import { connect } from 'react-redux'
import React, {Component} from 'react';
import assign from 'lodash.assign'

import { WhiteSpace , List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;



class Order extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div style={{position:'relative'}}>
        <div style={{
          position: 'absolute',
          textAlign:'center',
          width:'100%',
          padding:'37px 0px 0px 0px'
        }}>暂无数据</div>
        <div>{renderOrder(this.props.Order.data,this.props.Order.filter,this)}</div>
      </div>
    )
  }
}



Order.contextTypes = {
  router: Object
}
const mapStateToProps = (state, ownProps) => ({
  Order:state.reducer.Order,
  Nav:state.reducer.Nav,
  // routing:state.routing.locationBeforeTransitions
})


export default Order = connect(
  mapStateToProps
)(Order)





function renderOrder(argument,filter,_this) {
  if (filter == 'all') {
    if (argument.length == 0) {return}
    // return argument.map(function(value,ref){
    //   return orderDivision(value,_this,ref);
    // });
    let newArgument = {
      status1:[],
      status2:[],
      status3:[],
      status4:[],
      status5:[],
      status6:[],
      status7:[],
      status8:[],
      status9:[],
      status10:[],
    }
    for (let i = 0; i < argument.length; i++) {
        argument[i].select_Order = i;
      if (argument[i].orderStatus==1) {
        argument[i].title_Order = '预定中';
        newArgument.status1.push(argument[i]);
      }else if (argument[i].orderStatus==2) {
        argument[i].title_Order = '预定失败';
        newArgument.status2.push(argument[i]);
      }else if (argument[i].orderStatus==3) {
        argument[i].title_Order = '待付款';
        newArgument.status3.push(argument[i]);
      }else if (argument[i].orderStatus==4) {
        argument[i].title_Order = '退订成功';
        newArgument.status4.push(argument[i]);
      }else if (argument[i].orderStatus==5) {
        argument[i].title_Order = '交易失败';
        newArgument.status5.push(argument[i]);
      }else if (argument[i].orderStatus==6) {
        argument[i].title_Order = '支付成功';
        newArgument.status6.push(argument[i]);
      }else if (argument[i].orderStatus==7) {
        argument[i].title_Order = '申请退款';
        newArgument.status7.push(argument[i]);
      }else if (argument[i].orderStatus==8) {
        argument[i].title_Order = '退款成功';
        newArgument.status8.push(argument[i]);
      }else if (argument[i].orderStatus==9) {
        argument[i].title_Order = '退款失败';
        newArgument.status9.push(argument[i]);
      }else if (argument[i].orderStatus==10) {
        argument[i].title_Order = '支付尾款';
        newArgument.status10.push(argument[i]);
      }
    }
    let arrayArgument = [];
    for(let _obj in newArgument) {
      if (newArgument[_obj].length !=0) {
        let _array = [];
        for (let j = 0; j < newArgument[_obj].length; j++) {
          _array.push(
            <div onClick={()=>{
              // 页面跳转
              let _data = assign({},_this.props.Nav);

              _data.navtitle.push("订单详情");
              _data.PreURL.push("/Cent/Order/detail");


              _this.props.dispatch({
                type:'Chan_Nav',
                data:_data
              });
              _this.props.dispatch({
                type:'select_Order',
                data:newArgument[_obj][j].select_Order
              })

              _this.context.router.push('/Cent/Order/detail');
            }}>
              <Item arrow="horizontal" multipleLine>
                {newArgument[_obj][j].orderSn}
                {newArgument[_obj][j].orderItemList.map((_value,_ref)=>(
                  <Brief>{_value.productName}</Brief>
                ))}
              </Item>
            </div>
          )
        }
        arrayArgument.push(
          <List renderHeader={function(){
            return newArgument[_obj][0].title_Order
          }}>
            {_array}
          </List>
        )
      }
    }
    return arrayArgument
  }else {
    return argument.map(function(value,ref){
      if (filter == 'ing') {
        if (value.orderStatus == 1) {
          return orderDivision(value,_this,ref);
        }
      }else if (filter == 'pay') {
        if (value.orderStatus == 3) {
          if (value.countDown!=null) {
            return orderDivision(value,_this,ref);
          }
        }else if(value.orderStatus == 10) {
            return orderDivision(value,_this,ref);
        }
      }else if (filter == 'complete') {
        if (value.orderStatus == 6) {
          return orderDivision(value,_this,ref);
        }
      }
    });
  }
}


function orderDivision(value,_this,ref) {
  return <div>
    <WhiteSpace size="lg" />
      <List>
        <div onClick={()=>{
          // 页面跳转
          let _data = assign({},_this.props.Nav);

          _data.navtitle.push("订单详情");
          _data.PreURL.push("/Cent/Order/detail");


          _this.props.dispatch({
            type:'Chan_Nav',
            data:_data
          });
          _this.props.dispatch({
            type:'select_Order',
            data:ref
          })

          _this.context.router.push('/Cent/Order/detail');
        }}>
          <Item arrow="horizontal" multipleLine>
            {value.orderSn}
            {value.orderItemList.map((_value,_ref)=>(
              <Brief>{_value.productName}</Brief>
            ))}
          </Item>
        </div>
      </List>
  </div>
}






