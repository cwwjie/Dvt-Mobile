import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Tabs } from 'antd-mobile';

import MyNavBar from './../../components/MyNavBar/index';
import MyTabBar from './../../components/MyTabBar/index';

class Equipment extends Component {
  constructor(props) {
    super(props);

    this.tabs = [
      { 'title': '全部' },
      { 'title': '水下相机' },
      { 'title': '浮潜装备' },
    ];
  }

  jumpToDetail() {
    this.props.dispatch(routerRedux.push('/equipment/detail'));
  }

  render() {
    return (
      <div className="Equipment">
        <MyNavBar navName='设备租赁' />

        <div className="Equipment-navigation">
          <Tabs tabs={this.tabs} initialPage={0} animated={false} useOnPan={false}>
            <div>
              <div className="Equipment-item" onClick={this.jumpToDetail.bind(this)}>
                <div className="item-content">
                  <div className="item-img"><img src="null"/></div>
                  <div className="item-description">
                    12321321321
                  </div>
                </div>
                <div className="item-line" />
              </div>
              <div className="Equipment-item" onClick={this.jumpToDetail.bind(this)}>
                <div className="item-content">
                  <div className="item-img"><img src="null"/></div>
                  <div className="item-description">
                    12321321321
                  </div>
                </div>
                <div className="item-line" />
              </div>
            </div>
            <div>
              Content of second tab
            </div>
            <div>
              Content of third tab
            </div>
          </Tabs>
        </div>

        <MyTabBar selectedTab='Equipment' />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Equipment);
