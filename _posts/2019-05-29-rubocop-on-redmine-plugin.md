---
layout: post
title: Rubocop を Redmine plugin に導入した
date: '2019-05-29T18:31:38+0900'
tags:
  - ruby
  - redmine
---

Rubocop を [pinzolo/redmine\_persist\_wfmt: redmine\_persist\_wfmt is a plugin for Redmine that persists wiki format\.](https://github.com/pinzolo/redmine_persist_wfmt) に導入した

なにげに初めての Rubocop 導入だったりする

基本方針としては徹頭徹尾 Rubocop に従う。どうしても無理なヤツだけ `.rubocop.yml` にて除外する

いろいろ意義を申したい cop もあるがあーだこーだ考えて時間かけるよりはやりきる方が大事。

まあ対応自体はおそらく定番のやりかたでコツコツ

1. `bundle exed rubocop --init` にて `.rubocop.yml` を生成して plugins/redmine_persist_wfmt に移す
2. `bundle exec rubocop -R --auto-gen-config --exclude-limit 10000 plugins/redmine_persist_wfmt` で `.rubocop_todo.yml` を生成
3. `.rubocop_todo.yml` の先頭に `inherit_from: plugins/redmine_persist_wfmt/.rubocop.yml` を追加
4. `.rubocop_todo.yml` の各 cop をコメントアウトして `bundle exec rubocop -c .rubocop_todo.yml plugins/redmine_persist_wfmt`
5. テストが通ったら commit
6. `.rubocop_todo.yml` が空になるまで繰り返す

3は auto correct 対応しているやつからやって `-a` つきで自動修正してもらったらとても楽

とまあ地道に頑張るわけだけど、rails app でなくてたかが plugin なので offence の数も数百程度で収まってた

そんな中で最終的に `.rubocop.yml` に残ったヤツを備忘録的に記載しておこう

### Metrics/LineLength

さすがに 80 は厳しすぎるので 120 にした。

```yml
Metrics/LineLength:
  Max: 120
```

### Rails/ApplicationRecord

これは Redmine の都合。Redmine には（まだ？）ApplicationRecord は実装されていないので、そんな事を言われても困る。plugin でかってに実装するつもりもさらさら無い

```yml
Rails/ApplicationRecord:
  Enabled: false
```

### Rails/DynamicFindBy

このプラグインではテストは System test で行っているから Capybara の `find_by_id` が引っかかるのでテストコードは除外。

```yml
Rails/DynamicFindBy:
  Exclude:
    - 'test/macro.rb'
    - 'test/ui/*'
```

### Style/FrozenStringLiteralComment

Redmine plugin は当然本体の処理に割り込むわけで、plugin 生成した文字列を本体がいじることがザラにある。なのでエラーが出まくるので除外した。

```yml
Style/FrozenStringLiteralComment:
  Enabled: false
```

というわけで `.rubocop.yml` に記載した cop はたったの4つ。まあまあ頑張ったんじゃないかな
