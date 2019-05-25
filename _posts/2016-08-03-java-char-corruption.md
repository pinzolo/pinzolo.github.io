---
layout: post
title: "〜が文字化けした"
tags: java
---

UTF-8が浸透して随分楽になったが、外部システム連携なんかではまだまだShift_JIS変換は避けられないこのご時世、いかがお過ごしでしょうか。

先日、Java でソースコードにベタで書いた "〜" が Shift_JIS(MS932) で出力すると文字化けした。
調べてみると 0x301c に変換されていた。変換して欲しいのは 0xff5e である。

たぶん mac で書いているせいで、[http://blog.sakurachiro.com/2012/09/tilda/](http://blog.sakurachiro.com/2012/09/tilda/) ここらへんの話だろう。
Windowsでソース書けばちゃんと変換されるとか、sinθじゃなくて -sinθのほうで出力すれば大丈夫とか聞いたが、いちいち開発機を切り替えるのもいやだし、-sinθなんて絶対出し方忘れる。

というわけで、文字列じゃなくて `Character durationChar = Character.valueOf((char)65374);` とかやって逃げた。

```java
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class MS932Map {
    public static void main(String[] args) {
        File file = new File("MS932Map.csv");
        BufferedWriter out = null;
        try {
            out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "MS932"));
            for (int i = 1; i < Character.MAX_VALUE; i++) {
                out.write(String.format("0x%x,%d,%c\n", i, i, (char) i));
            }
            out.flush();
        } catch (Exception ex) {
            System.err.println(ex);
        } finally {
            try {
                out.close();
            } catch (IOException ex) {
                System.err.println(ex);
            }
        }
    }
}
```

こんな感じで出力したMS932マップを持っておくとこういう時便利。

