import { connect } from 'react-redux'
import React, {Component} from 'react';
import assign from 'lodash.assign'
import appConfig from './../../../config/index.js';
import cookie from './../../cookie.js';

import { WhiteSpace , List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;



class detail extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      data:{
        orderStatus:0,
        orderItemList:[{
          productName:'',
          productBrief:'',
          productPrice:'',
          promotePrice:'',
          period:'',
          apartment:'',
          bedType:'',
          apartmentNum:'',
        }]
      },
      OrderUserinfo:false
    };
  }
  componentDidMount() {
    const _this = this;
    // 这个后期要过滤掉
    if ( this.props.Order.select == 'false') {

      // let _data = assign({},_this.props.Nav);

      // _data.PreURL=['/'];
      // _data.navtitle=['潜游时光'];
      // _data.leftContent={return:false,logo:'home'};
      // _data.selectedTab='Home';

      // _this.props.dispatch({type:'Chan_Nav',data:_data})
      // _this.context.router.push('/');
      return
    }
    let _state = assign({},this.state);
    _state.data = this.props.Order.data[this.props.Order.select]
    this.setState(_state);
    fetch(
      appConfig.findByOrderId+"?orderId="+_state.data.orderId,{
      method: "GET",
      contentType: "application/json; charset=utf-8",
      headers:{
        token:cookie.getItem('token'),
        digest:cookie.getItem('digest')
      }
     }).then(function(response) {
      return response.json()
     }).then(function(json) {
      if (json.result=="0") {
        _this.props.dispatch({
          type:'Userinfo_Order',
          data:json.data
        })
      }else {
        alert("获取旅客信息失败")
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    const _this = this;
    // 这个后期要过滤掉
    if ( _this.props.Order.select == 'false') {
      // let _data = assign({},_this.props.Nav);

      // _data.PreURL=['/'];
      // _data.navtitle=['潜游时光'];
      // _data.leftContent={return:false,logo:'home'};
      // _data.selectedTab='Home';

      // _this.props.dispatch({type:'Chan_Nav',data:_data})
      // _this.context.router.push('/');
      return
    }
    let _state = assign({},_this.state);
    _state.data = nextProps.Order.data[nextProps.Order.select]
    _this.setState(_state);
    fetch(
      appConfig.findByOrderId+"?orderId="+_state.data.orderId,{
      method: "GET",
      contentType: "application/json; charset=utf-8",
      headers:{
        token:cookie.getItem('token'),
        digest:cookie.getItem('digest')
      }
     }).then(function(response) {
      return response.json()
     }).then(function(json) {
      if (json.result=="0") {
        _state = assign({},_this.state);
        _state.OrderUserinfo = json.data
        _this.setState(_state);
      }else {
        alert("获取旅客信息失败")
      }
    })
  }
  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
          <List renderHeader={() => '订单状态'} className="my-list">
            {OrderStatus(this.state.data.orderStatus)}
          </List>
        <WhiteSpace size="lg" />
          <List renderHeader={() => '订单信息'} className="my-list">
            <Item>订单编号: {this.state.data.orderSn}</Item>
            <Item>下单时间: {getsecond(this.state.data.orderTime)}</Item>
            <Item>产品总额: {this.state.data.productAmount} RMB</Item>
            <Item>订单总额: {this.state.data.orderAmount} RMB</Item>
            <Item>入住日期: {getnoUTCdate(this.state.data.departureDate)}</Item>
            <Item>离开日期: {getnoUTCdate(this.state.data.leaveDate)}</Item>
          </List>
        {RenderItemList(this.state.data.orderItemList)}
        {RenderUserinfo(this.state.OrderUserinfo)}
      </div>
    )
  }
}

detail.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Order:state.reducer.Order
  // Nav:state.reducer.Nav,
  // routing:state.routing.detaillocationBeforeTransitions
})


export default detail = connect(
  mapStateToProps
)(detail)






