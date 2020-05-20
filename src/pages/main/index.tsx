import { AddFavor, BuildList, DelFavor, FloorData, FloorList, Location, MapUsageRecord } from '@/service';
import { AppContext, ContextProps } from '@/app';
import { Button, Image, MovableArea, MovableView, Text, View, hideHomeButton, navigateTo, showModal, vibrateShort } from 'remax/wechat';
import { CircleButton, FloorSelector } from '@/components';
import { FavoriteIcon, LocationIcon, MyLocation, NotFavoriteIcon, SearchIcon, ShareIcon, SpecialIcon } from '@/assets/icons';

import FacilityItem from './components/facilityitem';
import React from 'react';
import VantPicker from '@vant/weapp/dist/picker';
import VantPopup from '@vant/weapp/dist/popup';
import styles from './index.less';

interface MainPageProps {
  location: any;
}
interface MainPageState {
  mapWidth: number;
  mapHeight: number;
  currentDrawings: string;
  drawings: string;
  itemData?: any;
  current: number;
  popShow: boolean;
  selectorPopShow: boolean;
  keep: boolean;
  floorName: string;
  buildList: Array<any>;
  buildNameList: Array<string>;
  buildIndex: number;
  floorList: Array<any>;
  floorNameList: Array<string>;
  floorIndex: number;
  facilityGroup: Array<any>;
  projectId: string;
  floorId: string;
  location?: [number, number];
  specialPoint?: [number, number];
  transX: any;
  transY: any;
  scalaValue: number;
  realScala: number;
  isOnShowData: boolean;
}
class MainPage extends React.Component<MainPageProps, MainPageState> {
  static contextType: React.Context<Partial<ContextProps>> = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: Readonly<MainPageProps>) {
    super(props);
    this.state = {
      mapWidth: 0,
      mapHeight: 0,
      currentDrawings: '',
      drawings: '',
      itemData: {},
      current: 0,
      popShow: false,
      facilityGroup: [],
      selectorPopShow: false,
      keep: false,
      floorName: '',
      buildList: [],
      buildNameList: [],
      buildIndex: 0,
      floorList: [],
      floorNameList: [],
      floorIndex: 0,
      projectId: '',
      floorId: '',
      transX: 0,
      transY: 0,
      scalaValue: 1,
      realScala: 1,
      isOnShowData: false
    };
  }

  private onClose = (): void => {
    vibrateShort();
    this.setState({ popShow: false, selectorPopShow: false });
  };

  private onFavorite = (): void => {
    vibrateShort();
    const { itemData, current, keep, facilityGroup } = this.state;
    const { facilityId } = itemData;
    if (current === -1) showModal({ title: '无法收藏', content: '我的位置暂不支持收藏', showCancel: false });
    else {
      let facilities: Array<any> = facilityGroup;
      if (keep) DelFavor({ facilityId }).catch((error) => console.warn(error));
      else AddFavor({ facilityId }).catch((error) => console.warn(error));
      facilities[current].isFavorite = !keep;
      this.setState({ facilityGroup: facilities, keep: !keep });
    }
  };

  private onSelector = (): void => {
    clearInterval(this.context.global?.getLocationInterval);
    this.context.setGlobal!({ getLocationInterval: -1 });
    const { projectId } = this.state;
    BuildList({ projectId })
      .then((res: any) => {
        const { result } = res;
        let temp: Array<string> = [];
        for (let index: number = 0, item: any; (item = result[index++]); ) temp.push(item.buildName);
        this.setState({ buildList: result, buildNameList: temp });
        this.onBuildChange({ detail: { index: 0 } });
      })
      .catch((error) => console.warn(error));
    this.setState({ selectorPopShow: true });
  };

  private onBuildChange = (event: any): void => {
    const { buildList } = this.state;
    const { index } = event.detail;
    let item: any = buildList[index];
    FloorList({ buildId: item.buildId })
      .then((res: any) => {
        const { result } = res;
        let temp: Array<string> = [];
        for (let index: number = 0, item: any; (item = result[index++]); ) temp.push(item.floorName);
        this.setState({ floorList: result, floorNameList: temp });
        this.onFloorChange({ detail: { index: 0, value: result[0].floorName } });
      })
      .catch((error) => console.warn(error));
    this.setState({ buildIndex: index });
  };

  private onFloorChange = (event: any): void => {
    const { floorList } = this.state;
    const { value, index } = event.detail;
    this.setState({ floorName: value, floorIndex: index, floorId: floorList[index].floorId });
  };

  private onSelectorOK = (): void => {
    vibrateShort();
    const { floorId, projectId } = this.state;
    MapUsageRecord({ floorId, projectId }).catch((error) => console.warn(error));
    FloorData({ floorId })
      .then((res: any) => this.fixFloorData(res))
      .catch((error) => console.warn(error));
    this.setState({ selectorPopShow: false });
  };

  // 点击设施时弹出收藏框
  private onItemClick = (record: any, current: number): void => {
    vibrateShort();
    this.setState({ itemData: record, popShow: true, current, keep: record.isFavorite });
  };

  // 动态渲染设施
  private renderFacilities = (): Array<any> => {
    const { facilityGroup } = this.state;
    let itemTemp: Array<any> = [];
    if (facilityGroup.length > 0) {
      for (let index: number = 0, item: any; (item = facilityGroup[index++]); ) {
        itemTemp.push(<FacilityItem key={index} data={item} onItemClick={this.onItemClick.bind(this, item, index - 1)} />);
      }
    }
    return itemTemp;
  };

  /**
   * 渲染位置
   */
  private renderLocation = (): JSX.Element | undefined => {
    const { location, floorId } = this.state;
    if (location && floorId === this.context.global?.currentFloor) {
      let locationData = { facilityId: '', avatar: MyLocation, point: location, name: '我的位置', address: '', isFavorite: false };
      return <FacilityItem data={locationData} onItemClick={this.onItemClick.bind(this, locationData, -1)} />;
    }
  };

  /**
   * 分享数据
   * @param res
   */
  onShareAppMessage = (res: any): any => {
    const { itemData, floorId } = this.state;
    return {
      title: '邀请您使用灯联网定位导航',
      path: `/pages/welcome/index?floorId=${floorId}&current=${JSON.stringify(itemData)}&from=share&shareobj=${JSON.stringify(res)}`
    };
  };

  onShow = (): void => {
    hideHomeButton();
    console.info('Main On Show');
    let currentData = this.context.global?.currentData!;
    if (currentData.isShare) {
      let current: any = JSON.parse(currentData.current);
      const { facilityId, point, name, address } = current;
      let args: any = { facilityId, avatar: SpecialIcon, point, name, address, isFavorite: false };
      FloorData({ floorId: current.floorId })
        .then((res: any) => this.fixOnShowData(res, args))
        .catch((error) => console.warn(error));
    } else if (currentData.from === 'favorite' || currentData.from === 'searchresult') {
      let current: any = JSON.parse(currentData.current);
      const { facilityId, facilityName, projectName, buildName, floorName } = current;
      let point: any = currentData.from === 'favorite' ? current.facilityPosition : current.point;
      let args: any = { facilityId: facilityId, avatar: SpecialIcon, point, name: facilityName, address: `${projectName}-${buildName}-${floorName}`, isFavorite: currentData.from === 'favorite' };
      FloorData({ floorId: current.floorId })
        .then((res: any) => this.fixOnShowData(res, args))
        .catch((error) => console.warn(error));
    }
    if (this.context.global?.atFirst) {
      this.context.setGlobal!({ atFirst: false });
      this.getLocation();
    }
  };

  /**
   * 获取定位数据
   */
  private getLocation = (): void => {
    let getLocationInterval: any = setInterval(() => {
      if (this.context.global?.allowUpdate) {
        this.context.setGlobal!({ allowUpdate: false });
        Location({ data: JSON.stringify({ deviceData: this.context.getIBeacons!() }) })
          .then((res: any) => {
            this.context.setGlobal!({ hadFail: false });
            this.fixLocationData(res);
          })
          .catch((error) => {
            console.warn(error);
            this.context.setGlobal!({ hadFail: true });
          });
      }
    }, 3000);
    this.context.setGlobal!({ getLocationInterval });
  };
  /**
   * 处理定位数据
   * @param res 服务端返回定位数据结果
   */
  private fixLocationData = (res: any): void => {
    let location: any;
    const { floorMapUrl, facilityList, floorName, projectId, floorId } = res.result;
    location = res.result.location;
    if (location === null) location = this.state.location;
    if (floorId !== this.state.floorId) {
      let facilityGroup: Array<any> = [];
      if (facilityList.length > 0) {
        for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
          const { facilityId, facilityTypeUrl, point, facilityName, projectName, buildName, isFavor } = item;
          facilityGroup.push({ facilityId, avatar: facilityTypeUrl, point, name: facilityName, address: `${projectName}-${buildName}-${floorName}`, isFavorite: isFavor });
        }
      }
      this.context.setGlobal!({ currentFloor: floorId });
      this.setState({ facilityGroup, drawings: floorMapUrl, floorName: floorName, projectId, floorId, location, isOnShowData: false });
    } else this.setState({ location, isOnShowData: false });
  };

  /**
   * 处理其他页面跳转数据
   * @param res 楼层数据
   * @param fixData 页面跳转所带数据
   */
  private fixOnShowData = (res: any, fixData: any): void => {
    clearInterval(this.context.global?.getLocationInterval);
    this.context.setGlobal!({ getLocationInterval: -1, hadFail: false });
    const { floorMapUrl, floorName, projectId, floorId, facilityList } = res.result;
    let facilityGroup: Array<any> = [];
    if (facilityList.length > 0) {
      for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
        const { facilityId, facilityTypeUrl, point, facilityName, projectName, buildName, isFavor } = item;
        if (facilityId !== fixData.facilityId) facilityGroup.push({ facilityId, avatar: facilityTypeUrl, point, name: facilityName, address: `${projectName}-${buildName}-${floorName}`, isFavorite: isFavor });
      }
    }
    facilityGroup.push(fixData);
    this.setState({ facilityGroup, drawings: floorMapUrl, floorName: floorName, projectId, floorId, specialPoint: fixData.point, isOnShowData: true });
    this.fixMapMove();
  };

  /**
   * 处理楼层数据
   * @param res 楼层数据
   */
  private fixFloorData = (res: any): void => {
    const { floorMapUrl, facilityList, floorName, projectId, floorId } = res.result;
    let facilityGroup: Array<any> = [];
    if (facilityList.length > 0) {
      for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
        const { facilityId, facilityTypeUrl, point, facilityName, projectName, buildName, isFavor } = item;
        facilityGroup.push({ facilityId, avatar: facilityTypeUrl, point, name: facilityName, address: `${projectName}-${buildName}-${floorName}`, isFavorite: isFavor });
      }
    }
    this.setState({ facilityGroup, drawings: floorMapUrl, floorName: floorName, projectId, floorId });
  };

  private onDrawingsLoad = (event: any): void => {
    const { drawings } = this.state;
    const { width: mapWidth, height: mapHeight } = event.detail;
    this.setState({ mapWidth, mapHeight, currentDrawings: drawings });
    this.fixMapMove();
  };

  private fixMapMove = (): void => {
    const { drawings, currentDrawings } = this.state;
    if (drawings !== '' && drawings === currentDrawings) {
      let scalaValue: number = 2;
      this.setState({ scalaValue, realScala: 2 });
      setTimeout(() => {
        const { location, mapWidth, mapHeight, isOnShowData, specialPoint } = this.state;
        const { windowHeight, windowWidth, pixelRatio, statusBarHeight } = this.context.global?.systemInfo!;
        let point: [number, number] = [mapWidth / 2, mapHeight / 2];
        if (isOnShowData) point = specialPoint!;
        else point = location!;
        let SH: number = ((windowHeight - statusBarHeight) * pixelRatio) / 3;
        let SW: number = (windowWidth * pixelRatio) / 3;
        let PX: number = (point[0] * pixelRatio) / (3 * scalaValue);
        let PY: number = (point[1] * pixelRatio) / (3 * scalaValue);
        let flagX: boolean = PX >= SW / 2;
        let flagY: boolean = PY <= SH / 2;
        let resultX: number = (flagX ? (SW - PX) / scalaValue : (PX - SW) / scalaValue) / 2;
        let resultY: number = (flagY ? (SH - PY) / scalaValue : (PY - SH) / scalaValue) / 2;
        this.setState({ transX: resultX, transY: resultY });
      }, 500);
    }
  };

  private renderView = (): JSX.Element | undefined => {
    const { mapWidth, mapHeight, drawings, transX, transY, realScala } = this.state;
    if (this.context.global?.hadFail) {
      return (
        <View className={styles.loading}>
          <View className={styles['loading-text']}>
            正在搜索服务
            <Text className={styles.dotting}></Text>
          </View>
        </View>
      );
    } else {
      if (drawings) {
        return (
          <MovableArea className={styles.floor} scaleArea style={{ height: '100vh', width: '100vw' }}>
            <MovableView
              outOfBounds
              scale
              scaleMin={0.6}
              scaleMax={2}
              direction="all"
              scaleValue={realScala}
              className={styles['floor-map']}
              style={{
                height: mapHeight,
                width: mapWidth
              }}
              x={transX}
              y={transY}
              onChange={(event: any): void => {
                const { source, x, y } = event.detail;
                if (source !== '') this.setState({ transX: x, transY: y });
              }}
              onScale={(event: any): void => {
                const { x, y, scale } = event.detail;
                this.setState({ transX: x, transY: y, scalaValue: scale, realScala: scale });
              }}
            >
              <Image className={styles['floor-map-drawings']} src={drawings} onLoad={this.onDrawingsLoad} />
              {this.renderFacilities()}
              {this.renderLocation()}
            </MovableView>
          </MovableArea>
        );
      }
    }
  };

  render(): JSX.Element {
    const { popShow, keep, itemData, selectorPopShow, floorName, buildNameList, floorNameList } = this.state;
    const { avatar, name, address } = itemData;
    const popStyle: string = 'background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx';

    return (
      <View>
        {this.renderView()}
        <CircleButton
          icon={SearchIcon}
          imageStyle={{ width: 42 }}
          onClick={() => {
            navigateTo({ url: `../search/index?current=${JSON.stringify({ floorId: this.state.floorId })}` });
          }}
          style={{ float: 'right', position: 'fixed', top: 100, right: 32 }}
        />
        <CircleButton
          icon={LocationIcon}
          onClick={() => {
            if (this.context.global?.getLocationInterval !== -1) this.fixMapMove();
            else this.getLocation();
          }}
          style={{ float: 'left', position: 'fixed', bottom: 108, left: 32 }}
        />
        <FloorSelector text={floorName} onClick={this.onSelector} style={{ position: 'fixed', bottom: 104, left: 250 }} />
        <CircleButton
          icon={NotFavoriteIcon}
          onClick={() => {
            navigateTo({ url: '../favorite/index' });
          }}
          style={{ float: 'right', position: 'fixed', bottom: 108, right: 32 }}
        />
        <VantPopup round show={popShow} close-on-click-overlay closeable close-icon="close" position="bottom" custom-style={popStyle} bindclose={this.onClose}>
          <View className={styles.popContainer}>
            <View className={styles.flexTop}>
              <View className={styles.topRight}>
                <Image className={styles.img} src={avatar} />
              </View>
              <View className={styles.topLeft}>
                <Text className={styles.leftTop}>{name}</Text>
                <Text className={styles.leftBottom}>{address}</Text>
              </View>
            </View>
            <View className={styles.flexBottom}>
              <View className={styles.bottomLeft} onClick={this.onFavorite}>
                <Image className={styles.bottomImg} src={keep ? FavoriteIcon : NotFavoriteIcon} />
                <Text className={styles.bottomTxt}>位置收藏</Text>
              </View>
              <View className={styles.bottomRight}>
                <Image className={styles.bottomImg} src={ShareIcon} />
                <Button className={styles.bottomTxt} style={{ border: 'none', padding: 0 }} plain type="default" openType="share" onClick={() => vibrateShort()}>
                  位置分享
                </Button>
              </View>
            </View>
          </View>
        </VantPopup>
        <VantPopup round show={selectorPopShow} close-on-click-overlay={false} position="bottom" custom-style={popStyle}>
          <View className={styles.selector}>
            <View className={styles['selector-title']}>
              <View className={styles['selector-title-left']}>楼栋</View>
              <View className={styles['selector-title-right']}>楼层</View>
            </View>
            <View className={styles['selector-top']}>
              <View className={styles['selector-top-left']}>
                <VantPicker columns={buildNameList} bindchange={this.onBuildChange} />
              </View>
              <View className={styles['selector-top-right']}>
                <VantPicker columns={floorNameList} bindchange={this.onFloorChange} />
              </View>
            </View>
            <View className={styles['selector-bottom']}>
              <View className={styles['selector-bottom-left']} onClick={this.onClose}>
                取消
              </View>
              <View className={styles['selector-bottom-right']} onClick={this.onSelectorOK}>
                确定
              </View>
            </View>
          </View>
        </VantPopup>
      </View>
    );
  }
}

export default MainPage;
