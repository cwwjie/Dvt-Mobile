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
          padding:'20px 0px 0px 0px'
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
  return argument.map(function(value,ref){
    if (filter == 'all') {
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
    }else if (filter == 'ing') {
      if (value.orderStatus == 1) {
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
    }else if (filter == 'pay') {
      if (value.orderStatus == 3) {
        if (value.countDown!=null) {
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
      }
    }else if (filter == 'complete') {
      if (value.orderStatus == 6) {
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
    }
  })
}









