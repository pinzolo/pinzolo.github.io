---
layout: post
title: "Rails で option タグにカスタムアトリビュートを付けたい"
date: '2017-03-30T22:49:36+0900'
main-class: dev
tags:
  - rails
  - ruby
---

`option` タグを JavaScript で操作する場合、AJAX使うまでも無いような要件では `data-kana` のようなカスタムアトリビュートでやってしまいたい。

それを Rails のヘルパーで実現できるの？と思って調べてみたら案外簡単にできた。

```erb
<%= f.select :user_id, User.all.map { |u| [u.name, u.id, { data: { kana: u.kana } }] } %>
```

ブレースがネストしすぎてキモイというなら、もちろんこっちでもいい。

```erb
<%= f.select :user_id, User.all.map { |u| [u.name, u.id, { 'data-kana' => u.kana }] } %>
```
