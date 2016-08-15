---
layout: post
title: 自作クラスの配列同士で引き算を正しく動作させるには
date: '2015-10-27T11:29:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- ruby
---

自作クラスの配列で引き算を行おうとしたら `==` のオーバーライドだけでは足りない。

```ruby
class Point
  attr_reader :x, :y

  def initialize(x, y)
    @x = x
    @y = y
  end

  def ==(other)
    @x == other.x && @y == other.y
  end

  def to_s
    "(#{x}, #{y})"
  end

  def inspect
    to_s
  end
end

p [Point.new(1, 1), Point.new(2, 2), Point.new(3, 3)] - [Point.new(3, 3), Point.new(1, 1)]
# => [(1, 1), (2, 2), (3, 3)]
```

`eql?` と `hash` のオーバーライドが必要だった。

```ruby
class Point
  attr_reader :x, :y

  def initialize(x, y)
    @x = x
    @y = y
  end

  def ==(other)
    eql?(other)
  end

  def eql?(other)
    @x == other.x && @y == other.y
  end

  def hash
    @x + @y
  end

  def to_s
    "(#{x}, #{y})"
  end

  def inspect
    to_s
  end
end

p [Point.new(1, 1), Point.new(2, 2), Point.new(3, 3)] - [Point.new(3, 3), Point.new(1, 1)]
# => [(2, 2)]
```
