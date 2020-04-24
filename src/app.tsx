import './app.less';

import { closeBluetoothAdapter, onBeaconUpdate, openBluetoothAdapter, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import { CloseMap } from './service';
import React from 'react';
import { Util } from './utils/util';

export const AppContext = React.createContext({});

export interface AppProps {
  location: any;
}
interface AppState {
  global: any;
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: Readonly<AppProps>) {
    super(props);
    this.state = {
      global: {
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

  SearchIBeacon = () => {
    openBluetoothAdapter({
      success: (resOpen: any) => {
        console.log('openBluetoothAdapter', resOpen);
        this.onStopBeaconDiscovery();
        startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] })
          .then((resStart: any) => {
            console.log('startBeaconDiscovery', resStart);
            onBeaconUpdate((res: any) => {
              console.log('onBeaconUpdate', res);
              if (res && res.beacons && res.beacons.length > 0) {
                const { beacons } = res;
                let ibeacons: any = [];
                for (let index: number = 0, item: any; (item = beacons[index++]); ) {
                  console.log(`${index - 1}:`, item);
                  if (index < 7) {
                    ibeacons.push({ coordinateId: Util.FixCoordinateId(item.major, item.minor), rssi: item.rssi });
                  }
                }
                this.setGlobal({ allowUpdate: true, ibeacons });
              }
            });
          })
          .catch((error: any) => {
            console.error('startBeaconDiscovery', error);
            this.onStopBeaconDiscovery();
          });
        // .finally(() => {
        //   setTimeout(() => {
        //     this.onStopBeaconDiscovery();
        //   }, 1000 * 10);
        // });
      }
    });
  };

  onStopBeaconDiscovery = () => {
    stopBeaconDiscovery()
      .then((res: any) => {
        console.log('stopBeaconDiscovery', res);
        closeBluetoothAdapter();
      })
      .catch((error: any) => console.error('stopBeaconDiscovery', error));
  };

  onShow() {
    console.log('OnAppShow');
    // this.SearchIBeacon();
  }

  onHide = () => {
    console.log('OnAppHide');
    CloseMap();
  };

  render() {
    const { global } = this.state;
    const { setGlobal, SearchIBeacon, onStopBeaconDiscovery } = this;
    return <AppContext.Provider value={{ global, setGlobal, SearchIBeacon, onStopBeaconDiscovery }}>{this.props.children}</AppContext.Provider>;
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
