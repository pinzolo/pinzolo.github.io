---
layout: post
title: VPS の Ruby と Redmine を最新に
date: '2016-09-20T18:26:07+0900'
tags:
  - redmine
  - ruby
  - ubuntu
---

## まずは Ubuntu を最新の状態に

```sh
$ sudo aptitude update && sudo aptitude -y upgrade
```

ここでいつもの `no space left on device` が出たので、スペースを開けるために古いパッケージを削除

```sh
$ sudo aptitude purge linux-image-3.13.0-77-generic linux-image-3.13.0-78-generic ... # 必要な分だけ
```

あとは再起動してアップデート完了

## Redmine の最新化

現状の環境で最新 Redmine が動くことを確認しておく

```sh
$ cd /var/lib/rails/redmine
$ sh update_redmine.sh 3.3.0
```

お手製スクリプト便利。特に問題なく終了

## Ruby の最新化

```sh
$ cd /opt/src
$ wget https://cache.ruby-lang.org/pub/ruby/2.3/ruby-2.3.1.tar.gz
$ tar xf ruby-2.3.1.tar.gz
$ cd ruby-2.3.1
$ ./configure --prefix=/opt/ruby/ruby-2.3.1
$ make && make install
$ cd /opt/ruby/ruby-2.3.1/bin
$ ./ruby --version
  ruby 2.3.1p112 (2016-04-26 revision 54768) [x86_64-linux] # OK
$ ./gem install bundler
$ ln -sfn /opt/ruby/ruby-2.3.1/bin/* /usr/bin/
$ ruby --version
  ruby 2.3.1p112 (2016-04-26 revision 54768) [x86_64-linux] # OK
```

## Passenger の最新化

```sh
$ gem install passenger
$ /opt/ruby/ruby-2.3.1/bin/passenger-install-apache2-module
```

完了後に表示される設定で `/etc/apache2/mods-enabled/passenger.load` と `/etc/apache2/mods-enabled/passenger.conf` を更新

## Redmine の gem を再インストール

```sh
$ cd /var/lib/rails/redimne
$ rm -rf vendor/bundle
$ rm Gemfile.lock
$ bundle install --path vendor/bundle
$ service apache2 restart
```

## 感想

こんなにトラブルなくすんなり更新できたのは初めてかも
