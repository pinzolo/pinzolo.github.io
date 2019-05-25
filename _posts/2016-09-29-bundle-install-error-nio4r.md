---
layout: post
title: bundle install で nio4r のインストールに失敗
date: '2016-09-29T19:28:18+0900'
tags:
  - mac
  - rails
  - ruby
---

久しぶりに rails app 作るかと `bundle install` したら下記のエラーを得た。

```
$ bundle install --path vendor/bundle
Fetching gem metadata from https://rubygems.org/
Fetching version metadata from https://rubygems.org/
Fetching dependency metadata from https://rubygems.org/
Resolving dependencies...
Installing rake 11.3.0
Installing concurrent-ruby 1.0.2
Installing i18n 0.7.0
Installing minitest 5.9.1
Installing thread_safe 0.3.5
Installing builder 3.2.2
Installing erubis 2.7.0
Installing mini_portile2 2.1.0
Installing pkg-config 1.1.7
Installing rack 2.0.1
Installing nio4r 1.2.1 with native extensions

Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    current directory: /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/gems/nio4r-1.2.1/ext/nio4r
/Users/pinzolo/.rbenv/versions/2.3.1/bin/ruby -r ./siteconf20160929-80542-1b9k7sg.rb extconf.rb
checking for unistd.h... *** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
	--with-opt-dir
	--without-opt-dir
	--with-opt-include
	--without-opt-include=${opt-dir}/include
	--with-opt-lib
	--without-opt-lib=${opt-dir}/lib
	--with-make-prog
	--without-make-prog
	--srcdir=.
	--curdir
	--ruby=/Users/pinzolo/.rbenv/versions/2.3.1/bin/$(RUBY_BASE_NAME)
/Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:456:in `try_do': The compiler failed to generate an executable file. (RuntimeError)
You have to install development tools first.
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:587:in `try_cpp'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:1091:in `block in have_header'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:942:in `block in checking_for'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:350:in `block (2 levels) in postpone'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:320:in `open'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:350:in `block in postpone'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:320:in `open'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:346:in `postpone'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:941:in `checking_for'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:1090:in `have_header'
	from extconf.rb:3:in `<main>'

To see why this extension failed to compile, please check the mkmf.log which can be found here:

  /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/extensions/x86_64-darwin-15/2.3.0/nio4r-1.2.1/mkmf.log

extconf failed, exit code 1

Gem files will remain installed in /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/gems/nio4r-1.2.1 for inspection.
Results logged to /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/extensions/x86_64-darwin-15/2.3.0/nio4r-1.2.1/gem_make.out

Installing websocket-extensions 0.1.2
Installing mime-types-data 3.2016.0521
Installing arel 7.1.2
Using bundler 1.12.5
Installing method_source 0.8.2
Installing thor 0.19.1
Installing tzinfo 1.2.2
Installing nokogiri 1.6.8 with native extensions

Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    current directory: /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/gems/nokogiri-1.6.8/ext/nokogiri
/Users/pinzolo/.rbenv/versions/2.3.1/bin/ruby -r ./siteconf20160929-80542-1wuo7ym.rb extconf.rb --use-system-libraries --with-xml2-include=/usr/local/opt/libxml2/include/libxml2
Using pkg-config version 1.1.7
checking if the C compiler accepts ... *** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
	--with-opt-dir
	--without-opt-dir
	--with-opt-include
	--without-opt-include=${opt-dir}/include
	--with-opt-lib
	--without-opt-lib=${opt-dir}/lib
	--with-make-prog
	--without-make-prog
	--srcdir=.
	--curdir
	--ruby=/Users/pinzolo/.rbenv/versions/2.3.1/bin/$(RUBY_BASE_NAME)
	--help
	--clean
/Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:456:in `try_do': The compiler failed to generate an executable file. (RuntimeError)
You have to install development tools first.
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:571:in `block in try_compile'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:522:in `with_werror'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:571:in `try_compile'
	from extconf.rb:138:in `nokogiri_try_compile'
	from extconf.rb:162:in `block in add_cflags'
	from /Users/pinzolo/.rbenv/versions/2.3.1/lib/ruby/2.3.0/mkmf.rb:629:in `with_cflags'
	from extconf.rb:161:in `add_cflags'
	from extconf.rb:414:in `<main>'

To see why this extension failed to compile, please check the mkmf.log which can be found here:

  /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/extensions/x86_64-darwin-15/2.3.0/nokogiri-1.6.8/mkmf.log

extconf failed, exit code 1

Gem files will remain installed in /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/gems/nokogiri-1.6.8 for inspection.
Results logged to /Users/pinzolo/develop/git.mkt-sys.jp/pinzolo/skyblue/vendor/bundle/ruby/2.3.0/extensions/x86_64-darwin-15/2.3.0/nokogiri-1.6.8/gem_make.out
Installing rack-test 0.6.3
Installing sprockets 3.7.0
An error occurred while installing nio4r (1.2.1), and Bundler cannot continue.
Make sure that `gem install nio4r -v '1.2.1'` succeeds before bundling.
```

この手のエラーは久しぶりだと思ってエラーログを見てみる

```

"cc -o conftest -I/Users/pinzolo/.rbenv/versions/2.3.1/include/ruby-2.3.0/x86_64-darwin15 -I/Users/pinzolo/.rbenv/versions/2.3.1/include/ruby-2.3.0/ruby/backward -I/Users/pinzolo/.rbenv/versions/2.3.1/include/ruby-2.3.0 -I. -I/Users/pinzolo/.rbenv/versions/2.3.1/include  -D_XOPEN_SOURCE -D_DARWIN_C_SOURCE -D_DARWIN_UNLIMITED_SELECT -D_REENTRANT    -O3 -Wno-error=shorten-64-to-32  -fno-common -pipe  conftest.c  -L. -L/Users/pinzolo/.rbenv/versions/2.3.1/lib -L. -L/Users/pinzolo/.rbenv/versions/2.3.1/lib  -fstack-protector     -lruby.2.3.0  -lpthread -ldl -lobjc  "
checked program was:

Agreeing to the Xcode/iOS license requires admin privileges, please
re-run as root via sudo.

/* begin */
1: #include "ruby.h"
2: 
3: int main(int argc, char **argv)
4: {
5:   return 0;
6: }
/* end */
```

なんだ Xcode のライセンスか

```sh
$ sudo xcodebuild -license
```

これだけだった
