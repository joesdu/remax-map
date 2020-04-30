import './app.less';

import { closeBluetoothAdapter, getSystemInfo, onBeaconUpdate, openBluetoothAdapter, setKeepScreenOn, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import { CloseMap } from './service';
import React from 'react';
import Util from './utils/util';

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
        bluetooth: false,
        allowUpdate: false,
        ibeacons: [],
        currentFloor: '',
        atFirst: true,
        interval: -1,
        hadFail: true
      }
    };
  }

  setGlobal = (data: any) => {
    const { global } = this.state;
    this.setState({ global: { ...global, ...data } });
  };

  private ibeacons: Array<{ deviceId: number; rssi: number; time: number; count: number }> = [];
  private cleanerInterval: any = -1;

  getIBeacons = () => {
    this.ibeacons.sort((a: { time: number }, b: { time: number }) => b.time - a.time);
    let iBeaconTemp: Array<any> = [];
    for (let index: number = 0, item; (item = this.ibeacons[index++]); ) {
      const { deviceId, rssi, count } = item;
      let rssiAverage = rssi / count;
      if (index < 20) iBeaconTemp.push({ deviceId, rssi: rssiAverage });
    }
    return iBeaconTemp;
  };

  SearchIBeacon = () => {
    openBluetoothAdapter({
      success: () => {
        this.onStopBeaconDiscovery();
        startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] })
          .then((startRes: any) => {
            console.warn('启动搜索:', startRes);
            this.setGlobal({ bluetooth: true });
            this.cleanerInterval = setInterval(() => {
              if (this.ibeacons.length > 3) {
                let timeout = this.ibeacons.findIndex((x: { time: number }) => Date.now() - x.time > 10000);
                if (timeout !== -1) this.ibeacons.splice(timeout, 1);
              }
            }, 500);
            onBeaconUpdate((res: any) => {
              if (res && res.beacons && res.beacons.length > 0) {
                const { beacons } = res;
                for (let index: number = 0, item: any; (item = beacons[index++]); ) {
                  const { major, minor, rssi } = item;
                  console.log({ deviceId: Util.FixDeviceId(major, minor), rssi });
                  let exist: number = -1;
                  if (this.ibeacons.length > 0) exist = this.ibeacons.findIndex((x: { deviceId: number }) => x.deviceId === Util.FixDeviceId(major, minor));
                  if (exist === -1) this.ibeacons.push({ deviceId: Util.FixDeviceId(major, minor), rssi, time: Date.now(), count: 1 });
                  else {
                    this.ibeacons[exist].time = Date.now();
                    this.ibeacons[exist].rssi += rssi;
                    this.ibeacons[exist].count += 1;
                  }
                }
                this.setGlobal({ allowUpdate: true });
              }
            });
          })
          .catch((error: any) => {
            console.error(error);
            this.setGlobal({ bluetooth: false, allowUpdate: false });
            this.onStopBeaconDiscovery();
          })
          .finally(() => {
            setTimeout(() => {
              if (this.ibeacons.length <= 0) {
                this.setGlobal({ allowUpdate: true, ibeacons: this.ibeacons, hadFail: true });
                this.onStopBeaconDiscovery();
              }
            }, 10000);
          });
      }
    });
  };

  onStopBeaconDiscovery = () =>
    stopBeaconDiscovery()
      .then(() => {
        this.setGlobal({ bluetooth: false, allowUpdate: false });
        clearInterval(this.cleanerInterval);
        closeBluetoothAdapter();
      })
      .catch((error: any) => console.error(error));

  onHide = () => CloseMap();

  onShow = () => {
    getSystemInfo()
      .then((res: any) => {
        this.setGlobal({ systemInfo: res });
        const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
        if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
          this.setGlobal({ hadFail: true });
        } else this.SearchIBeacon();
      })
      .catch((error: any) => console.error(error));
    setKeepScreenOn({ keepScreenOn: true });
  };

  render() {
    const { global } = this.state;
    const { setGlobal, getIBeacons } = this;
    return <AppContext.Provider value={{ global, setGlobal, getIBeacons }}>{this.props.children}</AppContext.Provider>;
  }
}
export default App;
