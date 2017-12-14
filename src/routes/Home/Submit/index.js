import React, {Component} from 'react';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';


class DetailTravel extends Component {
  constructor(props) {
    super(props);

    this.product = JSON.parse(localStorage.getItem('product'));

    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    
    return (
      <div className="Home-Submit">
        <MyNavBar
          navName='套餐行程'
          returnURL={this.returnURL}
        />

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(DetailTravel);
