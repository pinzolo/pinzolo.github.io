---
layout: post
title: Golang から AWS DocumentDB につなぐ
date: '2019-08-23T17:18:00+0900'
tags:
  - aws
  - golang
---

Golang から AWS の DocumentDB につなぎたかったんだけどうまくいかなかった。

```
mongodb://<yourMasterPassword>:<insertYourPassword>@<endpoint>:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0
```

コントロールパネルだとこんな接続文字列で接続しろと書いてある。（↓の場所ね）

[![Image from Gyazo](https://i.gyazo.com/88c905d4964778715a81b1f9259b040d.png)](https://gyazo.com/88c905d4964778715a81b1f9259b040d)

ところがこれでは動かなくて [プログラムによる Amazon DocumentDB への接続 \- Amazon DocumentDB](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/connect.html) の Go サンプルのような接続文字列じゃないとダメだった。

```
mongodb://<yourMasterPassword>:<insertYourPassword>@<endpoint>:27017/?ssl=true&sslcertificateauthorityfile=rds-combined-ca-bundle.pem&replicaSet=rs0
```

ssl_ca_certs → **sslcertificateauthorityfile** ということだ。

他のサンプルも覗いてみたけど、コントロールパネルにある接続文字列は Python 用のようだ。
