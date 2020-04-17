import { ScrollView, View, redirectTo, getSystemInfo } from 'remax/wechat';

import { DelFavor, FavoriteList } from '@/service/service';
import React from 'react';
import ResultItem from '@/components/resultItem';
import styles from './index.module.less';

export interface FavoriteProps {}
interface FavoriteState {
  scrollHight: number;
  manageTxt: string;
  isManage: boolean;
  favorites: Array<any>;
}
class Favorite extends React.Component<FavoriteProps, FavoriteState> {
  constructor(props: Readonly<FavoriteProps>) {
    super(props);
    this.state = {
      scrollHight: 500,
      manageTxt: '管理',
      isManage: false,
      favorites: []
    };
  }

  onShow() {
    FavoriteList().then((res: any) => {
      this.setState({ favorites: res });
    });
    getSystemInfo().then((res: any) => {
      const { screenHeight } = res;
      this.setState({ scrollHight: screenHeight });
    });
  }

  private onManage = () => {
    const { isManage } = this.state;
    if (isManage) this.setState({ isManage: false, manageTxt: '管理' });
    else this.setState({ isManage: true, manageTxt: '完成' });
  };

  private onFavorItemClick = (record: any) => {
    const { isManage } = this.state;
    console.log(record);
    if (isManage) {
      DelFavor({ facilityId: record.facilityId }).then(() => {
        FavoriteList().then((res: any) => {
          this.setState({ favorites: res });
        });
      });
    } else {
      redirectTo({ url: `../main/index?current=${JSON.stringify(record)}&from=favorite` });
    }
  };

  renderFavorItem = () => {
    const { favorites, isManage } = this.state;
    let tp: Array<any> = [];
    for (let index: number = 0, item: any; (item = favorites[index++]); ) {
      tp.push(<ResultItem key={index - 1} isDel={isManage} title={item.facilityName} subTitle={`${item.projectName}-${item.buildName}-${item.floorName}`} onClick={this.onFavorItemClick.bind(this, item)}></ResultItem>);
    }
    return tp;
  };

  render() {
    const { manageTxt, favorites, scrollHight } = this.state;

    return (
      <View>
        <View className={styles.topContainer}>
          <View>{favorites.length}个收藏</View>
          <View onClick={this.onManage}>{manageTxt}</View>
        </View>
        <ScrollView style={{ height: `${scrollHight}px`, width: '100vw' }}>{this.renderFavorItem()}</ScrollView>
      </View>
    );
  }
}

export default Favorite;
