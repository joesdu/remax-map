import { Image, View, getImageInfo } from 'remax/wechat';

import { AppContext } from '@/app';
import React from 'react';
import styles from './index.less';
import testImg from '@/assets/test.svg';

export interface TestPageProps {
  location: any;
}
interface TestPageState {
  scaleNum?: number;
  mapWidth?: number;
  mapHeight?: number;
  transformOriginX?: number;
  transformOriginY?: number;
  transition?: string;
  offsetX?: number;
  offsetY?: number;
  drawings: string;
}
class TestPage extends React.Component<TestPageProps, TestPageState> {
  static contextType = AppContext;

  constructor(props: Readonly<TestPageProps>) {
    super(props);
    this.state = {
      scaleNum: 1,
      mapWidth: 0,
      mapHeight: 0,
      transformOriginX: 0,
      transformOriginY: 0,
      transition: '.2s',
      offsetX: 100,
      offsetY: 100,
      drawings: ''
    };
  }

  onShow = () => {
    getImageInfo({ src: testImg }).then((res: WechatMiniprogram.GetImageInfoSuccessCallbackResult) => {
      const { width, height } = res;
      this.setState({ mapWidth: width, mapHeight: height, drawings: testImg });
    });
  };

  private onLoadImg = (event: any) => {
    const { width: mapWidth, height: mapHeight } = event.detail;
    const transformOriginX = mapWidth / 2;
    const transformOriginY = mapHeight / 2;
    let scaleNum = 0.5;
    const offsetX = 0;
    let offsetY = 0;
    this.setState({ mapWidth, mapHeight, scaleNum, transformOriginX, transformOriginY, offsetX, offsetY });
  };

  private oriX: number = 0;
  private oriY: number = 0;

  private onWrapTouchStart = (event: any) => {
    console.log('onWrapTouchStart', event);
    const { clientX: oriX, clientY: oriY } = event.touches[0];
    this.oriX = oriX;
    this.oriY = oriY;
    this.setState({ transition: 'none' });
  };

  private count: number = 0;

  private onWrapTouchMove = (event: any) => {
    this.count += 1;
    if (this.count > 5) {
      console.log('onWrapTouchMove', event);
      const { screenHeight, screenWidth } = this.context.global.systemInfo;
      const { offsetX, offsetY, scaleNum } = this.state;
      const { clientX: nowX, clientY: nowY } = event.touches[0];
      let x = offsetX;
      let y = offsetY;
      // x = (nowX - this.oriX) / scaleNum! + offsetX!;
      // y = (nowY - this.oriY) / scaleNum! + offsetY!;
      x = nowX - this.oriX;
      y = nowY - this.oriY;
      this.setState({
        // transformOriginX: screenWidth! / 2 - x, transformOriginY: screenHeight! / 2 - y,
        offsetX: x,
        offsetY: y
        // scaleNum
      });
      this.count = 0;
    }
  };

  private onWrapTouchEnd = (event: any) => {
    console.log('onWrapTouchEnd', event);
    this.setState({ transition: '0.2s transform linear' });
  };

  render() {
    const { drawings } = this.state;
    const { mapWidth, mapHeight, offsetX, offsetY, scaleNum, transformOriginX, transformOriginY, transition } = this.state;

    return (
      <View className={styles.floor}>
        <View className={styles['floor-wrap']} onTouchStart={this.onWrapTouchStart} onTouchMove={this.onWrapTouchMove} onTouchEnd={this.onWrapTouchEnd}>
          <View
            className={styles['floor-container']}
            style={{
              top: offsetY,
              left: offsetX
              // transform: `translate(${offsetX}px,${offsetY}px) scale(${scaleNum})`
              // transformOrigin: `${transformOriginX}px ${transformOriginY}px`
            }}
          >
            <View className={styles['floor-map']} style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}>
              <Image className={styles['floor-map-drawings']} style={{}} src={drawings} onLoad={this.onLoadImg} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default TestPage;
