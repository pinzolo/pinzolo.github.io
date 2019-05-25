---
layout: post
title: assert_change
date: '2015-12-16T10:42:00.001+09:00'
author: pinzolo
tags:
- ruby
- testing
---

ユニットテスト時によく使うメソッドの1つに `assert_difference` がありますね。  
でもこれ差分を取るので数値を返す式にしか使えません。使おうとしたら + なんて演算子ないよってエラーが出ます。  
仕方なしにこんなテストコードを書いてません？ 

```ruby
test 'ユーザーが確認済みになること' do
  assert_not user.confirmed?
  # ここに承認処理
  assert user.confirm?
end
```

それならば、こんなメソッドを `test_helper` あたりに定義しておいて

```ruby
def assert_change(expression, message = nil, &block)
  exp = expression.respond_to?(:call) ? expression : ->{ eval(expression, block.binding) }
  before = exp.call
  yield
  error = "#{expression.inspect} didn't change"
  error = "#{message}.\n#{error}" if message
  assert_not_equal before, exp.call, error
end

def assert_not_change(expression, message = nil, &block)
  exp = expression.respond_to?(:call) ? expression : ->{ eval(expression, block.binding) }
  before = exp.call
  yield
  error = "#{expression.inspect} changed"
  error = "#{message}.\n#{error}" if message
  assert_equal before, exp.call, error
end
```

```ruby
test 'ユーザーが確認済みになること' do
  assert_change 'user.confirmed?' do
    # ここに承認処理
  end
end

# 実際の値を気にしなくていいならこんな使い方も
test '保存したら updated_at が更新される' do
  assert_change 'user.updated_at' do
    user.save
  end
end
```

と書くとちょっとスッキリしますね。コードはほぼほぼ `assert_difference` のパクリです。  
`expression` の指定方法は必要になったら広げる感じでいいかな。
