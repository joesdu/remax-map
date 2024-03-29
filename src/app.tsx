import './app.less';
import './extensions';

import { closeBluetoothAdapter, getBluetoothAdapterState, getSystemInfo, getUpdateManager, onBluetoothDeviceFound, openBluetoothAdapter, setKeepScreenOn, showModal, showToast, startBluetoothDevicesDiscovery, stopBluetoothDevicesDiscovery } from 'remax/wechat';

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

  /**
   * 用于存放蓝牙搜到的设备的数据信息
   */
  private ibeacons: Array<{ deviceId: number; rssi: number; time: number; txPower: number }> = [];
  /**
   * 清理计时器的ID
   */
  private cleanerInterval: any = -1;
  /**
   * 该函数用于生成访问定位接口数据,每次定位接口的调用都需要对数据进行判断
   */
  getIBeacons = (): Array<{ deviceId: number; rssi: number; txPower: number }> => this.ibeacons.sort((a: { rssi: number }, b: { rssi: number }) => b.rssi - a.rssi).slice(0, 7);

  /**
   * 定时检测全部搜索到的数据中是否存在超过指定时间的数据.
   */
  private checkIBeaconsTimeout = (): void => {
    this.cleanerInterval = setInterval(() => {
      if (this.ibeacons.length > 3) {
        let timeout = this.ibeacons.findIndex((x: { time: number }) => Date.now() - x.time > 6300);
        if (timeout !== -1) this.ibeacons.splice(timeout, 1);
      }
    }, 500);
  };

  /**
   * 启动蓝牙搜索
   */
  private SearchIBeacon = (): void => {
    try {
      this.onStopBluetoothDevicesDiscovery();
      closeBluetoothAdapter();
    } catch (error) {
      console.warn(error);
    }
    openBluetoothAdapter({
      success: () => this.onGetBluetoothAdapterState()
    });
  };
  /**
   * 获取蓝牙状态
   */
  private onGetBluetoothAdapterState = (): void => {
    getBluetoothAdapterState({
      success: (res) => {
        if (res.discovering) this.onBluetoothUpdate();
        else if (res.available) this.onStartBluetoothDevicesDiscovery();
      },
      fail: (error) => console.error('getBluetoothAdapterState', error)
    });
  };
  /**
   * 开启蓝牙搜索
   */
  private onStartBluetoothDevicesDiscovery = (): void => {
    /**
     * Tips: 在IOS中无法识别Promise的写法,因此需要改成这种success,fail和complete的写法
     */
    startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      powerLevel: 'high',
      interval: 0,
      success: (startRes: WechatMiniprogram.BluetoothError) => {
        console.warn(startRes.errMsg);
        this.checkIBeaconsTimeout();
        this.onBluetoothUpdate();
      },
      fail: (error: WechatMiniprogram.BluetoothError) => {
        console.error(error.errMsg);
        this.setGlobal({ allowUpdate: false });
        this.onStopBluetoothDevicesDiscovery();
      },
      complete: () => {
        setTimeout(() => {
          if (this.ibeacons.length <= 0) {
            showToast({
              title: 'No IBeacons device data available',
              duration: 1500
            });
            this.setGlobal({ allowUpdate: true, hadFail: true });
            this.onStopBluetoothDevicesDiscovery();
          } else console.info(`IBeacons device data available,device count:${this.ibeacons.length}.`);
        }, 15000);
      }
    });
  };
  /**
   * ArrayBuffer转成16进制字符串
   * @param buffer 二进制数据转成16进制
   */
  private ab2hex = (buffer: Iterable<number>) => Array.prototype.map.call(new Uint8Array(buffer), (bit) => `00${bit.toString(16)}`.slice(-2)).join('');

  /**
   * 补码转原码,这里采用了字符串的处理方式,应该有数学上的处理方式,不做研究,没时间搞
   * @param tcr 补码的10进制数
   */
  private TCRtoTF = (tcr: number) => {
    let bitStr: string = tcr.toString(2);
    if (bitStr.startsWith('1')) {
      let result: string = '';
      for (let index = 1, str: string; (str = bitStr.charAt(index++)); ) str === '0' ? (result += '1') : (result += '0');
      return -result.toNumber(2) - 1;
    }
    return tcr;
  };
  /**
   * IBeacon设备的UUID
   */
  private UUID: string = 'ED5B98A7C8126F57494E53494445FFFE';
  /**
   * 发现设备后触发
   */
  private onBluetoothUpdate = (): void => {
    onBluetoothDeviceFound((res: any) => {
      if (res && res.devices && res.devices.length > 0) {
        const { devices } = res;
        for (let index: number = 0, item: any; (item = devices[index++]); ) {
          let advertisData = this.ab2hex(item.advertisData).toUpperCase();
          // 将获取到的设备广播数据转化成16进制后,按照文档协议进行解析.
          if (advertisData.includes(this.UUID)) {
            let usefulData: Array<string> = advertisData.substr(advertisData.indexOf(this.UUID) + 32, 10).segment(2);
            let txPower: number = this.TCRtoTF(usefulData.pop()!.toNumber(16));
            let deviceId: number = usefulData.join('').toNumber(16);
            const { RSSI: rssi } = item;
            console.info(`设备信息:deviceId:${deviceId},rssi:${rssi},txPower:${txPower},MAC:${item.localName}`);
            let exist: number = this.ibeacons.findIndex((x: { deviceId: number }) => x.deviceId === deviceId);
            // 当设备存在更新RSSI等信息,若是不存在设备则新增
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

  /**
   * 关闭蓝牙搜索,当长时间无法搜索到蓝牙设备时,关掉,避免大量耗电.
   */
  private onStopBluetoothDevicesDiscovery = () => {
    stopBluetoothDevicesDiscovery()
      .then(() => {
        this.setGlobal({ allowUpdate: false });
        clearInterval(this.cleanerInterval);
        closeBluetoothAdapter();
      })
      .catch((error: WechatMiniprogram.BluetoothError) => console.warn(error.errMsg));
  };

  /**
   * 检测小程序更新
   */
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

  /**
   * 当退出小程序时触发,关闭蓝牙,同时发送数据到后台,用于做统计
   */
  onHide = (): void => {
    this.onStopBluetoothDevicesDiscovery();
    CloseMap();
  };

  /**
   * 启动APP的时候触发
   */
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
