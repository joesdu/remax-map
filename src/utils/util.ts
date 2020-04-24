/**
 * 静态工具类,主要用于处理一些算法.
 */
export class Util {
  /**
   * 处理设备广播的信息
   * @param major 设备主ID值
   * @param minor 设备次ID值
   */
  public static FixCoordinateId(major: string, minor: string): number {
    let major_16: string = parseInt(major).toString(16).padStart(4, '0');
    let minor_16: string = parseInt(minor).toString(16).padStart(4, '0');
    console.log('设备主ID:', major);
    console.log('设备次ID:', minor);
    console.log('设备主ID_16:', major_16);
    console.log('设备次ID_16:', minor_16);
    console.log('返回坐标ID:', parseInt(major_16 + minor_16, 16));
    return parseInt(major_16 + minor_16, 16);
  }
}
