import './app.less';

import { closeBluetoothAdapter, onBeaconUpdate, openBluetoothAdapter, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import { CloseMap } from './service';
import React from 'react';

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
        startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] }) // TODO 补齐UUID
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
                    ibeacons.push({ coordinateId: '', rssi: item.rssi, accuracy: item.accuracy });
                  }
                }
                this.setGlobal({ allowUpdate: true, ibeacons });
              }
            });
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
    console.log('OnAppShow', option);
    this.SearchIBeacon();
  }

  onHide = (option: any) => {
    console.log('OnAppHide', option);
    CloseMap();
  };

  render() {
    const { global } = this.state;
    const { setGlobal, SearchIBeacon } = this;
    return <AppContext.Provider value={{ global, setGlobal, SearchIBeacon }}>{this.props.children}</AppContext.Provider>;
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
