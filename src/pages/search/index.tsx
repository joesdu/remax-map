import { DeleteIcon, ElevatorIcon, EscalatorIcon, ExitIcon, NoResultIcon, RestroomIcon } from '@/assets/icons';
import { Image, View, navigateTo } from 'remax/wechat';

import { AppContext } from '@/app';
import React from 'react';
import { SearchLocation } from '@/service';
import VantDropdownItem from '@vant/weapp/dist/dropdown-item';
import VantDropdownMenu from '@vant/weapp/dist/dropdown-menu';
import VantSearch from '@vant/weapp/dist/search';
import styles from './index.module.less';

export interface SearchProps {
  location: any;
}
interface SearchState {
  range: string;
  floorId: string;
}
class Search extends React.Component<SearchProps, SearchState> {
  static contextType = AppContext;

  constructor(props: Readonly<SearchProps>) {
    super(props);
    this.state = {
      range: '0',
      floorId: ''
    };
  }

  componentDidMount() {
    let data = JSON.parse(this.props.location.query.current);
    const { floorId } = data;
    this.setState({ floorId });
  }

  private onRangeChange = (dropdown: any) => this.setState({ range: dropdown.detail });

  private onSearch = (event: any) => {
    const { range, floorId } = this.state;
    this.context.setGlobal({ searchText: event.detail });
    let args = range === '0' ? { floorId, keywords: event.detail } : { keywords: event.detail };
    this.LocationSearch(args);
  };

  private Search = (keywords: string) => this.LocationSearch({ floorId: this.state.floorId, keywords });

  private LocationSearch = (args: any) => SearchLocation(args).then((res: any) => navigateTo({ url: `../searchresult/index?current=${JSON.stringify(res)}` }));

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
          <Image className={styles.image} mode="aspectFill" src={RestroomIcon} onClick={this.Search.bind(this, '卫生间')} />
          <Image className={styles.image} mode="aspectFill" src={ElevatorIcon} onClick={this.Search.bind(this, '电梯')} />
          <Image className={styles.image} mode="aspectFill" src={EscalatorIcon} onClick={this.Search.bind(this, '扶梯')} />
          <Image className={styles.image} mode="aspectFill" src={ExitIcon} onClick={this.Search.bind(this, '出入口')} />
        </View>
        <View className={styles.history}>
          <View className={styles['history-left']}>历史搜索记录</View>
          <View className={styles['history-right']}>
            <Image className={styles['history-del']} mode="aspectFill" src={DeleteIcon} />
          </View>
        </View>
        <View className={styles.historyContainer}>
          <Image className={styles['historyContainer-img']} mode="aspectFill" src={NoResultIcon} />
          <View className={styles['historyContainer-text']}>暂无搜索记录</View>
        </View>
      </View>
    );
  }
}

export default Search;
