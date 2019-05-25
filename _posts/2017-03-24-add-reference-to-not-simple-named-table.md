---
layout: post
title: "Railsにて列名から機械的に決定できないテーブルへの参照を定義する"
date: '2017-03-24T20:36:40+0900'
tags:
  - rails
  - ruby
---

`students` テーブルがあったとして、兄弟の情報を持ちたい。

```ruby
class CreateSiblings < ActiveRecord::Migration[5.0]
  def change
    create_table :siblings do |t|
      t.references :senior, foreign_key: true
      t.references :junior, foreign_key: true

      t.timestamps
    end
  end
end
```

こんなテーブルを作りたいが `seniors` テーブルも `juniors` テーブルも存在しないので参照が張れない。  
そんな場合はこうすればよい。

```ruby
class CreateSiblings < ActiveRecord::Migration[5.0]
  def change
    create_table :siblings do |t|
      t.references :senior, foreign_key: { to_table: :students }
      t.references :junior, foreign_key: { to_table: :students }

      t.timestamps
    end
  end
end
```
