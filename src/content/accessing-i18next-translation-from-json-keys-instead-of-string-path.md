---
title: 'Accessing i18next translation from JSON keys instead of string path'
date: '2021-05-25'
author: 'Wojciech Cendrzak'
image: '/images/translate.png'
tags: 'i18next,TypeScript'
---

**TypeScript** is awesome. Like **i18next** too. It works with TypeScript great but has one drawback. We need to provide a translation key as a plain string. It doesn't matter for small apps, but it does indeed for complex one when your translation file start to have hundreds of lines.

In this article, I want to show the way to solve that. It will leverage our localization experience to the next level.

## Goal

When using TypeScript we expect that tools will behave in some beneficial way like:

- we can use IDE **IntelliSense** to pick a specific key from object structure instead of the path as a string,
- we can **easily refactor** translations structure and still trust our code,
- we want to be **able to navigate** to a specific key location in the translation object structure,

So let's look at the solution.

What i18next offers as an out of the box looks like this:

```ts
// translation.ts

import en from './en.json';
import i18next from 'i18next';

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
  },
});
```

When having translation file like:

```json
{
  // en.json

  "homePage": {
    "title": "Home page",
    "homaPage": {
      "header": {
        "buttons": {
          "signIn": { "title": "Sign In" },
          "signUp": { "title": "Sign Up" }
        }
      }
    }
  }
}
```

We can access specific translated value by typing key as a string path:

```ts
i18next.t('homePage.header.buttons.signIn.title');
```

As you can see, by having the **translation key as a string**, we are losing all benefits described above.

## Solution

What we want to achieve is something that looks like this:

```ts
i18next.t(keys.homePage.header.buttons.signIn.title);
```

What fun is, the typescript already allows us to load JSON files into the code and enjoy the benefits of IntelliSense already running there.

Now we need a new object named keys with the same structure as our JSON file. But instead of translated values at every leaf, we need to have **that key as a path**. Because i18next.t function still needs that path.

So by accessing:

```ts
keys.homePage.header.buttons.signIn.title;
```

We want to recievie:

```ts
'homePage.header.buttons.signIn.title';
```

To achieve this, we need to transform the JSON file into another one like this:

```ts
import { reduce } from 'lodash';

const getTranslationKeys = <T>(translations: T, path = ''): T =>
  reduce(
    translations,
    (accumulator, value, key) => {
      const newPath = `${path}${path ? '.' : ''}${key}`;
      return {
        ...accumulator,
        [key]: isObject(value) ? getTranslationKeys(value, newPath) : newPath,
      };
    },
    {}
  );
```

This code will **recursively** enumerate all the key/value pairs. When a value is an object it will call himself with path collected so far. Otherwise, it reaches the leaf and returns the path. Finally, all the leaves will contains paths as expected.

Now we can create keys object and get our translation:

```ts
import en from './en.json';
import i18next from 'i18next';

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
  },
});

const translationKeys = getTranslationKeys(en);

const value = i18next.t(translationKeys.homePage.header.buttons.signIn.title);
```

## End note

Finally, we've reached the goal.
Now the TypeScript and IDE tools are active when we reference the translation keys. And we can trust our code more.

See also [i18n-keys](https://github.com/WojciechCendrzak/i18n-keys) library that fully implements this concept.

Thanks for reading.
