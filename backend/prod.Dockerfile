FROM python:3.8-slim-buster

RUN apt-get update && apt-get install git -y

WORKDIR /app

COPY . .

RUN pip3 install -r requirements.txt