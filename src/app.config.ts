import { AppConfig } from 'remax/wechat';

const config: AppConfig = {
  pages: ['pages/welcome/index', 'pages/main/index', 'pages/searchresult/index', 'pages/search/index', 'pages/favorite/index', 'pages/test/index'],
  window: {
    navigationBarTitleText: '室内导航',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black'
  }
};

export default config;
