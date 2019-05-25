---
layout: post
title: EC2(Amazon Linux)上のRailsアプリにQiita::Markdownをインストール
date: '2016-01-10T17:56:00.000+09:00'
author: pinzolo
tags:
- aws
- markdown
- rails
- ruby
- rubygems
---

## インストール

Qiita::Markdownはシンタックスハイライトに Pygments を使用しているのでインストールしておく(`sudo pip install pygments`)
そして、おもむろに Gemfile に `gem 'qiita-markdown'` として `bundle install` してみる。

```
Installing charlock_holmes 0.7.3 with native extensions

Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    /usr/bin/ruby2.2 -r ./siteconf20160110-30152-1igbivj.rb extconf.rb
checking for main() in -licui18n... no
which: no brew in (/home/ec2-user/bin:/home/ec2-user/.rbenv/bin:/home/ec2-user/bin:/home/ec2-user/.rbenv/bin:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/aws/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/opt/aws/bin:/opt/aws/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/opt/aws/bin)
checking for main() in -licui18n... no


***************************************************************************************
*********** icu required (brew install icu4c or apt-get install libicu-dev) ***********
***************************************************************************************
*** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
        --with-opt-dir
        --without-opt-dir
        --with-opt-include
        --without-opt-include=${opt-dir}/include
        --with-opt-lib
        --without-opt-lib=${opt-dir}/lib64
        --with-make-prog
        --without-make-prog
        --srcdir=.
        --curdir
        --ruby=/usr/bin/$(RUBY_BASE_NAME)2.2
        --with-icu-dir
        --without-icu-dir
        --with-icu-include
        --without-icu-include=${icu-dir}/include
        --with-icu-lib
        --without-icu-lib=${icu-dir}/lib64
        --with-icui18nlib
        --without-icui18nlib
        --with-icui18nlib
        --without-icui18nlib

extconf failed, exit code 1

Gem files will remain installed in /home/ec2-user/rails_app/vendor/bundle/ruby/2.2/gems/charlock_holmes-0.7.3 for inspection.
Results logged to /home/ec2-user/rails_app/vendor/bundle/ruby/2.2/extensions/x86_64-linux/2.2/charlock_holmes-0.7.3/gem_make.out
</pre><pre class="code">
Installing rugged 0.24.0b11 with native extensions

Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    /usr/bin/ruby2.2 -r ./siteconf20160110-30152-1y0cp2j.rb extconf.rb
checking for gmake... yes
checking for cmake... no
ERROR: CMake is required to build Rugged.
*** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
        --with-opt-dir
        --without-opt-dir
        --with-opt-include
        --without-opt-include=${opt-dir}/include
        --with-opt-lib
        --without-opt-lib=${opt-dir}/lib64
        --with-make-prog
        --without-make-prog
        --srcdir=.
        --curdir
        --ruby=/usr/bin/$(RUBY_BASE_NAME)2.2
        --use-system-libraries

extconf failed, exit code 1

Gem files will remain installed in /home/ec2-user/rails_app/vendor/bundle/ruby/2.2/gems/rugged-0.24.0b11 for inspection.
Results logged to /home/ec2-user/rails_app/vendor/bundle/ruby/2.2/extensions/x86_64-linux/2.2/rugged-0.24.0b11/gem_make.out
```

とまあ、2つのエラーが出た。Amazon Linuxは yum だからlibicu-dev じゃなくて libicu-devel にすればOKかな？  
`sudo yum install -y libicu-devel cmake` して `bundle install` したらインストールは成功したようだ

## ハイライト

インストールは成功したのでこんなコードを書いて使えば Markdown に変換された。ばっちりばっちり

```ruby
module ApplicationHelper
  def markdown(source)
    Qiita::Markdown::Processor.new.call(source)[:output].to_s.html_safe
  end
end
```

変換はばっちりだがシンタックスハイライトがされていない。いや、正確にはスタイルシートがない。
[richleland/pygments-css](https://github.com/richleland/pygments-css) あたりでお好みのものを利用させてもらおう

## 絵文字

シンタックスハイライトも完了した。次は絵文字である。
[gemoji | RubyGems.org | your community gem host](https://rubygems.org/gems/gemoji) がインストールされているはずなので、Rakefile に下記の行を加える。

```ruby
load 'tasks/emoji.rake'
```

あとは `bundle exec rake emoji` を実行すれば `/public/images/emoji` 以下に画像はファイルが配置される。 これだけで絵文字が表示できるようになる。`bundle` と `rake` で導入できるので `/public/images/emoji` は `.gitignore` に加えておいてもいいかもしれない。大量に画像ファイルをリポジトリに登録したくないもんね
