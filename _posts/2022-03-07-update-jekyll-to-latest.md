---
layout: post
title: "Jekyll を最新の v4.1 に更新した"
date: '2022-03-07T17:19:31+0900'
tags:
  - blog
  - jekyll
---

Security alerts も出ていたし、ながらく更新していなかったこの blog の jekyll をアップデートすることにした。

[Jekyllのサイト](http://jekyllrb-ja.github.io/) を確認すると現在は v4.1.1 が最新のようだ

とりあえず v4.0 系に上げる

```ruby
gem "jekyll", "~> 4.0.0"
```

jekyll のバージョン指定だけ上げて `bundle update` する

> -------------------------------------------------------------------------------------
> Jekyll 4.0 comes with some major changes, notably:
> 
>   * Our `link` tag now comes with the `relative_url` filter incorporated into it.
>     You should no longer prepend `{{ site.baseurl }}` to `{% link foo.md %}`
>     For further details: https://github.com/jekyll/jekyll/pull/6727
> 
>   * Our `post_url` tag now comes with the `relative_url` filter incorporated into it.
>     You shouldn't prepend `{{ site.baseurl }}` to `{% post_url 2019-03-27-hello %}`
>     For further details: https://github.com/jekyll/jekyll/pull/7589
> 
>   * Support for deprecated configuration options has been removed. We will no longer
>     output a warning and gracefully assign their values to the newer counterparts
>     internally.
> -------------------------------------------------------------------------------------

このようなメッセージが出てきたが、軽く調べてみてもこの blog には影響がなさそう。

実際 `bundle exec jekyll serve` しても正常に動いていた。

しかし `tags.htnml` にアクセスすると動かなくなっていた。

これは使用している https://cdn.jsdelivr.net/npm/vue がいつの間にか Vue3 を返すようになっていたからのようだ。

ということは以前からこのページは動いていなかったと言うことか。

CDN の URL を https://cdn.jsdelivr.net/npm/vue@2 に更新して終了。

つぎに v4.1 にアップデートする

```ruby
gem "jekyll", "~> 4.0.0"
```

`bundle update` したら今度はメッセージすら表示なし。拍子抜けだ。

GitHub の Security alerts も消えたし、これで安心してしばらく放置出来るな。
