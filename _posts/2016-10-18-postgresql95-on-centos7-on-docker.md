---
layout: post
title: Docker の CentOS7 で PostgreSQL 9.5 を利用する
date: '2016-10-18T21:39:57+0900'
main-class: dev
tags:
  - centos
  - docker
  - postgresql
---

Docker で PostgreSQL 環境を作ろうと思い、[CentOS\-Dockerfiles/postgres/centos7 at master · CentOS/CentOS\-Dockerfiles](https://github.com/CentOS/CentOS-Dockerfiles/tree/master/postgres/centos7) をベースに `docker build` すると PostgreSQL のバージョンは 9.2 だった。  
さすがに、ちょっと古いので 9.5 に対応するべくスクリプトを変更した。

[pinzolo/pg95\-centos7\-docker: PostgreSQL9\.5 on CentOS7 on Docker](https://github.com/pinzolo/pg95-centos7-docker) に置いておく。
