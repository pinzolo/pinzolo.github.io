---
layout: post
title: "MyBatis Migrations 3.3.0 の hook が便利"
date: '2016-11-17T17:37:13+0900'
main-class: dev
tags: java
---

[MyBatis Migrations](http://www.mybatis.org/migrations/) を利用しているけど、環境別に初期データを登録する術がなかった。  

* 開発時には最低限のデータは入っていたほうが便利
* 顧客に確認してもらうデータは個人情報をマスクしたりもする
* テスト環境では冪等性のために初期データはいらない

仕方ないので migration を実行した後に、別の方法を取らないと上記のようなことが出来ない。

しかし、3.3.0-SNAPSHOT で含まれた [Migration hooks](http://www.mybatis.org/migrations/hooks.html) を使えばこのあたりが解決できる。  

## なにが出来るのか？？

hook には以下の種類がある。名前を見れば、まあだいたいわかるはず。

* hook_before_up
* hook_before_each_up
* hook_after_each_up
* hook_after_up
* hook_before_down
* hook_before_each_down
* hook_after_each_down
* hook_after_down

まず `development.properties` や `test.properties` で実行するスクリプトファイルを指定するため、環境ごとに実行する SQL を切り替えることが出来る。  
またスクリプトは JSR-223 に対応していればよいので、Java のクラス郡を利用することが出来る。

つまり `hook_before_up` で実行ログをとって、`hook_after_each_up` で初期データを登録し、`hook_after_up` でサーバーを再起動する。なんてシナリオができる。環境ごとに！！

## サンプル

```sql
-- db/scripts/20161117175523_create_users.sql
CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY
  , login TEXT NOT NULL
  , email TEXT NOT NULL
  , name TEXT NOT NULL
);

CREATE UNIQUE INDEX users_uniq1 ON users(login);

-- //@UNDO
DROP TABLE users;
```

こんなマイグレーションファイルがあったとする。

まず、設定ファイルに使用するスクリプトの設定を追加する。

```properties
# db/environments/development.properties
hook_after_each_up=JavaScript:dev_after_each_up.js
```

hooks ディレクトリを作成し、スクリプトファイルを作成する。

```js
// db/hooks/dev_after_each_up.js
switch (hookContext.getChange().getId()) {
  case 20161117175523: // create_users.sql
    hookContext.executeSql("INSERT INTO users (login, password) VALUES ('admin', 'admin@example.com', 'システム管理者');");
    break;
}
```

これで、マイグレーションを実行すると各step毎に `dev_after_each_up.js` が実行されて初期データが無事登録できた。

## さらに

* このままだと、初期データ登録が一つの巨大なファイルになってしまう
* SQL が文字列なのでエディタのハイライトなどの恩恵が受けられない

といったことが考えられるので、せっかく Java の資産が利用できるのだからもう少しに便利にしよう。

```js
// db/hooks/dev_after_each_up.js
var path = java.nio.file.Paths.get(migrationPaths.getHookPath() + "/after_each_up/development/" + hookContext.getChange().getId() + ".sql");
if (java.nio.file.Files.exists(path)) {
  var query = java.lang.String.join("\n", java.nio.file.Files.readAllLines(path, java.nio.charset.StandardCharsets.UTF_8));
  hookContext.executeSql(query);
}
```

これで、初期データが存在する場合には `db/hook/after_each_up/development/20161117175523.sql` のようにバージョンに合わせて SQL を置いておけば実行されるようになる。  
マイグレーションと連動してくれるので、現在のバージョンにあった初期データが登録される。少し古いバージョンで開発している人が最新のデータ登録でテーブルがなくてエラーなんてこともない。

万歳！！
