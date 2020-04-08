import React, { Component } from 'react';
import { getImageInfo, wheel } from '@/utils/utils';
import { View, Image, MovableArea, MovableView } from 'remax/wechat';

import FacilityItem from '@/components/facilityItem';
import styles from './index.module.less';
import floormap from '@/assets/floormap.svg';

interface FacilitiesState {
  mapWidth: number;
  mapHeight: number;
}
class Facilities extends Component<{}, FacilitiesState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      mapWidth: 0,
      mapHeight: 0
    };
  }

  private drawings = floormap;

  componentWillMount() {
    this.initSetting(this.drawings);
  }

  private initSetting = (url: string) => {
    // 1.获取图片的宽高
    getImageInfo(url).then((res) => {
      const { width: mapWidth, height: mapHeight } = res;
      // 2.设置容器的宽高
      this.setState({ mapWidth, mapHeight });
    });
  };

  // 渲染网关下的设备
  //   private renderFacilities = (facilityGroup: Array<any>) => {
  //     const tpl = [];
  //     if (facilityGroup && facilityGroup.length > 0) {
  //       const { scaleNum } = this.state;
  //       for (let index: number = 0, item: any; (item = facilityGroup[index++]); ) {
  //         tpl.push(
  //           <FacilityItem
  //             data={item}
  //             key={item.id || index}
  //             scale={scaleNum as number}
  //           />
  //         );
  //       }
  //     }
  //     return tpl;
  //   };

  render() {
    const { mapWidth, mapHeight } = this.state;

    return (
      <View>
        <MovableArea style={{ height: '100%', width: '100%' }}>
          <MovableView scale direction="all" style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}>
            <Image className={styles['floor-map-drawings']} src={this.drawings} />
            {/* {this.renderFacilities(facilityGroup)} */}
          </MovableView>
        </MovableArea>
      </View>
    );
  }
}

export default Facilities;
