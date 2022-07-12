---
title: 'Expo React Native e2e tests - Cypress test with Cucumber'
date: '2022-07-12'
author: 'Wojciech Cendrzak'
# image: '/images/tagged-template-literal-jest-test.png'
tags: 'BDD, cypress, gherkin, expo, TypeScript'
keywords: 'BDD, cypress, cucumber, gherkin, expo, react native, CI/CD, TypeScript, gitlab'
isPublished: false
---

Writing end to end test for **react native** seems to be hard and tricky? Not anymore with Expo and Cypress.

In this article we'll try to cover all steps from installation to write very clean e2e test with Gherkin language and automate them with GitLab.

Prepare your coffee and let's start.

## Prerequisites

- have Expo React Native application with Web

```
yarn add -D cypress
```


```
npx cypress open
```
