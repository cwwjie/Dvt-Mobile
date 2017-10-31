import { connect } from 'react-redux'
import React, {Component} from 'react';

import assign from 'lodash.assign'
import { WhiteSpace , List , Flex} from 'antd-mobile';

import cookie from './../../method/cookie.js';
import appConfig from './../../config/index.js';

import styles from './index.scss'


const Item = List.Item;
const PlaceHolder = (data) => (
  <div style={{
      color: '#888',
      textAlign: 'center',
      height: '1rem',
      lineHeight: '1rem',
      width: '100%',
      borderRight:"1px solid #ddd"
    }}
  >{data}</div>
);





class Foo extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      userInfor:{}
    };
  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      userInfor:nextProps.user
    });
  }
  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
          <List>
            <Item
              extra={'个人中心'}
              arrow="horizontal"
              onClick={function () {
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('个人中心');
                _data.PreURL.push('/Cent/personal');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });

                _this.context.router.push('/Cent/personal');

            }.bind(this)} multipleLine>
              <div style={{color:"#888"}}>{this.props.user.nickname}</div>
            </Item>
          </List>
          <List>
            <div className={styles.personalCenter}>
              <div onClick={function(){
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('修改密码');
                _data.PreURL.push('/Cent/password');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });

                _this.context.router.push('/Cent/password');
              }.bind(this)}>{PlaceHolder("修改密码")}</div>
              <div onClick={function(){
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('修改邮箱');
                _data.PreURL.push('/Cent/mailbox');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });

                _this.context.router.push('/Cent/mailbox');
              }.bind(this)}>{PlaceHolder("修改邮箱")}</div>
              <div onClick={function(){
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('修改手机');
                _data.PreURL.push('/Cent/phone');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });

                _this.context.router.push('/Cent/phone');
              }.bind(this)}>{PlaceHolder("修改手机")}</div>
            </div>
          </List>
        <WhiteSpace size="lg" />
          <List>
            <Item
              extra={'全部订单'}
              arrow="horizontal"
              onClick={() => {
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('全部订单');
                _data.PreURL.push('/Cent/Order');
                _data.leftContent = {
                  return: 'left',
                  logo: false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });
                _this.props.dispatch({
                  type:'filter_Order',
                  data:'all'
                });

                _this.context.router.push('/Cent/Order');
            }} multipleLine>
              <div style={{color:"#888"}}>我的订单</div>
            </Item>
          </List>
          <List>
            <div className={styles.personalCenter}>
              <div onClick={() => {
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('预订订单');
                _data.PreURL.push('/Cent/Order');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });
                _this.props.dispatch({
                  type:'filter_Order',
                  data:'ing'
                });

                _this.context.router.push('/Cent/Order');
              }}>{PlaceHolder("预订中")}</div>
              <div onClick={() => {
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('待付款订单');
                _data.PreURL.push('/Cent/Order');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });
                _this.props.dispatch({
                  type:'filter_Order',
                  data:'pay'
                });

                _this.context.router.push('/Cent/Order');
              }}>{PlaceHolder("待付款")}</div>
              <div onClick={() => {
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('付款成功');
                _data.PreURL.push('/Cent/Order');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });
                _this.props.dispatch({
                  type:'filter_Order',
                  data:'complete'
                });

                _this.context.router.push('/Cent/Order');
              }}>{PlaceHolder("成功/退款")}</div>
            </div>
          </List>
        <WhiteSpace size="lg" />
          <div onClick={() => {
            // 页面跳转
            let _this = this
            let _data = assign({},_this.props.Nav);

            _data.navtitle.push('旅客信息');
            _data.PreURL.push('/Cent/Passenger');
            _data.leftContent = {
              return:'left',
              logo:false
            };

            _this.props.dispatch({
              type:'Chan_Nav',
              data:_data
            });
            _this.props.dispatch({
              type:'filter_Order',
              data:'complete'
            });

            _this.context.router.push('/Cent/Passenger');
            }}>
            <List>
              <Item
                arrow="horizontal"
                onClick={() => {
              }} multipleLine>
                <div style={{color:"#888"}}>常用旅客信息</div>
              </Item>
            </List>
          </div>
        <WhiteSpace size="lg" />
          <div className={styles.SignOut}
            onClick={() => {
              // 先将 cookie 移除掉
              cookie.removeItem('token',"/");
              cookie.removeItem('digest',"/");

              // 页面跳转
              let _this = this
              let _data = assign({},_this.props.Nav);

              _data.RightContent = 'login';

              _data.navtitle=['潜游时光','用户登录'];
              _data.PreURL=['/','/Cent/login'];
              _data.leftContent={
                return:'left',
                logo:false
              };

              _data.hidden= true,
              _data.selectedTab='Home'

              _this.props.dispatch({
                type:'Chan_Nav',
                data:_data
              });
              _this.context.router.push('/Cent/login');
            }}
          >
            <div>账号退出</div>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  user:state.reducer.user,
  routing:state.routing.locationBeforeTransitions
})


Foo.contextTypes = {
  router: Object
}
export default Foo = connect(
  mapStateToProps
)(Foo)
