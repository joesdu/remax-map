import { AddFavor, BuildList, DelFavor, FloorData, FloorList, Location } from '@/service';
import { CircleButton, FloorSelector } from '@/components';
import { FavoriteIcon, LocationIcon, MyLocation, NotFavoriteIcon, SearchIcon, ShareIcon } from '@/assets/icons';
import { Image, MovableArea, MovableView, Text, View, navigateTo } from 'remax/wechat';

import { AppContext } from '@/app';
import FacilityItem from './components/facility-item';
import React from 'react';
import VantPicker from '@vant/weapp/dist/picker';
import VantPopup from '@vant/weapp/dist/popup';
import VantToast from '@vant/weapp/dist/toast';
import { getImageInfo } from 'remax/wechat';
import styles from './index.module.less';

// import VantSearch from '@vant/weapp/dist/search';

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
      floorId: ''
    };
  }

  onShow = () => {
    let query = this.props.location.query;
    console.log('FROM:', query.from);
    if (query.from === 'favorite') {
      // 从收藏跳转到主页
      console.log(query.current);
      /**
       * {"floorId":29,"facilityTypeName":"扶梯","buildName":"新建楼栋测试","facilityId":15,"facilityTypeUrl":"http://service-gw.winside.com:8080/uploadFile/facility/扶梯.svg","id":3,"facilityName":"扶梯","floorName":"测试地图问题5","facilityPosition":[1230,718],"projectName":"空地图测试","projectId":18}
       */
    } else if (query.from === 'searchresult') {
      //从结果页面跳转到主页
      console.log(query.current);
      /**
       * {"buildName":"新建楼栋测试","facilityTypeName":"卫生间","facilityId":13,"buildId":null,"point":[1186,356],"floorId":29,"wh":[null,null],"facilityTypeId":1,"facilityTypeUrl":"http://service-gw.winside.com:8080/uploadFile/facility/卫生间.svg","facilityName":"卫生间","floorName":"测试地图问题5","projectName":"空地图测试","projectId":18,"facilityOwner":2}
       */
    } else {
      // 从欢迎页跳转到主页
      this.onLocationClick();
    }
  };

  // 存储计时器ID
  private timer: any = -1;

  private onLocationClick = () => {
    console.log('定位按钮点击');
    this.context.setGlobal({ allowUpdate: false });
    // TODO 蓝牙未检测
    Location({
      data: JSON.stringify({
        deviceData: [
          { coordinateId: 618, rssi: -40, accuracy: 0.6 },
          { coordinateId: 619, rssi: -40, accuracy: 0.6 },
          { coordinateId: 620, rssi: -40, accuracy: 0.6 },
          { coordinateId: 621, rssi: -40, accuracy: 0.6 },
          { coordinateId: 622, rssi: -40, accuracy: 0.6 }
        ]
      })
    }).then((res: any) => this.fixFloorData(res));
    // this.context.SearchIBeacon();
    // this.timer = setInterval(() => {
    //   if (this.context.global.allowUpdate) {
    //     Location(JSON.stringify({ deviceData: this.context.global.ibeacons })).then((res: any) => this.fixFloorData(res));
    //   }
    // }, 1000);
  };

  private fixFloorData = (res: any) => {
    console.log('MapDATA:', res);
    const { floorMapUrl, facilityList, floorName, projectId, floorId, location } = res.result;
    let facilityGroup: Array<any> = [];
    for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
      const { facilityId, facilityTypeUrl, point, facilityName, projectName, buildName, isFavor } = item;
      facilityGroup.push({
        isLocation: true,
        facilityId,
        avatar: facilityTypeUrl,
        point,
        name: facilityName,
        address: `${projectName}-${buildName}`,
        isFavorite: isFavor,
        shareData: facilityId
      });
    }
    facilityGroup.push({
      isLocation: false,
      facilityId: '',
      avatar: MyLocation,
      point: location,
      name: '',
      address: '',
      isFavorite: false,
      shareData: ''
    });
    console.log('facilityGroup:', facilityGroup);
    this.setState({ facilityGroup, floorName: floorName, projectId, floorId });
    getImageInfo({ src: floorMapUrl })
      .then((res: any) => {
        const { width: mapWidth, height: mapHeight } = res;
        this.setState({ mapWidth, mapHeight, drawings: floorMapUrl });
      })
      .catch((error: any) => console.error(error))
      .finally(() => clearInterval(this.timer));
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
    console.log('buildItem:', item);
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
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.setState({ floorName: value, floorIndex: index, floorId: floorList[index].floorId });
  };

  private onSelectorOK = () => {
    const { floorList, floorIndex } = this.state;
    FloorData({ floorId: floorList[floorIndex].floorId }).then((res: any) => {
      console.log(res);
      this.fixFloorData(res);
    });
    this.setState({ selectorPopShow: false });
  };

  // 点击设施时弹出收藏框
  private onItemClick = (record: any, current: number) => this.setState({ itemData: record, popShow: true, current, keep: record.isFavorite });

  // 动态渲染设施
  private renderFacilities = (facilityGroup: Array<any>) => {
    let itemTemp: Array<any> = [];
    for (let index: number = 0, item: any; (item = facilityGroup && facilityGroup[index++]); ) {
      itemTemp.push(<FacilityItem key={index - 1} data={item} onItemClick={item.isLocation ? this.onItemClick.bind(this, item, index - 1) : null} />);
    }
    return itemTemp;
  };

  private onSearchFocus = () => {
    const { floorId } = this.state;
    navigateTo({ url: `../search/index?current=${JSON.stringify({ floorId })}` });
  };

  render() {
    const { mapWidth, mapHeight, drawings, popShow, keep, itemData, selectorPopShow, floorName, buildNameList, floorNameList, facilityGroup } = this.state;
    const { avatar, name, address } = itemData;

    const popStyle = 'background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx';

    return (
      <View>
        <View className={styles['floor-wrap']}>
          {/* <VantSearch value={this.context.global.searchText} shape="round" placeholder="请输入搜索关键词" custom-class={styles.search} bindfocus={this.onSearchFocus} /> */}
          <MovableArea className={styles['floor-container']} style={{ height: '100vh', width: '100vw' }}>
            <MovableView scale direction="all" className={styles['floor-map']} style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}>
              <Image className={styles['floor-map-drawings']} src={drawings} />
              {this.renderFacilities(facilityGroup)}
            </MovableView>
          </MovableArea>
          <CircleButton icon={SearchIcon} imageStyle={{ width: 42 }} onClick={this.onSearchFocus} style={{ float: 'right', position: 'fixed', top: 100, right: 32 }} />
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
        <VantToast id="custom-selector" />
      </View>
    );
  }
}

export default MainPage;
