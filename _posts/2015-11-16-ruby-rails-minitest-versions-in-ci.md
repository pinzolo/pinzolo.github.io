---
layout: post
title: RubyとRailsとminitestのマルチバージョンでのCI環境の話
date: '2015-11-16T14:27:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- ruby
- rubygems
- travis-ci
---

[pinzolo/rails-flog](https://github.com/pinzolo/rails-flog) の Rails4.2でのテストが落ちてて、でも動いてるしーで放置してしまってた。
んで、ちゃんとしないとと思って調べてみたら、テストを壊していたのはテストコード（と自分の思い込み）だった。
具体的には mocha というモックライブラリを使用していたんだけど、スタブ作ったらテストケースをまたいで存在し続けるのを、テストケースセーフだと思い込んでいた。以前のバージョンではシーケンシャルにテストが行われていたけど、ランダムになったのでテストが落ちるようになった。

どうりでローカルでテストすると時々によってエラーの数が違うわけだ。
んで minitest にもモック・スタブ機能があることを知り、ブロックでの影響範囲を限定できるのでこっちのほうがいいじゃん！！と mocha を削除し minitest のスタブに統一した。

ここまで前置き

ローカルでテスト通ったーと喜んで push すると [travis でコケる](https://travis-ci.org/pinzolo/rails-flog/builds/91303301)。  
Ruby1.9 & Rails3.2ではstubなんてないよと怒られ、Ruby2.2 & Rails3.2では [`minitest/autorun`がないと怒られた](https://travis-ci.org/pinzolo/rails-flog/jobs/91303373)。 Ruby1.9に同梱されている minitest には `minitest/mock` がまだ存在していなかったらしい。

調べてみると明示的に最新の minitest を使うのが良いらしく gemspec に足してみた。
すると今度は [Rails3.2で軒並みコケた](https://travis-ci.org/pinzolo/rails-flog/builds/91308453)。  
警告も出てるし、いくつか試行錯誤してRails3.2では minitest のバージョンを 4.7.x となるように指定したら、今度はRuby2.2の時だけ [test-unitが足りない](https://travis-ci.org/pinzolo/rails-flog/builds/91311496) と言われる。
そういや削除されたんだったっけ。

これでようやく全部通った。なまじ同梱されてるから環境の差分を調整するのはしんどい。
