import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SwitchBolck from './../../../components/UserSame/SwitchBolck';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import convertDate from './../../../utils/convertDate';

import { Toast, Modal, Tabs } from 'antd-mobile';

// orderList = {
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

    this.initialPage = localStorage.getItem('defaultActiveKey') ? 
    parseInt(localStorage.getItem('defaultActiveKey')) :
    0 ;
    localStorage.removeItem('defaultActiveKey');
    this.state = {
      orderList: []
    };

    this.getOrderList.bind(this);
    this.renderOrderBy.bind(this);
    this.JumpToDetail.bind(this);
  }

  componentDidMount() {
    this.getOrderList(1, 0);
  }

  getOrderList(pageNum, pageSize) {
    fetch(`${config.URLversion}/order/${pageNum ? pageNum : 1}/${pageSize ? pageSize : 10}/list.do`, {
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

  JumpToDetail(key) {
    localStorage.setItem('order-detail', JSON.stringify(this.state.orderList[key]) );
    this.props.dispatch(routerRedux.push('/user/order/detail'));
  }

  renderOrderBy(type) {
    const _this = this;
    let countNum = 0;
    let OrdeNode = [];

    if (type === 'all') {
      return this.state.orderList.length === 0 ?  <div className='Order-Nodata'>暂无数据</div> : this.state.orderList.map((val, key) => (
        <OrderItem key={key} data={val} JumpToDetail={() => _this.JumpToDetail(key)} />
      ));
    }

    for (let i = 0; i < this.state.orderList.length; i++) {
      if (this.state.orderList[i].orderStatus === type) {
        countNum++;
        OrdeNode.push(
          <OrderItem key={i} data={this.state.orderList[i]} JumpToDetail={() => _this.JumpToDetail(key)} />
        );
      }
    }
    
    if (countNum === 0) {
      return <div className='Order-Nodata'>暂无数据</div>;
    } else {
      return OrdeNode;
    }
  }

  render() {
    const tabs = [
      { title: '所有订单' },
      { title: '预定中' },
      { title: '等付款' },
      { title: '成功' },
    ];

    return (
      <div className="Order">
        <MyNavBar
          navName='商城订单'
          returnURL='/user/index'
        />

        <SwitchBolck
          isFirstActive={true}
          firstName='商城订单'
          otherName='淘宝订单'
          jumpToUrl='/user/order/taobao'
        />

        <Tabs tabs={tabs}
          initialPage={this.initialPage}
        >
          <div>
            {this.renderOrderBy('all')}
          </div>
          <div>
            {this.renderOrderBy(1)}
          </div>
          <div>
            {this.renderOrderBy(3)}
          </div>
          <div>
            {this.renderOrderBy(6)}
          </div>
        </Tabs>
      </div>
    )
  }
}

const OrderItem = ({data, JumpToDetail}) => (
  <div className='order-Item' onClick={JumpToDetail}>
    <div className='item-content'>
      <div className='Content-Img'>
        <div>
          <img src={`${config.URLbase}${data.orderItemList[0].productThumb}`} />
        </div>
      </div>
      <div className='Content-Right'>
        <div className='Content-Title'>{data.orderName}</div>
        <div className='Content-Desc'>{data.orderDesc}</div>
        <div className='Content-Botton'>
          <div>{convertDate.dateToFormat(new Date(data.orderTime))}</div>
          <div className='Botton-State'>
            {renderOrderState(data.orderStatus, data.countDown)}
          </div>
        </div>
      </div>
    </div>
  </div>
)

const renderOrderState = (OrderState, countDown) => {
  if (OrderState === 1) {
    return '预订中'
  }else if (OrderState === 2) {
    return '预订失败'
  }else if (OrderState === 3) {
    if (countDown === null) {
      return '预订失败'
    }else {
      return '待付款'
    }
  }else if (OrderState === 4) {
    return '已取消'
  }else if (OrderState === 5) {
    return '交易失败'
  }else if (OrderState === 6) {
    return '已完成'
  }else if (OrderState === 7) {
    return '申请退款'
  }else if (OrderState === 8) {
    return '退款成功'
  }else if (OrderState === 9) {
    return '退款失败'
  }else if (OrderState === 10) {
    return '待付尾款'
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Order);
