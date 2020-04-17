import { AppID, Token } from '@/configs/config';

import APIS from '@/configs/apis';
import { request, setStorageSync } from 'remax/wechat';

/**
 * 登陆API
 * @param data 获取的loginCode
 */
export const Login = (code: string): Promise<any> =>
  new Promise((_, reject) => {
    request({
      url: APIS.login,
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
      url: APIS.tokenLogin,
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
      url: APIS.updateUserInfo,
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
      url: APIS.updatePhone,
      data: data,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *获取项目地图
 */
export const ProjectMap = (): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: APIS.projectMap,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 *记录项目/楼层地图使用记录
 */
export const AddUsage = (data: { floorId: string; projectId: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: APIS.addLog,
      data,
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
      url: APIS.addFavor,
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
export const DelFavor = (data: { id: string }): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: APIS.delFavor,
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
      url: APIS.searchLocation,
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
      url: APIS.floorMap,
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
      url: APIS.location,
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
      url: APIS.buildList,
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
      url: APIS.floorList,
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
      url: APIS.favoriteList,
      header: { Authorization: Token },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
