import { AppConfig } from 'remax/wechat';

const pages: Array<string> = ['pages/index/index', 'pages/main/index'];

const config: AppConfig = {
  pages: [pages[1]],
  window: {
    navigationBarTitleText: 'Remax WeChat Program',
    navigationBarBackgroundColor: '#282c34'
  }
};

export default config;
