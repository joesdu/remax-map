import { AppConfig } from 'remax/wechat';

const pages: Array<string> = ['pages/welcome/index', 'pages/main/index', 'pages/searchresult/index', 'pages/search/index', 'pages/favorite/index'];

const config: AppConfig = {
  pages: pages,
  window: {
    navigationBarTitleText: '室内导航',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black'
  }
};

export default config;
