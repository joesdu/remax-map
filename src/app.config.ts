import { AppConfig } from 'remax/wechat';

const pages: Array<string> = ['pages/test/index', 'pages/main/index'];

const config: AppConfig = {
  pages: [pages[0]],
  window: {
    navigationBarTitleText: 'Remax WeChat Program',
    navigationBarBackgroundColor: '#282c34'
  }
};

export default config;
