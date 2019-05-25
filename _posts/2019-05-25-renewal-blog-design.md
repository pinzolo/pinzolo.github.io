---
layout: post
title: ブログデザインを新しくした
date: '2019-05-25T18:44:11+0900'
tags: 
  - jekyll
  - blog
---

以前のデザインは気に入っていたんだけど、GitHub でセキュリティアラートが出るようになったので gulp やら stylus やらモリモリなのはやめてシンプルな物にすることにした。

そんなに凝ったテーマは必要ないので適当に選んでもいいけどどうせ長く保守するなら自分で勉強がてら作ることにした。

といってもデザインセンスなどないので、[Bulma](https://bulma.io/) をそのまんま使う。Bootstrap じゃないのは jQuery の依存をなくすため。

メニューのトグル表示なんか Vanilla JS ですぐ書けるし、凝ったことするなら Vue を使った方がいい。

というわけで、初版版ができあがった → [tail \-f pinzo\.log \| pinzolo の技術系 blog](https://pinzolo.github.io/)

こっちがリポジトリ → [pinzolo/pinzolo\.github\.io](https://github.com/pinzolo/pinzolo.github.io)

[タグページ](https://pinzolo.github.io/tags) は Vue を使って実装。個別タグページ作るのか結構だるいみたいなので。

一画面のカードの高さは揃えたいなとか細かいのはあるけど、概ねこれで満足してる。シンプルがいい。

もっとさっくりできるかと思ってた Vue.js との連携は意外と苦労した。

一つのプロパティしか対象に出来ないという jekyll の map フィルターの貧弱さがいらいらするし、出力のための double brace が被ってるのが辛かった。

あ、でも `jsonify` フィルターはナイスです。どうもありがとう
