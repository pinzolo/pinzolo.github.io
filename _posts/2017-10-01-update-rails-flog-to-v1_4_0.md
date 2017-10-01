---
layout: post
title: "rails-flog gem をアップデートした"
date: '2017-10-01T20:22:09+0900'
main-class: dev
tags:
  - ruby
  - rubygems
---

先日作成した [pinzolo/spwd: Secret file based password management tool](https://github.com/pinzolo/spwd) をアップデートしたついでにふと [pinzolo/rails\-flog: Rails log formatter for Parameters and SQL](https://github.com/pinzolo/rails-flog) を覗いてみた。すると、なんか issue が 3 とかなってる。

んで [compatibility for Rails5\.1 · Issue \#17 · pinzolo/rails\-flog](https://github.com/pinzolo/rails-flog/issues/17) という issue が登録されている。あれ？？そんなメールは Github から来た覚えないぞ？？どうしてだ？と思いつつ確認してみた。

というか `alias_method_chain` が削除されるって話は知っていたので `prepend` に書き直さなきゃなと思って忘れていた。

というわけで作業ログ

1. まずは確実に動くRails.4.2環境に固定してテストが通ることを確認。[\#17 Fiv version for passing test · pinzolo/rails\-flog@47f6197](https://github.com/pinzolo/rails-flog/commit/47f619788d2af1c28af17bcd1e9f7cd36196bbaa)
1. `alias_method_chain` やめて `prepend` にする。[\#17 Use prepend insted of alias\_method\_chain\. alias\_method\_chain is d… · pinzolo/rails\-flog@c70a5f3](https://github.com/pinzolo/rails-flog/commit/c70a5f3d3e76265515f8b0d52b814f2a860ddccd)
1. いろいろ警告が出ていたので対応。[\#17 Remove warning · pinzolo/rails\-flog@85f5e02](https://github.com/pinzolo/rails-flog/commit/85f5e02e700ebc70f35cd970a6d41648d215a247)
1. テストが通ったので master にマージするためバージョン指定を元に戻す。[\#17 Restore dependency version · pinzolo/rails\-flog@bad5a46](https://github.com/pinzolo/rails-flog/commit/bad5a4662ee894654e958b012cb9c26298a69f9a)
1. Rails5.0にバージョン指定。[\#17 Set rails version to 5\.0\.x · pinzolo/rails\-flog@cff5d61](https://github.com/pinzolo/rails-flog/commit/cff5d617c4d226e9a734c082fc625764f0da6cac)
1. Rails 5.0 に対応（1 commit にしてしまったので変更点を列挙）[\#17 Rails 5\.0 compatible · pinzolo/rails\-flog@973f3af](https://github.com/pinzolo/rails-flog/commit/973f3af19572559329f88a12a92068452746c7bc)
  1. `nothing` は削除されるよって警告が出てきたので削除。
  1. テスト時に使用する `get` メソッドのパラメータ指定形式が変わるよっていうので対応したら、4.2で通らなくなったので苦肉の策で対応。
  1. Rails 5.0 になったらパラメータの順序が入れ替わったので、順序を気にしなくていいようにログの文字列から Hash を作って中身比較。
1. テストが通ったので master にマージするためバージョン指定を元に戻す。[\#17 Restore rails version dependency · pinzolo/rails\-flog@1f87c2b](https://github.com/pinzolo/rails-flog/commit/1f87c2b1d17b5b7f90f618930bc1f1dee3f7915c)
1. バージョン変更はコミットする必要ないことに気づく
1. SQLがキャッシュの場合、以前は `event.payload[:name]` に `CACHE` という文字列が入っていたが、Rails 5.1 では `event.payload[:cached]` で判断すればよいみたい[\#17 cached query is judged by payload\[:cached\] instead of payload\[:na… · pinzolo/rails\-flog@c3123a3](https://github.com/pinzolo/rails-flog/commit/c3123a3db95d4416caff810c4968aa3f77dddefd)
1. Tavis CI の設定変更。`prepend` の使用できない Ruby 1.9.3 はサヨウナラして新しい Ruby と Rails のバージョンに対応する。[\#17 Add new versions for CI · pinzolo/rails\-flog@5cca348](https://github.com/pinzolo/rails-flog/commit/5cca3487c0de93f5e37e6bd59e35d8c886b71b20)
1. Ruby2.0以上だけのサポートになったのでマジックコメントはいらない[Remove magic comment\. \#17 · pinzolo/rails\-flog@2254330](https://github.com/pinzolo/rails-flog/commit/22543301f8b6824e671bf62b0951845997ad5eea)
1. 珍しく一発で全パターンのCIが通ったのでバージョンを上げる[\#17 Up to v1\.4\.0 · pinzolo/rails\-flog@a6a2919](https://github.com/pinzolo/rails-flog/commit/a6a2919ea525a5fa23301eac31bee80672ee4843)
1. `bundle exec rake release`

お疲れ様でした。``
