---
title: 'How to copy SSH keys to new Mac'
date: '2024-01-17'
author: 'Wojciech Cendrzak'
image: '/images/github-ssh.png'
tags: 'github ssh'
keywords: 'github ssh'
isPublished: true
---

## 1. Copy your keys from previous machine to same folder on next

Copy your keys from previous machine to same folder on next

On your previous mac
```bash
cd .ssh

open .
```

Copy following files to same destinations on new mac

```bash
id_rsa	- private key
id_rsa.pub - public key
```

## 2. Add keys to ssh agent on new mac

### Create configuration file

```bash
touch ~/.ssh/config
```

with content

```bash
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa
```

### Add your SSH private hay to ssh-agent
```bash
ssh-add --apple-use-keychain ~/.ssh/id_rsa
```


## See more

Read more how to connect to github with ssh on [official documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
