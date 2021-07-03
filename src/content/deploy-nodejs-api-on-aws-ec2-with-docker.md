---
title: 'Deploy NodeJs API on AWS EC2 with docker'
date: '2021-07-03'
author: 'Wojciech Cendrzak'
image: '/images/nodejs-ec2-docker.png'
tags: 'devops, nodejs, aws, docker'
isPublished: true
includeReferences: deploy-nodejs-api-series-section
---

In this, we'll cover how to **dockerized** NodeJs application. Finally, we will deploy it on AWS EC2.

{{deploy-nodejs-api-series-section}}

## What Docker is

**Docker** itself is a platform that allows us to manage **containerized** applications. It can run on Linux, Windows, and Mac.
Linux and Windows support it **natively**.

On Mac, Docker is running through a **lightweight Linux Virtual Machine**. So it is a Docker on Linux under the hood.
It also exposes Docker API to your Mac environment. Therefore we can use the Docker commands from the Mac terminal in the same way as on the native Linux.

In this tutorial, we will be using Mac. Make sure you have [**Docker Desktop**](https://www.docker.com/products/docker-desktop) installed.

You can check the installation by typing:

```bash
$ sudo docker version
```

The output should looks like this:

```bash
Client:
 Cloud integration: 1.0.17
 Version:           20.10.7
 API version:       1.41
 Go version:        go1.16.4
 Git commit:        f0df350
 Built:             Wed Jun  2 11:56:22 2021
 OS/Arch:           darwin/amd64
 Context:           desktop-linux
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.7
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.13.15
  Git commit:       b0f5bc3
  Built:            Wed Jun  2 11:54:58 2021
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.4.6
  GitCommit:        d71fcd7d8303cbf684402823e425e9dd2e99285d
 runc:
  Version:          1.0.0-rc95
  GitCommit:        b9ee9c6314599f1b4a7f497e1f1f856fe433d3b7
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

## What Container is

**Container** is a piece of software that runs in **isolation** from hosting OS and from other containers.

More precisely, it allows us to **package an application with its environment**, dependencies, and configuration.

Exp, it makes it easy to make development on the local machine. Then deploy it to the cloud without worries that some dependencies will be missing or has a version that our app is not supporting.

It allows us also to run multiple applications that use different versions of a specific library.
E. g two different versions of the same database engine. It wouldn't be easy without containers. We can achieve that by running multiply Virtual Machines on the host OS. With Docker containers, this is far way easy.

## Isn't the Container a VM itself?

This metaphor is accurate from a usage perspective, but not technically.
A container provides isolation just like a virtual machine but in a different way.

When running software on **virtual machine**, we need to install the guest OS on it. VM **shares hardware** from the host machine.

In opposition, the container shares not only hardware but **shares a host OS** too. It utilizes container concepts such as **cgroups** and **namespaces**. Those were implemented directly on the Linux kernel and then ported to Windows. So you don't need to install an additional OS.
It gives an advantage over the virtual machine such as:

- it is very **lightweight**,
- switching containers on/off is significant **faster**
- **no additional license** needed for VM guest OS

Docker Container can be from an **Image**.

## What Image is

In simple words, we can say that Docker Image is a **blueprint** for a container. Or a class, for instance. Or container template for a container. We can create a Docker Image through Dockerfile.

## What Dockerfile is

A Dockerfile is a recipe from which we will build an Image.
It is essentially a **text file** that contains the commands to build an image.
Those commands are read-only layers, each of which represents a Dockerfile instruction.
The layers are stacked, and each one is a delta of the changes from the previous layer.

## Complete flow

1. We will create a NodeJs app
2. We will create a **Dockerfile**
3. From a Dockerfile we will build an **Image**
4. We will run an Image into a new **Container**

## 1. Create a NodeJs project

We can create any NodeJs app or clone this git repo:

```bash
https://github.com/WojciechCendrzak/nestjs-api
```

A complete solution is also available here:

```bash
https://github.com/WojciechCendrzak/nestjs-api/tree/docker
```

## 2. Create a Dockerfile

Create a Dockerfile in main folder:

```dockerfile
# ./Dockerfile

FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
```

Let's take a look at the Dockerfile anatomy and break it down, line by line.
You can check a full specification here [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)

```dockerfile
FROM node:14
```

In the first line, we can define from which **parent Image** we want to start. It is also possible to create an image from scratch. In that case, we can completely omit **FROM**. But, in most cases, we will base a new Image on another existing one. It simplifies stuff a lot. In this case, we will use 'node:14'. This image comes with NodeJS version 14 LTS and npm installed. It will be taken from [Docker Hub](https://hub.docker.com/_/node) during the build process.

```dockerfile
WORKDIR /usr/src/app
```

Next, we set a working directory for any following Docker instructions. Later we will copy our NodeJs application there. It will be created on the container filesystem if not exists.

```dockerfile
COPY package*.json ./

RUN npm install
```

In the two following lines, we will install dependencies. First, we copy a package.json and package-lock.json (notice a wildcard \*). What interesting is we are not going to copy all project files. It is because we want to take benefit of **cached Docker layers**.

```dockerfile
COPY . .
```

After that, we want to copy our application source files to the container filesystem.
The first param stands for source. In this case, a dot means a folder containing Dockerfile.
The second is a destination inside the container filesystem. In this case, a dot means a WORKDIR that we set up before.

```dockerfile
EXPOSE 3000
```

Our NesjJs API is bind to port 3000. The EXPOSE instruction informs Docker that the container listens on that port at runtime.

```dockerfile
CMD [ "npm", "run", "start" ]
```

Finally, we will run API by triggering _npm run start_.
The template for providing this instruction is like that:

```bash
CMD ["executable","param1","param2"]
```

## 3. Buil an Image

Before we build, let create '.dockerignore' file

```bash
# .dockerignore

node_modules
npm-debug.log
```

It will prevent our local modules and debug logs from being copied onto our Docker image.

Let's navigate the directory with our Dockerfile and run the following command to build the Docker image.
The **-t** flag lets us tag our image, so it's easier to find later.

```bash
$ docker build . -t nestjs-api
```

Now we can list our new image:

```bash
$ docker images

REPOSITORY          TAG       IMAGE ID       CREATED         SIZE
nestjs-api          latest    cb53842aa908   8 seconds ago   1.17GB
```

## 4. Run the Container

```bash
$ docker run -p 3000:3000 -d nestjs-api
```

The **-p** flag redirects a public port to a private port inside a container.
We can also pass **-d** flag, and it will run the container in detached mode.
We can then close the console leaving the container running in the background.

## Check whether container is running

```bash
$ curl -i localhost:3000

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"
Date: Fri, 02 Jul 2021 23:20:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Hello World!
```

## Other Docker commands

#### List containers

```bash
$ docker ps

CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS         PORTS                                       NAMES
542cd674ae6b   nestjs-api          "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   suspicious_goldwasser
```

#### Prints a logs

```bash
$ docker logs <container id>
```

#### Stop the container

```bash
$ docker stop <container id>
```

#### Go inside running container

```bash
$ docker exec -it <container id> /bin/bash
```

## Deploying on AWS EC2

Now we will see all the beauty of Docker:
We can run our dockerized NestJs API on AWS EC2 in the same way as locally.

First login to AWS EC2.

If you haven't yet created any EC2 check [this](/post/deploy-nodejs-api-on-aws-ec2) article.

After connected via SSH, let install first a docker:

```bash
$ sudo apt install docker.io
```

Let's double-check installation:

```bash
$ sudo docker version
```

Clone NestJs API from git and change branch 'docker':

```bash
$ git clone https://github.com/WojciechCendrzak/nestjs-api
$ cd nestjs-api
$ git branch -a
$ git checkout remotes/origin/docker
```

Build and run the container:

```bash
$ sudo docker build . -t nestjs-api
$ sudo docker run -p 3000:3000 -d nestjs-api
```

Finally, we can check whether it's alive from a local machine:

```bash
$ curl -i http://ec2-100-24-242-27.compute-1.amazonaws.com:3000
```

Thanks for reading.
