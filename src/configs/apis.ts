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
  /**
   *更新用户信息
   */
  public static updateUserInfo: string = `${BaseUrl}wxuser/updateUserInfo`;
  /**
   * 更新用户手机号
   */
  public static updatePhone: string = `${BaseUrl}wxuser/updatePhoneNumber`;
  /**
   * 获取项目地图数据
   */
  public static projectMap: string = `${BaseUrl}location/projectMap`;
  /**
   * 记录项目/楼层地图使用记录
   */
  public static addLog: string = `${BaseUrl}location/addMapUsageRecord`;
  /**
   * 新增收藏位置
   */
  public static addFavor: string = `${BaseUrl}location/addFavorLocation`;
  /**
   * 删除收藏位置
   */
  public static delFavor: string = `${BaseUrl}location/delFavorLocation`;
  /**
   * 搜索位置
   */
  public static searchLocation: string = `${BaseUrl}location/searchLocation`;
  /**
   * 获取楼层数据
   */
  public static floorMap: string = `${BaseUrl}location/getFloorData`;
  /**
   * 定位
   */
  public static location: string = `${BaseUrl}location/location`;
  /**
   * 楼栋列表
   */
  public static buildList: string = `${BaseUrl}project/getBuildList`;
  /**
   * 楼层列表
   */
  public static floorList: string = `${BaseUrl}project/getFloorList`;
  /**
   * 我的收藏列表
   */
  public static favoriteList: string = `${BaseUrl}location/myFavorLocation`;
}

export default APIS;
