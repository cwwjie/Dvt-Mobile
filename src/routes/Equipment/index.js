import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Tabs, Modal } from 'antd-mobile';

import MyNavBar from './../../components/MyNavBar/index';
import MyTabBar from './../../components/MyTabBar/index';

import config from './../../config/index';

class Equipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'rentList': [
        // {
        //   "created": 1521796901000,
        //   "updated": null,
        //   "id": 27,
        //   "firstPic": "\\rent\\pic\\5B8062B6D8384D16817B3CF778F7B637.jpg",
        //   "matchedProduct": null,
        //   "title": "按时大大",
        //   "sellPoint": "为分狗头人又好听",
        //   "price": 123123.0,
        //   "num": null,
        //   "cid": 1,
        //   "status": 1,
        //   "clickCount": null,
        //   "isNew": 1,
        //   "itemDesc": "",
        //   "rental": 123.0,
        //   "deposit": 1231.0,
        //   "code": "全文单位沸腾"
        // }
      ]
    };

    this.tabs = [
      { 'title': '全部' },
      { 'title': '水下相机' },
      { 'title': '浮潜装备' },
    ];
  }

  componentDidMount() {
    const _this = this;

    this.getEquipmentProduct()
    .then(json => {
      if (json.result === '0') {
        _this.setState({'rentList': json.data})
      } else {
        Modal.alert('获取租赁商品信息失败', `请求服务器成功, 但是返回的租赁商品信息有误! 原因: ${json.message}`);
      }
    });
  }
  
  // 根据分类id查询该分类下商品
  getEquipmentCartgoryById(id) {
    return fetch(`${config.URLbase}/Dvt-rent-web/rentItem/cartgory/${id}.do`, {
      'method': 'GET',
      'contentType': 'application/json; charset=utf-8'
    }).then(
      response => response.json(),
      error => ({'result': '1', 'message': error})
    ).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求租赁商品信息失败, 原因: ${error}`);
    })
  }

  jumpToDetail(val) {
    this.props.dispatch(routerRedux.push(`/equipment/detail?rentItemId=${val.id}`));
  }

  getEquipmentProduct() {
    return fetch(`${config.URLbase}/Dvt-rent-web/rentItem.do`, {
      'method': 'GET',
      'contentType': 'application/json; charset=utf-8'
    }).then(
      response => response.json(),
      error => ({'result': '1', 'message': error})
    ).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求租赁商品信息失败, 原因: ${error}`);
    })
  }

  renderProduct() {
    if (this.state.rentList.length > 0) {
      return this.state.rentList.map((val, key) => {
        return (
          <div 
            key={key}
            className="Equipment-item" 
            onClick={() => this.jumpToDetail(val)}
          >
            <div className="item-content">
              <div className="item-img">
                <img src={ val.firstPic ? `${config.URLbase}${val.firstPic}` : ''}/>
              </div>
              <div className="item-description">
                <div className="description-title">{val.title}</div>
              </div>
            </div>
            <div className="item-line" />
          </div>
        )
      });
    }
  }


  render() {
    return (
      <div className="Equipment">
        <MyNavBar navName='设备租赁' />

        <div className="Equipment-navigation">
          <Tabs tabs={this.tabs} initialPage={0} animated={false} useOnPan={false}>
            <div>
              {this.renderProduct.call(this)}
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
