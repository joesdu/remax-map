import './app.less';

import React from 'react';
import dva from 'remax-dva';

const app = dva();
class App extends React.Component {
  onShow() {
    console.log('App OnShow');
  }

  render() {
    return this.props.children;
  }
}

export default app.start(App);
