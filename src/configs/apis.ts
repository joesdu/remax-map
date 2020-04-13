import { BaseUrl } from './config';

class APIS {
  /**
   * 登陆API URL
   */
  public static login: string = `${BaseUrl}wxuser/jscodeLogin`;
  /**
   * Token登陆API URL
   */
  public static tokenLogin: string = `${BaseUrl}wxuser/tokenLogin`;
}

export default APIS;
