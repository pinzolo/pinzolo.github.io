---
layout: post
title: オブジェクトが存在するときにだけ処理をする
date: '2016-01-09T15:29:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- rails
- ruby
---

みんな大好き `Object#tap`。でもこんなソースはあまり書きたくない。

```ruby
foo.bar.baz.tap do |baz|
  do_something(baz) if baz
end
```

`tap_if` とかあれば便利じゃない？

```ruby
foo.bar.baz.tap_if do |baz|
  do_something(baz)
end

# もしくは
foo.bar.tap_if(:baz) do |baz|
  do_something(baz)
end
```

似たようなことを考える人はいるものですでにある。→ [tap-if | RubyGems.org | your community gem host](https://rubygems.org/gems/tap-if)  
そして Rails やる上では `try` で事足りることがわかった。ブロック取れるのか。

```ruby
foo.bar.baz.try do |baz|
  do_something(baz)
end

# もしくは
foo.bar.try(:baz) do |baz|
  do_something(baz)
end
```

結論：`Object#try` サイコー
