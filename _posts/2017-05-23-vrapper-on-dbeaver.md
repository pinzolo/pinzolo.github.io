---
layout: post
title: DBeaver で vrapper を使う
date: '2017-05-23T02:01:38+0900'
main-class: dev
tags: tool
---

[DBeaver \| Free Universal SQL Client](http://dbeaver.jkiss.org/) というDBツールを少し前に知って利用しているが、かなりよいと思う。  
簡単に紹介すると Eclipse のWSTベースで実装されていているツールで、単独版とEclipseプラグインがある。ちなみに、タブが紛れたりパースペクティブのレイアウトがコロコロ変わるのは好きではないので Eclipse プラグインではなくスタンドアロン版を利用している。  
WSTベースなのでマルチプラットフォームだし、扱えるDB製品の数も非常に多い。テーブル名や列名の補完もしてくれるし、キーワードを自動で大文字にしてくれる、本番・テスト・開発など環境ごとにマーカーを指定できるのもよい。検索結果から外部キーの参照先列へダイレクトで飛べたりするし、SQLの部分実行もできるし、ショートカット一発でSQLをフォーマットもしてくれる。機能的には十分である。

WSTベースということもあって、ネイティブ言語で作成されたツールよりはもっさりするのはデメリットだが個人的には些細な範囲。

で、EclipseベースなのでちょっとしたEclipseプラグインなら使えるんじゃないのと思って Help -> Installation Information や Help -> Install New Software... を覗いてみるが、プラグインリポジトリは全く登録されていない。  
普段 vim キーバインドを使用しているので、できれば DB ツールで SQL 書くときも vim のキーバインドで書きたい。vrapper が使えたらそれがかなう。  

というわけで試してみる。  

1. Help -> Install New Softoware を選択し、add... ボタンを押下する。  
2. [http://vrapper.sourceforge.net/update-site/stable](http://vrapper.sourceforge.net/update-site/stable) を入力して、必要なものを選択してインストール。
3. DBeaver を再起動

思った通り、SQLペインで vim キーバインドが有効となった。かなり満足している
