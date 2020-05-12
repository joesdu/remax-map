import { AppContext, ContextProps } from '@/app';
import { DelFavor, FavoriteList } from '@/service';
import { ScrollView, View, redirectTo, vibrateShort } from 'remax/wechat';

import React from 'react';
import ResultItem from '@/components/resultItem';
import styles from './index.less';

export interface FavoriteProps {
  location: any;
}
interface FavoriteState {
  scrollHight: number;
  manageTxt: string;
  isManage: boolean;
  favorites: Array<any>;
}
class Favorite extends React.Component<FavoriteProps, FavoriteState> {
  static contextType: React.Context<Partial<ContextProps>> = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: Readonly<FavoriteProps>) {
    super(props);
    this.state = {
      scrollHight: 500,
      manageTxt: '管理',
      isManage: false,
      favorites: []
    };
  }

  onShow = (): void => {
    console.info('Favorite On Show');
    FavoriteList()
      .then((res: any) => this.setState({ favorites: res.result }))
      .catch((error) => console.warn(error));
    this.setState({ scrollHight: this.context.global?.systemInfo?.screenHeight! });
  };

  private onManage = (): void => {
    vibrateShort();
    const { isManage } = this.state;
    if (isManage) this.setState({ isManage: false, manageTxt: '管理' });
    else this.setState({ isManage: true, manageTxt: '完成' });
  };

  private onFavorItemClick = (record: any): void => {
    vibrateShort();
    const { isManage } = this.state;
    if (isManage)
      DelFavor({ facilityId: record.facilityId })
        .then(() => FavoriteList().then((res: any) => this.setState({ favorites: res })))
        .catch((error) => console.warn(error));
    else redirectTo({ url: `../main/index?current=${JSON.stringify(record)}&from=favorite` });
  };

  renderFavorItem = (): Array<any> => {
    const { favorites, isManage } = this.state;
    let tp: Array<any> = [];
    for (let index: number = 0, item: any; (item = favorites[index++]); ) {
      tp.push(<ResultItem key={index} isDel={isManage} title={item.facilityName} subTitle={`${item.projectName}-${item.buildName}-${item.floorName}`} onClick={this.onFavorItemClick.bind(this, item)}></ResultItem>);
    }
    return tp;
  };

  render(): JSX.Element {
    const { manageTxt, favorites, scrollHight } = this.state;

    return (
      <View>
        <View className={styles.topContainer}>
          <View>{favorites ? favorites.length : 0} 个收藏</View>
          <View onClick={this.onManage}>{manageTxt}</View>
        </View>
        <ScrollView style={{ height: `${scrollHight}px`, width: '100vw' }}>{this.renderFavorItem()}</ScrollView>
      </View>
    );
  }
}

export default Favorite;
