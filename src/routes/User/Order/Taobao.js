import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SwitchBolck from './../../../components/UserSame/SwitchBolck';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import convertDate from './../../../utils/convertDate';

import { Toast, Modal } from 'antd-mobile';

// orderList = [{
//   'adultNum': 2,
//   'belongId': 33,
//   'calMethod': "123412",
//   'checkIn': 1514649600000,
//   'checkOut': 1514736000000,
//   'childNum': 0,
//   'confirmStatus': null,
//   'createBy': 33,
//   'createTime': 1512926229000,
//   'customCode': "AAADD",
//   'discount': 100,
//   'infoId': null,
//   'insuranceBegin': null,
//   'insuranceEnd': null,
//   'isBX': "N",
//   'isComplete': "N",
//   'isConfirmed': "N",
//   'isLocked': "Y",
//   'isValid': "Y",
//   'kidsAge': "",
//   'linkId': 192,
//   'notPayAmount': 9800,
//   'operationStatus': 0,
//   'orderAmount': 9900,
//   'orderDesc': "123123",
//   'orderName': "园景房",
//   'orderSn': "AAADD",
//   'orderSrc': "TB",
//   'payAmount': 100,
//   'payStatus': 2,
//   'peopleNum': 2,
//   'pinyinName': "LianJieShu",
//   'present': "",
//   'productAmount': 10000,
//   'remark': null,
//   'roomNum': 1,
//   'serialNumber': null,
//   'signName': "连接数",
//   'submitTime': null,
//   'template': 1,
//   'transfersInfo': "",
//   'uniqueKey': "a98afa21-3808-43d4-b2e3-522c8e4b388f",
//   'updateBy': 33,
//   'updateTime': 1514398638000,
//   'userId': 106,
// }]

class Taobao extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderList: [],
    };

    this.getOrderList.bind(this);
    this.jumpTotaobaoInfor.bind(this);
  }

  componentDidMount() {
    this.getOrderList(1, 0);
  }

  getOrderList(pageNum, pageSize) {
    fetch(`${config.URLversion}/gather/link/${pageNum ? pageNum : 1}/${pageSize ? pageSize : 10}/listOrder.do`, {
      'method': "GET",
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
    }}).then(
      (response) => (response.json()),
      (error) => ({'result': 1, 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        this.setState({
          'orderList': json.data.list
        });
      } else {
        Modal.alert('请求订单出错', `向服务器发起请求订单失败, 原因: ${json.message}`);
      }
    }).catch((error) => {
      Modal.alert('请求订单出错', `向服务器发起请求订单失败, 原因: ${error}`);
    })
  }

  jumpTotaobaoInfor(taobaoItem) {
    localStorage.setItem('_token', cookies.getItem('token'));
    localStorage.setItem('_digest', cookies.getItem('digest'));
    localStorage.setItem('_uniqueKey', taobaoItem.uniqueKey);
    localStorage.setItem('loginSuccessful', JSON.stringify(taobaoItem));

    window.location.href = './../info/mobile/index.html' ;
  }

  render() {
    const _this = this;

    return (
      <div className="Order-taobao">
        <MyNavBar
          navName='淘宝订单'
          returnURL='/user/index'
        />

        <SwitchBolck
          isFirstActive={false}
          firstName='商城订单'
          otherName='淘宝订单'
          jumpToUrl='/user/order/index'
        />

        {this.state.orderList.map((val, key) => (
          <div 
            onClick={() => _this.jumpTotaobaoInfor(val)}
            className='taobao-item' 
            key={key}
          >
            <div className='item-title'>
              订单号:{val.orderSn}
              <span>状态: {val.payStatus === 1 ? '已付全款' : '已付定金'}</span>
            </div>
            <div className='item-List'>
              <div>{val.orderName}</div>
              <div>{val.orderDesc}</div>
              <div className='List-span'>
                {convertDate.dateToFormat(new Date(val.checkIn) )}
                到
                {convertDate.dateToFormat(new Date(val.checkOut) )}
                <span>{val.roomNum}间房 / {val.adultNum} 成人 / {val.childNum}儿童</span>
              </div>
              <div>产品总金额: {val.productAmount}RMB</div>
              <div className='List-span'>优惠金额: {val.discount}RMB<span>订单总金额: {val.orderAmount}RMB</span></div>
            </div>
            <div className='item-btn'>
              {val.infoId ? <div className='btn-normal'>查看信息</div> : <div className='btn-primary'>填写出行信息</div>}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default Taobao;
