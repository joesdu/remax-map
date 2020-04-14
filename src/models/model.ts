import { AddFavorAPI, AddUsageAPI, BuildListAPI, DelFavorAPI, FloorDataAPI, FloorListAPI, LocationAPI, LoginAPI, ProjectMapAPI, SearchLocationAPI, TokenLoginAPI } from '@/service/service';

import { setStorageSync } from 'remax/wechat';

/**
 * 登陆
 * @param code 通过微信API获取到的Code
 */
export const Login = (code: string): void => {
  LoginAPI(code)
    .then((response: any) => setStorageSync('token', response.result.token))
    .catch((error: any) => console.error(error));
};
/**
 * Token登陆
 */
export const TokenLogin = (): Promise<any> =>
  new Promise((resolve, reject) => {
    TokenLoginAPI()
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 获取项目地图
 */
export const ProjectMap = () =>
  new Promise((resolve, reject) => {
    ProjectMapAPI()
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 新增项目/楼层地图使用记录
 * @param data { floorId: string; projectId: string }
 */
export const AddUsage = (data: { floorId: string; projectId: string }) =>
  new Promise((resolve, reject) => {
    AddUsageAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 新增收藏
 * @param data { facilityId: string }
 */
export const AddFavor = (data: { facilityId: string }) =>
  new Promise((resolve, reject) => {
    AddFavorAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 删除收藏位置
 * @param data { id: string; }
 */
export const DelFavor = (data: { id: string }) =>
  new Promise((resolve, reject) => {
    DelFavorAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 搜索位置
 * @param data { floorId?: string | undefined; keywords: string; }
 */
export const SearchLocation = (data: { floorId?: string | undefined; keywords: string }) =>
  new Promise((resolve, reject) => {
    SearchLocationAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 获取楼层数据
 * @param data  { floorId: string; }
 */
export const FloorData = (data: { floorId: string }) =>
  new Promise((resolve, reject) => {
    FloorDataAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 定位
 * @param data 定位相关数据格式查看文档
 */
export const Location = (data: any) =>
  new Promise((resolve, reject) => {
    LocationAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 获取楼栋列表
 * @param data { projectId: string; }
 */
export const BuildList = (data: { projectId: string }) =>
  new Promise((resolve, reject) => {
    BuildListAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
/**
 * 获取楼层列表
 * @param data { buildId: string; }
 */
export const FloorList = (data: { buildId: string }) =>
  new Promise((resolve, reject) => {
    FloorListAPI(data)
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
