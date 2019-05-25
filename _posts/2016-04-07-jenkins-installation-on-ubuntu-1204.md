---
layout: post
title: Ubuntu 12.04 on さくらのVPS に Jenkins を入れたメモ
date: '2016-04-07T12:34:00.000+09:00'
author: pinzolo
tags:
- jenkins
- ubuntu
---

## Jenkinsのインストール

```bash
$ wget -q -O - http://pkg.jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
$ sudo sh -c 'echo "deb http://pkg.jenkins-ci.org/debian binary/" > /etc/apt/sources.list.d/jenkins.list'
$ sudo aptitude update
$ sudo aptitude install -y jenkins
```

## Jenkinsの設定変更

```bash
sudo vi /etc/default/jenkins
```

`HTTP_PORT`を-1に、`AJP_PORT`を8008に（Tomcat導入予定のため）

## Apacheの設定

```bash
$ sudo vi /etc/apache2/sites-available/jenkins.conf
  <VirtualHost *:443>
    ServerName jenkins.my-domain:443
    <Location />
      ProxyPass ajp://localhost:8008/
    </Location>
    SSLCertificateFile    /etc/apache2/cert/ssl-cert.pem
    SSLCertificateKeyFile /etc/apache2/cert/ssl-cert.key
  </VirtualHost>

$ sudo a2ensite jenkins
```

## 再起動

```bash
$ sudo service jenkins restart
$ sudo service apache2 restart
```

とっても簡単だった