// 渲染订单状态
function OrderStatus(status) {
  if (status == 1) {
    return <Item>预订中</Item>
  }else if (status == 2) {
    return <Item>预订失败</Item>
  }else if (status == 3) {
    return <Item>预订成功、待付款</Item>
  }else if (status == 4) {
    return <Item>退订成功、已取消</Item>
  }else if (status == 5) {
    return <Item>未按期支付，订单交易失败</Item>
  }else if (status == 6) {
    return <Item>支付成功、已完成</Item>
  }else if (status == 7) {
    return <Item>申请退款</Item>
  }else if (status == 8) {
    return <Item>退款成功</Item>
  }
}
// 渲染产品信息
function RenderItemList(_Item) {
  let _Array = [];
  for (var i = 0; i < _Item.length; i++) {
    _Array.push(<div>
      <WhiteSpace size="lg" />
        <List renderHeader={(i) => {return '产品信息' + 1;}} className="my-list">
          <Item>产品名称: {_Item[i].productName}</Item>
          <Item>简单描述: {_Item[i].productBrief}</Item>
          <Item>产品价格: {_Item[i].productPrice}</Item>
          <Item>促销价格: {_Item[i].promotePrice}</Item>
          <Item>周期长度: {_Item[i].period}天-{(_Item[i].period-1)}晚</Item>
          <Item>房型: {_Item[i].apartment}</Item>
          <Item>床型: {_Item[i].bedType}</Item>
          <Item>产品数量: {_Item[i].apartmentNum}</Item>
        </List>
    </div>);
  }
  return _Array
}
// 渲染旅客信息
function RenderUserinfo(Info) {
  if (Info == false) {
    return
  }
  let _Array = [];
  for (var i = 0; i < Info.length; i++) {
    _Array.push(<div>
      <WhiteSpace size="lg" />
        <List renderHeader={(i) => {return '旅客信息' + 1;}} className="my-list">
          <Item>护照号码: {Info[i].passportNo==null?"未填写":Info[i].passportNo}</Item>
          <Item>中文姓名: {Info[i].chineseName==null?"未填写":Info[i].chineseName}</Item>
          <Item>英文姓名: {Info[i].pinyinName==null?"未填写":Info[i].pinyinName}</Item>
          <Item>手机号码: {Info[i].mobile==null?"未填写":Info[i].mobile}</Item>
          <Item>潜水等级: {Info[i].divingRank==null?"未填写":Info[i].divingRank}</Item>
          <Item>潜水次数: {Info[i].divingCount==null?"未填写":Info[i].divingCount}</Item>
          <Item>出生日期: {getdate(UTC2LocalTime(Info[i].birthday))}</Item>
          <Item>年龄: {Info[i].age==null?"未填写":Info[i].age}</Item>
          <Item>性别: {Info[i].gender==0?"男":'女'}</Item>
          <Item>邮箱: {Info[i].email==null?"未填写":Info[i].email}</Item>
        </List>
    </div>);
  }
  return _Array
}






// 方法 - 时间差  timestamp -> 时间戳
function UTC2LocalTime(timestamp) {
  //将 服务器UTC时间戳 转为Date
  var d = new Date(timestamp);
  //服务器UTC时间 与 GMT时间的时间 偏移差
  var offset = d.getTimezoneOffset() * 60000;
  return new Date(timestamp - offset);
}
// 方法 - 获取时间返回201x-xx-xx
function getdate(date) {
  var newdate = new Date(UTC2LocalTime(date)),
    thisString = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate();
  return thisString
}
// 方法 - 获取时间返回201x-xx-xx
function getnoUTCdate(date) {
  var newdate = new Date(date),
    thisString = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate();
  return thisString
}
// 方法 - 获取时间返回201x-xx-xx xx:xx:
function getsecond(data) {
  var newdate = new Date(UTC2LocalTime(data)),
    thisString = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate() + " " + newdate.getHours()+ ":" + newdate.getMinutes()+ ":"  + newdate.getSeconds();
  return thisString
}