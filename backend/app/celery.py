import os
import re
import redis
import sentry_sdk
import simplejson as json
import snscrape.modules.twitter as sntwitter

from celery import Celery
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=os.environ['SENTRY_DSN'],
    integrations=[CeleryIntegration()],
    environment=os.environ['ENV'],
)

celeryApp = Celery('tasks', broker=f'redis://{os.environ["REDIS_HOST"]}:{os.environ["REDIS_PORT"]}/0')

r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"], db=0)

@celeryApp.task(autoretry_for=(Exception,))
def check_tweet(tweet_id, address):
    tweet = list(sntwitter.TwitterTweetScraper(tweet_id, sntwitter.TwitterTweetScraperMode.SINGLE).get_items())[0]
    if not tweet:
        r.set(address, json.dumps({"error": "No tweet found"}))
        return
    addresses = re.findall('0x[a-fA-F0-9]{40}', tweet.content)
    if len(addresses) == 0:
        r.set(address, json.dumps({"error": "No addresses found"}))
        return
    tweet_address = addresses[0]
    if tweet_address != address:
        r.set(address, json.dumps({"error": "Address not matching"}))
        return
    
    r.set(address, json.dumps({"username": tweet.user.username}))

@celeryApp.task(autoretry_for=(Exception,))
def get_number_of_gms(address, username):
    count = 0
    for i,tweet in enumerate(sntwitter.TwitterSearchScraper(f'gm from:{username} since:2021-01-01 until:2021-12-31').get_items()):
        if "gm" in tweet.content.lower():
            count += 1
    data = json.loads(r.get(address))
    data['gm'] = count
    r.set(address, json.dumps(data))