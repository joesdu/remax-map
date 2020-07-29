import { getStorage, request, setStorage } from 'remax/wechat';

/**
 * 网络请求Url前缀
 */
const BaseUrl: string = 'http://service-gw.winside.com:8080/smartlight/api/';

/**
 * 登陆API
 * @param data 获取的loginCode
 */
export const Login = (code: string): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}wxuser/jscodeLogin`,
      data: { jsCode: code, appId: 'wxa521c64b9a5faa4c' },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res: any) => {
        setStorage({ key: 'token', data: res.data.result.token, success: () => resolve(), fail: () => reject() });
      })
      .catch((error: any) => reject(error));
  });
/**
 * Token登陆API
 */
export const TokenLogin = (token: string, data?: { projectId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}wxuser/tokenLogin`,
      header: { Authorization: token, 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data
    })
      .then((res: any) => {
        setStorage({ key: 'token', data: res.data.result.token });
        resolve(res.data);
      })
      .catch((error: any) => reject(error));
  });
/**
 * 更新用户信息
 */
export const UpdateUserInfo = (data: any): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}wxuser/updateUserInfo`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 * 更新用户手机号
 */
export const UpdatePhone = (data: any): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}wxuser/updatePhoneNumber`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 * 地图使用日志
 */
export const MapUsageRecord = (data: { floorId: string; projectId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}location/addMapUsageRecord`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *新增位置收藏
 */
export const AddFavor = (data: { facilityId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}location/addFavorLocation`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *删除收藏位置
 */
export const DelFavor = (data: { facilityId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}location/delFavorLocation`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *搜索位置
 */
export const SearchLocation = (data: { floorId?: string; keywords: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}location/searchLocation`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *获取楼层数据
 */
export const FloorData = (data: { floorId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}location/getFloorData`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *定位
 */
export const Location = (data: any): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      console.log('定位参数', data);
      request({
        url: `${BaseUrl}location/location`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *获取楼栋列表数据
 */
export const BuildList = (data: { projectId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}project/getBuildList`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 *获取楼层列表数据
 */
export const FloorList = (data: { buildId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}project/getFloorList`,
        data,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });

/**
 *获取我的收藏列表
 */
export const FavoriteList = (): Promise<any> =>
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}location/myFavorLocation`,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res.data))
        .catch((error: any) => reject(error));
    });
  });
/**
 * 关闭地图,切换到后台调用.
 */
export const CloseMap = () => {
  new Promise((resolve, reject) => {
    getStorage({ key: 'token' }).then((token: any) => {
      request({
        url: `${BaseUrl}wxuser/closeMap`,
        header: { Authorization: token.data, 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
        .then((res: any) => resolve(res))
        .catch((error: any) => reject(error));
    });
  });
};
