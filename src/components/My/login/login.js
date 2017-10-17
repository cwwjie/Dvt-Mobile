import { connect } from 'react-redux'
import React, {Component} from 'react';

import { Button, Flex, WingBlank , WhiteSpace , Toast  , Checkbox} from 'antd-mobile';

import assign from 'lodash.assign'
import appConfig from './../../../config/index.js';
import cookie from './../../cookie.js';

import styles from './../index.scss';

import eye from './../svg/eye.svg';
import register from './../svg/register.svg';
import findback from './../svg/findback.svg';
import eye_hover from './../svg/eye_hover.svg';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;




class login extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      submit:false,   // false true loading
      account:"",
      password:"",
      passwordType:"password",
      eye:eye,
      save:false
    };
  }
  renderSubmit = () => {
    if (this.state.submit == false) {
      return <Button className="btn" onClick={function(){
        if ( this.state.account == "" ) {Toast.info('请输入账号', 2, null, false );return}
        else if ( this.state.password.length < 8 ) {Toast.info('密码应该大于8位', 2, null, false );return}
      }.bind(this)}>登录</Button>
    }else if (this.state.submit == true) {
      return <Button className="btn" onClick={function(){
        const _this = this;
        // 账号 非 手机 邮箱
        if ( !(/^1[34578]\d{9}$/.test( _this.state.account )) && !(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test( _this.state.account )) ) {
          Toast.info('请输入正确格式邮箱或手机', 2, null, false );
          return
        }
        let _json = {};
        if ( /^1[34578]\d{9}$/.test(_this.state.account) ) {
          _json = {"mobile" : _this.state.account,"passwd" : _this.state.password };
        }else if ( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(_this.state.account) ) {
          _json = {"email" : _this.state.account,"passwd" : _this.state.password };
        }
        _this.setState({
          submit:"loading"
        })
        fetch(
          appConfig.logurl,{
          method: "POST",
          contentType: "application/json; charset=utf-8",
          body:JSON.stringify(_json)
         }).then(function(response) {
          return response.json()
         }).then(function(json) {
          if (json.result=="0") {
            // 储存cookie
            if (_this.state.save) {
              const data = new Date((Date.parse(new Date())+604800000));
              cookie.setItem('token',json.data.token,data,"/");
              cookie.setItem('digest',json.data.digest,data,"/");
            }else {
              cookie.setItem('token',json.data.token,null,"/");
              cookie.setItem('digest',json.data.digest,null,"/");
            }
            // 数据储存到 redux
            _this.props.dispatch({
              type:'USER_ADD',
              data:json.data
            })
            // 返回到上次操作
              // 如果 PreURL 堆栈为 1 ，那么
              if (_this.props.Nav.PreURL.length == 1) {
                let _data = assign({},_this.props.Nav);

                _data.RightContent='successful';

                _data.navtitle = ['潜游时光'];
                _data.PreURL = ['/'];
                _data.leftContent = {
                  return:false,
                  logo:'home'
                };

                _data.hidden = false;
                _data.selectedTab = 'Home';

                _this.props.dispatch({type:'Chan_Nav',data:_data});
                _this.context.router.push('/');
              }else if (_this.props.Nav.PreURL.length == 2) {
                // 如果 PreURL 堆栈为 2 ，那么返回上一页,并且显示 下方导航
                let _data = assign({},_this.props.Nav);
                let _Url =_this.props.Nav.PreURL[(_data.PreURL.length-2)]

                _data.RightContent='successful';

                _data.navtitle.pop();
                _data.PreURL.pop();
                _data.leftContent = {
                  return:false,
                  logo:'home'
                };
                _data.hidden = false;
                _this.props.dispatch({type:'Chan_Nav',data:_data})
                _this.context.router.push(_Url);
              }else {
                // 如果 PreURL 堆栈为 2以上，那么返回上一页
                let _data = assign({},_this.props.Nav);
                let _Url =_this.props.Nav.PreURL[(_data.PreURL.length-2)]


                _data.RightContent='successful';

                _data.navtitle.pop();
                _data.PreURL.pop();
                _this.props.dispatch({type:'Chan_Nav',data:_data})
                _this.context.router.push(_Url);
              }
          }else {
            alert("登录失败，原因"+json.message)
          }
          _this.setState({
            submit:true
          })
        })
      }.bind(this)} type="ghost">登录</Button>
    }else if (this.state.submit == "loading") {
      return <Button className="btn" onClick={function(){}.bind(this)} loading>登录</Button>
    }
  }
  accountFilter = (event) => {
    this.setState({
      account:event.target.value
    })
    if ( event.target.value != "" && this.state.password.length >= 8 ) {
      this.setState({
        submit:true
      })
    }else {
      this.setState({
        submit:false
      })
    }
  }
  passwordFilter = (event) => {
    this.setState({
      password:event.target.value
    })
    if ( this.state.account != "" && event.target.value.length >= 8 ) {
      this.setState({
        submit:true
      })
    }else {
      this.setState({
        submit:false
      })
    }
  }
  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
          <div className={styles.newInput}>
            <div>
              <input placeholder="账号" value={this.state.account} onChange={function(){this.accountFilter(event)}.bind(this)}/>
            </div>
          </div>
        <WhiteSpace size="lg" />
          <div className={styles.newInput}>
            <div>
              <input placeholder="密码" type={this.state.passwordType} value={this.state.password} onChange={function(){this.passwordFilter(event)}.bind(this)}/>
              <div className={styles.eyeSvg}
                onClick={function(){
                  if (this.state.eye == eye) {
                    this.setState({passwordType:'text',eye:eye_hover})
                  }else if (this.state.eye == eye_hover) {
                    this.setState({passwordType:'password',eye:eye})
                  }
                }.bind(this)}
                style={{
                  width: '0.44rem',
                  height: '0.44rem',
                  background: 'url('+this.state.eye+') center center /  0.42rem 0.42rem no-repeat'
                }}>
              </div>
            </div>
          </div>
        <WhiteSpace size="lg" />
        <WingBlank size="md">
          <div className={styles.divInput}>
          <div className="btn-container">
            <div>
            {this.renderSubmit()}
            </div>
          </div>
          </div>
        </WingBlank>

        <WhiteSpace size="lg" />

        <Flex>
          <Flex.Item>
            <AgreeItem data-seed="logId" onChange={function(event){
              this.setState({save:event.target.checked});
            }.bind(this)}>
              自动保存密码
            </AgreeItem>
          </Flex.Item>
        </Flex>

        <WhiteSpace size="lg" />

        <WingBlank>
          <div className={styles.loginLink}>
            <div className={styles.loginLinkL} onClick={function(event){
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('找回密码');
                _data.PreURL.push('/Cent/forget');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });

                _this.context.router.push('/Cent/forget');
            }.bind(this)}><div
              style={{
                width: '0.36rem',
                height: '0.36rem',
                background: 'url('+findback+') center center /  0.36rem 0.36rem no-repeat'
              }}/>找回密码</div>
            <div className={styles.loginLinkR} onClick={function(event){
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('注册账号');
                _data.PreURL.push('/Cent/signup');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });

                _this.context.router.push('/Cent/signup');
            }.bind(this)}><div
              style={{
                width: '0.36rem',
                height: '0.36rem',
                background: 'url('+register+') center center /  0.36rem 0.36rem no-repeat'
              }}/>注册账号</div>
          </div>
        </WingBlank>
      </div>
    )
  }
}

login.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  user:state.reducer.user,
  routing:state.routing.locationBeforeTransitions
})


export default login = connect(
  mapStateToProps
)(login)
