import React, {Component} from 'react';
import { connect } from 'dva';
import { Toast, WhiteSpace, WingBlank, List } from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';


class DetailTravel extends Component {
  constructor(props) {
    super(props);

    this.productId = window.location.hash.substring(31, window.location.hash.length);
    this.returnURL = `/home/detail?productId=${this.productId}`;

    this.state = {
      productRoute: [
        // {
        //   createBy: 23,
        //   createTime: 1485285336000,
        //   isDelete: "N",
        //   productId: 64,
        //   tripBrief: "初次遇见 天然小岛 邦邦",
        //   tripDay: 1,
        //   tripDesc: "<p>天然小岛详细详细</p>",
        //   tripEvent: "初次遇见 天然小岛 邦邦",
        //   tripId: 570,
        //   tripPlace: "邦邦龙珠",
        //   updateBy: null,
        //   updateTime: null
        // }
      ]
    }
  }

  componentDidMount() {
    this.getTrip.call(this);
  }

  getTrip() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/trip/findByProductId.do?productId=${_this.productId}`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          _this.setState({
            'productRoute': json.data
          });
          resolve();
        }else {
          Toast.fail(`套餐行程请求数据有误，原因 ${json.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`套餐行程请求失败，原因 ${error}`, 3);
        reject();
      })
    })
  }

  render() {
    
    return (
      <div className="HomeDetail">
        <MyNavBar
          navName='套餐行程'
          returnURL={this.returnURL}
        />

        {this.state.productRoute.map((product, key) => (
          <div key={key}>
            <WhiteSpace size="lg" />
            <WingBlank size="md">第{(key+1)}天 {product.tripBrief}</WingBlank>
            <WhiteSpace size="lg" />
            <List>
              <div className="detail-list">
                <div className="list-attrValue" dangerouslySetInnerHTML={{__html:product.tripDesc}}/>
              </div>
            </List>
          </div>
        ))}

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(DetailTravel);
