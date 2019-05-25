---
layout: post
title: "pry で返り値が表示されないようにする"
date: '2017-04-08T01:36:03+0900'
tags:
  - pry
  - ruby
---

[最後にnilを付けてrails consoleで無駄に表示される大量のデータを抑制する \- Qiita](http://qiita.com/jnchito/items/f80818a36b7795391751) にコメントしたけど備忘録的メモとして。

`pry` では最後に `;` をつければ返り値を表示しなくなります。

```ruby
[1] pry(main)> (1...100).to_a.each { |i| puts i if i % 10 == 0 }
10
20
30
40
50
60
70
80
90
=> [1,
 2,
 3,
 4,
 5,
 6,
 7,
 8,
 9,
 ....
```

 みたいなのが

```ruby
[1] pry(main)> (1...100).to_a.each { |i| puts i if i % 10 == 0 };
10
20
30
40
50
60
70
80
90
```

になります。スッキリ
