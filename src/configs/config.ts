import { getStorageSync } from 'remax/wechat';

export const uuids: Array<string> = [];

export const BaseUrl: string = 'http://10.69.43.21:7003/smartlight/api/';

export const Token: string = getStorageSync('token');

export const AppID: string = 'wxb469856f9258f52b';
