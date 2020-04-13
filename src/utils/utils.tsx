import { closeBluetoothAdapter, login, onBeaconServiceChange, onBeaconUpdate, openBluetoothAdapter, startBeaconDiscovery, stopBeaconDiscovery } from 'remax/wechat';

import Toast from '@vant/weapp/dist/toast/toast';
import { uuids } from '@/configs/config';

export const onBluetoothStateChange = () => {
  Toast({ message: '倒计时 3 秒', selector: '#custom-selector' });
  onBeaconServiceChange((res: any) => {
    if (res.available) {
      onOpenBluetooth();
    }
  });
};

const onOpenBluetooth = () => {
  openBluetoothAdapter({
    success: (res: any) => {
      console.log('openBluetoothAdapter', res);
      onStartBeaconDiscovery();
    }
  });
};

const onStartBeaconDiscovery = () => {
  startBeaconDiscovery({ uuids })
    .then((res: any) => {
      console.log('startBeaconDiscovery', res);
      BeaconUpdate();
    })
    .catch((error: any) => {
      console.error('startBeaconDiscovery', error);
      onStopBeaconDiscovery();
    })
    .finally(() => {
      setTimeout(() => {
        onStopBeaconDiscovery();
      }, 1000 * 10);
    });
};

const BeaconUpdate = () => {
  onBeaconUpdate((res: any) => {
    if (res && res.beacons && res.beacons.length > 0) {
      const { beacons } = res;
      for (let index: number = 0, item: any; (item = beacons[index++]); ) {
        console.log(`${index - 1}:`, item);
      }
    }
  });
};

const onStopBeaconDiscovery = () => {
  stopBeaconDiscovery()
    .then((res: any) => {
      console.log('stopBeaconDiscovery', res);
      closeBluetoothAdapter();
    })
    .catch((error: any) => console.error('stopBeaconDiscovery', error));
};

/**
 * 获取小程序用户登录凭证
 */
export const getCode = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    login()
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
};
