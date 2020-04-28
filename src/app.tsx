import './app.less';

import { closeBluetoothAdapter, onBeaconUpdate, openBluetoothAdapter, setKeepScreenOn, showModal, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

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
        let date: number = 0;
        let ibeacons: Array<any> = [];
        startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] })
          .then((startRes: any) => {
            console.log('打开搜索:', startRes);
            this.setGlobal({ bluetooth: true });
            setInterval(() => {
              if (ibeacons.length > 3) {
                let timeout = ibeacons.findIndex((x: { time: number }) => Date.now() - x.time > 12000);
                if (timeout !== -1) ibeacons.splice(timeout, 1);
              }
            }, 500);
            onBeaconUpdate((res: any) => {
              if (res && res.beacons && res.beacons.length > 0) {
                if (Date.now() - date <= 9000) return;
                const { beacons } = res;
                for (let index: number = 0, item: any; (item = beacons[index++]); ) {
                  const { major, minor, rssi } = item;
                  console.log({ deviceId: Util.FixDeviceId(major, minor), rssi });
                  let exist: number = -1;
                  if (ibeacons.length > 0) exist = ibeacons.findIndex((x: { deviceId: number }) => x.deviceId === Util.FixDeviceId(major, minor));
                  if (exist === -1) ibeacons.push({ deviceId: Util.FixDeviceId(major, minor), rssi, time: Date.now() });
                  else {
                    ibeacons[exist].time = Date.now();
                    ibeacons[exist].rssi = rssi;
                  }
                }
                if (Date.now() - date >= 5000 || ibeacons.length >= 3) {
                  ibeacons.sort((a: { time: number }, b: { time: number }) => b.time - a.time);
                  let iBeaconTemp: Array<any> = [];
                  for (let index: number = 0; index < 3; index++) {
                    const { deviceId, rssi } = ibeacons[index];
                    iBeaconTemp.push({ deviceId, rssi });
                  }
                  this.setGlobal({ allowUpdate: true, ibeacons: iBeaconTemp });
                  date = Date.now();
                }
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
              if (ibeacons.length <= 0) {
                this.setGlobal({ allowUpdate: true, ibeacons });
                showModal({ title: '未检测到智能设备', content: '对不起,您当前位置无法为您提供服务', showCancel: false });
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
        closeBluetoothAdapter();
      })
      .catch((error: any) => console.error(error));

  onHide = () => CloseMap();

  onShow = () => setKeepScreenOn({ keepScreenOn: true });

  render() {
    const { global } = this.state;
    const { setGlobal, SearchIBeacon, onStopBeaconDiscovery } = this;
    return <AppContext.Provider value={{ global, setGlobal, SearchIBeacon, onStopBeaconDiscovery }}>{this.props.children}</AppContext.Provider>;
  }
}
export default App;
