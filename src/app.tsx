import './app.less';

import React from 'react';
import { getStorage } from 'remax/wechat';
import { CloseMap } from './service/service';

export const AppContext = React.createContext({});

interface AppProps {}
interface AppState {
  global: any;
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: Readonly<AppProps>) {
    super(props);
    this.state = {
      global: {
        token: '',
        searchText: '',
        allowUpdate: false,
        ibeacons: []
      }
    };
  }
  setGlobal = (data: any) => {
    const { global } = this.state;
    this.setState({ global: { ...global, ...data } });
  };

  onShow(option: any) {
    console.log('OnShow', option);
    let that = this;
    getStorage({ key: 'token' }).then((token: any) => that.setGlobal({ token: token.data }));
  }

  onHide = (option: any) => {
    console.log('onAppHide', option);
    CloseMap();
  };

  render() {
    const { global } = this.state;
    const { setGlobal } = this;
    return <AppContext.Provider value={{ global, setGlobal }}>{this.props.children}</AppContext.Provider>;
  }
}
export default App;

/**
import { useAppEvent } from 'remax/wechat';

export const AppContext = React.createContext({});

const App: React.FC = ({ children }) => {
  const [global, setGlobal] = React.useState({
    test: 'test'
  });

  useAppEvent('onShow', (option: any) => {
    console.log('OnShow', option);
  });

  return <AppContext.Provider value={{ global, setGlobal }}>{children}</AppContext.Provider>;
};

export default App;
 */
