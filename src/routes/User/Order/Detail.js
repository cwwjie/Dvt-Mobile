import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import convertDate from './../../../utils/convertDate';

import { Toast, Modal, List, WhiteSpace } from 'antd-mobile';
const Item = List.Item;

// orderItem = {
//   cancelTime: null,
//   city: 0,
//   consignee: null,
//   countDown: 241802,
//   departureDate: 1514217600000,
//   discount: 0,
//   discountRate: 1,
//   district: 0,
//   earnest: 0.01,
//   haveDays: 1,
//   isDelete: "N",
//   leaveDate: 1514304000000,
//   mobile: null,
//   orderAmount: 1200,
//   orderDesc: "卡帕莱2天1晚 —— 沙滩木屋2成人0儿童",
//   orderId: 3293,
//   orderName: "卡帕莱2天1晚",
//   orderSn: "DVT20171226163407264001",
//   orderStatus: 3,
//   orderTime: 1514248447000,
//   orderType: "C",
//   payInfoId: 140,
//   productAmount: 1200,
//   province: 0,
//   refundTime: null,
//   reserveTime: 1514248447000,
//   street: null,
//   telephone: null,
//   userId: 106,
//   zipcode: null,
//   orderItemList: [
//     {
//       adultNum: 2,
//       adultUnitPrice: 600,
//       apartment: "沙滩木屋",
//       apartmentNum: 1,
//       bedType: "大床",
//       childNum: 0,
//       childUnitPrice: 300,
//       isAvePrice: "N",
//       itemType: "apartment",
//       orderId: 3293,
//       orderItemId: 140,
//       peopleNum: 2,
//       period: 2,
//       productBrief: "卡帕莱沙滩木屋描述",
//       productId: 3,
//       productImg: "/source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg",
//       productName: "沙滩木屋",
//       productNum: 1,
//       productPrice: 1200,
//       productSn: "KPLstmw",
//       productThumb: "/source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg",
//       promotePrice: 0,
//     }
//   ],
//   paymentInfo: {
//     notPayAmount: 1200,
//     payAmount: 0,
//     payInfoId: 140,
//     payName: null,
//     payStatus: 0,
//     payTime: null,
//   },
// }

class Order extends Component {
  constructor(props) {
    super(props);

    this.orderItem = localStorage.getItem('order-detail') ? JSON.parse(localStorage.getItem('order-detail')) : alert('数据有误!');

    this.state = {
      orderUserinfo: [
        // {
        //   'age': 26,
        //   'birthday': "1992-10-31",
        //   'chineseName': "曾杰杰",
        //   'divingCount': null,
        //   'divingRank': null,
        //   'email': "454766952@qq.com",
        //   'gender': 0,
        //   'mobile': "15976713287",
        //   'orderId': 3293,
        //   'passportNo': null,
        //   'pinyinName': "Rejiejay",
        //   'relId': 261
        // }
      ],
    };

    this.paycCustomizeBy.bind(this);
  }

  componentDidMount() {
    const _this = this;

    this.request(`${config.URLversion}/order/orderUserinfo/findByOrderId.do?orderId=${this.orderItem.orderId}`)
    .then((json) => {
      if (json.result === '0') {
        this.setState({
          'orderUserinfo': json.data
        });
      } else {
        Modal.alert('请求订单出错', `向服务器发起请求订单失败, 原因: ${json.message}`);
      }
    })
  }

