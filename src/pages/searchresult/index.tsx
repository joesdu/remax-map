import { ScrollView, redirectTo } from 'remax/wechat';

import React from 'react';
import ResultItem from '@/components/resultItem';

export interface SearchResultProps {
  location: any;
}

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

  componentDidMount() {
    let data = JSON.parse(this.props.location.query.current);
    console.log('searchData:', data.result);
    this.setState({ results: data.result });
  }

  onShow(options: any) {
    console.log('onShow', options);
  }

  onGotoClick = (record: any) => {
    console.log(record);
    redirectTo({ url: '../main/index?current=' + JSON.stringify(record) + '&from=searchresult' });
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
