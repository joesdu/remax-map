import APIS from '@/configs/apis';
import { request } from 'remax/wechat';

/**
 * 登陆API
 * @param data 获取的loginCode
 */
export const LoginAPI = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({ url: APIS.login, data: { code: data.code } })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
};

/**
 * Token登陆API
 * @param data 获取的loginCode
 */
export const TokenLoginAPI = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({ url: APIS.tokenLogin, header: { Authorization: token } })
      .then((res: any) => resolve(res))
      .catch((error: any) => reject(error));
  });
};
