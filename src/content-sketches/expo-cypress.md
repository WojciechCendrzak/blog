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

- have Expo React Native application
- have Expo for Web installed in your app

## Install cypress

```
yarn add -D cypress
```

```
npx cypress open
```

## Configure Cucumber

### install dependencies

https://testersdock.com/cypress-10-upgrade/

```
yarn add -D @badeball/cypress-cucumber-preprocessor
yarn add -D @bahmutov/cypress-esbuild-preprocessor
yarn add -D @esbuild-plugins/node-modules-polyfill
```

### configure plugin

```js
// cypress/plugin/index.js

const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;

const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

const nodePolyfills = require('@esbuild-plugins/node-modules-polyfill').NodeModulesPolyfillPlugin;

const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;

module.exports = async (on, config) => {
  await addCucumberPreprocessorPlugin(on, config); // to allow json to be produced

  // To use esBuild for the bundler when preprocessing
  on(
    'file:preprocessor',
    createBundler({
      plugins: [nodePolyfills(), createEsbuildPlugin(config)],
    })
  );
  return config;
};
```

### configure package.json

```json
"cypress-cucumber-preprocessor": {
    "stepDefinitions": "cypress/e2e/cucumber-test/**/*.{js,ts}"
  }
```

## Add GitLab automation
