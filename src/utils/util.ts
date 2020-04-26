import { request } from 'remax/wechat';

/**
 * 静态工具类,主要用于处理一些算法.
 */
export class Util {
  /**
   * 处理设备广播的设备ID
   * @param major 设备主ID值
   * @param minor 设备次ID值
   */
  public static FixDeviceId = (major: string, minor: string): number => {
    let major_16: string = parseInt(major).toString(16).padStart(4, '0');
    let minor_16: string = parseInt(minor).toString(16).padStart(4, '0');
    return parseInt(major_16 + minor_16, 16);
  };

  /**
   * 获取偏移值
   * @param mapWidth 图片宽度
   * @param mapHeight 图片高度
   * @param screenHeight 屏幕高度
   * @param screenWidth 屏幕宽度
   * @param pointX 位置X
   * @param pointY 位置Y
   * @param pixelRatio 屏幕像素比
   */
  public static GetCenterPoint = (mapWidth: number, mapHeight: number, screenHeight: number, screenWidth: number, pointX: number, pointY: number, pixelRatio: number): [number, number] => {
    let negativelyX: boolean = false,
      negativelyY: boolean = false;
    if (mapWidth - pointX >= screenWidth / pixelRatio) negativelyX = true;
    if (mapHeight - pointY <= screenHeight / pixelRatio) negativelyY = true;
    let centerPointX: number = 0,
      centerPointY: number = 0;
    centerPointX = pointX - screenWidth;
    centerPointY = pointY - screenHeight / pixelRatio;
    if (negativelyX) centerPointX = -centerPointX;
    if (negativelyY) centerPointY = -centerPointY;
    return [centerPointX, centerPointY];
  };

  /**
   * 获取网络SVG图片宽高
   * @param src SVG网络资源链接
   */
  public static GetSvgInfoFormUrl = (src: string): Promise<any> =>
    new Promise((resolve, reject) => {
      request({ url: src }).then((res: any) => {
        const { data } = res;
        // <svg height="" width=""
        const r1: RegExp = /(?:[\S\s]+)?<svg(?=.*(height)="(\d+)(?:[^"]+)?")(?=.*(width)="(\d+)(?:[^"]+)?")(?:[\S\s]+)?/;
        // <svg viewBox="0 0 1103 711"
        const r2: RegExp = /(?:[\S\s]+)?viewBox="\d+ \d+ (\d+) (\d+)"(?:[\S\s]+)?/;
        // <svg style="height:***px;width:***px"
        const r3: RegExp = /(?:[\S\s]+)?(?:<svg[^>]+style="(?=.*(height):(\d+)(?:[^>]+)?)(?=.*(width):(\d+)(?:[^>]+)?))(?:[\S\s]+)?/;
        let str: string = '{}';
        let info: { width: number; height: number } = { width: 0, height: 0 };
        let isSuccess: boolean = false;
        try {
          str = data
            .replace(r1, '{"$1":$2,"$3":$4}')
            .replace(/\$(2|4)/, '0')
            .replace(/\$1/, 'height')
            .replace(/\$3/, 'width');
          if (str.length > 45) isSuccess = false;
          else {
            isSuccess = true;
            info = JSON.parse(str);
          }
          if (!isSuccess) {
            str = data.replace(r2, '{"width":$1,"height":$2}').replace(/\$(1|2)/, '0');
            if (str.length > 45) isSuccess = false;
            else {
              isSuccess = true;
              info = JSON.parse(str);
            }
            console.log('r2', info);
          }
          if (!isSuccess) {
            str = data
              .replace(r3, '{"$1":$2,"$3":$4}')
              .replace(/\$(2|4)/, '0')
              .replace(/\$1/, 'height')
              .replace(/\$3/, 'width');
            if (str.length > 45) isSuccess = false;
            else {
              isSuccess = true;
              info = JSON.parse(str);
            }
            console.log('r3', info);
          }
        } catch (error) {
          console.log(error);
          reject(error);
        }
        if (isSuccess) resolve(info);
        else reject(new Error('无法正确解析SVG数据'));
      });
    });
}
