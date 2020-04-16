import { AppID, Token } from '@/configs/config';

import APIS from '@/configs/apis';
import { request } from 'remax/wechat';

/**
 * 登陆API
 * @param data 获取的loginCode
 */
export const LoginAPI = (code: string): Promise<any> =>
  new Promise((resolve, reject) => {
    request({
      url: APIS.login,
      data: { jsCode: code, appId: AppID },
      method: 'POST'
    })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * Token登陆API
 */
export const TokenLoginAPI = (): Promise<any> =>
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
export const UpdateUserInfoAPI = (data: any): Promise<any> =>
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
export const UpdatePhoneAPI = (data: any): Promise<any> =>
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
export const ProjectMapAPI = (): Promise<any> =>
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
export const AddUsageAPI = (data: { floorId: string; projectId: string }): Promise<any> =>
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
export const AddFavorAPI = (data: { facilityId: string }): Promise<any> =>
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
export const DelFavorAPI = (data: { id: string }): Promise<any> =>
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
export const SearchLocationAPI = (data: { floorId?: string; keywords: string }): Promise<any> =>
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
export const FloorDataAPI = (data: { floorId: string }): Promise<any> =>
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
export const LocationAPI = (data: any): Promise<any> =>
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
export const BuildListAPI = (data: { projectId: string }): Promise<any> =>
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
export const FloorListAPI = (data: { buildId: string }): Promise<any> =>
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
