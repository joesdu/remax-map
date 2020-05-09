/**
 * 静态工具类,主要用于处理一些算法.
 */
export default class Util {
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
}
