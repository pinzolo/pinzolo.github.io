---
layout: post
title: Ubuntu 12.04 on さくらのVPS に GitBucket を入れたメモ
date: '2016-04-07T16:03:00.000+09:00'
author: pinzolo
tags:
- gitbucket
- ubuntu
---

## Tomcatのインストール


```bash
sudo aptitude install -y tomcat7 tomcat7-admin
```

## Tomcatの設定

```bash
sudo vi /etc/tomcat7/server.xml
```

HTTPのConnector設定をコメントアウトし、AJPのConnector設定を有効にする。

## GitBucketの配置

```bash
$ wget https://github.com/gitbucket/gitbucket/releases/download/3.13/gitbucket.war
$ sudo mv gitbucket.war /var/lib/tomcat7/webapps
$ ls -al /var/lib/tomcat7/webapps
  drwxrwxr-x 4 tomcat7 tomcat7     4096 Apr  7 14:37 .
  drwxr-xr-x 6 root    root        4096 Apr  7 14:24 ..
  drwxr-xr-x 7 tomcat7 tomcat7     4096 Apr  7 14:37 gitbucket
  -rw-r--r-- 1 root    root    39783199 Apr  7 14:37 gitbucket.war
  drwxr-xr-x 3 root    root        4096 Apr  7 14:25 ROOT
```

## ApacheのGitBucket用設定ファイル

```bash
$ sudo vi /etc/apache2/sites-available/gitbucket.conf
  <VirtualHost *:443>
    ServerName gitbucket.my-domain:443
    <Location />
      ProxyPass ajp://localhost:8009/
    </Location>
    SSLCertificateFile    /etc/apache2/cert/ssl-cert.pem
    SSLCertificateKeyFile /etc/apache2/cert/ssl-cert.key
  </VirtualHost>
$ sudo a2ensite gitbucket
```

## 再起動

```bash
$ sudo service tomcat7 restart
$ sudo service apache2 restart
```

しかし、アクセスしても 404 となる。  
`/var/log/tomcat7/localhost.2016-04-07.log` を見ると、こんなエラーが出ている。

```
SEVERE: Error configuring application listener of class gitbucket.core.ssh.SshServerListener
java.lang.UnsupportedClassVersionError: gitbucket/core/ssh/SshServerListener : Unsupported major.minor version 52.0 (unable to load class gitbucket.core.ssh.SshServerListener)
        at org.apache.catalina.loader.WebappClassLoader.findClassInternal(WebappClassLoader.java:2948)
        at org.apache.catalina.loader.WebappClassLoader.findClass(WebappClassLoader.java:1208)
        at org.apache.catalina.loader.WebappClassLoader.loadClass(WebappClassLoader.java:1688)
        at org.apache.catalina.loader.WebappClassLoader.loadClass(WebappClassLoader.java:1569)
        at org.apache.catalina.core.DefaultInstanceManager.loadClass(DefaultInstanceManager.java:529)
        at org.apache.catalina.core.DefaultInstanceManager.loadClassMaybePrivileged(DefaultInstanceManager.java:511)
        at org.apache.catalina.core.DefaultInstanceManager.newInstance(DefaultInstanceManager.java:139)
        at org.apache.catalina.core.StandardContext.listenerStart(StandardContext.java:4888)
        at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:5467)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:150)
        at org.apache.catalina.core.ContainerBase.addChildInternal(ContainerBase.java:901)
        at org.apache.catalina.core.ContainerBase.addChild(ContainerBase.java:877)
        at org.apache.catalina.core.StandardHost.addChild(StandardHost.java:632)
        at org.apache.catalina.startup.HostConfig.deployWAR(HostConfig.java:1073)
        at org.apache.catalina.startup.HostConfig$DeployWar.run(HostConfig.java:1857)
        at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:471)
        at java.util.concurrent.FutureTask.run(FutureTask.java:262)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
        at java.lang.Thread.run(Thread.java:745)

```

<a href="https://github.com/gitbucket/gitbucket/issues/1082">https://github.com/gitbucket/gitbucket/issues/1082</a> によると、Java8を必要としているがJava8ではない場合に出るエラーのようだ。TomcatがJava8で動いていないっぽい。 

## JAVA_HOMEの設定

```bash
$ sudo vi /etc/default/tomcat7
```

`JAVA_HOME=/usr/lib/jvm/java-8-oracle` を追加して再起動。 しかしまだ表示されない。今度はこんなエラー。

