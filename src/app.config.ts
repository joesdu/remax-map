import { AppConfig } from 'remax/wechat';

const pages: Array<string> = ['pages/welcome/index', 'pages/searchresult/index', 'pages/main/index', 'pages/search/index', 'pages/favorite/index', 'pages/test/index'];

const config: AppConfig = {
  pages: [pages[1]],
  window: {
    navigationBarTitleText: '室内导航',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black'
  }
};

export default config;
