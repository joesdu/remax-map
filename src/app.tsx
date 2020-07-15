import './app.less';

import { closeBluetoothAdapter, getSystemInfo, getUpdateManager, onBeaconUpdate, openBluetoothAdapter, setKeepScreenOn, showModal, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import { CloseMap } from './service';
import React from 'react';

export type ContextProps = {
  global: Global;
  setGlobal(data: Global): void;
  getIBeacons(): Array<{ deviceId: number; rssi: number }>;
};

export const AppContext: React.Context<Partial<ContextProps>> = React.createContext<Partial<ContextProps>>({});

export interface AppProps {
  location: any;
}

export type CurrentData = {
  from: string;
  current: string;
  isShare: boolean;
};
export interface Global {
  systemInfo?: WechatMiniprogram.GetSystemInfoSuccessCallbackResult;
  allowUpdate?: boolean;
  currentFloor?: string;
  atFirst?: boolean;
  getLocationInterval?: any;
  hadFail?: boolean;
  currentData?: CurrentData;
  needLogin?: boolean;
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
        hadFail: true,
        needLogin: true
      }
    };
  }

  setGlobal = (data: Global): void => {
    const { global } = this.state;
    this.setState({ global: { ...global, ...data } });
  };

  private ibeacons: Array<{ deviceId: number; rssi: number; time: number }> = [];
  private cleanerInterval: any = -1;
  private IBeacons: Array<{ deviceId: number; rssi: number }> = [];

  getIBeacons = (): Array<{ deviceId: number; rssi: number }> => {
    if (this.IBeacons.length >= 3) {
      console.log('IBeaconsLength>=3', '2020.07.15.1240');
      for (let I: number = 0, item: { deviceId: number; rssi: number }; (item = this.IBeacons[I++]); ) {
        let i = this.ibeacons.findIndex((x: { deviceId: number }) => item.deviceId === x.deviceId);
        if (i < 0 || (i >= 0 && Math.abs(item.rssi - this.ibeacons[i].rssi) >= 15)) this.IBeacons.splice(I - 1, 1);
        if (this.IBeacons.length < 3) {
          this.ibeacons.sort((a: { rssi: number }, b: { rssi: number }) => b.rssi - a.rssi);
          for (let index: number = 0, Item: { deviceId: number; rssi: number; time: number }; (Item = this.ibeacons[index++]); ) {
            let index = this.IBeacons.findIndex((x: { deviceId: number }) => Item.deviceId === x.deviceId);
            if (index < 0 && this.IBeacons.length < 3) {
              this.IBeacons.push({ deviceId: Item.deviceId, rssi: Item.rssi });
            }
          }
        }
      }
      return this.IBeacons;
    } else {
      console.log('IBeaconsLength<3', '2020.07.15.1240');
      this.ibeacons.sort((a: { rssi: number }, b: { rssi: number }) => b.rssi - a.rssi);
      for (let index: number = 0, item: { deviceId: number; rssi: number; time: number }; (item = this.ibeacons[index++]); ) {
        let i = this.IBeacons.findIndex((x: { deviceId: number }) => item.deviceId === x.deviceId);
        if (i < 0 && this.IBeacons.length < 3) {
          this.IBeacons.push({ deviceId: item.deviceId, rssi: item.rssi });
        }
      }
      return this.IBeacons;
    }
  };

  private checkIBeaconsTimeout = (): void => {
    this.cleanerInterval = setInterval(() => {
      if (this.ibeacons.length > 3) {
        let timeout = this.ibeacons.findIndex((x: { time: number }) => Date.now() - x.time > 4100);
        if (timeout !== -1) this.ibeacons.splice(timeout, 1);
      }
    }, 500);
  };

  /**
   * 处理设备广播的设备ID
   * @param major 设备主ID值
   * @param minor 设备次ID值
   */
  private FixDeviceId = (major: string, minor: string): number => {
    let major_16: string = parseInt(major).toString(16).padStart(4, '0');
    let minor_16: string = parseInt(minor).toString(16).padStart(4, '0');
    return parseInt(major_16 + minor_16, 16);
  };

  private SearchIBeacon = (): void => {
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
          let exist: number = -1;
          let deviceId: number = this.FixDeviceId(major, minor);
          console.log('设备:', { deviceId, rssi });
          if (this.ibeacons.length > 0) exist = this.ibeacons.findIndex((x: { deviceId: number }) => x.deviceId === deviceId);
          if (exist === -1) this.ibeacons.push({ deviceId, rssi, time: Date.now() });
          else {
            this.ibeacons[exist].time = Date.now();
            this.ibeacons[exist].rssi = rssi;
          }
        }
        this.setGlobal({ allowUpdate: true });
      }
    });
  };

  private onStartBeaconDiscovery = (): void => {
    startBeaconDiscovery({ uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'] })
      .then((startRes: WechatMiniprogram.IBeaconError) => {
        console.warn(startRes.errMsg);
        this.checkIBeaconsTimeout();
        this.onIBeaconUpdate();
      })
      .catch((error: WechatMiniprogram.IBeaconError) => {
        console.error(error.errMsg);
        this.setGlobal({ allowUpdate: false });
        this.onStopBeaconDiscovery();
      })
      .finally(() => {
        setTimeout(() => {
          if (this.ibeacons.length <= 0) {
            console.warn('No IBeacons device data available');
            this.setGlobal({ allowUpdate: true, hadFail: true });
            this.onStopBeaconDiscovery();
          } else console.info(`IBeacons device data available,device count:${this.ibeacons.length}.`);
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
      .catch((error: WechatMiniprogram.IBeaconError) => console.warn(error.errMsg));
  };

  private checkUpgrade = (): void => {
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
        updateManager.onUpdateFailed(() => showModal({ title: '已经有新版本了哟~', content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~' }));
      }
    });
  };

  onHide = (): void => {
    this.onStopBeaconDiscovery();
    CloseMap();
  };

  onShow = (): void => {
    getSystemInfo()
      .then((res: WechatMiniprogram.GetSystemInfoSuccessCallbackResult) => {
        this.setGlobal({ systemInfo: res });
        console.log(res);
        const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
        if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
          showModal({ content: '手机蓝牙或者定位功能未打开,请打开后重新进入小程序', showCancel: false });
          this.setGlobal({ hadFail: true });
        } else this.SearchIBeacon();
      })
      .catch((error: any) => console.error(error.errMsg));
    setKeepScreenOn({ keepScreenOn: true });
    this.checkUpgrade();
  };

  render(): JSX.Element {
    const { global } = this.state;
    const { setGlobal, getIBeacons } = this;
    return <AppContext.Provider value={{ global, setGlobal, getIBeacons }}>{this.props.children}</AppContext.Provider>;
  }
}
export default App;
