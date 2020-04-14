import FacilityItem, { FacilityItemData } from './components/facility-item';
import { Image, MovableArea, MovableView, Text, View } from 'remax/wechat';

import CircleButton from '@/components/circleButton';
import FloorSelector from '@/components/floorSelector';
import React from 'react';
import VantPicker from '@vant/weapp/dist/picker';
import VantPopup from '@vant/weapp/dist/popup';
import VantToast from '@vant/weapp/dist/toast';
import VantSearch from '@vant/weapp/dist/search';
import favorite from '@/assets/favorite.svg';
import floormap from '@/assets/floormap.png';
import { getImageInfo } from 'remax/wechat';
import location from '@/assets/location.svg';
import notfavorite from '@/assets/notfavorite.svg';
import { onBluetoothStateChange } from '@/utils/utils';
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
  buildName: string;
  floorName: string;
  buildList: Array<string>;
  buildIndex: number;
  floorList: Array<string>;
  floorIndex: number;
  facilityGroup: Array<FacilityItemData>;
}
class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      mapWidth: 0,
      mapHeight: 0,
      drawings: '',
      facilityGroup: [
        {
          facilityId: '1',
          avatar: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
          point: [110, 140],
          name: '测试',
          address: '测试地址-3#-3L',
          isFavorite: true,
          shareData: '1'
        },
        {
          facilityId: '2',
          avatar: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
          point: [210, 100],
          name: '测试1',
          address: '测试地址-3#-2L',
          isFavorite: false,
          shareData: '2'
        }
      ],
      itemData: {
        facilityId: '1',
        avatar: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
        point: [110, 140],
        name: '测试',
        address: '测试地址-3#-3L',
        isFavorite: true,
        shareData: '1'
      },
      current: 0,
      popShow: false,
      selectorPopShow: false,
      keep: false,
      buildName: '',
      floorName: '',
      buildList: ['1F', '2F', '3F'],
      buildIndex: 0,
      floorList: ['1#', '2#', '3#'],
      floorIndex: 0
    };
  }

  onShow() {
    getImageInfo({ src: floormap })
      .then((res: any) => {
        const { width: mapWidth, height: mapHeight } = res;
        this.setState({ mapWidth, mapHeight, drawings: floormap });
      })
      .catch((error: any) => console.error(error));
    onBluetoothStateChange();
  }

  private onLocationClick = () => {
    console.log('locationClick');
  };
  private onFavoriteClick = () => {
    console.log('favoriteClick');
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
      facilityGroup,
      keep
    } = this.state;
    let facilities = facilityGroup;
    console.log(isFavorite, facilityId);
    facilities[current].isFavorite = !keep;
    this.setState({ keep: !keep, facilityGroup: facilities });
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
    this.setState({ buildName: value, buildIndex: index });
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

  render() {
    const { mapWidth, mapHeight, drawings, popShow, keep, itemData, selectorPopShow, buildName, floorName, buildList, floorList, facilityGroup } = this.state;
    const { avatar, name, address } = itemData;

    const popStyle = 'background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx';

    return (
      <View>
        <View className={styles['floor-wrap']}>
          <VantSearch shape="round" placeholder="请输入搜索关键词" custom-class={styles.search} />
          <MovableArea className={styles['floor-container']} style={{ height: `100vh`, width: `100vw` }}>
            <MovableView scale direction="all" className={styles['floor-map']} style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}>
              <Image className={styles['floor-map-drawings']} src={drawings} />
              {this.renderFacilities(facilityGroup)}
            </MovableView>
          </MovableArea>
          <CircleButton icon={location} onClick={this.onLocationClick} style={{ float: 'left', position: 'fixed', bottom: 108, left: 32 }} />
          <FloorSelector text={`${buildName}·${floorName}`} onClick={this.onSelector} style={{ position: 'absolute', bottom: 104, left: 250 }} />
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
                <VantPicker columns={buildList} bindchange={this.onBuildChange} />
              </View>
              <View className={styles['selector-top-right']}>
                <VantPicker columns={floorList} bindchange={this.onFloorChange} />
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
