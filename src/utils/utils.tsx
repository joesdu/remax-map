import { login } from 'remax/wechat';

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
