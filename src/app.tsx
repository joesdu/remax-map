import './app.less';
import './extensions';

import { closeBluetoothAdapter, getBluetoothAdapterState, getSystemInfo, getUpdateManager, onBluetoothDeviceFound, openBluetoothAdapter, setKeepScreenOn, showModal, startBluetoothDevicesDiscovery, stopBluetoothDevicesDiscovery } from 'remax/wechat';

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

  private ibeacons: Array<{ deviceId: number; rssi: number; time: number; txPower: number }> = [];
  private cleanerInterval: any = -1;
  private IBeacons: Array<{ deviceId: number; rssi: number; txPower: number }> = [];

  getIBeacons = (): Array<{ deviceId: number; rssi: number; txPower: number }> => {
    if (this.IBeacons.length >= 3) {
      console.log('IBeaconsLength>=3', '2020.07.15.1240');
      for (let I: number = 0, item: { deviceId: number; rssi: number }; (item = this.IBeacons[I++]); ) {
        let i = this.ibeacons.findIndex((x: { deviceId: number }) => item.deviceId === x.deviceId);
        if (i < 0 || (i >= 0 && Math.abs(item.rssi - this.ibeacons[i].rssi) >= 10)) this.IBeacons.splice(I - 1, 1);
        if (this.IBeacons.length < 3) {
          this.ibeacons.sort((a: { rssi: number }, b: { rssi: number }) => b.rssi - a.rssi);
          for (let J: number = 0, Item: { deviceId: number; rssi: number; time: number; txPower: number }; (Item = this.ibeacons[J++]); ) {
            let index = this.IBeacons.findIndex((x: { deviceId: number }) => Item.deviceId === x.deviceId);
            if (index < 0 && this.IBeacons.length < 3) {
              this.IBeacons.push({ deviceId: Item.deviceId, rssi: Item.rssi, txPower: Item.txPower });
            }
          }
        }
        if (this.IBeacons.length >= 3) {
          this.ibeacons.sort((a: { rssi: number }, b: { rssi: number }) => b.rssi - a.rssi);
          for (let J: number = 0, Item: { deviceId: number; rssi: number; time: number; txPower: number }; (Item = this.ibeacons[J++]); ) {
            let index = this.IBeacons.findIndex((x: { deviceId: number; rssi: number }) => Item.deviceId === x.deviceId && Item.rssi - x.rssi >= 10);
            if (index >= 0) {
              this.IBeacons[index] = { deviceId: Item.deviceId, rssi: Item.rssi, txPower: Item.txPower };
            }
          }
        }
      }
      return this.IBeacons;
    } else {
      console.log('IBeaconsLength<3', '2020.07.15.1240');
      this.ibeacons.sort((a: { rssi: number }, b: { rssi: number }) => b.rssi - a.rssi);
      for (let index: number = 0, item: { deviceId: number; rssi: number; time: number; txPower: number }; (item = this.ibeacons[index++]); ) {
        let i = this.IBeacons.findIndex((x: { deviceId: number }) => item.deviceId === x.deviceId);
        if (i < 0 && this.IBeacons.length < 3) {
          this.IBeacons.push({ deviceId: item.deviceId, rssi: item.rssi, txPower: item.txPower });
        }
      }
      return this.IBeacons;
    }
  };

  private checkIBeaconsTimeout = (): void => {
    this.cleanerInterval = setInterval(() => {
      if (this.ibeacons.length > 3) {
        let timeout = this.ibeacons.findIndex((x: { time: number }) => Date.now() - x.time > 6300);
        if (timeout !== -1) this.ibeacons.splice(timeout, 1);
      }
    }, 500);
  };

  private SearchIBeacon = (): void => {
    try {
      this.onStopBluetoothDevicesDiscovery();
      closeBluetoothAdapter();
    } catch (error) {
      console.warn(error);
    }
    openBluetoothAdapter({
      success: () => {
        // this.onStartBeaconDiscovery();
        this.onGetBluetoothAdapterState();
      }
    });
  };

  private onGetBluetoothAdapterState = (): void => {
    getBluetoothAdapterState()
      .then((res) => {
        if (res.discovering) this.onBluetoothUpdate();
        else if (res.available) this.onStartBluetoothDevicesDiscovery();
      })
      .catch((error) => console.error('getBluetoothAdapterState-Error', error));
  };

  private onStartBluetoothDevicesDiscovery = (): void => {
    startBluetoothDevicesDiscovery({
      powerLevel: 'high',
      allowDuplicatesKey: true,
      interval: 500
    })
      .then((startRes: WechatMiniprogram.BluetoothError) => {
        console.warn(startRes.errMsg);
        this.checkIBeaconsTimeout();
        this.onBluetoothUpdate();
      })
      .catch((error: WechatMiniprogram.BluetoothError) => {
        console.error(error.errMsg);
        this.setGlobal({ allowUpdate: false });
        this.onStopBluetoothDevicesDiscovery();
      })
      .finally(() => {
        setTimeout(() => {
          if (this.ibeacons.length <= 0) {
            console.warn('No IBeacons device data available');
            this.setGlobal({ allowUpdate: true, hadFail: true });
            this.onStopBluetoothDevicesDiscovery();
          } else console.info(`IBeacons device data available,device count:${this.ibeacons.length}.`);
        }, 20000);
      });
  };

  private ab2hex = (buffer: Iterable<number>) => Array.prototype.map.call(new Uint8Array(buffer), (bit) => `00${bit.toString(16)}`.slice(-2)).join('');

  /**
   * 补码转原码
   * @param tcr 补码的10进制数
   */
  private TCRtoTF = (tcr: number) => {
    let bitStr: string = tcr.toString(2);
    if (bitStr.startsWith('1')) {
      let result: string = '';
      for (let index = 1, str: string; (str = bitStr.charAt(index++)); ) {
        str === '0' ? (result += '1') : (result += '0');
      }
      return -result.toNumber(2) - 1;
    }
    return tcr;
  };

  private onBluetoothUpdate = (): void => {
    onBluetoothDeviceFound((res: any) => {
      if (res && res.devices && res.devices.length > 0) {
        const { devices } = res;
        for (let index: number = 0, item: any; (item = devices[index++]); ) {
          let advertisData = this.ab2hex(item.advertisData).toUpperCase();
          if (advertisData.startsWith('4C000215FDA50693A4E24FB1AFCFC6EB07647825')) {
            let usefulData: Array<string> = advertisData.substr('4C000215FDA50693A4E24FB1AFCFC6EB07647825'.length, 10).segment(2);
            let txPower: number = this.TCRtoTF(usefulData.pop()!.toNumber(16));
            let deviceId: number = usefulData.join('').toNumber(16);
            const { RSSI: rssi } = item;
            console.log(`原始数据:${advertisData}`);
            console.log(`设备信息:deviceId:${deviceId},rssi:${rssi},txPower:${txPower}`);
            let exist: number = this.ibeacons.findIndex((x: { deviceId: number }) => x.deviceId === deviceId);
            if (exist === -1) this.ibeacons.push({ deviceId, rssi, time: Date.now(), txPower });
            else {
              this.ibeacons[exist].time = Date.now();
              this.ibeacons[exist].rssi = rssi;
              this.ibeacons[exist].txPower = txPower;
            }
          }
        }
        this.setGlobal({ allowUpdate: true });
      }
    });
  };

  private onStopBluetoothDevicesDiscovery = () => {
    stopBluetoothDevicesDiscovery()
      .then(() => {
        this.setGlobal({ allowUpdate: false });
        clearInterval(this.cleanerInterval);
        closeBluetoothAdapter();
      })
      .catch((error: WechatMiniprogram.BluetoothError) => console.warn(error.errMsg));
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
    // this.onStopBeaconDiscovery();
    this.onStopBluetoothDevicesDiscovery();
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
