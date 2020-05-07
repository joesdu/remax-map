import './app.less';

import { closeBluetoothAdapter, getSystemInfo, getUpdateManager, onBeaconUpdate, openBluetoothAdapter, setKeepScreenOn, showModal, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import { CloseMap } from './service';
import React from 'react';
import Util from './utils/util';

export const AppContext = React.createContext({});

export interface AppProps {
  location: any;
}
export interface Global {
  systemInfo?: WechatMiniprogram.GetSystemInfoSuccessCallbackResult;
  allowUpdate?: boolean;
  currentFloor?: string;
  atFirst?: boolean;
  getLocationInterval?: number;
  hadFail?: boolean;
}
interface AppState {
  global: Global;
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: Readonly<AppProps>) {
    super(props);
    this.state = {
      global: {
        allowUpdate: false,
        currentFloor: '',
        atFirst: true,
        getLocationInterval: -1,
        hadFail: true
      }
    };
  }

  setGlobal = (data: Global): void => {
    const { global } = this.state;
    this.setState({ global: { ...global, ...data } });
  };

  private ibeacons: Array<{ deviceId: number; rssi: number; time: number; count: number }> = [];
  private cleanerInterval: any = -1;

  getIBeacons = (): Array<{ deviceId: number; rssi: number }> => {
    this.ibeacons.sort((a: { time: number }, b: { time: number }) => b.time - a.time);
    let iBeaconTemp: Array<{ deviceId: number; rssi: number }> = [];
    for (let index: number = 0, item; (item = this.ibeacons[index++]); ) {
      const { deviceId, rssi, count } = item;
      let rssiAverage = rssi / count;
      if (index < 20) iBeaconTemp.push({ deviceId, rssi: rssiAverage });
    }
    return iBeaconTemp;
  };

  private checkIBeaconsTimeout = (): void => {
    this.cleanerInterval = setInterval(() => {
      if (this.ibeacons.length > 3) {
        let timeout = this.ibeacons.findIndex((x: { time: number }) => Date.now() - x.time > 10000);
        if (timeout !== -1) this.ibeacons.splice(timeout, 1);
      }
    }, 500);
  };

  SearchIBeacon = (): void => {
    openBluetoothAdapter({
      success: () => {
        this.onStopBeaconDiscovery();
        this.onStartBeaconDiscovery();
      }
    });
  };

  private onIBeaconUpdate = (): void => {
    onBeaconUpdate((res: WechatMiniprogram.OnBeaconUpdateCallbackResult) => {
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
  };

  private onStartBeaconDiscovery = (): void => {
    startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] })
      .then((startRes: WechatMiniprogram.IBeaconError) => {
        console.warn('启动搜索:', startRes);
        this.checkIBeaconsTimeout();
        this.onIBeaconUpdate();
      })
      .catch((error: WechatMiniprogram.IBeaconError) => {
        console.error(error);
        this.setGlobal({ allowUpdate: false });
        this.onStopBeaconDiscovery();
      })
      .finally(() => {
        setTimeout(() => {
          if (this.ibeacons.length <= 0) {
            this.setGlobal({ allowUpdate: true, hadFail: true });
            this.onStopBeaconDiscovery();
          }
        }, 10000);
      });
  };

  private onStopBeaconDiscovery = (): void => {
    stopBeaconDiscovery()
      .then(() => {
        this.setGlobal({ allowUpdate: false });
        clearInterval(this.cleanerInterval);
        closeBluetoothAdapter();
      })
      .catch((error: WechatMiniprogram.IBeaconError) => console.error(error));
  };

  private checkUpgrade = () => {
    let updateManager: WechatMiniprogram.UpdateManager = getUpdateManager();
    updateManager.onCheckForUpdate((res: WechatMiniprogram.OnCheckForUpdateCallbackResult) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用进行更新？',
            success: (res: WechatMiniprogram.ShowModalSuccessCallbackResult) => {
              if (res.confirm) updateManager.applyUpdate();
            }
          });
        });
        updateManager.onUpdateFailed(() =>
          showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          })
        );
      }
    });
  };

  onHide = (): void => CloseMap();

  componentDidMount = () => {
    getSystemInfo()
      .then((res: WechatMiniprogram.GetSystemInfoSuccessCallbackResult) => {
        this.setGlobal({ systemInfo: res });
        const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
        if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
          this.setGlobal({ hadFail: true });
        } else this.SearchIBeacon();
      })
      .catch((error: any) => console.error(error));
    setKeepScreenOn({ keepScreenOn: true });
    this.checkUpgrade();
  };

  // onShow = (): void => {
  //   console.log('AppOnShow');
  //   getSystemInfo()
  //     .then((res: WechatMiniprogram.GetSystemInfoSuccessCallbackResult) => {
  //       this.setGlobal({ systemInfo: res });
  //       const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
  //       if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
  //         this.setGlobal({ hadFail: true });
  //       } else this.SearchIBeacon();
  //     })
  //     .catch((error: any) => console.error(error));
  //   setKeepScreenOn({ keepScreenOn: true });
  // };

  render() {
    const { global } = this.state;
    const { setGlobal, getIBeacons } = this;
    return <AppContext.Provider value={{ global, setGlobal, getIBeacons }}>{this.props.children}</AppContext.Provider>;
  }
}
export default App;
