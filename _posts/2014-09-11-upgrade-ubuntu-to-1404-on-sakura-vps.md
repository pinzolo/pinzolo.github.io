---
layout: post
title: さくらVPSの Ubuntu12.04 を 14.04 にした
date: '2014-09-11T11:40:00.001+09:00'
author: pinzolo
tags:
- redmine
- ubuntu
---

さくらVPSにログインするとアップグレードできるよって通知が出ていたので、14.04 にアップグレードしやした。
盛大にハマった.... 

## コマンド叩く

```bash
$ do-release-upgrade
The upgrade has aborted. The upgrade needs a total of 55.6 M free
space on disk '/boot'. Please free at least an additional 12.7 M of
disk space on '/boot'. Empty your trash and remove temporary packages
of former installations using 'sudo apt-get clean'. 
```

いきなり容量が足りないときた。
`/boot`以下のファイルのうち、最新バージョン以外を削除して再度実行すればOKだった。
何度か、設定ファイルなどを最新のに上書きするかい？って聞かれるけど、おこのみで。
しないほうが無難だとは思う。 

## バージョンの確認<div>git はソースから入れた 2.1.0 のまま。

[前回と同じく](http://blog.mkt-sys.jp/2014/05/sakura-vps-ubuntu-to-1204-from-1204.html)Rubyはリポジトリのものに置き換えられて 1.9.3 になっていたので入れ替えた。

```bash
$ mv /usr/bin/erb{,.bak}
$ mv /usr/bin/gem{,.bak}
$ mv /usr/bin/irb{,.bak}
$ mv /usr/bin/rake{,.bak}
$ mv /usr/bin/rdoc{,.bak}
$ mv /usr/bin/ri{,.bak}
$ mv /usr/bin/ruby{,.bak}
$ mv /usr/bin/testrb{,.bak}
$ ln -sfn /opt/ruby/ruby-2.1.2/bin/* /usr/bin
```

ようやく Ubuntu でも 1.9.3 がデフォルトになったのか。めでたい。

## Passengerのアップデート

Apacheのバージョンが上がったので、Passenger も再インストール。

```bash
$ gem install passenger
$ /opt/ruby/ruby-2.1.2/bin/passenger-install-apache2-module
  * To install Apache 2 development headers:
  Please install it with apt-get install apache2-threaded-dev

  * To install Apache Portable Runtime (APR) development headers:
  Please install it with apt-get install libapr1-dev

  * To install Apache Portable Runtime Utility (APU) development headers:
  Please install it with apt-get install libaprutil1-dev
```

言われるままにインストールする。 

```bash
$ aptitude install apache2-threaded-dev libapr1-dev libaprutil1-dev

```

passengerモジュールをインストール。 

```bash
$ passenger-install-apache2-module
  apache2: Syntax error on line 140 of /etc/apache2/apache2.conf: Syntax error on line 1 of /etc/apache2/mods-enabled/passenger.load: Cannot load /opt/ruby/ruby-2.1.2/lib/ruby/gems/2.1.0/gems/passenger-4.0.45/buildout/apache2/mod_passenger.so into server: /opt/ruby/ruby-2.1.2/lib/ruby/gems/2.1.0/gems/passenger-4.0.45/buildout/apache2/mod_passenger.so: undefined symbol: unixd_config
  apache2: Syntax error on line 140 of /etc/apache2/apache2.conf: Syntax error on line 1 of /etc/apache2/mods-enabled/passenger.load: Cannot load /opt/ruby/ruby-2.1.2/lib/ruby/gems/2.1.0/gems/passenger-4.0.45/buildout/apache2/mod_passenger.so into server: /opt/ruby/ruby-2.1.2/lib/ruby/gems/2.1.0/gems/passenger-4.0.45/buildout/apache2/mod_passenger.so: undefined symbol: unixd_config
  Your Apache installation might be broken
```

なぜかビルド出来ない。調べてみると unixd_config は ap_unixd_config にリネームされたらしいが、決定的な情報が出てこず、ハマる。悩む。  
で、よーーーーーーーーく考えてみると、passenger.load でエラーが出ているけど、新しい passenger 入れるんだからいらんだろ！ということで、passenger.load と passenger.conf の中身をコメントアウトしたらビルド通った。 

## Redmine

[前回のアップグレードでは、RMagicがおかしなことになっていた](http://blog.mkt-sys.jp/2014/05/rmagick-reinstall.html)ので、確認してみる。
RMagic とか Redmine 以前に、`ERR_SSL_PROTOCOL_ERROR` とか言われて接続できていないんですけどー。
`/etc/apache2/sites-available/default-ssl.conf` から `/etc/apache2/sites-enabled/000-default-ssl.conf` とかシンボリックリンクを貼ると Redmine ではなくデフォルトページだが表示されるので、Redmine 用の設定が読み込まれていないっぽい。
調べてみると [server - Why not work Apache virtual hosts on Ubuntu 14.04? - Ask Ubuntu](http://askubuntu.com/questions/450722/why-not-work-apache-virtual-hosts-on-ubuntu-14-04) がヒット。
Apache2.4から `.conf` 拡張子が必要になったらしい。

```bash
$ rm /etc/apache2/sites-enabled/001-redmine
$ mv /etc/apache2/sites-available/redmine{,.conf}
$ ln -s /etc/apache2/sites-available/redmine.conf /etc/apache2/sites-enabled/001-redmine.conf
$ service apache2 restart
  AH00548: NameVirtualHost has no effect and will be removed in the next release /etc/apache2/sites-enabled/001-redmine.conf:1
```

ちゃんと読み込まれたらしい。警告が出たので、対応もした。

再度アクセスしたら、今度は `You don't have permission to access / on this server.` とか言われる。今まではこれで動いとってん！
`/var/log/apache2/error.log` には `AH01630: client denied by server configuration: /var/lib/rails/redmine/public` と出力されている。
`redmine.conf` にパーミッション設定をすればよさげ。

```conf
<VirtualHost *:443>
  ServerName xxx.mkt-sys.jp:443
  DocumentRoot /var/lib/rails/redmine/public
  <Directory /var/lib/rails/redmine/public/>
    Options FollowSymLinks
    AllowOverride None
    Order allow,deny
    Allow from all
  </Directory>
  SSLCertificateFile/etc/apache2/cert/ssl-cert.pem
  SSLCertificateKeyFile /etc/apache2/cert/ssl-cert.key
  PassengerEnabled on
</VirtualHost>

```

しかし、これでも動かない。わけわからん。
ここで再びネットの海を彷徨い [おほ。2.4系じゃ .htaccess ファイルの許可の仕方も変わってるんだなあ - 電気ウナギ的○○](http://blog.netandfield.com/shar/2012/10/24-htaccess.html) を発見する。

```conf
<VirtualHost *:443>
  ServerName xxx.mkt-sys.jp:443
  DocumentRoot /var/lib/rails/redmine/public
  <Directory /var/lib/rails/redmine/public/>
    Options FollowSymLinks
    AllowOverride None
    Require all granted
  </Directory>
  SSLCertificateFile/etc/apache2/cert/ssl-cert.pem
  SSLCertificateKeyFile /etc/apache2/cert/ssl-cert.key
  PassengerEnabled on
</VirtualHost>
```

とせんとイカンらしい。これでようやくRedmineが表示された。

## ImageMagickとRMagick

Redmineを確認すると案の定下記の ImageMagick 関連がエラーになっていた。

* RMagickが利用可能 (オプション)
* ImageMagickのconvertコマンドが利用可能 (オプション)
* 前回の用にソースから再度ビルドしてもいいのだが、どうやら apt に入っている ImageMagick も新しくなって、RMagick をすんなり入れられるらしいので、入れ替える。

`/usr/bin` から ImageMagick 関連のシンボリックリンクを削除した後に ImageMagick と RMagick を入れ替える。 

```bash
$ aptitude install imagemagick libmagick++-dev
$ cd /var/lib/rails/redmine
$ bundle exec gem uninstall rmagick
$ bundle install

```

これで、"ImageMagickのconvertコマンドが利用可能 (オプション)" は解決。
RMagick については [以前の経験](http://blog.mkt-sys.jp/2014/05/fix-rmagick.html)により調査する。 

```bash
$ bundle exec rails c production
irb(main):001:0> require 'RMagick'
  LoadError: liblcms.so.1: cannot open shared object file: No such file or directory - /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/extensions/x86_64-linux/2.1.0-static/rmagick-2.13.2/RMagick2.so
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:251:in `require'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:251:in `block in require'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:236:in `load_dependency'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:251:in `require'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/rmagick-2.13.2/lib/RMagick.rb:11:in `<top (required)>'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:251:in `require'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:251:in `block in require'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:236:in `load_dependency'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/activesupport-3.2.19/lib/active_support/dependencies.rb:251:in `require'
  from (irb):1
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/railties-3.2.19/lib/rails/commands/console.rb:47:in `start'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/railties-3.2.19/lib/rails/commands/console.rb:8:in `start'
  from /var/lib/rails/redmine-2.5.2/vendor/bundle/ruby/2.1.0/gems/railties-3.2.19/lib/rails/commands.rb:41:in `<top (required)>'
  from script/rails:6:in `require'
  from script/rails:6:in `<main>'
```

liblcms.so.1 が見つからないらしい。locate しても確かにいない。
apt で入れたのに、ライブラリ足りないってどーゆーことよ。
依存関係を調べてみる。 

```bash
$ ldd vendor/bundle/ruby/2.1.0/gems/rmagick-2.13.2/lib/RMagick2.so
  linux-vdso.so.1 =>(0x00007fff01ffe000)
  libMagickCore.so.5 => /usr/local/lib/libMagickCore.so.5 (0x00007f6be578c000)
  libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f6be556e000)
  libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f6be5267000)
  libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f6be4ea1000)
  liblcms.so.1 => not found
  libtiff.so.4 => not found
  libfreetype.so.6 => /usr/lib/x86_64-linux-gnu/libfreetype.so.6 (0x00007f6be4bfd000)
  libjasper.so.1 => /usr/lib/x86_64-linux-gnu/libjasper.so.1 (0x00007f6be49a6000)
  libjpeg.so.62 => /usr/lib/x86_64-linux-gnu/libjpeg.so.62 (0x00007f6be4780000)
  libpng12.so.0 => /lib/x86_64-linux-gnu/libpng12.so.0 (0x00007f6be455a000)
  libXext.so.6 => /usr/lib/x86_64-linux-gnu/libXext.so.6 (0x00007f6be4348000)
  libSM.so.6 => /usr/lib/x86_64-linux-gnu/libSM.so.6 (0x00007f6be413f000)
  libICE.so.6 => /usr/lib/x86_64-linux-gnu/libICE.so.6 (0x00007f6be3f23000)
  libX11.so.6 => /usr/lib/x86_64-linux-gnu/libX11.so.6 (0x00007f6be3bee000)
  libbz2.so.1.0 => /lib/x86_64-linux-gnu/libbz2.so.1.0 (0x00007f6be39dd000)
  libxml2.so.2 => /usr/lib/x86_64-linux-gnu/libxml2.so.2 (0x00007f6be3677000)
  libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007f6be345e000)
  libgomp.so.1 => /usr/lib/x86_64-linux-gnu/libgomp.so.1 (0x00007f6be324e000)
  libltdl.so.7 => /usr/lib/x86_64-linux-gnu/libltdl.so.7 (0x00007f6be3044000)
  libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f6be2e40000)
  /lib64/ld-linux-x86-64.so.2 (0x00007f6be607c000)
  libjpeg.so.8 => /usr/lib/x86_64-linux-gnu/libjpeg.so.8 (0x00007f6be2bea000)
  libuuid.so.1 => /lib/x86_64-linux-gnu/libuuid.so.1 (0x00007f6be29e5000)
  libxcb.so.1 => /usr/lib/x86_64-linux-gnu/libxcb.so.1 (0x00007f6be27c5000)
  liblzma.so.5 => /lib/x86_64-linux-gnu/liblzma.so.5 (0x00007f6be25a3000)
  libXau.so.6 => /usr/lib/x86_64-linux-gnu/libXau.so.6 (0x00007f6be239e000)
  libXdmcp.so.6 => /usr/lib/x86_64-linux-gnu/libXdmcp.so.6 (0x00007f6be2198000)
```

なんと `liblcms.so.1` だけでなく、`libtiff.so.4` も見つからないらしい。おろろーん。
aptitude でみてみると libtiff5 や libcmls2 は入っている。


```
lrwxrwxrwx 1 root root 17 Jan 162014 /usr/lib/x86_64-linux-gnu/liblcms2.so -> liblcms2.so.2.0.5
lrwxrwxrwx 1 root root 17 Jan 162014 /usr/lib/x86_64-linux-gnu/liblcms2.so.2 -> liblcms2.so.2.0.5
-rw-r--r-- 1 root root 346928 Jan 162014 /usr/lib/x86_64-linux-gnu/liblcms2.so.2.0.5
# 省略
lrwxrwxrwx 1 root root 16 May6 04:39 /usr/lib/x86_64-linux-gnu/libtiff.so -> libtiff.so.5.2.0
lrwxrwxrwx 1 root root 16 May6 04:39 /usr/lib/x86_64-linux-gnu/libtiff.so.5 -> libtiff.so.5.2.0
-rw-r--r-- 1 root root 467208 May6 04:39 /usr/lib/x86_64-linux-gnu/libtiff.so.5.2.0
```

ライブラリのファイルもあるので、多少バージョンが違うかもしれないが強引にこれらにリンクさせてみる。


```bash
$ cd /usr/lib/x86_64-linux-gnu/
$ ln -s liblcms2.so liblcms.so.1
$ ln -s libtiff.so.5 libtiff.so.4

```

Redmine を再起動して確認してみると、"ImageMagickのconvertコマンドが利用可能 (オプション)" もOKマークに変わっている。
念のため、動かしてみる。
Redmine では、RMagick はガントチャートの PNG のために使用されているので、PNG 表示してみると無事に表示されたが、日本語が文字化けした。
[ガントチャートをPNG形式の画像に出力すると文字化けする — Redmine.JP](http://redmine.jp/faq/gantt/gantt-png-mojibake/) によると、日本語フォントを設定しないといけないらしい。
そもそもインストールしていないのでインストールして設定する。


```bash
$ aptitude install fonts-ipaexfont
$ vim /var/lib/rails/redmine/config/configration.yml
  #=> rmagick_font_path に /usr/share/fonts/truetype/fonts-japanese-gothic.ttf を指定
```

するとすんなり PNG でも日本語が表示された。
ということで、とりあえず問題は解決したと思われる。
しかし、もっと本質的な解決方法があると思うなぁ、でも疲れたので今回はここまで。
前回より苦戦しないかと思ったらとんでもない、ドはまりしてだいぶ時間がかかった。
