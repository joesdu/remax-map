import { Image, View, navigateTo } from 'remax/wechat';

import { AppContext } from '@/app';
import React from 'react';
import { SearchLocation } from '@/service/service';
import VantDropdownItem from '@vant/weapp/dist/dropdown-item';
import VantDropdownMenu from '@vant/weapp/dist/dropdown-menu';
import VantSearch from '@vant/weapp/dist/search';
import deleteImg from '@/assets/delete.svg';
import elevator from '@/assets/elevator.svg';
import escalator from '@/assets/escalator.svg';
import exit from '@/assets/exit.svg';
import noresult from '@/assets/noresult.svg';
import restRoom from '@/assets/restroom.svg';
import styles from './index.module.less';

interface SearchProps {}
interface SearchState {
  range: string;
  floorId: string;
}
class Search extends React.Component<SearchProps, SearchState> {
  static contextType = AppContext;
  constructor(props: Readonly<SearchProps>) {
    super(props);
    this.state = { range: '0', floorId: '' };
  }

  onLoad = (options: any) => {
    let data = JSON.parse(options.current);
    const { floorId } = data;
    this.setState({ floorId });
  };

  private onRangeChange = (dropdown: any) => {
    console.log(dropdown);
    this.setState({ range: dropdown.detail });
  };

  private onSearch = (event: any) => {
    const { range, floorId } = this.state;
    this.context.setGlobal({ searchText: event.detail });
    let args = range === '0' ? { floorId, keywords: event.detail } : { keywords: event.detail };
    SearchLocation(args).then((res: any) => {
      navigateTo({ url: `../searchresult/index?current=${JSON.stringify(res)}` });
    });
  };

  private onRestroom = () => {
    const { floorId } = this.state;
    let args = { floorId, keywords: '卫生间' };
    SearchLocation(args).then((res: any) => {
      navigateTo({ url: `../searchresult/index?current=${JSON.stringify(res)}` });
    });
  };
  private onElevator = () => {
    const { floorId } = this.state;
    let args = { floorId, keywords: '电梯' };
    SearchLocation(args).then((res: any) => {
      navigateTo({ url: `../searchresult/index?current=${JSON.stringify(res)}` });
    });
  };
  private onEscalator = () => {
    const { floorId } = this.state;
    let args = { floorId, keywords: '扶梯' };
    SearchLocation(args).then((res: any) => {
      navigateTo({ url: `../searchresult/index?current=${JSON.stringify(res)}` });
    });
  };
  private onExit = () => {
    const { floorId } = this.state;
    let args = { floorId, keywords: '安全出口' };
    SearchLocation(args).then((res: any) => {
      navigateTo({ url: `../searchresult/index?current=${JSON.stringify(res)}` });
    });
  };

  render() {
    const { range } = this.state;
    const option = [
      { text: '附近', value: '0' },
      { text: '全部', value: '1' }
    ];

    return (
      <View>
        <View className={styles.topSearch}>
          <View className={styles['topSearch-range']}>
            <VantDropdownMenu>
              <VantDropdownItem value={range} options={option} bindchange={this.onRangeChange} />
            </VantDropdownMenu>
          </View>
          <View className={styles['topSearch-search']}>
            <VantSearch use-left-icon-slot placeholder="请输入搜索关键词" bindsearch={this.onSearch} />
          </View>
        </View>
        <View className={styles.fastContainer}>
          <Image className={styles.image} mode="aspectFill" src={restRoom} onClick={this.onRestroom} />
          <Image className={styles.image} mode="aspectFill" src={elevator} onClick={this.onElevator} />
          <Image className={styles.image} mode="aspectFill" src={escalator} onClick={this.onEscalator} />
          <Image className={styles.image} mode="aspectFill" src={exit} onClick={this.onExit} />
        </View>
        <View className={styles.history}>
          <View className={styles['history-left']}>历史搜索记录</View>
          <View className={styles['history-right']}>
            <Image className={styles['history-del']} mode="aspectFill" src={deleteImg} />
          </View>
        </View>
        <View className={styles.historyContainer}>
          <Image className={styles['historyContainer-img']} mode="aspectFill" src={noresult} />
          <View className={styles['historyContainer-text']}>暂无搜索记录</View>
        </View>
      </View>
    );
  }
}

export default Search;
