import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';

import config from './../../../config';
import convertDate from './../../../utils/convertDate';

import { Toast, Modal } from 'antd-mobile';

class VillageSubmit extends Component {
  constructor(props) {
    super(props);

    this.product = JSON.parse(localStorage.getItem('VillageProduct'));

    this.state = {}
    
  }

  render() {
    return (
      <div className="Village-Submit">
        <MyNavBar
          navName='预定度假村'
          returnURL='/village/index'
        />
      </div>
    )
  }
}


export default connect()(VillageSubmit);