```bash
SEVERE: Exception sending context initialized event to listener instance of class gitbucket.core.servlet.InitializeListener
java.sql.SQLException: Connections could not be acquired from the underlying database!
        at com.mchange.v2.sql.SqlUtils.toSQLException(SqlUtils.java:118)
        at com.mchange.v2.c3p0.impl.C3P0PooledConnectionPool.checkoutPooledConnection(C3P0PooledConnectionPool.java:692)
        at com.mchange.v2.c3p0.impl.AbstractPoolBackedDataSource.getConnection(AbstractPoolBackedDataSource.java:140)
        at scala.slick.jdbc.JdbcBackend$DatabaseFactoryDef$$anon$3.createConnection(JdbcBackend.scala:47)
        at scala.slick.jdbc.JdbcBackend$BaseSession.conn$lzycompute(JdbcBackend.scala:397)
        at scala.slick.jdbc.JdbcBackend$BaseSession.conn(JdbcBackend.scala:397)
        at scala.slick.jdbc.JdbcBackend$BaseSession.withTransaction(JdbcBackend.scala:420)
        at scala.slick.backend.DatabaseComponent$DatabaseDef$$anonfun$withTransaction$1.apply(DatabaseComponent.scala:54)
        at scala.slick.backend.DatabaseComponent$DatabaseDef$$anonfun$withTransaction$1.apply(DatabaseComponent.scala:54)
        at scala.slick.backend.DatabaseComponent$DatabaseDef$class.withSession(DatabaseComponent.scala:34)
        at scala.slick.jdbc.JdbcBackend$DatabaseFactoryDef$$anon$3.withSession(JdbcBackend.scala:46)
        at scala.slick.backend.DatabaseComponent$DatabaseDef$class.withTransaction(DatabaseComponent.scala:54)
        at scala.slick.jdbc.JdbcBackend$DatabaseFactoryDef$$anon$3.withTransaction(JdbcBackend.scala:46)
        at gitbucket.core.servlet.InitializeListener.contextInitialized(InitializeListener.scala:30)
        at org.apache.catalina.core.StandardContext.listenerStart(StandardContext.java:4973)
        at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:5467)
        at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:150)
        at org.apache.catalina.core.ContainerBase.addChildInternal(ContainerBase.java:901)
        at org.apache.catalina.core.ContainerBase.addChild(ContainerBase.java:877)
        at org.apache.catalina.core.StandardHost.addChild(StandardHost.java:632)
        at org.apache.catalina.startup.HostConfig.deployWAR(HostConfig.java:1073)
        at org.apache.catalina.startup.HostConfig$DeployWar.run(HostConfig.java:1857)
        at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)
        at java.util.concurrent.FutureTask.run(FutureTask.java:266)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:745)
Caused by: com.mchange.v2.resourcepool.CannotAcquireResourceException: A ResourcePool could not acquire a resource from its primary factory or source.
        at com.mchange.v2.resourcepool.BasicResourcePool.awaitAvailable(BasicResourcePool.java:1469)
        at com.mchange.v2.resourcepool.BasicResourcePool.prelimCheckoutResource(BasicResourcePool.java:644)
        at com.mchange.v2.resourcepool.BasicResourcePool.checkoutResource(BasicResourcePool.java:554)
        at com.mchange.v2.c3p0.impl.C3P0PooledConnectionPool.checkoutAndMarkConnectionInUse(C3P0PooledConnectionPool.java:758)
        at com.mchange.v2.c3p0.impl.C3P0PooledConnectionPool.checkoutPooledConnection(C3P0PooledConnectionPool.java:685)
        ... 25 more
Caused by: org.h2.jdbc.JdbcSQLException: Error while creating file "/usr/share/tomcat7/.gitbucket" [90062-190]
        at org.h2.message.DbException.getJdbcSQLException(DbException.java:345)
        at org.h2.message.DbException.get(DbException.java:179)
        at org.h2.message.DbException.get(DbException.java:155)
        at org.h2.store.fs.FilePathDisk.createDirectory(FilePathDisk.java:274)
        at org.h2.store.fs.FileUtils.createDirectory(FileUtils.java:42)
        at org.h2.store.fs.FileUtils.createDirectories(FileUtils.java:309)
        at org.h2.mvstore.db.MVTableEngine.init(MVTableEngine.java:73)
        at org.h2.engine.Database.getPageStore(Database.java:2450)
        at org.h2.engine.Database.open(Database.java:672)
        at org.h2.engine.Database.openDatabase(Database.java:269)
        at org.h2.engine.Database.<init>(Database.java:263)
        at org.h2.engine.Engine.openSession(Engine.java:65)
        at org.h2.engine.Engine.openSession(Engine.java:175)
        at org.h2.engine.Engine.createSessionAndValidate(Engine.java:153)
        at org.h2.engine.Engine.createSession(Engine.java:136)
        at org.h2.engine.Engine.createSession(Engine.java:28)
        at org.h2.engine.SessionRemote.connectEmbeddedOrServer(SessionRemote.java:349)
        at org.h2.jdbc.JdbcConnection.<init>(JdbcConnection.java:107)
        at org.h2.jdbc.JdbcConnection.<init>(JdbcConnection.java:91)
        at org.h2.Driver.connect(Driver.java:72)
        at com.mchange.v2.c3p0.DriverManagerDataSource.getConnection(DriverManagerDataSource.java:175)
        at com.mchange.v2.c3p0.WrapperConnectionPoolDataSource.getPooledConnection(WrapperConnectionPoolDataSource.java:220)
        at com.mchange.v2.c3p0.WrapperConnectionPoolDataSource.getPooledConnection(WrapperConnectionPoolDataSource.java:206)
        at com.mchange.v2.c3p0.impl.C3P0PooledConnectionPool$1PooledConnectionResourcePoolManager.acquireResource(C3P0PooledConnectionPool.java:203)
        at com.mchange.v2.resourcepool.BasicResourcePool.doAcquire(BasicResourcePool.java:1138)
        at com.mchange.v2.resourcepool.BasicResourcePool.doAcquireAndDecrementPendingAcquiresWithinLockOnSuccess(BasicResourcePool.java:1125)
        at com.mchange.v2.resourcepool.BasicResourcePool.access$700(BasicResourcePool.java:44)
        at com.mchange.v2.resourcepool.BasicResourcePool$ScatteredAcquireTask.run(BasicResourcePool.java:1870)
        at com.mchange.v2.async.ThreadPoolAsynchronousRunner$PoolThread.run(ThreadPoolAsynchronousRunner.java:696)

```

