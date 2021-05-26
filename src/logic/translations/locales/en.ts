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
  pages: {
    home: {
      title: 'Home page',
    },
    articles: {},
    aboutMe: {
      title: 'About me',
      description: 'Hi, I’m Wojciech, Front End (React) and Back End (.Net) developer.',
      avatar: {
        alt: 'Wojciech Cendrzak',
      },
    },
  },
};