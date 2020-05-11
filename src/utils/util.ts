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
}
