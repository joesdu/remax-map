import { AppID, Token, BaseUrl } from '@/configs/config';

import { request, setStorageSync } from 'remax/wechat';

/**
 * 登陆API
 * @param data 获取的loginCode
 */
export const Login = (code: string): Promise<any> =>
  new Promise((_, reject) => {
    request({
      url: `${BaseUrl}wxuser/jscodeLogin`,
      data: { jsCode: code, appId: AppID },
      method: 'POST'
    })
      .then((res: any) => setStorageSync('token', res.result.token))
      .catch((error: any) => reject(error));
  });
/**
 * Token登陆API
 */
export const TokenLogin = (): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}wxuser/tokenLogin`,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 更新用户信息
 */
export const UpdateUserInfo = (data: any): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}wxuser/updateUserInfo`,
      data: data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 更新用户手机号
 */
export const UpdatePhone = (data: any): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}wxuser/updatePhoneNumber`,
      data: data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *新增位置收藏
 */
export const AddFavor = (data: { facilityId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}location/addFavorLocation`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *删除收藏位置
 */
export const DelFavor = (data: { facilityId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}location/delFavorLocation`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *搜索位置
 */
export const SearchLocation = (data: { floorId?: string; keywords: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}location/searchLocation`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *获取楼层数据
 */
export const FloorData = (data: { floorId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}location/getFloorData`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *定位
 */
export const Location = (data: any): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}location/location`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *获取楼栋列表数据
 */
export const BuildList = (data: { projectId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}project/getBuildList`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *获取楼层列表数据
 */
export const FloorList = (data: { buildId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}project/getFloorList`,
      data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });

/**
 *获取我的收藏列表
 */
export const FavoriteList = (): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: `${BaseUrl}location/myFavorLocation`,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
