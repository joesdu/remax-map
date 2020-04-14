import { AppConfig } from 'remax/wechat';

const pages: Array<string> = ['pages/welcome/index', 'pages/test/index', 'pages/main/index'];

const config: AppConfig = {
  pages: [pages[2]],
  window: {
    navigationBarTitleText: '室内导航',
    navigationBarBackgroundColor: '#282C34'
  }
};

export default config;
