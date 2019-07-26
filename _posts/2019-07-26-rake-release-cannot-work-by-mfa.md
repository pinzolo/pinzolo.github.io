---
layout: post
title: "二段階認証をしていたら bundle exec rake release が動かなかった"
date: '2019-07-26T17:32:54+0900'
tags:
  - ruby
  - rubygems
---

拙作の gem である [rails-flog](https://github.com/pinzolo/rails-flog) に対して [Add ignore\_query configuration by mothule · Pull Request \#23 · pinzolo/rails\-flog](https://github.com/pinzolo/rails-flog/pull/23) というプルリクが来た。

まあ、そういう用途もあるよねと思って取り込んで、ついでに対称性のために `ignore_params` オプションも追加した。

んでさあリリースするぞとおもむろに `bundle exec rake release` したら以下のようなエラーで動かない。

```
rails-flog 1.6.0 built to pkg/rails-flog-1.6.0.gem.
Tagged v1.6.0.
Pushed git commits and tags.
rake aborted!
Pushing gem to https://rubygems.org...
You have enabled multifactor authentication but no OTP code provided. Please fill it and retry.
/Users/pinzolo/dev/github.com/pinzolo/rails-flog/vendor/bundle/ruby/2.5.0/gems/rake-12.3.2/exe/rake:27:in `<top (required)>'
/Users/pinzolo/.anyenv/envs/rbenv/versions/2.5.1/bin/bundle:23:in `load'
/Users/pinzolo/.anyenv/envs/rbenv/versions/2.5.1/bin/bundle:23:in `<main>'
Tasks: TOP => release => release:rubygem_push
(See full trace by running task with --trace)
```

たしかに二段階認証設定したなと思って調べてみたら `gem signin` しろみたいな情報が出てきた→[Using multifactor authentication in command line \- RubyGems Guides](https://guides.rubygems.org/using-mfa-in-command-line/)

しかし、`gem signin` してもうんともすんとも言わないし、`gem signin --otp` なんてしたらそんなオプション無いという。

ということはコマンドのバージョンかとおもってとりあえず 2.5.1 のままだったローカルの ruby バージョンを上げることにした。

とはいえ `rbenv global 2.6.0` で終わりなんだけど。

この状態で `bundle exec rake release` したら今度は下記の状態で止まった。

```
rails-flog 1.6.0 built to pkg/rails-flog-1.6.0.gem.
Tagged v1.6.0.
```

調べてみたらこの状態で OTP を入力して enter すればよいらしい。実際それで push できた。

しかし

```
rails-flog 1.6.0 built to pkg/rails-flog-1.6.0.gem.
Tagged v1.6.0.
OTP: <カーソルチカチカ>
```

ってやってくれた方が嬉しいな。ちょっと、いやかなりわかりづらいと思う。

ちなみに 2.6.0 の時の `gem -v` の結果は 3.0.1 で 2.5.1 の時は 2.7.6 だった。gem 3.0 以上じゃないといけないのかな？

というわけで rails-flog 1.6.0 なんとかリリースしました。
