import assign from 'lodash.assign'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import { WhiteSpace , WingBlank , Button , Toast} from 'antd-mobile';

import cookie from './../../cookie.js';
import appConfig from './../../../config/index.js';

import eye from './../svg/eye.svg';
import eye_hover from './../svg/eye_hover.svg';

import styles from './../index.scss';


class phone extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      submit:false,   // false true loading
      mobile:"",
      password:"",
      messageContent:"",
      passwordType:"password",
      renderVerification:true,
      VerificationCode:false,
      count:60,
      eye:eye,
    };
  }

  renderSubmit = () => {
    if (this.state.submit == false) {
      return <Button className="btn" style={{color:"#888"}} onClick={function(){
        if ( this.state.password.length < 8 ) {Toast.info('密码应该大于8位', 2, null, false );return}
        else if ( !(/^1[34578]\d{9}$/.test(this.state.mobile)) ) {Toast.info('手机不正确', 2, null, false );return}
        else if ( !this.state.VerificationCode ) {Toast.info('验证码不通过', 2, null, false );return}
      }.bind(this)}>修改</Button>
    }else if (this.state.submit == true) {
      return <Button className="btn" onClick={function(){
        this.setState({submit:'loading'})
        const _this = this;
        const _json = {
          authAction: "updateMob",
          passwd:_this.state.password,
          mobile:_this.state.mobile,
          messageContent:_this.state.messageContent
        }
        fetch(
          appConfig.updateMobile,{
          method: "POST",
          headers:{
            token:cookie.getItem('token'),
            digest:cookie.getItem('digest')
          },
          contentType: "application/json; charset=utf-8",
          body:JSON.stringify(_json)
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          if (json.result=="0") {
            Toast.success('恭喜你绑定手机成功!!!', 1);
            // 这里返回上一页
            let _data = assign({},_this.props.Nav);
            let _Url = _this.props.Nav.PreURL[(_data.PreURL.length-2)]
            _data.PreURL.pop();
            _data.navtitle.pop();
            _this.props.dispatch({type:'Chan_Nav',data:_data})
            _this.context.router.push(_Url);
          }else {
            Toast.fail('提交失败，原因'+json.message, 2, () => {
              _this.setState({submit:true})
            });
          }
        })
      }.bind(this)} type="ghost">修改</Button>
    }else if (this.state.submit == "loading") {
      return <Button className="btn" onClick={function(){}.bind(this)} loading>修改</Button>
    }
  }

  passwordFilter = (event) => {
    let _state = assign({},this.state);
    _state.password = event.target.value;
    if ( event.target.value.length >= 8 && /^1[34578]\d{9}$/.test(this.state.mobile) && this.state.VerificationCode && this.state.messageContent.length == 6 ) {
      _state.submit = true;
    }else {
      _state.submit = false;
    }
    this.setState(_state)
  }

  mobileFilter = (event) => {
    let _state = assign({},this.state);
      _state.mobile = event.target.value
    if ( this.state.password.length >= 8 && /^1[34578]\d{9}$/.test(event.target.value) && this.state.VerificationCode && this.state.messageContent.length == 6 ) {
      _state.submit = true;
    }else {
      _state.submit = false;
    }
    this.setState(_state)
  }

  messageContentFilter = (event) => {
    let _state = assign({},this.state);
    if (event.target.value.length == 6) {
      _state.VerificationCode = true;
    }else {
      _state.VerificationCode = false;
    }
    _state.messageContent = event.target.value
    if ( this.state.password >= 8 && /^1[34578]\d{9}$/.test(this.state.mobile) && _state.VerificationCode && event.target.value.length == 6 ) {
      _state.submit = true;
    }else {
      _state.submit = false;
    }
    this.setState(_state)
  }

  renderVerification = () => {
    let _message = "点击获取"
    if (this.state.renderVerification) {
      return <div className={styles.Code} onClick={function(){
        const _this = this;
        if ( _this.state.password < 8 ) {
          Toast.info('请输入你的密码', 2, null, false );
          return
        }else if ( !(/^1[34578]\d{9}$/.test(_this.state.mobile)) ) {
          Toast.info('请输入新的手机号码', 2, null, false );
          return
        }
        _message = "正在获取"
        const _json = {
          mobile:_this.state.mobile,
          authAction:"updateMob"
        }
        fetch(
          appConfig.getMobileCode,{
          method: "POST",
          contentType: "application/json; charset=utf-8",
          body:JSON.stringify(_json)
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          if (json.result=="0") {
            _this.setState({
              renderVerification:false
            })
            for(var i = 0; i < 60; i++ ){
              (function(x){
                setTimeout(function(){
                  let _state = assign({},_this.state);
                  _state.count = _this.state.count - 1;
                  _this.setState(_state);
                  if (x === 59) {
                    let _state = assign({},_this.state);
                    _state.count = 60;
                    _state.renderVerification=true;
                    _this.setState(_state);
                  }
                },x*1000)
              })(i)
            }
          }else {
            Toast.fail('获取验证码失败，原因'+json.message, 2, () => {
            });
          }
          _message = "点击获取"
        })
      }.bind(this)}>{_message}</div>
    }else {
      return <div className={styles.Code}>{this.state.count}</div>
    }
  }

  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
          <div className={styles.newInput}>
            <div>
              <input placeholder="输入你的密码" id="password" type={this.state.passwordType} value={this.state.password} onChange={function(){this.passwordFilter(event)}.bind(this)}/>
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
          <div className={styles.newInput}>
            <div>
            <input placeholder="新的手机号码" value={this.state.mobile} onChange={function(){this.mobileFilter(event)}.bind(this)}/>
            </div>
          </div>
        <WhiteSpace size="lg" />
          <div className={styles.VerificationCode}>
            <div>
            <input placeholder="验证码" value={this.state.messageContent} onChange={function(){this.messageContentFilter(event)}.bind(this)}/>
            {this.renderVerification()}
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
      </div>
    )
  }
}


phone.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  user:state.reducer.user,
  routing:state.routing.locationBeforeTransitions
})

export default phone = connect(
  mapStateToProps
)(phone)






