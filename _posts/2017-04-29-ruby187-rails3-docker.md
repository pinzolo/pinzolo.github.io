---
layout: post
title: "Ruby1.8.7, Rails3.0 な開発環境を docker で"
date: '2017-04-29T14:57:16+0900'
tags:
  - docker
  - rails
  - ruby
---

Macを新調して少しお手伝いしている Ruby1.8.7, Rails3.0 な案件の開発環境を作ろうとした。  
前のMacの時にrbenvでRuby1.8.7を入れるのに、あれこれしたので今回は環境を汚さないよう docker でやろうと思い立った。

[nvulane/ruby1\.8\.7 \- Docker Hub](https://hub.docker.com/r/nvulane/ruby1.8.7/) を使えばいけそうだったんだけど `rails server` で OpenSSL からみのエラーが発生したのであきらめた。

ふと、昔の ubuntu は apt-get で入る ruby が 1.8.7 だったなということを思いだし、調べてみると [12.04がそうらしい](http://packages.ubuntu.com/precise/ruby)  

```
FROM ubuntu:precise

ENV DEBIAN_FRONTEND noninteractive

RUN mkdir -p /usr/src/app
ENV APP_ROOT /usr/src/app
WORKDIR $APP_ROOT

RUN apt-get update && apt-get install -y build-essential ruby rubygems libpq-dev zlib1g-dev libxml2-dev libxslt1-dev
RUN gem install bundler
COPY Gemfile $APP_ROOT
COPY Gemfile.lock $APP_ROOT
RUN bundle install

CMD bash -c "bundle exec rake db:migrate && bundle exec rails server -b 0.0.0.0"
```

```
docker run -d -p 3000:3000 -v "$PWD":/usr/src/app --link foo-db:foo-db -t --name foo-app pinzolo/foo-app:latest
```

こんな感じで動いた。(`foo-db`はすでに作ってある PostgreSQL のコンテナ)
