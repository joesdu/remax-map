import './app.less';

import React from 'react';

class App extends React.Component {
  onShow(options: any) {
    console.log('onShow', options);
  }

  render() {
    return this.props.children;
  }
}

export default App;
