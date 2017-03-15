---
layout: post
title: "inclusionなどのバリデーションで検証対象の範囲を検証時に取得する"
date: '2017-03-16T00:01:12+0900'
main-class: dev
tags:
  - rails
  - ruby
---

最初はこうだった。

```ruby
class Member < ApplicationRecord
  # gender は 1: 男、2: 女
  belongs_to :gender
end
```

Rails5 ではこれだけで渡された `gender_id` が `genders` テーブルに存在するかどうか見てくれていた。

ところが、会員登録処理が色々と膨らんできたため、フォームクラスを利用せざるを得なくなった。  
そこでこんなフォームを書いた。

```ruby
class MemberForm
  include ActiveModel::Model

  attr_accessor :gender_id
  validates :gender_id, presence: true, inclusion: { in: Gender.pluck(:id), allow_blank: true }
end
```

実際に動かしてみると問題なく動いてくれたわけだが、テストがコケる。

というのも、バリデーションはクラスのロード時に評価されてクラス単位で持ち回されるので DB を空にして行うテストでは `gender` のテストデータが登録される前に `MemberForm` がロードされてしまい、`gender_id` に何を渡しても存在しないことになってしまう。  

```ruby
class MemberForm
  include ActiveModel::Model

  attr_accessor :gender_id
  validates :gender_id, presence: true, inclusion: { in: ->(_) { Gender.pluck(:id) }, allow_blank: true }
end
```

そんな場合はこんな感じに lambda を渡してやると良い。引数が渡ってくるので `-> { Gender.pluck(:id) }` ではエラーになるよ。
