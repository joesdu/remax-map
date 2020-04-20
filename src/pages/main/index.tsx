import { AddFavor, BuildList, DelFavor, FloorData, FloorList, Location } from '@/service/service';
import { Image, MovableArea, MovableView, Text, View, navigateTo, showToast } from 'remax/wechat';

import { AppContext } from '@/app';
import CircleButton from '@/components/circleButton';
import FacilityItem from './components/facility-item';
import FloorSelector from '@/components/floorSelector';
import React from 'react';
import VantPicker from '@vant/weapp/dist/picker';
import VantPopup from '@vant/weapp/dist/popup';
import VantSearch from '@vant/weapp/dist/search';
import VantToast from '@vant/weapp/dist/toast';
import favorite from '@/assets/favorite.svg';
import { getImageInfo } from 'remax/wechat';
import location from '@/assets/location.svg';
import notfavorite from '@/assets/notfavorite.svg';
import share from '@/assets/share.svg';
import styles from './index.module.less';

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
}
class MainPage extends React.Component<{}, MainPageState> {
  static contextType = AppContext;
  constructor(props: Readonly<{}>) {
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
      projectId: ''
    };
  }

  onLoad = (options: any) => {
    // 非欢迎页跳转过来
    if (options.from !== 'welcome') {
      // todo Fix Something from other page data
      this.setState({});
    }
  };

  // 存储计时器ID
  private timer: any = -1;

  onShow() {
    this.onLocationClick();
  }

  private onLocationClick = () => {
    console.log('定位按钮点击');
    this.context.setGlobal({ allowUpdate: false });
    // TODO 蓝牙未检测
    // this.context.onBluetoothStateChange();
    setTimeout(() => {
      showToast({ title: '使用定时器修改蓝牙检测值。', duration: 1000 });
      this.context.setGlobal({ allowUpdate: true });
    }, 3000);
    this.timer = setInterval(() => {
      if (this.context.global.allowUpdate) {
        Location(JSON.stringify({ deviceData: this.context.global.ibeacons })).then((res: any) => this.fixFloorData(res));
      }
    }, 1000);
  };

  private fixFloorData = (res: any) => {
    const { floorMapUrl, facilityList, floorName, projectId } = res;
    let facilityGroup: Array<any> = [];
    for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
      const { facilityId, facilityTypeUrl, point, facilityName, projectName, buildName, isFavor } = item;
      facilityGroup.push({
        facilityId,
        avatar: facilityTypeUrl,
        point,
        name: facilityName,
        address: `${projectName}-${buildName}`,
        isFavorite: isFavor,
        shareData: facilityId
      });
    }
    this.setState({ facilityGroup, floorName: floorName, projectId });
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

  private onSelector = () => {
    const { projectId } = this.state;
    BuildList({ projectId }).then((res: any) => {
      let temp: Array<string> = [];
      for (let index: number = 0, item: any; (item = res[index++]); ) temp.push(item.buildName);
      this.setState({ buildList: res, buildNameList: temp });
    });
    this.setState({ selectorPopShow: true });
  };

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

  private onBuildChange = (event: any) => {
    const { buildList } = this.state;
    const { index } = event.detail;
    let item: any = buildList[index];
    FloorList(item.buildId).then((res: any) => {
      console.log(res);
      let temp: Array<string> = [];
      for (let index: number = 0, item: any; (item = res[index++]); ) temp.push(item.floorName);
      this.setState({ floorList: res, floorNameList: temp });
    });
    this.setState({ buildIndex: index });
  };

  private onFloorChange = (event: any) => {
    const { value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.setState({ floorName: value, floorIndex: index });
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
      itemTemp.push(<FacilityItem key={index - 1} data={item} onItemClick={this.onItemClick.bind(this, item, index - 1)} />);
    }
    return itemTemp;
  };

  private onSearchFocus = () => {
    const { floorList, floorIndex } = this.state;
    navigateTo({ url: `../search/index?current=${JSON.stringify({ floorId: floorList[floorIndex].floorId })}` });
  };

  render() {
    const { mapWidth, mapHeight, drawings, popShow, keep, itemData, selectorPopShow, floorName, buildNameList, floorNameList } = this.state;
    const { avatar, name, address } = itemData;

    const popStyle = 'background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx';

    return (
      <View>
        <View className={styles['floor-wrap']}>
          <VantSearch value={this.context.global.searchText} shape="round" placeholder="请输入搜索关键词" custom-class={styles.search} bindfocus={this.onSearchFocus} />
          <MovableArea className={styles['floor-container']} style={{ height: `100vh`, width: `100vw` }}>
            <MovableView scale direction="all" className={styles['floor-map']} style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}>
              <Image className={styles['floor-map-drawings']} src={drawings} />
              {this.renderFacilities(this.context.global.facilityGroup)}
            </MovableView>
          </MovableArea>
          <CircleButton icon={location} onClick={this.onLocationClick} style={{ float: 'left', position: 'fixed', bottom: 108, left: 32 }} />
          <FloorSelector text={floorName} onClick={this.onSelector} style={{ position: 'absolute', bottom: 104, left: 250 }} />
          <CircleButton icon={notfavorite} onClick={this.onFavoriteClick} style={{ float: 'right', position: 'fixed', bottom: 108, right: 32 }} />
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
                <Image className={styles.bottomImg} src={keep ? favorite : notfavorite} />
                <Text className={styles.bottomTxt}>位置收藏</Text>
              </View>
              <View className={styles.bottomRight} onClick={this.onShare}>
                <Image className={styles.bottomImg} src={share} />
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
