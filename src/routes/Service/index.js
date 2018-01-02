import React, {Component} from 'react';
import { connect } from 'dva';
import { List, WhiteSpace, Modal } from 'antd-mobile';

import MyNavBar from './../../components/MyNavBar/index';
import MyTabBar from './../../components/MyTabBar/index';
import CustomerNode from './../../components/CustomerNode/index';

class CustomerService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popWeche: false,
      popcompany: false,
    }
  }

  render() {
    return (
      <div className="CustomerService">
        <MyNavBar
          navName='客服中心'
        />

        <CustomerNode/>

        <MyTabBar
          selectedTab='Service'
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(CustomerService);
