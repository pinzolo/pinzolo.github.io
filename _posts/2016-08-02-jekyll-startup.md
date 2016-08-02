---
layout: post
title:  Jekyll始めました
tags: jekyll blog
---

長らく [blogger](http://blog.mkt-sys.jp) で blog を書いていたんだけど、やっぱり手軽に Markdown で書きたいよね。と思っていて、どこにするかと悩んでいたんだけど、技術blogなんだからローカルに原稿残っていたほうがgrepできていいよね。ネット繋がってなくても自分の過去ログ漁れるのはかなりの利点じゃないかな？と思ったのでJekyllで頑張ることにしました。

サイトのデザインとか無効の過去ログとかはまあおいおい

## トラブったこと

### Invalid date

```
Invalid date '<%= Time.now.strftime('%Y-%m-%d %H:%M:%S %z') %>': Document 'vendor/bundle/ruby/2.3.0/gems/jekyll-3.2.0/lib/site_template/_posts/0000-00-00-welcome-to-jekyll.markdown.erb' does not have a valid date in the YAML front matter.
```

bundle 使って環境整えたので、`bundle exec jekyll serve` したらこんなエラーが出た。  
`_config.yml` に `exclude: [vendor]` 追加したら消えた

### pluginが追加できない

`_config.yml` だけでなく `Gemfile` にも追加して `bundle install` しておかないといけなかった

### Github Pages でビルド失敗

```
The page build failed with the following error:

A file was included in `about.md` that is a symlink or does not exist in your `_includes` directory. For more information, see https://help.github.com/articles/page-build-failed-file-is-a-symlink.

For information on troubleshooting Jekyll see:

  https://help.github.com/articles/troubleshooting-jekyll-builds

If you have any questions you can contact us by replying to this email.
```

push したらこんなエラーメールが届いた。`jekyll new` で生成される `about.md` に含まれている `include` の対象が存在していないらしい。`about.me` を更新して `include` をなくしたらOK。

