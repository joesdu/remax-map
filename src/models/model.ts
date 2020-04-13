import { LoginAPI, TokenLoginAPI } from '@/service/service';

import { setStorageSync } from 'remax/wechat';

/**
 * 登陆
 * @param data 通过微信API获取到的Code,以及APP_ID
 */
export const Login = (data: any): void => {
  LoginAPI(data)
    .then((response: any) => setStorageSync('token', response.result.token))
    .catch((error: any) => console.error(error));
};

/**
 * Token登陆
 * @param data 通过微信API获取到的Code,以及APP_ID
 */
export const TokenLogin = (data: string): void => {
  TokenLoginAPI(data).catch((error: any) => console.error(error));
};
