import React from 'react';
import ResultItem from '@/components/resultItem';
import { ScrollView } from 'remax/wechat';

export interface SearchResultProps {}

interface SearchResultState {
  results: Array<any>;
}
class SearchResult extends React.Component<SearchResultProps, SearchResultState> {
  constructor(props: Readonly<SearchResultProps>) {
    super(props);
    this.state = {
      results: []
    };
  }
  onShow(options: any) {
    console.log('onShow', options);
  }

  onGotoClick = (record: any) => {
    console.log(record);
  };

  renderResultItem = () => {
    const { results } = this.state;
    let tp: Array<any> = [];
    for (let index: number = 0, item: any; (item = results[index++]); ) {
      tp.push(<ResultItem key={index - 1} title={item.facilityName} subTitle={`${item.projectName}-${item.floorName}`} onClick={this.onGotoClick.bind(this, item)}></ResultItem>);
    }
    return tp;
  };

  render() {
    return (
      <ScrollView scrollY style={{ height: '100vh', width: '100vw' }}>
        {this.renderResultItem()}
      </ScrollView>
    );
  }
}

export default SearchResult;
