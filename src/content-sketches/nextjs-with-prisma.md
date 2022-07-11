---
title: 'Add Prisma to NestJs'
date: '2021-07-3'
author: 'Wojciech Cendrzak'
image: '/images/nodejs-ec2.png'
tags: 'devops, nodejs, aws'
isPublished: false
---

In this article, we will add a Prisma to **NestJs** application.

... with postgreSQL

## Add Prisma

```bash
yarn add prisma -D

yarn add @prisma/client
```

## Initalize prisma

```bash
yarn prisma init
```

```
model User {
  id   Int     @id @default(autoincrement())
  name String?
}
```

## Generate the Prisma Client

```
yarn prisma generate
```

## Docker Build

```bash
docker build -t nestjs-api .
```

```bash
docker run -p 3000:3000 --env-file .env -d nestjs-api
```

## Create a docker compose

make sure docker-compose is installed

```
docker-compose version
```

Result

```bash
docker-compose version 1.29.2, build 5becea4c
docker-py version: 5.0.0
CPython version: 3.9.0
OpenSSL version: OpenSSL 1.1.1h  22 Sep 2020
```

## Create the first migration:

```
yarn prisma migrate dev --name init
```

Replace the host postgres with localhost if you want to perform Prisma migrations locally of your Postgres Docker container.

## Apply migration to existing db

Change db host to local host
run docker-compose
apply migration from local machine (Q. hot local machine can see dockerized progress server (a- its expose a port same like app))

```
npx prisma migrate deploy
```

stop docker compose
change db host to `postgres` container name again
run docker-compose again

## Seed DataBase

```
yarn prisma db seed --preview-feature
```

# Deploy on AWS

## Git remote update

```
git remote update
```

## reset git changes

```
git reset --hard
```

## Instal docker compose

```
sudo apt install docker-compose
```

hm this will install old version

so remove it

```
docker-compose version 1.25.0, build unknown
docker-py version: 4.1.0
CPython version: 3.8.10
OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
```

```
sudo apt remove docker-compose
```

New way to inslall

[link](https://docs.docker.com/compose/install/)

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

```
nano .env
```

```
sudo docker-compose up
```

### remove container

```
sudo docker container rm <container id>
```

### remove image

```
sudo docker image rm <image id>
```

### enlist volumes

```
sudo docker volume ls
```

### delete volume

```
sudo docker volume rm <volume name>
```

```
sudo docker-compose up
```
