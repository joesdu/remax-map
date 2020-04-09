import { Image, Text, View } from 'remax/wechat';

import React from 'react';
import VanPopup from '@vant/weapp/dist/popup';
import favorite from '@/assets/favorite.svg';
import notfavorite from '@/assets/notfavorite.svg';
import share from '@/assets/share.svg';
import styles from './index.module.less';

export interface TestItemData {
  facilityId: string;
  avatar: string;
  point: [number, number];
  name: string;
  address: string;
  isFavorite: boolean;
  shareData: any;
}
export interface TestItemProps {
  itemUrl?: string;
  data: any;
  key?: any;
}
interface TestItemState {
  popShow?: boolean;
  popStyle: string;
  keep: boolean;
}
class TestItem extends React.PureComponent<TestItemProps, TestItemState> {
  constructor(props: Readonly<TestItemProps>) {
    super(props);
    this.state = {
      popShow: false,
      popStyle: 'background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx',
      keep: false
    };
  }

  componentDidMount() {
    this.setState({ keep: this.props.data.isFavorite });
  }

  onItemClick = () => {
    this.setState({ popShow: true });
  };

  onClose = () => {
    this.setState({ popShow: false });
  };

  onFavorite = () => {
    // Todo do favorite action
    const {
      data: { isFavorite, facilityId }
    } = this.props;
    const { keep } = this.state;
    console.log(isFavorite, facilityId);
    this.setState({ keep: !keep });
  };

  onShare = () => {
    // Todo do share action
    const {
      data: { shareData, facilityId }
    } = this.props;
    console.log(shareData, facilityId);
  };

  render() {
    const {
      data: { point, avatar, name, address },
      itemUrl
    } = this.props;
    const { popShow, popStyle, keep } = this.state;
    return (
      <View>
        <View className={styles.facilityItem} style={{ left: `${point[0] - 15}px`, top: `${point[1] - 15}px` }} onClick={this.onItemClick}>
          <Image className={styles['facility-img']} src={itemUrl ? itemUrl : avatar} />
          <Text className={styles['facility-name']}>{name}</Text>
        </View>
        <VanPopup overlay={false} round show={popShow} closeable close-icon="close" position="bottom" custom-style={popStyle} bindclose={this.onClose}>
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
        </VanPopup>
      </View>
    );
  }
}

export default TestItem;
