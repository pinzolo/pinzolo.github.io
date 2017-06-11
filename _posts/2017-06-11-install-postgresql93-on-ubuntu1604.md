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
% sudo apt-get install postgresql libpq-dev
```

## postgres ユーザーになれるようにパスワードを設定する

```bash
% sudo passwd postgres
```

## 日本語の設定

```bash
% sudo vi /etc/postgresql/9.3/main/postgresql.conf

```

```diff
 # These settings are initialized by initdb, but they can be changed.
-lc_messages = 'C'                       # locale for system error message strings
+lc_messages = 'ja_JP.UTF-8'             # locale for system error message strings
-lc_monetary = 'C'                       # locale for monetary formatting
+lc_monetary = 'ja_JP.UTF-8'             # locale for monetary formatting
-lc_numeric = 'C'                        # locale for number formatting
+lc_numeric = 'ja_JP.UTF-8'              # locale for number formatting
-lc_time = 'C'                           # locale for time formatting
+lc_time = 'ja_JP.UTF-8'                 # locale for time formatting

 # default configuration for text search
-default_text_search_config = 'pg_catalog.english'
+default_text_search_config = 'pg_catalog.japanese'
```

```bash
% sudo service postgresql restart
 * Restarting PostgreSQL 9.3 database server
 * The PostgreSQL server failed to start. Please check the log output:
2017-06-11 11:48:06 JST LOG:  invalid value for parameter "lc_messages": "ja_JP.UTF-8"
2017-06-11 11:48:06 JST LOG:  invalid value for parameter "lc_monetary": "ja_JP.UTF-8"
2017-06-11 11:48:06 JST LOG:  invalid value for parameter "lc_numeric": "ja_JP.UTF-8"
2017-06-11 11:48:06 JST LOG:  invalid value for parameter "lc_time": "ja_JP.UTF-8"
2017-06-11 11:48:06 JST FATAL:  configuration file "/etc/postgresql/9.3/main/postgresql.conf" contains errors
```

日本語パックが入っていないようだ

```bash
% sudo apt-get install language-pack-ja
% sudo service postgresql restart
 * Restarting PostgreSQL 9.3 database server                                                               [OK]
```

## デフォルトの encoding, collate, ctype を変更する

```bash
% sudo -u postgres createdb foo
% sudo -u postgres psql
postgres=# \l

                                 List of databases
   Name    |  Owner   | Encoding  |  Collate   |   Ctype    |   Access privileges
-----------+----------+-----------+------------+------------+-----------------------
 foo       | postgres | SQL_ASCII | C          | C          |
 postgres  | postgres | SQL_ASCII | C          | C          |
 template0 | postgres | SQL_ASCII | C          | C          | =c/postgres          +
           |          |           |            |            | postgres=CTc/postgres
 template1 | postgres | SQL_ASCII | C          | C          | =c/postgres          +
           |          |           |            |            | postgres=CTc/postgres
(4 rows)
```

現時点では `createdb` するとこうなってしまう。毎回オプション指定をするのも面倒なので template1 を変更してしまう。

```bash
# template1 に接続
postgres=# \c template1

# template0 に接続できるようにする
template1=# UPDATE pg_database SET datallowconn = TRUE WHERE datname = 'template0';

# template0 に接続
template1=# \c template0

# template1 をテンプレートから除外
template0=# UPDATE pg_database SET datistemplate = FALSE WHERE datname = 'template1';

# template1 を encoding: UTF-8, collate: ja_JP.UTF8, ctype: ja_JP.UTF8 で再作成
template0=# DROP DATABASE template1;
template0=# CREATE DATABASE template1 WITH template = template0 encoding = 'UTF8' lc_collate = 'ja_JP.UTF8' lc_ctype = 'ja_JP.UTF8';

# 作成した template1 をテンプレートに含める
template0=# UPDATE pg_database SET datistemplate = TRUE WHERE datname = 'template1';

# template1 に接続し、tamplate0 へ接続できないようにする
template0=# \c template1
template1=# UPDATE pg_database SET datallowconn = FALSE WHERE datname = 'template0';
template1=# \q
```

確認してみる。

```bash
% sudo -u postgres createdb foo
% sudo -u postgres psql
postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding  |  Collate   |   Ctype    |   Access privileges
-----------+----------+-----------+------------+------------+-----------------------
 foo       | postgres | UTF8      | ja_JP.UTF8 | ja_JP.UTF8 |
 postgres  | postgres | SQL_ASCII | C          | C          |
 template0 | postgres | SQL_ASCII | C          | C          | =c/postgres          +
           |          |           |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8      | ja_JP.UTF8 | ja_JP.UTF8 |
(4 rows)
```
