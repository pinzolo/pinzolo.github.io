---
layout: post
title: rails-flog を Ruby 3 に対応
date: '2021-04-04T09:33:31+0900'
tags:
---

[【オンライン】Kyoto\.rb Meetup 20210404 \- Kyoto\.rb \| Doorkeeper](https://kyotorb.doorkeeper.jp/events/119356) での作業ログ

```
$ rbenv install 3.0.0
https://dqw8nmjcqpjn7.cloudfront.net/aaf2fcb575cdf6491b98ab4829abf78a3dec8402b8b81efc8f23c00d443981bf
Installing openssl-1.1.1j...
Installed openssl-1.1.1j to /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0

Downloading ruby-3.0.0.tar.gz...
-> https://cache.ruby-lang.org/pub/ruby/3.0/ruby-3.0.0.tar.gz
Installing ruby-3.0.0...
ruby-build: using readline from homebrew
Installed ruby-3.0.0 to /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0

Fetching bundler-2.2.15.gem
Successfully installed bundler-2.2.15
1 gem installed
```

OK

```
$ git switch -c ruby3
$ rbenv local 3.0.0
$ ruby -v
ruby 3.0.0p0 (2020-12-25 revision 95aff21468) [x86_64-darwin18]
```

準備終わり。gem をインストール

```
$ bundle install
Fetching gem metadata from https://rubygems.org/.........
Using rake 13.0.3
Using concurrent-ruby 1.1.8
Using erubi 1.10.0
Using mini_portile2 2.5.0
Using racc 1.5.2
Using crass 1.0.6
Using zeitwerk 2.4.2
Using nio4r 2.5.7
Using websocket-extensions 0.1.5
Using mimemagic 0.3.5
Using mini_mime 1.0.2
Using amazing_print 1.2.2
Using anbt-sql-formatter 0.1.0
Using ast 2.4.2
Using bundler 2.2.13
Using json 2.5.1
Using docile 1.3.5
Using simplecov-html 0.10.2
Using sync 0.5.0
Using thor 1.1.0
Using method_source 1.0.0
Using parallel 1.20.1
Using rainbow 3.0.0
Using regexp_parser 2.1.1
Using rexml 3.2.4
Using ruby-progressbar 1.11.0
Using unicode-display_width 2.0.0
Fetching sqlite3 1.4.2
Using builder 3.2.4
Using i18n 1.8.9
Using minitest 5.14.4
Using nokogiri 1.11.1 (x86_64-darwin)
Using websocket-driver 0.7.3
Using marcel 0.3.3
Using mail 2.7.1
Using parser 3.0.0.0
Using tzinfo 2.0.4
Using rack 2.2.3
Using activesupport 6.1.3
Using loofah 2.9.0
Using rack-test 1.1.0
Using simplecov 0.16.1
Using tins 1.28.0
Using sprockets 4.0.2
Using rubocop-ast 1.4.1
Using rails-dom-testing 2.0.3
Using rails-html-sanitizer 1.3.0
Using globalid 0.4.2
Using activemodel 6.1.3
Using term-ansicolor 1.7.1
Using rubocop 1.11.0
Using actionview 6.1.3
Using activejob 6.1.3
Using activerecord 6.1.3
Using coveralls 0.8.23
Using actionpack 6.1.3
Using actioncable 6.1.3
Using actionmailer 6.1.3
Using railties 6.1.3
Using activestorage 6.1.3
Using sprockets-rails 3.2.2
Using actionmailbox 6.1.3
Using actiontext 6.1.3
Using rails 6.1.3
Using rails-flog 1.6.1 from source at `.`
Installing sqlite3 1.4.2 with native extensions
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    current directory: /Users/pinzolo/dev/github.com/pinzolo/rails-flog/vendor/bundle/ruby/3.0.0/gems/sqlite3-1.4.2/ext/sqlite3
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/bin/ruby -I /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/lib/ruby/3.0.0 -r ./siteconf20210404-3954-wk62qn.rb extconf.rb
checking for sqlite3.h... yes
checking for pthread_create() in -lpthread... yes
checking for -ldl... yes
checking for sqlite3_libversion_number() in -lsqlite3... yes
checking for rb_proc_arity()... yes
checking for rb_integer_pack()... yes
checking for sqlite3_initialize()... yes
checking for sqlite3_backup_init()... yes
checking for sqlite3_column_database_name()... yes
checking for sqlite3_enable_load_extension()... yes
checking for sqlite3_load_extension()... yes
checking for sqlite3_open_v2()... yes
checking for sqlite3_prepare_v2()... yes
checking for sqlite3_int64 in sqlite3.h... yes
checking for sqlite3_uint64 in sqlite3.h... yes
creating Makefile

current directory: /Users/pinzolo/dev/github.com/pinzolo/rails-flog/vendor/bundle/ruby/3.0.0/gems/sqlite3-1.4.2/ext/sqlite3
make "DESTDIR=" clean

current directory: /Users/pinzolo/dev/github.com/pinzolo/rails-flog/vendor/bundle/ruby/3.0.0/gems/sqlite3-1.4.2/ext/sqlite3
make "DESTDIR="
compiling aggregator.c
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/defines.h:73:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/backward/2/attributes.h:43:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/pure.h:25:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/assert.h:132:1: error: '__declspec' attributes are not enabled; use '-fdeclspec' or '-fms-extensions' to enable support for __declspec attributes
RBIMPL_ATTR_NORETURN()
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/noreturn.h:29:33: note: expanded from macro 'RBIMPL_ATTR_NORETURN'
# define RBIMPL_ATTR_NORETURN() __declspec(noreturn)
                                ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:24:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/anyargs.h:77:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/intern/vm.h:64:1: error: '__declspec' attributes are not enabled; use '-fdeclspec' or '-fms-extensions' to enable support for __declspec attributes
RBIMPL_ATTR_NORETURN()
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/noreturn.h:29:33: note: expanded from macro 'RBIMPL_ATTR_NORETURN'
# define RBIMPL_ATTR_NORETURN() __declspec(noreturn)
                                ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/int.h:26:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/long.h:70:1: error: '__declspec' attributes are not enabled; use '-fdeclspec' or '-fms-extensions' to enable support for __declspec attributes
RBIMPL_ATTR_NORETURN()
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/noreturn.h:29:33: note: expanded from macro 'RBIMPL_ATTR_NORETURN'
# define RBIMPL_ATTR_NORETURN() __declspec(noreturn)
                                ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:28:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:46:14: error: expected parameter declarator
RUBY_ALIGNAS(SIZEOF_VALUE)
             ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/value.h:41:23: note: expanded from macro 'SIZEOF_VALUE'
# define SIZEOF_VALUE SIZEOF_LONG
                      ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/x86_64-darwin18/ruby/config.h:62:21: note: expanded from macro 'SIZEOF_LONG'
#define SIZEOF_LONG 8
                    ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:28:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:46:14: error: expected ')'
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/value.h:41:23: note: expanded from macro 'SIZEOF_VALUE'
# define SIZEOF_VALUE SIZEOF_LONG
                      ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/x86_64-darwin18/ruby/config.h:62:21: note: expanded from macro 'SIZEOF_LONG'
#define SIZEOF_LONG 8
                    ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:46:1: note: to match this '('
RUBY_ALIGNAS(SIZEOF_VALUE)
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/backward/2/stdalign.h:27:22: note: expanded from macro 'RUBY_ALIGNAS'
#define RUBY_ALIGNAS RBIMPL_ALIGNAS
                     ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/stdalign.h:66:44: note: expanded from macro 'RBIMPL_ALIGNAS'
# define RBIMPL_ALIGNAS(_) __declspec(align(_))
                                           ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:28:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:47:1: error: expected function body after function declarator
RBasic {
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:82:23: error: incomplete definition of type 'struct RBasic'
    return RBASIC(obj)->klass;
           ~~~~~~~~~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:82:12: note: forward declaration of 'struct RBasic'
    return RBASIC(obj)->klass;
           ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:50: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                                                 ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:30:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:35:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/value_type.h:157:28: error: incomplete definition of type 'struct RBasic'
    VALUE ret = RBASIC(obj)->flags & RUBY_T_MASK;
                ~~~~~~~~~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/value_type.h:157:17: note: forward declaration of 'struct RBasic'
    VALUE ret = RBASIC(obj)->flags & RUBY_T_MASK;
                ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:50: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                                                 ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:30:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:237:23: error: incomplete definition of type 'struct RBasic'
    return RBASIC(obj)->flags & flags;
           ~~~~~~~~~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:237:12: note: forward declaration of 'struct RBasic'
    return RBASIC(obj)->flags & flags;
           ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:50: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                                                 ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:30:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:285:1: error: '__declspec' attributes are not enabled; use '-fdeclspec' or '-fms-extensions' to enable support for __declspec attributes
RBIMPL_ATTR_NOALIAS()
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/noalias.h:53:32: note: expanded from macro 'RBIMPL_ATTR_NOALIAS'
# define RBIMPL_ATTR_NOALIAS() __declspec(noalias)
                               ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:30:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:288:30: warning: declaration of 'struct RBasic' will not be visible outside of this function [-Wvisibility]
rbimpl_fl_set_raw_raw(struct RBasic *obj, VALUE flags)
                             ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:290:8: error: incomplete definition of type 'struct RBasic'
    obj->flags |= flags;
    ~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:288:30: note: forward declaration of 'struct RBasic'
rbimpl_fl_set_raw_raw(struct RBasic *obj, VALUE flags)
                             ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:298:27: warning: incompatible pointer types passing 'struct RBasic *' to parameter of type 'struct RBasic *' [-Wincompatible-pointer-types]
    rbimpl_fl_set_raw_raw(RBASIC(obj), flags);
                          ^~~~~~~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:30: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                             ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/cast.h:33:28: note: expanded from macro 'RBIMPL_CAST'
# define RBIMPL_CAST(expr) (expr)
                           ^~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:288:38: note: passing argument to parameter 'obj' here
rbimpl_fl_set_raw_raw(struct RBasic *obj, VALUE flags)
                                     ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:310:1: error: '__declspec' attributes are not enabled; use '-fdeclspec' or '-fms-extensions' to enable support for __declspec attributes
RBIMPL_ATTR_NOALIAS()
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/noalias.h:53:32: note: expanded from macro 'RBIMPL_ATTR_NOALIAS'
# define RBIMPL_ATTR_NOALIAS() __declspec(noalias)
                               ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:30:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:313:32: warning: declaration of 'struct RBasic' will not be visible outside of this function [-Wvisibility]
rbimpl_fl_unset_raw_raw(struct RBasic *obj, VALUE flags)
                               ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:315:8: error: incomplete definition of type 'struct RBasic'
    obj->flags &= ~flags;
    ~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:313:32: note: forward declaration of 'struct RBasic'
rbimpl_fl_unset_raw_raw(struct RBasic *obj, VALUE flags)
                               ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:323:29: warning: incompatible pointer types passing 'struct RBasic *' to parameter of type 'struct RBasic *' [-Wincompatible-pointer-types]
    rbimpl_fl_unset_raw_raw(RBASIC(obj), flags);
                            ^~~~~~~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:30: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                             ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/cast.h:33:28: note: expanded from macro 'RBIMPL_CAST'
# define RBIMPL_CAST(expr) (expr)
                           ^~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:313:40: note: passing argument to parameter 'obj' here
rbimpl_fl_unset_raw_raw(struct RBasic *obj, VALUE flags)
                                       ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:335:1: error: '__declspec' attributes are not enabled; use '-fdeclspec' or '-fms-extensions' to enable support for __declspec attributes
RBIMPL_ATTR_NOALIAS()
^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/attr/noalias.h:53:32: note: expanded from macro 'RBIMPL_ATTR_NOALIAS'
# define RBIMPL_ATTR_NOALIAS() __declspec(noalias)
                               ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:30:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:338:34: warning: declaration of 'struct RBasic' will not be visible outside of this function [-Wvisibility]
rbimpl_fl_reverse_raw_raw(struct RBasic *obj, VALUE flags)
                                 ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:340:8: error: incomplete definition of type 'struct RBasic'
    obj->flags ^= flags;
    ~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:338:34: note: forward declaration of 'struct RBasic'
rbimpl_fl_reverse_raw_raw(struct RBasic *obj, VALUE flags)
                                 ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:348:31: warning: incompatible pointer types passing 'struct RBasic *' to parameter of type 'struct RBasic *' [-Wincompatible-pointer-types]
    rbimpl_fl_reverse_raw_raw(RBASIC(obj), flags);
                              ^~~~~~~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:30: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                             ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/cast.h:33:28: note: expanded from macro 'RBIMPL_CAST'
# define RBIMPL_CAST(expr) (expr)
                           ^~~~~~
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:338:42: note: passing argument to parameter 'obj' here
rbimpl_fl_reverse_raw_raw(struct RBasic *obj, VALUE flags)
                                         ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:465:43: error: incomplete definition of type 'struct RBasic'
        if (RBASIC_CLASS(x) && !(RBASIC(x)->flags & RUBY_FL_SINGLETON)) {
                                 ~~~~~~~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/fl_type.h:465:34: note: forward declaration of 'struct RBasic'
        if (RBASIC_CLASS(x) && !(RBASIC(x)->flags & RUBY_FL_SINGLETON)) {
                                 ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rbasic.h:34:50: note: expanded from macro 'RBASIC'
#define RBASIC(obj)          RBIMPL_CAST((struct RBasic *)(obj))
                                                 ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:25:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic.h:23:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/arithmetic/char.h:29:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:74:19: error: field has incomplete type 'struct RBasic'
    struct RBasic basic;
                  ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:74:12: note: forward declaration of 'struct RBasic'
    struct RBasic basic;
           ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:109:26: error: incomplete definition of type 'struct RBasic'
    VALUE f = RBASIC(str)->flags;
              ~~~~~~~~~~~^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:74:12: note: forward declaration of 'struct RBasic'
    struct RBasic basic;
           ^
In file included from aggregator.c:1:
In file included from ./aggregator.h:4:
In file included from ./sqlite3_ruby.h:4:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby.h:38:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/ruby.h:26:
In file included from /Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core.h:23:
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rarray.h:88:19: error: field has incomplete type 'struct RBasic'
    struct RBasic basic;
                  ^
/Users/pinzolo/.anyenv/envs/rbenv/versions/3.0.0/include/ruby-3.0.0/ruby/internal/core/rstring.h:74:12: note: forward declaration of 'struct RBasic'
    struct RBasic basic;
           ^
fatal error: too many errors emitted, stopping now [-ferror-limit=]
6 warnings and 20 errors generated.
make: *** [aggregator.o] Error 1

make failed, exit code 2

Gem files will remain installed in /Users/pinzolo/dev/github.com/pinzolo/rails-flog/vendor/bundle/ruby/3.0.0/gems/sqlite3-1.4.2 for inspection.
Results logged to /Users/pinzolo/dev/github.com/pinzolo/rails-flog/vendor/bundle/ruby/3.0.0/extensions/x86_64-darwin-18/3.0.0/sqlite3-1.4.2/gem_make.out

An error occurred while installing sqlite3 (1.4.2), and Bundler cannot continue.
Make sure that `gem install sqlite3 -v '1.4.2' --source 'https://rubygems.org/'` succeeds before bundling.

In Gemfile:
  sqlite3
```

ふぁー

[https://mebee.info/2021/01/14/post-27968/](https://mebee.info/2021/01/14/post-27968/)

sqlite がインストールされていないのが問題くさいな

```
$ brew update
Error:
  homebrew-core is a shallow clone.
  homebrew-cask is a shallow clone.
To `brew update`, first run:
  git -C /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core fetch --unshallow
  git -C /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask fetch --unshallow
These commands may take a few minutes to run due to the large size of the repositories.
This restriction has been made on GitHub's request because updating shallow
clones is an extremely expensive operation due to the tree layout and traffic of
Homebrew/homebrew-core and Homebrew/homebrew-cask. We don't do this for you
automatically to avoid repeatedly performing an expensive unshallow operation in
CI systems (which should instead be fixed to not use shallow clones). Sorry for
the inconvenience!
```

[https://gotohayato.com/content/528/](https://gotohayato.com/content/528/)

めんどくせぇ

```
$ git -C /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core fetch --unshallow
$ git -C /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask fetch --unshallow

$ brew install sqlite
Error: sqlite 3.34.0 is already installed.
To upgrade to 3.35.3, run:
  brew upgrade sqlite
```

はいってたわ

念の為 upgrade してみるか

```
$ brew upgrade sqlite
$ bundle install
```

あかんわ、同じエラーが出る

docker 化しよう

```
$ cat Dockerfile
FROM ruby:3.0.0
RUN apt-get update && apt-get install libsqlite3-dev
RUN gem update bundler
RUN mkdir /rails-flog
WORKDIR /rails-flog
COPY . /rails-flog
RUN bundle install
CMD ["bundle", "exec", "rake"]
docker build -t flog-test .
```

sqlite3 インストールエラーでなかった  
と思ったら mimemagic でダメだった  
対応されているだろうから最新でいいだろう  
Gemfile.lock 削除して再度実行  

```
$ docker run flog-test
-- create_table(:books, {:force=>true})
   -> 0.0115s
Run options: --seed 64512

# Running:

..........................................

Finished in 0.833777s, 50.3732 runs/s, 135.5279 assertions/s.
42 runs, 113 assertions, 0 failures, 0 errors, 0 skips
[Coveralls] Outside the CI environment, not sending data.
```

やったね  
でも Ruby のバージョンアップ毎にこれやるのかぁ  
.travis.yml にバージョン追加して push する  
もう Travis-CI では動いていないようだ。GitHub Actions に移行しないとな。また今度
