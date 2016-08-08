---
layout: post
title: Rails の TimeWithZone を JavaScript で読み込めるフォーマットで出力する
date: '2016-01-18T15:18:00.000+09:00'
author: pinzolo
main-class: dev
tags:
- rails
- ruby
- javascript
---

JavaScript で `new Date(text)` や `Date.parse(text)` した時に読み込める形で TimeWithZone の値を出力したい。  
そのまま `to_s` すると `2015-01-18 12:34:56 +0900` となるが、これでは Chrome でしか読み込めない。  
`2015/01/18 12:34:56 +0900` という形式ならば Chrome, IE, Firefox で読み込むことができた。

もしくは、せっかく `to_json` メソッドがあるんだからこれを利用すると安心。しかし余計なダブルクォートは取り除く必要がある。  
あと、人が見た時は先述のやり方のほうがぱっと見で理解しやすいと思う

```ruby
module TimeWithZoneHelper
  def format_for_js1(time_with_zone)
    time_with_zone.to_s.gsub(/-/, '/')
  end

  def format_for_js2(time_with_zone)
    time_with_zone.to_json.gsub(/\"/, '')
  end
end

# to_s(:js) にするなら config/initializers/time_formats.rb にて
Time::DATE_FORMATS[:js] = '%Y/%m/%d %H:%M:%S %z'
```

`to_json` 経由だとミリ秒まで含まれているから完全に等価ではないけど、そこらへんは要件しだいということで
まあ、色々やり方はあるので好きなやり方を使えばいいと思う。
