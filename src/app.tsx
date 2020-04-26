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
        systemInfo: {},
        searchText: '',
        bluetooth: false,
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
      success: () => {
        this.onStopBeaconDiscovery();
        startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] })
          .then((startRes: any) => {
            console.log('打开搜索:', startRes);
            this.setGlobal({ bluetooth: true });
            let date: number = Date.now();
            let firstTime: boolean = true;
            onBeaconUpdate((res: any) => {
              if (res && res.beacons && res.beacons.length > 0) {
                const { beacons } = res;
                let ibeacons: any = [];
                for (let index: number = 0, item: any; (item = beacons[index++]); ) {
                  const { major, minor, rssi } = item;
                  console.log({ deviceId: Util.FixDeviceId(major, minor), rssi });
                  if (index < 7) ibeacons.push({ deviceId: Util.FixDeviceId(major, minor), rssi });
                }
                if (Date.now() - date >= 15000 || firstTime) {
                  this.setGlobal({ allowUpdate: true, ibeacons });
                  date = Date.now();
                  firstTime = false;
                }
              }
            });
          })
          .catch((error: any) => {
            console.error(error);
            this.setGlobal({ bluetooth: false });
            this.onStopBeaconDiscovery();
          });
      }
    });
  };

  onStopBeaconDiscovery = () =>
    stopBeaconDiscovery()
      .then(() => {
        this.setGlobal({ bluetooth: true });
        closeBluetoothAdapter();
      })
      .catch((error: any) => console.error(error));

  onHide = () => CloseMap();

  render() {
    const { global } = this.state;
    const { setGlobal, SearchIBeacon, onStopBeaconDiscovery } = this;
    return <AppContext.Provider value={{ global, setGlobal, SearchIBeacon, onStopBeaconDiscovery }}>{this.props.children}</AppContext.Provider>;
  }
}
export default App;
