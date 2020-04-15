import { Image, Text, View } from 'remax/wechat';

import React from 'react';
import styles from './index.module.less';

export interface FavoriteProps {}
interface FavoriteState {}
class Favorite extends React.Component<FavoriteProps, FavoriteState> {
  constructor(props: Readonly<FavoriteProps>) {
    super(props);
    this.state = {};
  }
  render() {
    return <View></View>;
  }
}

export default Favorite;
