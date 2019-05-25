---
layout: post
title: 本番環境での secret_key_base 設定
date: '2015-11-06T12:56:00.000+09:00'
author: pinzolo
tags:
- apache2
- passenger
- rails
- ubuntu
---

本番環境に Rails4.2.4 のアプリケーションをデプロイするとこんなエラーが出た。

```
App 21863 stderr: [ 2015-11-06 12:37:20.3972 21881/0x007f1632a022e8(Worker 1) utils.rb:84 ]: *** Exception RuntimeError in Rack application object (Missing `secret_token` and `secret_key_base` for 'production' environment, set these values in `config/secrets.yml`) (process 21881, thread 0x007f1632a022e8(Worker 1)):  
```

`config/secrets.yml`によると、本番環境では `ENV["SECRET_KEY_BASE"]` を読み込むらしい。  
でも、複数の Rails アプリを動かしているし、今後も増やすだろうからpassengerの運用ユーザーに対して設定する訳にはいかない。  
`ENV["FOO_SECRET_KEY_BASE"]` のようにアプリごとに環境変数変えたらいいのかな？とおもって調べてみると、apacheの設定ファイルで SetEnv すればよいらしい。

```conf
# /etc/apache2/sites-available/foo-app.conf  
<VirtualHost *:80>  
  ServerName foo-app.mkt-sys.jp:80  
  DocumentRoot /var/lib/rails/foo-app/public  
  <Directory /var/lib/rails/foo-app/public/>  
    SetEnv SECRET_KEY_BASE abcdefg...xyz       #←ココ  
    Options FollowSymLinks  
    AllowOverride None  
    Require all granted  
  </Directory>  
  PassengerEnabled on  
</VirtualHost>  
```

設定するキーは `bunde exec rake secret RAILS_ENV=production` で出力されたものをコピペ。（多分 `RAILS_ENV=production`はいらないだろうけど） 
