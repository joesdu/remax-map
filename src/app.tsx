import './app.less';

import { closeBluetoothAdapter, onBeaconServiceChange, onBeaconUpdate, openBluetoothAdapter, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import React from 'react';
import { uuids } from '@/configs/config';

export const AppContext = React.createContext({});

interface AppState {
  global: any;
}
class App extends React.Component<{}, AppState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      global: {
        test: 'test',
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

  onBluetoothStateChange = () => {
    onBeaconServiceChange((res: any) => {
      if (res.available) {
        this.onOpenBluetooth();
      }
    });
  };
  private onOpenBluetooth = () => {
    openBluetoothAdapter({
      success: (res: any) => {
        console.log('openBluetoothAdapter', res);
        this.onStartBeaconDiscovery();
      }
    });
  };

  private onStartBeaconDiscovery = () => {
    startBeaconDiscovery({ uuids })
      .then((res: any) => {
        console.log('startBeaconDiscovery', res);
        this.BeaconUpdate();
      })
      .catch((error: any) => {
        console.error('startBeaconDiscovery', error);
        this.onStopBeaconDiscovery();
      })
      .finally(() => {
        setTimeout(() => {
          this.onStopBeaconDiscovery();
        }, 1000 * 10);
      });
  };

  private BeaconUpdate = () => {
    onBeaconUpdate((res: any) => {
      if (res && res.beacons && res.beacons.length > 0) {
        const { beacons } = res;
        let ibeacons: any = [];
        for (let index: number = 0, item: any; (item = beacons[index++]); ) {
          console.log(`${index - 1}:`, item);
          // TODO 使用 setGlobal 将数据存入到全局中
          if (index < 7) {
            ibeacons.push(item);
          }
        }
        this.setGlobal({ allowUpdate: true, ibeacons });
      }
    });
  };

  private onStopBeaconDiscovery = () => {
    stopBeaconDiscovery()
      .then((res: any) => {
        console.log('stopBeaconDiscovery', res);
        closeBluetoothAdapter();
      })
      .catch((error: any) => console.error('stopBeaconDiscovery', error));
  };

  onShow(option: any) {
    console.log('OnShow', option);
  }
  render() {
    const { global } = this.state;
    const { setGlobal, onBluetoothStateChange } = this;
    return <AppContext.Provider value={{ global, setGlobal, onBluetoothStateChange }}>{this.props.children}</AppContext.Provider>;
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
