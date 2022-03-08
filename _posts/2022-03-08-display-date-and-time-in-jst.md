---
layout: post
title: "Display date and time in JST"
date: '2022-03-08T10:27:14+0900'
tags:
  - blog
  - jekyll
---

そういえば blog のことで放置していた件があったのでついでに直した。

何かというと記事の作成日時が UTC で表示されていたのだ。

![before](/assets/img/20220308_before.png)

JavaScript の日付操作ライブラリは今はなにが定番なのかと思ったが [Day\.js](https://day.js.org/) でまだまだよさそう。

で、Day.js を使用するに当たって JavaScript の CDN を複数使用していたのに気づいて [jsDeliver に統一した](https://github.com/pinzolo/pinzolo.github.io/commit/d28770acfde7870f8c00b59942aa775cddfb9a71)

あとは data 属性に値とフォーマットを書き出して、表示処理を入れて終わり。[Display JST by using dayjs · pinzolo/pinzolo\.github\.io@70717d5](https://github.com/pinzolo/pinzolo.github.io/commit/70717d5b6c5e010e7e7a1c5faab30e2faf842380)

![after](/assets/img/20220308_after.png)

うん、ちゃんと変わった。

まあ、コンテンツやタイトルじゃないから JavaScript で動的表示しても SEO 的に問題はないと思う。

タイムゾーンを使えるような plugin を作ってもいいかもしれない。こんな感じのヤツ → [Timezone Conversion in Liquid Templates, for Ruby on Rails](https://docspring.com/blog/posts/timezone-conversion-in-liquid-templates-for-ruby-on-rails/)
