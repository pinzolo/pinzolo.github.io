---
layout: post
title: Railsのテストで定数のスタブが欲しい場合
date: '2015-12-16T19:07:00.001+09:00'
author: pinzolo
tags:
- rails
- ruby
- testing
---

Railsの `ActiveSupport::TestCase` は minitest を使っていて、minitest/mock には定数をスタブ化する機能はない。  
[adammck/minitest-stub-const](https://github.com/adammck/minitest-stub-const) ってのはあるけど、外部ライブラリ入れるほどじゃないよねって場合があるかもしれない。

```ruby
class Foo
  BAR = 'bar'
end

class FooTest < ActiveSupport::TestCase
  setup do
    @original = Foo.send(:remove_const, :BAR)
    Foo.const_set(:BAR, 'new_value')
  end
  
  teardown do
    Foo.send(:remove_const, :BAR)
    Foo.const_set(:BAR, @original)
  end
  
  test 'Foo::BARのテスト' do
    assert_equal 'new_value', Foo::BAR
  end
end
```

そんな時はこんな感じのコードでいいんじゃないかな？


こういうトリッキーなのは最終手段的なもので、定数を環境ごとに設定ファイルに定義できるような gem を使うべきだとは思う。やってみたらできたというお話
