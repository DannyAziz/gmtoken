import os
import redis
import simplejson as json
import sentry_sdk
import snscrape.modules.twitter as sntwitter

from flask import Flask, request
from flask_cors import CORS

from sentry_sdk.integrations.flask import FlaskIntegration

from app.celery import get_number_of_gms, check_tweet

r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"], db=0)

sentry_sdk.init(
    dsn=os.environ['SENTRY_DSN'],
    integrations=[FlaskIntegration()],
    environment=os.environ['ENV'],
    traces_sample_rate=1.0,
)

app = Flask(__name__)
CORS(app)


@app.route("/wallet/<wallet_address>")
def wallet_in_db(wallet_address):
    raw_data = r.get(wallet_address)
    if raw_data is None:
        return json.dumps({"error": "Wallet address not in database"}), 400
    return raw_data

@app.route('/tweet-check/', methods=['POST'])
def check_tweet_url():
    data = request.json
    if not 'url' in data or len(data['url']) == 0:
        return json.dumps({"error": "No url provided"}), 400
    if not "address" in data:
        return json.dumps({"error": "No address provided"}), 400
    url = data['url']
    address = data['address']
    raw_data = r.get(address)
    if raw_data is not None and not "error" in json.loads(raw_data):
        return json.dumps({"error": "Wallet address already in database"}), 400
    if "twitter.com" not in url:
        return json.dumps({"error": "Not a twitter url"}), 400
    split_url = url.split("status/")
    if len(split_url) < 2:
        return json.dumps({"error": "Not a twitter url"}), 400
    
    tweet_id = split_url[1]
    check_tweet.delay(tweet_id, address)

    return json.dumps({"ok": True})