import { AddFavor, BuildList, DelFavor, FloorData, FloorList, Location, MapUsageRecord } from '@/service';
import { CircleButton, FloorSelector } from '@/components';
import { FavoriteIcon, LocationIcon, MyLocation, NotFavoriteIcon, SearchIcon, ShareIcon } from '@/assets/icons';
import { Image, MovableArea, MovableView, Text, View, hideLoading, navigateTo, showLoading, showModal } from 'remax/wechat';

import { AppContext } from '@/app';
import FacilityItem from './components/facility-item';
import React from 'react';
import { Util } from '@/utils/util';
import VantPicker from '@vant/weapp/dist/picker';
import VantPopup from '@vant/weapp/dist/popup';
import { getImageInfo } from 'remax/wechat';
import styles from './index.module.less';

export interface MainPageProps {
  location: any;
}
interface MainPageState {
  mapWidth: number;
  mapHeight: number;
  drawings: string;
  itemData?: any;
  current: number;
  popShow?: boolean;
  selectorPopShow?: boolean;
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
  mapX: number;
  mapY: number;
  isLocation?: boolean;
  location?: [number, number];
  favorResult?: boolean;
  favorData?: any;
}
class MainPage extends React.Component<MainPageProps, MainPageState> {
  static contextType = AppContext;

  constructor(props: Readonly<MainPageProps>) {
    super(props);
    this.state = {
      mapWidth: 0,
      mapHeight: 0,
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
      mapX: 0,
      mapY: 0
    };
  }

  onShow = () => {
    let query = this.props.location.query;
    if (query.from === 'welcome') this.onLocationClick();
    else {
      let current = JSON.parse(query.current);
      let args = {
        isLocation: true,
        facilityId: current.facilityId,
        avatar: current.facilityTypeUrl,
        point: query.from === 'favorite' ? current.facilityPosition : current.point,
        name: current.facilityName,
        address: `${current.projectName}-${current.buildName}-${current.floorName}`,
        isFavorite: query.from === 'favorite',
        shareData: ''
      };
      FloorData({ floorId: current.floorId }).then((res: any) => this.fixFloorData(res, false, true, args));
    }
  };

  private timer: any = -1;

  private onLocationClick = () => {
    clearInterval(this.timer);
    this.context.setGlobal({ allowUpdate: false });
    showLoading({ title: '定位中', mask: true });
    if (!this.context.global.bluetooth) this.context.SearchIBeacon();
    this.timer = setInterval(() => {
      if (this.context.global.allowUpdate) {
        hideLoading();
        this.context.setGlobal({ allowUpdate: false });
        Location({ data: JSON.stringify({ deviceData: this.context.global.ibeacons }) })
          .then((res: any) => this.fixFloorData(res, true))
          .catch(() => {
            clearInterval(this.timer);
            showModal({ title: '未检测到智能设备', content: '对不起,您当前位置无法为您提供服务', showCancel: false });
          });
      }
    }, 1000);
  };

