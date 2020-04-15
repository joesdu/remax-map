import { ScrollView, View } from 'remax/wechat';

import React from 'react';
import ResultItem from '@/components/resultItem';
import styles from './index.module.less';

export interface FavoriteProps {}
interface FavoriteState {
  manageTxt: string;
  isManage: boolean;
  favorites: Array<any>;
}
class Favorite extends React.Component<FavoriteProps, FavoriteState> {
  constructor(props: Readonly<FavoriteProps>) {
    super(props);
    this.state = {
      manageTxt: '管理',
      isManage: false,
      favorites: []
    };
  }

  onManage = () => {
    const { isManage } = this.state;
    if (isManage) this.setState({ isManage: false, manageTxt: '管理' });
    else this.setState({ isManage: true, manageTxt: '完成' });
  };

  onFavorItemClick = (record: any) => {
    const { isManage } = this.state;
    if (isManage) {
      // TODO 为True即为删除
      console.log(record);
    } else {
      // TODO 非True即为点击跳转
    }
  };

  renderFavorItem = () => {
    const { favorites, isManage } = this.state;
    let tp: Array<any> = [];
    for (let index: number = 0, item: any; (item = favorites[index++]); ) {
      tp.push(<ResultItem key={index - 1} isDel={isManage} title={item.facilityName} subTitle={`${item.projectName}-${item.floorName}`} onClick={this.onFavorItemClick.bind(this, item)}></ResultItem>);
    }
    return tp;
  };

  render() {
    const { manageTxt } = this.state;

    return (
      <View>
        <View className={styles.topContainer}>
          <View>{}个收藏</View>
          <View onClick={this.onManage}>{manageTxt}</View>
        </View>
        <ScrollView style={{}}>{this.renderFavorItem()}</ScrollView>
      </View>
    );
  }
}

export default Favorite;
