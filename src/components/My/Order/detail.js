import assign from 'lodash.assign'
import { connect } from 'react-redux'
import React, {Component} from 'react';

import appConfig from './../../../config/index.js';
import cookie from './../../../method/cookie.js';

import styles from './../index.scss';

import { WhiteSpace , List , Toast} from 'antd-mobile';

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
    // 过滤成功，这里为了保险起见、没什么卵用
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
    _state.data = this.props.Order.data[this.props.Order.select];
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
    // 过滤成功，这里为了保险起见、没什么卵用
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
            {OrderStatus(this.state.data.orderStatus,this.state.data.countDown)}
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
        {RenderItemList(this.state.data.orderItemList,this)}
        {RenderUserinfo(this.state.OrderUserinfo)}
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        {RenderSubmit(this.state.data,this)}
      </div>
    )
  }
}

detail.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Order:state.reducer.Order,
  Nav:state.reducer.Nav,
  routing:state.routing.detaillocationBeforeTransitions
})


export default detail = connect(
  mapStateToProps
)(detail)






// 渲染订单状态
function OrderStatus(status,countDown) {
  if (status == 1) {
    return <Item>预订中、24小时内将会有客服联系您</Item>
  }else if (status == 2) {
    return <Item>预订失败</Item>
  }else if (status == 3) {
    if (countDown == null) {
      return <Item>预订失败</Item>
    }else {
      return <Item>预订成功、待付款</Item>
    }
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
  }else if (status == 9) {
    return <Item>退款失败</Item>
  }else if (status == 10) {
    return <Item>待付尾款</Item>
  }
}
// 渲染产品信息
function RenderItemList(_Item,_this) {
  let _Array = [];
  for (let i = 0; i < _Item.length; i++) {
    _Array.push(<div>
      <WhiteSpace size="lg" />
        <List renderHeader={(i) => {return '产品信息' + 1;}} className="my-list">
          <div onClick={function(){
            // 页面跳转
            let _data = assign({},_this.props.Nav);
            _data.navtitle.push("订单详情");
            _data.PreURL.push("/Detail");
            _data.leftContent={
              return:'left',
              logo:false
            };
            _data.hidden = true;
            _data.productId = _Item[i].productId;
            _this.props.dispatch({
              type:'Chan_Nav',
              data:_data
            });
            _this.props.dispatch({
              type:'product_Id',
              data:_Item[i].productId
            })
            _this.context.router.push('/Detail');
          }.bind(i)}><Item arrow="horizontal">{_Item[i].productName}</Item></div>
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
  for (let i = 0; i < Info.length; i++) {
    _Array.push(
      <div>
        <WhiteSpace size="lg" />
        <List renderHeader={(key) => {return '旅客信息' + (i+1)}} className="my-list">
          <Item>护照号码: { Info[i].passportNo==null?"未填写":Info[i].passportNo }</Item>
          <Item>中文姓名: { Info[i].chineseName==null?"未填写":Info[i].chineseName }</Item>
          <Item>英文姓名: { Info[i].pinyinName==null?"未填写":Info[i].pinyinName }</Item>
          <Item>手机号码: { Info[i].mobile==null?"未填写":Info[i].mobile }</Item>
          <Item>潜水等级: { InfodivingRank(Info[i].divingRank) }</Item>
          <Item>潜水次数: { Info[i].divingCount==null?"未填写":Info[i].divingCount }</Item>
          <Item>出生日期: { getdate(Info[i].birthday) }</Item>
          <Item>性别: { Info[i].gender==0?"男":'女' }</Item>
          <Item>邮箱: { Info[i].email==null?"未填写":Info[i].email }</Item>
        </List>
      </div>
    );
  }
  return _Array
}
// 渲染提交按钮
function RenderSubmit(val,_this) {
  if (val.orderStatus == 0) {
    return
  }
  if (val.orderStatus == 1) {
    return <div className={styles.bottomPay}>
      <div id='BTN_Cancel' className={styles.bottomPay} onClick={function(){
        let r = confirm("确认取消订单?")
        if (r == true) {
          document.getElementById('BTN_Cancel').innerHTML = '正在取消'
        }else{
          return
        }
        fetch(
          appConfig.URLversion + "/order/id/" + _this.state.data.orderId +"/cancelOrder.do" ,{
          method: "GET",
          headers:{
            token:cookie.getItem('token'),
            digest:cookie.getItem('digest')
          }
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          if (json.result=="0") {
            alert("订单成功取消");
            // 这里返回上一页
            let _data = assign({},_this.props.Nav);
            let _Url = _this.props.Nav.PreURL[(_data.PreURL.length-2)]
            _data.PreURL.pop();
            _data.navtitle.pop();
            _this.props.dispatch({type:'Chan_Nav',data:_data})
            _this.context.router.push(_Url);
            location.reload();
          }else {
            Toast.fail('取消失败，原因'+json.message, 1);
          }
        })
      }}>取消订单</div>
    </div>
  }else if (val.orderStatus == 3) {
    if (val.countDown != null) {
      return <div className={styles.bottomPay}>
        <div id='alipayMob'></div>
        {(function(){
          if (_this.state.data.orderType == "P") {
            return <div id='alipayBTN' className={styles.bottomPay2} onClick={function(){
              document.getElementById('alipayMob').innerHTML='正在付款';
              // 表示是商城订单
              fetch(
                appConfig.URLversion + "/payment/alipayMob.do?orderId=" + _this.state.data.orderId ,{
                method: "GET",
                headers:{
                  token:cookie.getItem('token'),
                  digest:cookie.getItem('digest')
                }
              }).then(function(response) {
                response.text().then(function (text) {
                  if (response == "FAILED") {
                    alert("您在30分钟内未完成付款，交易已关闭");
                  }else {
                    document.getElementById('alipayMob').innerHTML=text;
                    document.getElementById('alipaysubmit').submit();
                  }
                  document.getElementById('alipayMob').innerHTML='去付款';
                });
              })
            }}>去付款</div>
          }else if (_this.state.data.orderType == "C") {
            return <div id='alipayBTN' className={styles.bottomPay2} onClick={function(){
              document.getElementById('alipayMob').innerHTML='正在付款';
              // 证明该订单为度假村直订（C:custom）显示支付定金按钮
              fetch(
                appConfig.URLversion + "/payment/" +_this.state.data.orderSn+ "/E/alipay4Custom.do?dev=Mobile",{
                method: "GET",
                headers:{
                  token:cookie.getItem('token'),
                  digest:cookie.getItem('digest')
                }
              }).then(function(response) {
                response.text().then(function (text) {
                  if (response == "FAILED") {
                    alert("您在30分钟内未完成付款，交易已关闭");
                  }else {
                    document.getElementById('alipayMob').innerHTML=text;
                    document.getElementById('alipaysubmit').submit();
                  }
                  document.getElementById('alipayMob').innerHTML='去付款';
                });
              })
            }}>支付定金</div>
          }
        })()}
      </div>
    }
  }else if (val.orderStatus == 6) {
    return <div className={styles.bottomPay}>
      <div id='BTN_Refund' className={styles.bottomPay} onClick={function(){
        let r = confirm("确认申请退款?")
        if (r == true) {
          document.getElementById('BTN_Refund').innerHTML = '正在取消'
        }else{
          return
        }
        fetch(
          appConfig.URLversion + "/order/id/" + _this.state.data.orderId +"/refund.do" ,{
          method: "GET",
          headers:{
            token:cookie.getItem('token'),
            digest:cookie.getItem('digest')
          }
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          if (json.result=="0") {
            alert("退款申请成功");
            // 这里返回上一页
            let _data = assign({},_this.props.Nav);
            let _Url = _this.props.Nav.PreURL[(_data.PreURL.length-2)]
            _data.PreURL.pop();
            _data.navtitle.pop();
            _this.props.dispatch({type:'Chan_Nav',data:_data})
            _this.context.router.push(_Url);
            location.reload();
          }else {
            Toast.fail('取消失败，原因'+json.message, 1);
          }
        })
      }}>申请退款</div>
    </div>
  }else if (val.orderStatus == 10) {
    return <div className={styles.bottomPay}>
      <div id='alipayMob'></div>
      <div id='alipayBTN' className={styles.bottomPay} onClick={function(){
        document.getElementById('alipayMob').innerHTML='正在付款';
        // 证明该订单为度假村直订（C:custom）显示支付定金按钮
        fetch(
          appConfig.URLversion + "/payment/"//
          +_this.state.data.orderSn+"/R/alipay4Custom.do?dev=Mobile",{
          method: "GET",
          headers:{
            token:cookie.getItem('token'),
            digest:cookie.getItem('digest')
          }
        }).then(function(response) {
          response.text().then(function (text) {
            if (response == "FAILED") {
              alert("您在30分钟内未完成付款，交易已关闭");
            }else {
              document.getElementById('alipayMob').innerHTML=text;
              document.getElementById('alipaysubmit').submit();
            }
            document.getElementById('alipayMob').innerHTML='去付款';
          });
        })
      }}>去付款</div>
    </div>
  }
}

const Item = List.Item;
const Brief = Item.Brief;

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
  var newdate = new Date(date),
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
    thisString = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate() + " ";
    if (newdate.getHours() < 10) {
      thisString += '0'+ newdate.getHours()+ ":";
    }else {
     thisString += newdate.getHours()+ ":";
    }
    if (newdate.getMinutes() < 10 ) {
      thisString += '0'+ newdate.getMinutes()+ ":";
    }else {
      thisString += newdate.getMinutes()+ ":";
    }
    if (newdate.getSeconds() < 10) {
      thisString += '0'+ newdate.getSeconds();

    }else {
      thisString += newdate.getSeconds();
    }
  return thisString
}
function InfodivingRank(num) {
  if (num == 1) {
    return "OW级别"
  }else if(num == 2) {
    return "AOW级别以上"
  }else {
    return "未填写"
  }
}
