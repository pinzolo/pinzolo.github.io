---
layout: post
title: Ubuntu16.04@さくらのVPS に PostgreSQL をインストール
date: '2017-06-11T10:59:14+0900'
main-class: vps
tags:
  - postgresql
  - ubuntu
---

## PostgreSQL のインストール

```bash
% sudo apt install postgresql libpq-dev
```

## postgres ユーザーになれるようにパスワードを設定する

```bash
% sudo passwd postgres
```

## Envoding, Collate, Ctype の確認

```bash
% su - postgres
                                  List of databases
   Name    |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
-----------+----------+----------+-------------+-------------+-----------------------
 postgres  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 template0 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
(3 rows)
```

さくらのVPSの場合、デフォルトで UTF-8 になっているようだ。
