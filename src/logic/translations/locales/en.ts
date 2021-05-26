import { AppRoute } from '../../../app/app.route.conts';

export const en = {
  site: {
    // TDO: use this title
    title: 'Code Calligraphy',
    routes: {
      [AppRoute.Home]: 'Home',
      [AppRoute.Articles]: 'Articles',
      [AppRoute.AboutMe]: 'AboutMe',
    },
  },
  common: {
    buttons: {
      backToHome: {
        title: 'Back to home',
      },
    },
  },
  homePage: {
    title: 'Home page',
    aboutMe: {
      title: 'About me',
      description: "I'am frontend developer",
    },
  },
};