  request(Url) {
    return fetch(Url, {
      'method': "GET",
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
    }}).then(
      (response) => (response.json()),
      (error) => ({'result': 1, 'message': error})
    ).catch((error) => {
      Modal.alert('请求订单出错', `向服务器发起请求订单失败, 原因: ${error}`);
      Toast.hide();
    })
  }

  orderStatus() {
    const status = this.orderItem.orderStatus,
      countDown = this.orderItem.countDown;

    if (status === 1) {
      return '预订中、24小时内将会有客服联系您'
    }else if (status === 2) {
      return '预订失败'
    }else if (status === 3) {
      return countDown ? '预订成功、待付款' : '预订失败、订单已超时';
    }else if (status === 4) {
      return '退订成功、已取消'
    }else if (status === 5) {
      return '未按期支付，订单交易失败'
    }else if (status === 6) {
      return '支付成功、已完成'
    }else if (status === 7) {
      return '申请退款'
    }else if (status === 8) {
      return '退款成功'
    }else if (status === 9) {
      return '退款失败'
    }else if (status === 10) {
      return '待付尾款'
    }
  }

  InfodivingRank(Rank) {
    if (Rank === 1) {
      return 'OW级别'
    }else if(Rank === 2) {
      return 'AOW级别以上'
    }else {
      return '未填写'
    }
  }

  cancelOrder() {
    const _this = this;
    Modal.alert('请确认', '确认取消订单?', [{
      text: '确定',
      onPress: () => {
        _this.request(`${config.URLversion}/order/id/${_this.orderItem.orderId}/cancelOrder.do`)
        .then((val) => {
          if (val.result === '0') {
            Modal.alert('成功', '订单成功取消', [{
              text: '确定',
              onPress: () => {
                _this.props.dispatch(routerRedux.push('/user/order/index'));
              },
              style: 'default'
            }]);
          } else {
            Modal.alert('订单取消失败', `请求服务器成功发起, 但是订单取消失败, 原因: ${val.message}`);
          }
        })
      },
      style: 'default'
    },{
      text: '取消',
      style: 'default'
    }]);
  }

  payPackageOrders() {

    Toast.loading('正在提交...');
    fetch(`${config.URLversion}/payment/alipayMob.do?orderId=${this.orderItem.orderId}`, {
      'method': "GET",
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
    }}).then(
      response => response.text(),
      error => `FAILED: ${error}`
    ).then(val => {
      Toast.hide();
      if (val.indexOf("FAILED") !== -1) {
        Modal.alert('支付失败', `服务器发起成功, 但是订单有误, 原因: ${val.slice(val.indexOf(':'))}`);
      } else {
        document.getElementById('root').innerHTML = val;
        document.getElementById('alipaysubmit').submit();
      }
    }).catch(error => Modal.alert('请求支付出错', `向服务器发起请求订单支付失败, 原因: ${error}`));
  }

  paycCustomizeBy(Type) { // Type F:全款，E:定金，R:余款

    Toast.loading('正在提交...');
    fetch(`${config.URLversion}/payment/${this.orderItem.orderSn}/${Type}/alipay4Custom.do?dev=Mobile`, {
      'method': "GET",
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
    }}).then(
      response => response.text(),
      error => `FAILED: ${error}`
    ).then(val => {
      Toast.hide();
      if (val.indexOf("FAILED") !== -1) {
        Modal.alert('支付失败', `服务器发起成功, 但是订单有误, 原因: ${val.slice(val.indexOf(':'))}`);
      } else {
        document.getElementById('root').innerHTML = val;
        document.getElementById('alipaysubmit').submit();
      }
    }).catch(error => Modal.alert('请求支付出错', `向服务器发起请求订单支付失败, 原因: ${error}`));
  }

  refundOrders() {
    const _this = this;
    Modal.alert('请确认', '确认申请退款?', [{
      text: '确定',
      onPress: () => {
        _this.request(`${config.URLversion}/order/id/${_this.orderItem.orderId}/refund.do`)
        .then((val) => {
          if (val.result === '0') {
            Modal.alert('成功', '退款申请成功', [{
              text: '确定',
              onPress: () => {
                _this.props.dispatch(routerRedux.push('/user/order/index'));
              },
              style: 'default'
            }]);
          } else {
            Modal.alert('申请退款失败', `请求服务器成功发起, 但是申请退款失败, 原因: ${val.message}`);
          }
        })
      },
      style: 'default'
    },{
      text: '取消',
      style: 'default'
    }]);
  }

  renderSubmit() {
    const orderStatus = this.orderItem.orderStatus;
    const orderType = this.orderItem.orderType;

    if (orderStatus === 1) {
      return <div className='submit-bottom'>
        <div className='submit-btn' onClick={this.cancelOrder.bind(this)}>取消订单</div>
      </div>
    } else if (orderStatus === 3) {
      if (orderType === 'C') { // C: 定制
        return <div className='submit-bottom'>
          <div className='submit-btn' onClick={() => this.paycCustomizeBy('F')}>支付全款</div>
          <div className='submit-btn' onClick={() => this.paycCustomizeBy('E')}>支付定金</div>
        </div>
      } else { // P: 套餐
        return <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.payPackageOrders.bind(this)}>立即付款</div>
        </div>
      }
    } else if (orderStatus === 6) {
      return <div className='submit-bottom'>
        <div className='submit-btn' onClick={this.refundOrders.bind(this)}>申请退款</div>
      </div>
    } else if (orderStatus === 10) {
      return <div className='submit-bottom'>
        <div className='submit-btn' onClick={() => this.paycCustomizeBy('R')}>支付余款</div>
      </div>
    } else {
      return null
    }
  }

  render() {
    return (
      <div className="Order-detail">
        <MyNavBar
          navName='订单详情'
          returnURL='/user/order/index'
        />

        <List renderHeader={() => '订单状态'} className="my-list">
          <Item>{this.orderStatus.call(this)}</Item>
        </List>

        <List renderHeader={() => '订单信息'} className="my-list">
          <Item>订单编号: {this.orderItem.orderSn}</Item>
          <Item>下单时间: {convertDate.dateToYYYYmmDDhhMMss(new Date(this.orderItem.orderTime))}</Item>
          <Item>产品总额: {this.orderItem.productAmount} RMB</Item>
          <Item>订单总额: {this.orderItem.orderAmount} RMB</Item>
          <Item>入住日期: {convertDate.dateToFormat(new Date(this.orderItem.departureDate))}</Item>
          <Item>离开日期: {convertDate.dateToFormat(new Date(this.orderItem.leaveDate))}</Item>
        </List>

        {this.orderItem.orderItemList.map((val, key) => (
          <List renderHeader={() => `产品信息${key + 1}`} key={key} className="my-list">
            <Item>{val.productName}</Item>
            <Item>简单描述: {val.productBrief}</Item>
            <Item>产品价格: {val.productPrice}</Item>
            <Item>促销价格: {val.promotePrice}</Item>
            <Item>周期长度: {val.period}天-{(val.period-1)}晚</Item>
            <Item>房型: {val.apartment}</Item>
            <Item>床型: {val.bedType}</Item>
            <Item>产品数量: {val.apartmentNum}</Item>
          </List>
        ))}

        {this.state.orderUserinfo.map((val, key) => (
          <List renderHeader={() => `旅客信息${key + 1}`} key={key} className="my-list">
            <Item>护照号码: { val.passportNo === null ? '未填写' : val.passportNo }</Item>
            <Item>中文姓名: { val.chineseName === null ? '未填写' : val.chineseName }</Item>
            <Item>英文姓名: { val.pinyinName === null ? '未填写' : val.pinyinName }</Item>
            <Item>手机号码: { val.mobile === null ? '未填写' : val.mobile }</Item>
            <Item>潜水等级: { this.InfodivingRank(val.divingRank) }</Item>
            <Item>潜水次数: { val.divingCount === null ? '未填写' : val.divingCount }</Item>
            <Item>出生日期: { convertDate.dateToFormat(new Date(val.birthday)) }</Item>
            <Item>性别: { val.gender === 0 ? '男' : '女' }</Item>
            <Item>邮箱: { val.email === null ? '未填写' : val.email }</Item>
          </List>
        ))}

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        {this.renderSubmit.call(this)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Order);
