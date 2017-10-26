import assign from 'lodash.assign';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { WhiteSpace, List, Tabs } from 'antd-mobile';

import styles from './styles.scss';
import appConfig from './../../../config/index';
import dateToFormat from './../../../method/dateToFormat.js';

class Order extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      'defaultActiveKey': '1',
      'filter': 'all'
    };

    this.renderOrderOther.bind(this);
    this.JumpToDetail.bind(this);
  }

  componentDidMount() {
    const myfilter = this.props.Order.filter;

    if (myfilter === 'all') {
      this.setState({ 'defaultActiveKey': '1', 'filter': "all"});
    } else if (myfilter === 'ing') {
      this.setState({ 'defaultActiveKey': '2', 'filter': "ing"});
    } else if (myfilter === 'pay') {
      this.setState({ 'defaultActiveKey': '3', 'filter': "pay"});
    } else if (myfilter === 'complete') {
      this.setState({ 'defaultActiveKey': '4', 'filter': "complete"});
    }
  }

  JumpToDetail(ref) {
    // 页面跳转
    let myNavdata = assign({},this.props.Nav);

    myNavdata.navtitle.push("订单详情");
    myNavdata.PreURL.push("/Cent/Order/detail");


    this.props.dispatch({
      type:'Chan_Nav',
      data:myNavdata
    });

    this.props.dispatch({
      type: 'select_Order',
      data: ref
    })

    this.context.router.push('/Cent/Order/detail');
  }

  renderOrderAll() {
    const _this = this,
      orderList = this.props.Order.data;
    
    if (orderList.length === 0) {
      return <div style={{'position': 'absolute', 'textAlign': 'center', 'width': '100%', 'padding': '37px 0px 0px 0px'}}
      >暂无数据</div>
    }

    return orderList.map((val, key) => ( <OrderItem data={val} JumpToDetail={() => {_this.JumpToDetail(key)}} /> ))
  }
  
  renderOrderOther(type) {
    const _this = this,
      orderList = this.props.Order.data;
    
    if (orderList.length === 0) {
      return <div style={{'position': 'absolute', 'textAlign': 'center', 'width': '100%', 'padding': '37px 0px 0px 0px'}}
      >暂无数据</div>
    }

    return orderList.map((val, key) => {
      if (val.orderStatus === type) {
        return <OrderItem data={val} JumpToDetail={() => {_this.JumpToDetail(key)}} /> 
      } else {
        return <div/> 
      }
    })
  }

  changeTab(key) {
    if (key == '1') {
      this.setState({ 'defaultActiveKey': '1','filter': 'all'});
    }else if (key == '2') {
      this.setState({ 'defaultActiveKey': '2','filter': 'ing'});
    }else if (key == '3') {
      this.setState({ 'defaultActiveKey': '3','filter': 'pay'});
    }else if (key == '4') {
      this.setState({ 'defaultActiveKey': '4','filter': 'complete'});
    }
  }

  render() {
    const _this = this;

    return <div style={{'position': 'relative'}}>
      <Line/>
      <div className={styles.NavL}>
        <div className={styles.NavLL}>商城订单</div>
        <div className={styles.NavLR} onClick={() => {
          _this.context.router.push('/Cent/taobao')
        }}>淘宝订单</div>
      </div>
      <Line/>
        <Tabs animated={false}
          activeKey={this.state.defaultActiveKey}
          onChange={this.changeTab.bind(this)}>
          <TabPane tab='所有订单' key='1'>
            {this.renderOrderAll.call(this)}
          </TabPane>
          <TabPane tab='预定中' key='2'>
            {this.renderOrderOther(1)}
          </TabPane>
          <TabPane tab="等付款" key="3">
            {this.renderOrderOther(3)}
          </TabPane>
          <TabPane tab="成功" key="4">
            {this.renderOrderOther(6)}
          </TabPane>
        </Tabs>
    </div>
  }    
}

const Item = List.Item;
const Brief = Item.Brief;
const TabPane = Tabs.TabPane;

const Line = () => (<div style={{height:"1px",background:"#ddd"}}></div>)

const OrderItem = ({data, JumpToDetail}) => (
  <div className={styles.orderItem} onClick={JumpToDetail}>
    <div className={styles.itemContent}>
      <div className={styles.ContentImg}>
        <div>
          <img src={appConfig.URLbase + data.orderItemList[0].productThumb} />
        </div>
      </div>
      <div className={styles.ContentRight}>
        <div className={styles.ContentTitle}>{data.orderName}</div>
        <div className={styles.ContentNumber}>{data.orderSn}</div>
        <div className={styles.ContentBotton}>
          <div>{dateToFormat(new Date(data.orderTime))}</div>
          <div className={styles.BottonState}>{renderOrderState(data.orderStatus, data.countDown)}</div>
        </div>
      </div>
    </div>
  </div>
)

const renderOrderState = (OrderState, countDown) => {
  if (OrderState == 1) {
    return '预订中'
  }else if (OrderState == 2) {
    return '预订失败'
  }else if (OrderState == 3) {
    if (countDown == null) {
      return '预订失败'
    }else {
      return '待付款'
    }
  }else if (OrderState == 4) {
    return '已取消'
  }else if (OrderState == 5) {
    return '交易失败'
  }else if (OrderState == 6) {
    return '已完成'
  }else if (OrderState == 7) {
    return '申请退款'
  }else if (OrderState == 8) {
    return '退款成功'
  }else if (OrderState == 9) {
    return '退款失败'
  }else if (OrderState == 10) {
    return '待付尾款'
  }
}

Order.contextTypes = { router: Object }

const mapStateToProps = (state, ownProps) => ({
  'Order': state.reducer.Order,
  'Nav': state.reducer.Nav
})

export default Order = connect(
  mapStateToProps
)(Order)