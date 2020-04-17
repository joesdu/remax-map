import FacilityItem from './components/facility-item';
import { Image, MovableArea, MovableView, Text, View, navigateTo } from 'remax/wechat';

import { AppContext } from '@/app';
import CircleButton from '@/components/circleButton';
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
import { Location } from '@/service/service';

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
      facilityGroup: [
        {
          facilityId: '1',
          avatar: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
          point: [110, 140],
          name: '测试',
          address: '测试地址-3#-3L',
          isFavorite: true,
          shareData: '1'
        }
      ],
      selectorPopShow: false,
      keep: false,
      floorName: '',
      buildList: [],
      buildNameList: ['1F', '2F', '3F'],
      buildIndex: 0,
      floorList: [],
      floorNameList: ['1#', '2#', '3#'],
      floorIndex: 0
    };
  }

  onLoad = (options: any) => {
    // 非欢迎页跳转过来
    if (options.from !== 'welcome') {
      let data = JSON.parse(options.current);
      this.setState({});
    }
  };

  private timer: any = -1;

  onShow() {
    this.onLocationClick();
  }

  private onLocationClick = () => {
    // TODO 定位按钮点击
    console.log('定位按钮点击');
    this.context.onBluetoothStateChange();
    // TODO 获取楼层和楼栋列表数据
    this.timer = setInterval(() => {
      if (this.context.global.allowUpdate) {
        Location(this.context.global.ibeacons).then((res: any) => {
          const { location, floorMapUrl, facilityList } = res;
          for (let index: number = 0, item: any; (item = facilityList[index++]); ) {
            const element = item;
          }
          getImageInfo({ src: floorMapUrl })
            .then((res: any) => {
              const { width: mapWidth, height: mapHeight } = res;
              this.setState({ mapWidth, mapHeight, drawings: floormap });
            })
            .catch((error: any) => console.error(error));
        });
      }
    }, 1000);
  };

  private onFavoriteClick = () => {
    navigateTo({ url: '../favorite/index' });
  };

  private onClose = () => this.setState({ popShow: false, selectorPopShow: false });

  private onSelector = () => {
    this.setState({ selectorPopShow: true });
  };

  private onFavorite = () => {
    // Todo do favorite action
    const {
      itemData: { isFavorite, facilityId },
      current,
      keep
    } = this.state;
    let facilities = this.context.global.facilityGroup;
    console.log(isFavorite, facilityId);
    facilities[current].isFavorite = !keep;
    this.setState({ keep: !keep });
    this.context.global.setGlobal({ facilityGroup: facilities });
  };

  private onShare = () => {
    // Todo do share action
    const {
      itemData: { shareData, facilityId }
    } = this.state;
    console.log(shareData, facilityId);
  };

  private onBuildChange = (event: any) => {
    const { value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    // TODO 根据BuildID获取楼层列表
    this.setState({ buildIndex: index });
  };

  private onFloorChange = (event: any) => {
    const { value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.setState({ floorName: value, floorIndex: index });
  };

  private onSelectorOK = () => {
    // TODO 根据楼层数据获取地图等内容.
    this.setState({ selectorPopShow: false });
  };
  // 点击设施时弹出收藏框
  private onItemClick = (record: any, current: number) => {
    console.log('index:', current);
    this.setState({ itemData: record, popShow: true, current, keep: record.isFavorite });
  };
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
