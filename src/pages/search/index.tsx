import { Image, View } from 'remax/wechat';

import React from 'react';
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
}
class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: Readonly<SearchProps>) {
    super(props);
    this.state = {
      range: '0'
    };
  }

  onRangeChange = (dropdown: any) => {
    console.log(dropdown);
    this.setState({ range: dropdown.detail });
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
            <VantSearch use-left-icon-slot placeholder="请输入搜索关键词"></VantSearch>
          </View>
        </View>
        <View className={styles.fastContainer}>
          <Image className={styles.image} mode="aspectFill" src={restRoom}></Image>
          <Image className={styles.image} mode="aspectFill" src={elevator}></Image>
          <Image className={styles.image} mode="aspectFill" src={escalator}></Image>
          <Image className={styles.image} mode="aspectFill" src={exit}></Image>
        </View>
        <View className={styles.history}>
          <View className={styles['history-left']}>历史搜索记录</View>
          <View className={styles['history-right']}>
            <Image className={styles['history-del']} mode="aspectFill" src={deleteImg}></Image>
          </View>
        </View>
        <View className={styles.historyContainer}>
          <Image className={styles['historyContainer-img']} mode="aspectFill" src={noresult}></Image>
          <View className={styles['historyContainer-text']}>暂无搜索记录</View>
        </View>
      </View>
    );
  }
}

export default Search;
