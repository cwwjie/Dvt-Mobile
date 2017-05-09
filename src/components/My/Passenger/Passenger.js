import { connect } from 'react-redux'
import React, {Component} from 'react';
import assign from 'lodash.assign';
import appConfig from './../../../config/index.js';
import cookie from './../../cookie.js';

import { WhiteSpace , List } from 'antd-mobile';

import styles from '../styles.scss';


const Item = List.Item;
const Brief = Item.Brief;



class Passenger extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      data:[]
    };
  }
  componentWillMount(){
    let _state = assign({},this.state);
    _state.data = this.props.Passenger.data;
    this.setState(_state)
  }
  componentWillReceiveProps(nextProps) {
    let _state = assign({},this.state);
    _state.data = nextProps.Passenger.data;
    this.setState(_state);
  }
  render() {
    return (
      <div style={{position:'relative'}}>
        <div style={{
          width:'100%',
          textAlign:'center',
          position: 'absolute',
          padding:'20px 0px 0px 0px'
        }}>暂无数据</div>
        {this.state.data.map(function(value, ref) {
          return <div>
            <WhiteSpace size="lg" />
              <List>
                <div onClick={function(){
                  const _this = this;
                  // 页面跳转
                  let _data = assign({},_this.props.Nav);

                  _data.navtitle.push("编辑旅客信息");
                  _data.PreURL.push("/Cent/Passenger/edit");

                  _this.props.dispatch({
                    type:'Chan_Nav',
                    data:_data
                  });
                  _this.props.dispatch({
                    type:'select_Passenger',
                    data:{
                      type:'edit',
                      select:ref
                    }
                  })

                  _this.context.router.push('/Cent/Passenger/edit');
                }.bind(this)}>
                  <Item extra={'编辑'} arrow="horizontal" multipleLine>
                    {value.chineseName}
                    <Brief>{value.pinyinName}</Brief>
                  </Item>
                </div>
              </List>
          </div>
        }.bind(this))}
        <div className={styles.bottomPay}>
          <div className={styles.bottomPay} onClick={function(){
            const _this = this;
            // 页面跳转
            let _data = assign({},_this.props.Nav);

            _data.navtitle.push("编辑旅客信息");
            _data.PreURL.push("/Cent/Passenger/edit");

            _this.props.dispatch({
              type:'Chan_Nav',
              data:_data
            });
            _this.props.dispatch({
              type:'select_Passenger',
              data:{
                type:'add',
                select:false
              }
            })

            _this.context.router.push('/Cent/Passenger/edit');
          }.bind(this)}>新增旅客信息</div>
        </div>
      </div>
    )
  }
}



Passenger.contextTypes = {
  router: Object
}
const mapStateToProps = (state, ownProps) => ({
  Passenger:state.reducer.Passenger,
  Nav:state.reducer.Nav,
  // routing:state.routing.locationBeforeTransitions
})


export default Passenger = connect(
  mapStateToProps
)(Passenger)













