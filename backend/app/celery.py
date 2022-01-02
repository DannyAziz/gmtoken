import os
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

celeryApp = Celery('tasks', broker=f'redis://{os.environ["REDIS_HOST"]}:6379/0')

r = redis.Redis(host=os.environ["REDIS_HOST"], port=6379, db=0)

@celeryApp.task
def get_number_of_gms(address, username):
    count = 0
    for i,tweet in enumerate(sntwitter.TwitterSearchScraper(f'gm from:{username} since:2021-01-01 until:2021-12-31').get_items()):
        if "gm" in tweet.content.lower():
            count += 1
    data = json.loads(r.get(address))
    data['gm'] = count
    r.set(address, json.dumps(data))