`/usr/share/tomcat7/.gitbucket` が作成できないらしい。パーミッションか

```bash
$ ls -al /usr/share/tomcat7
  drwxr-xr-x   4 root root 4096 Apr  7 14:24 .
  drwxr-xr-x 155 root root 4096 Apr  7 14:25 ..
  drwxr-xr-x   2 root root 4096 Apr  7 14:24 bin
  -rw-r--r--   1 root root   39 Feb 21  2014 defaults.md5sum
  -rw-r--r--   1 root root 2030 Feb 21  2014 defaults.template
  drwxr-xr-x   2 root root 4096 Apr  7 14:24 lib
  -rw-r--r--   1 root root   53 Feb 21  2014 logrotate.md5sum
  -rw-r--r--   1 root root  118 Feb 21  2014 logrotate.template
```

rootになっとる。

## /usr/share/tomcat7/.gitbuckeのパーミッション設定

```bash
$ sudo chown -R tomcat7:tomcat7 /usr/share/tomcat7
```

再度再起動したら表示はされたが assets が効いていない。

## assets有効化

どうやら assets のパスは固定になっているらしい。今回は VirtualHost でやったため、`/gitbucket` が存在しないから `/gitbucket/assets` も当然見えないわけだ。  
しかたないので `/etc/apache2/sites-available/gitbucket.conf` を書き換えた。

```
    <VirtualHost *:443>
      ServerName gitbucket.my-domain:443
      ProxyReverseHost On
      RewriteEngine On
      ProxyPass /gitbucket ajp://localhost:8009/gitbucket/
      ProxyPassReverse /gitbucket ajp://localhost:8009/gitbucket/
      ProxyPass /gitbucket/assets ! # 静的ファイルはAapacheに処理させる
      Redirect / /gitbucket # ルートにアクセスしても大丈夫なように
      RewriteRule ^/gitbucket/(.*) ajp://localhost:8009/gitbucket/$1 [P,L,QSA]
      SSLCertificateFile    /etc/apache2/cert/ssl-cert.pem
      SSLCertificateKeyFile /etc/apache2/cert/ssl-cert.key
    </VirtualHost>

```

`RewriteRule` がないとトップは表示されても、サインインできなかった。  
もうちょっとスッキリした設定があるような気がするけど、まあとりあえず。