  private fixFloorData = (res: any, isLocation: boolean, favorResult: boolean = false, favorData: any = null) => {
    let location: any;
    const { floorMapUrl, facilityList, floorName, projectId, floorId } = res.result;
    if (isLocation) location = res.result.location;
    let facilityGroup: Array<any> = [];
    if (favorResult) {
      facilityGroup = [favorData];
    } else {
      if (facilityList.length > 0) {
        for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
          const { facilityId, facilityTypeUrl, point, facilityName, projectName, buildName, isFavor } = item;
          facilityGroup.push({ isLocation: true, facilityId, avatar: facilityTypeUrl, point, name: facilityName, address: `${projectName}-${buildName}-${floorName}`, isFavorite: isFavor, shareData: facilityId });
        }
      }
      if (isLocation && location) {
        facilityGroup.push({ isLocation: false, facilityId: '', avatar: MyLocation, point: location, name: '', address: '', isFavorite: false, shareData: '' });
      }
    }
    this.setState({ facilityGroup, floorName: floorName, projectId, floorId, drawings: floorMapUrl, isLocation, location, favorResult, favorData });
  };

  private onDrawingsLoad = (event: any) => {
    console.log('image:', event);
    const { width: mapWidth, height: mapHeight } = event.detail;
    const { screenHeight, screenWidth, pixelRatio } = this.context.global.systemInfo;
    const { isLocation, location, favorResult, favorData } = this.state;
    let [mapX, mapY] = Util.GetCenterPoint(mapWidth, mapHeight, screenHeight, screenWidth, mapWidth / pixelRatio, mapHeight / pixelRatio, pixelRatio);
    if (isLocation && location) {
      [mapX, mapY] = Util.GetCenterPoint(mapWidth, mapHeight, screenHeight, screenWidth, location[0], location[1], pixelRatio);
    }
    if (favorResult) {
      const { point } = favorData;
      [mapX, mapY] = Util.GetCenterPoint(mapWidth, mapHeight, screenHeight, screenWidth, point[0], point[1], pixelRatio);
    }
    this.setState({ mapWidth, mapHeight, mapX, mapY });
  };

  private onFavoriteClick = () => navigateTo({ url: '../favorite/index' });

  private onClose = () => this.setState({ popShow: false, selectorPopShow: false });

  private onFavorite = () => {
    const { itemData, current, keep, facilityGroup } = this.state;
    const { facilityId } = itemData;
    let facilities = facilityGroup;
    if (keep) DelFavor({ facilityId });
    else AddFavor({ facilityId });
    facilities[current].isFavorite = !keep;
    this.setState({ facilityGroup: facilities, keep: !keep });
  };

  private onShare = () => {
    // Todo do share action
    const {
      itemData: { shareData, facilityId }
    } = this.state;
    console.log(shareData, facilityId);
  };

  private onSelector = () => {
    const { projectId } = this.state;
    BuildList({ projectId }).then((res: any) => {
      const { result } = res;
      let temp: Array<string> = [];
      for (let index: number = 0, item: any; (item = result[index++]); ) temp.push(item.buildName);
      this.setState({ buildList: result, buildNameList: temp });
      this.onBuildChange({ detail: { index: 0 } });
    });
    this.setState({ selectorPopShow: true });
  };

  private onBuildChange = (event: any) => {
    const { buildList } = this.state;
    const { index } = event.detail;
    let item: any = buildList[index];
    FloorList({ buildId: item.buildId }).then((res: any) => {
      console.log(res);
      const { result } = res;
      let temp: Array<string> = [];
      for (let index: number = 0, item: any; (item = result[index++]); ) temp.push(item.floorName);
      this.setState({ floorList: result, floorNameList: temp });
      this.onFloorChange({ detail: { index: 0, value: result[0].floorName } });
    });
    this.setState({ buildIndex: index });
  };

  private onFloorChange = (event: any) => {
    const { floorList } = this.state;
    const { value, index } = event.detail;
    this.setState({ floorName: value, floorIndex: index, floorId: floorList[index].floorId });
  };

  private onSelectorOK = () => {
    const { floorId, projectId } = this.state;
    MapUsageRecord({ floorId, projectId });
    FloorData({ floorId }).then((res: any) => this.fixFloorData(res, false));
    this.setState({ selectorPopShow: false });
  };

  // 点击设施时弹出收藏框
  private onItemClick = (record: any, current: number) => this.setState({ itemData: record, popShow: true, current, keep: record.isFavorite });

  // 动态渲染设施
  private renderFacilities = (facilityGroup: Array<any>) => {
    let itemTemp: Array<any> = [];
    if (facilityGroup.length > 0) {
      for (let index: number = 0, item: any; (item = facilityGroup[index++]); ) {
        itemTemp.push(<FacilityItem key={index} data={item} onItemClick={item.isLocation ? this.onItemClick.bind(this, item, index - 1) : null} />);
      }
    }
    return itemTemp;
  };

  private onSearch = () => navigateTo({ url: `../search/index?current=${JSON.stringify({ floorId: this.state.floorId })}` });

  private renderView = () => {
    const { mapWidth, mapHeight, drawings, facilityGroup, mapX, mapY } = this.state;
    if (drawings) {
      return (
        <MovableArea className={styles['floor-container']} style={{ height: '100vh', width: '100vw' }}>
          <MovableView outOfBounds={true} scale direction="all" className={styles['floor-map']} x={mapX} y={mapY} style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}>
            <Image className={styles['floor-map-drawings']} src={drawings} onLoad={this.onDrawingsLoad} />
            {this.renderFacilities(facilityGroup)}
          </MovableView>
        </MovableArea>
      );
    }
  };

  render() {
    const { popShow, keep, itemData, selectorPopShow, floorName, buildNameList, floorNameList } = this.state;
    const { avatar, name, address } = itemData;
    const popStyle = 'background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx';

    return (
      <View>
        <View className={styles['floor-wrap']}>
          {this.renderView()}
          <CircleButton icon={SearchIcon} imageStyle={{ width: 42 }} onClick={this.onSearch} style={{ float: 'right', position: 'fixed', top: 100, right: 32 }} />
          <CircleButton icon={LocationIcon} onClick={this.onLocationClick} style={{ float: 'left', position: 'fixed', bottom: 108, left: 32 }} />
          <FloorSelector text={floorName} onClick={this.onSelector} style={{ position: 'absolute', bottom: 104, left: 250 }} />
          <CircleButton icon={NotFavoriteIcon} onClick={this.onFavoriteClick} style={{ float: 'right', position: 'fixed', bottom: 108, right: 32 }} />
        </View>
        <VantPopup round show={popShow} closeable close-icon="close" position="bottom" custom-style={popStyle} bindclose={this.onClose}>
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
              <View className={styles.bottomRight} onClick={this.onShare}>
                <Image className={styles.bottomImg} src={ShareIcon} />
                <Text className={styles.bottomTxt}>位置分享</Text>
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
