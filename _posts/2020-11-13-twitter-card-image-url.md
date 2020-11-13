---
layout: post
title: Twitter card の画像が表示されなかった
date: '2020-11-13T10:17:18+0900'
tags:
  - blog
  - SEO
---

ながらく Twitter Card でこの blog の画像が表示されていなかった

![](/assets/img/20201113_unshown-twitter-card-image.png)

コードはこうなっていた

{% raw %}
```html
<!-- Jekyll -->
<meta property="twitter:image:src" content="{{ '/assets/img/blog-image.png' | relative_url }}">
<!-- HTML -->
<meta property="twitter:image:src" content="/assets/img/blog-image.png">
```
{% endraw %}

こういう SEO 関連は疎いので Google 先生片手にしらべてみた

とりあえず `property` ではなく `name` だということがわかった

というわけでこのように修正した

{% raw %}
```html
<!-- Jekyll -->
<meta name="twitter:image:src" content="{{ '/assets/img/blog-image.png' | relative_url }}">
<!-- HTML -->
<meta name="twitter:image:src" content="/assets/img/blog-image.png">
```
{% endraw %}

しかしこれでも表示されない

うーん、タグに間違いはなさそうなんだが・・・としたときにふと思った

「ひょっとして URL の解決なんてやってないのか？完全な URL を出力してみるか」

{% raw %}
```html
<!-- Jekyll -->
<meta name="twitter:image:src" content="{{ '/assets/img/blog-image.png' | absolute_url }}">
<!-- HTML -->
<meta name="twitter:image:src" content="https://pinzolo.github.io/assets/img/blog-image.png">
```
{% endraw %}

どうやら正しかったようで [Card Validator \| Twitter Developers](https://cards-dev.twitter.com/validator) で試してみると正常に表示された

![](/assets/img/20201113_valid-twitter-card-image.png)

めでたし、めでたし
