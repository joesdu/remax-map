import * as React from 'react';

import { Image, View } from 'remax/wechat';

import VanPopup from '@vant/weapp/dist/popup';
import styles from './index.module.less';

export interface FacilityItemProps {
  itemUrl: string;
  itemPoint: [number, number];
}
interface FacilityItemState {
  point: [number, number];
  popShow?: boolean;
  popStyle: string;
}
class FacilityItem extends React.PureComponent<FacilityItemProps, FacilityItemState> {
  constructor(props: Readonly<FacilityItemProps>) {
    super(props);
    this.state = {
      point: [0, 0],
      popShow: false,
      popStyle: 'height:344rpx;background:#FFFFFFFF;box-shadow:0rpx 8rpx 24rpx 0rpx #00000019;border-radius:16rpx;border: 2rpx solid #00000019;margin-bottom:108rpx;width:686rpx;margin-left:32rpx'
    };
  }

  componentDidMount() {
    this.setState({ point: this.props.itemPoint });
  }

  onItemClick = () => {
    this.setState({ popShow: true });
  };

  onClose = () => {
    this.setState({ popShow: false });
  };

  render() {
    const { itemUrl } = this.props;
    const { point, popShow, popStyle } = this.state;
    return (
      <View>
        <View className={styles.facilityItem} style={{ left: `${point[0] - 15}'px'`, top: `${point[1] - 15}'px'` }} onClick={this.onItemClick}>
          <Image className={styles.facilityImage} src={itemUrl} />
        </View>
        <VanPopup overlay={false} round show={popShow} closeable close-icon="close" position="bottom" custom-style={popStyle} bindclose={this.onClose}>
          <View className="">
            <View className="">test</View>
            <View className="">test</View>
          </View>
        </VanPopup>
      </View>
    );
  }
}

export default FacilityItem;
