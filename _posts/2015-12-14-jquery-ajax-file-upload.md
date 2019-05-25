---
layout: post
title: jQuery使ってAJAXでファイルアップロード
date: '2015-12-14T11:53:00.000+09:00'
author: pinzolo
tags:
- ajax
- jQuery
- javascript
---

なんか毎回毎回うろ覚えでちょろちょろ調べながら書いている気がするのでメモとして

```html
<div id="drop-area" class="file-drop-area">
  <input id="upload-file" type="file" class="hidden"/>
  <button id="select-file" class="btn btn-primary">ファイルを選択</button>
</div>
```

```javascript
jQuery(document).ready(function($) {
  var cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  $('.file-drop-area').bind('dragenter', function(e) {
    $(this).addClass('drag-enter');
    return cancel(e);
  }).bind("dragleave", function(e) {
    $(this).removeClass('drag-enter');
    return cancel(e);
  }).bind('dragover', function(e) {
    return cancel(e);
  }).bind('drop', function(e) {
    $(this).removeClass('drag-enter');
    return cancel(e);
  });
});
```

```javascript
jQuery(document).ready(function($) {
  var uploadFile = function(file) {
    formData = new FormData();
    formData.append('file', file);
    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    }).done(function(data, status, response) {
      console.log('success');
    }).fail(function(response, status, thrown) {
      console.log(response.responseText);
    });
  };

  $('#drop-area').bind('drop', function(e) {
    if (e.originalEvent.dataTransfer.files.length > 0) {
      uploadFile(e.originalEvent.dataTransfer.files[0]);
    }
  });

  $('#upload-file').bind('change', function() {
    if (this.files.length > 0) {
      uploadFile(this.files[0]);
    }
  });

  $('#select-file').bind('click', function() {
    $('#upload-file').click();
  });
});
```

今回は `dragover` を補足してキャンセルしておかないと `drop` イベントを補足してくれなかったのにハマった  
スタイル変えたり、イベント伝播のキャンセル処理は共通なので class で処理して共通 js に置く。  
ドロップされた時の処理は、アップロード先やアップロード後の処理など画面ごとになる可能性が高いので id を使って個別jsに置くイメージ
