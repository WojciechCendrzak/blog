---
title: 'How to deploy NodeJs API to AWS EC2'
date: '2021-06-29'
author: 'Wojciech Cendrzak'
image: '/images/nodejs-ec2.png'
tags: 'devops, nodejs, aws'
isPublished: true
---

In this article, we'll cover how to deploy a simply NodeJs API to AWS EC2. To ensure everything works fine, we will try to access it from the browser.

## NodeJS server

We will use this sample repository with
NestJs API.

https://github.com/WojciechCendrzak/nestjs-api

You can also create your server app.

## AWS Free Tier

When creating **AWS** account, you can choose Free Plan, which allows you to access core services for a year. The **Free tier** services include EC2 ( Amazon Elastic Compute Cloud) t2.micro. It can run for a maximum of 750 hours per month for free. 24 hours per 31 days gives us 744 hours, which means we are still 6 hours ahead. So we can continuously use a single machine for an entire year for free.

We assume you have **AWS** account created already.

## Create EC2

1. On the **AWS console**, let's navigate to **Services** and then **EC2** and **Launch instance**.
2. Choose an Amazon Machine Image (AMI) - select **Ubuntu Server 20.04 LTS** (Free tier eligible)
3. Choose an Instance Type - check **t2.micro** (Free tier eligible) and press **Review and Launch**.
4. Review Instance Launch - ignore popup warning and press **Launch**
5. The following popup with **key-pair** allows you to either select or create a new key-pair. Public-private pair will make the connection to our server secure. As AWS will store a public part, we need to have a private one on our local machine. So let give any name (exp 'EC2-tutorial') and create a new one (or select if there any). Then **Download Key Pair**. We will need them later. Then press **Launch Instances**
6. Now, the server is created and started. Press **View Instances**
7. The Last thing, we need to configure **Security groups** to establish public access, exp from browser.
   From **EC2 > instances**, press on **Instance ID** link of instance that we have created. Select **Security** tab and press link at **Security groups**. On tab **Inbound rules** press **Edit inbound rules**.
   As you can see, there is a default rule already configured for **SSH** connection.
   Add another rule that allows access from any IP address to our instance over the internet on port 3000. We need this specific one because our NestJS API will be exposed on that port.
   Select **Custom TCP** type. Set port to **3000** and select source for **Anywhere**. Then press **Save rules** button.

## Connect to EC2 via SSH

Navigate to **EC2 > instances** to see SSH connection instructions and details. Select checkbox to the left of our created instance. Press **Action**, select **Connect** and select **SSH client**.

In the terminal, navigate to the folder with your private key.

Hide private key from public access.

```sh
sudo chmod 400 EC2-tutorial.pem
```

Let's now connect:

```sh
sudo ssh -i "EC2-tutorial.pem" ubuntu@ec2-100-27-3-238.compute-1.amazonaws.com
```

Congratulation. Once we got into the instance, let's make ubuntu packages update first:

```sh
sudo apt-get update
```

## Install NodeJs

Install node version manager (nvm):

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

Activate nvm:

```sh
. ~/.nvm/nvm.sh
```

Install the latest version of Node.js

```sh
nvm install node
```

Double-check installation:

```sh
node -v
```

You should see the current version. In my case: _v16.4.0_.

## Clone repository from Git

Let's check whether _git_ is installed correctly:

```sh
git --version
```

That has printed me _git version 2.25.1_ this time.

Let's clone the app:

```sh
git clone https://github.com/WojciechCendrzak/nestjs-api
```

It will create a _nestjs-api_ project folder.

## Install API dependencies

Enter the project folder:

```sh
cd nestjs-api
```

Install dependencies:

```sh
npm i
```

## Start API

The following command will build the project into _dist_ folder on behind and start our API.

```sh
npm run start
```

## Access from Browser

As we previously set up **Inbound** with port 3000, we need to call with it.

Type this in the browser address bar:

```sh
http://ec2-100-27-3-238.compute-1.amazonaws.com:3000
```

Done. If everything was fine, we should see _'Hello World!'_

Thanks for reading.
