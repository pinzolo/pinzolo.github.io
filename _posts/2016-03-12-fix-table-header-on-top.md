---
layout: post
title: よくあるテーブルのヘッダ固定の1つ
date: '2016-03-12T16:13:00.000+09:00'
author: pinzolo
tags:
- angularjs
---

業務アプリを作っているとテーブルのヘッダを固定して欲しいという話はよくある。よくありすぎる。  
2つのテーブルを作って列の幅を固定して、body担当テーブルはdivで囲って overflow-y 程度でできればいいんだけど、IEはスクロールバーを出しっぱなしなのでずれる。  
仕方なくheader担当にもスクロールバーをだしっぱなすとかまあ色々苦労する。

今回は、ページの上部にヘッダが来たらそこでheader担当を固定させてやればいいよね。ということでやってみた。

```js
(function() {
  'use strict';

  angular.module('app').directive('fixedOnTop', function($window) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        angular.element($window).on('scroll', function() {
          var baseTop = element.get(0).offsetTop;
          if (angular.element(this).scrollTop() >= baseTop) {
            element.addClass('fixed-on-top');
            element.width(angular.element('#' + attrs.fixedOnTop).width());
          } else {
            element.removeClass('fixed-on-top');
            element.width('100%');
          }
        });
      }
    }
  });
}());
```

```css
.fixed-on-top {
  position: fixed;
  top: 98px;
}
```

```html
<div>
  <table id="table-header" fixed-on-top="table-body">
    <!-- header cells -->
  </table>
  <table id="table-body">
    <!-- data cells -->
  </table>
</div>
```

```js
// jQuery でやる場合
$(function() {
  var baseTop = $('#table-header').get(0).offsetTop;
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > baseTop) {
      $('.header').addClass('fixed-on-top');
    } else {
      $('.header').removeClass('fixed-on-top');
    }
  });
});
```

AngularJS の directive でやったけど、参考にした jQuery も備忘録的にメモっておいた  
Bootstrapのpanelなんかの中にあった場合、固定した瞬間にはみ出て横幅がずれるので、body担当の横幅に合わせられるようにしている。

本当は thead に設定して1つのテーブルでやりたかったんだけどどうしても幅指定が出来なくて仕方なくテーブルを分けた。  
横幅やスクロール距離、固定位置などパラメータは要件次第だけど結構手軽にできるもんだな。
