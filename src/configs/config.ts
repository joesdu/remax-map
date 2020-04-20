import { getStorageSync } from 'remax/wechat';

export const uuids: Array<string> = [];

export const BaseUrl: string = 'http://service-gw.winside.com:8080/smartlight/api/';

export const Token: string = getStorageSync('token');

export const AppID: string = 'wxa521c64b9a5faa4c';

export const Version: string = 'Insider Preview 20200416-1650';

export const Copyright: string = 'Copyright © 2020';
