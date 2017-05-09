import { connect } from 'react-redux'
import React, {Component} from 'react';


import { WhiteSpace , WingBlank , Button , Toast} from 'antd-mobile';


import assign from 'lodash.assign'
import cookie from './../../cookie.js';
import appConfig from './../../../config/index.js';
import eye from '../eye.svg';
import eye_hover from '../eye_hover.svg';
import styles from '../styles.scss';




const _display = {
  border:'none',
  color: '#fff',
  backgroundColor: '#eee'
}

class forget extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      submit:false,// 提交 false loading mailBox mobile

      mailBox:'',// 邮箱的值

      mobile:'',// 手机的值

      Code:'',// 验证码的值
      renderVerification:true,// true 显示'点击获取' 、 false 显示 '倒计时'
      VerificationCode:false, // 验证码是否通过
      count:60,// 倒计时相关

      password:'',// 密码的值
      passwordType:"password",// 眼睛
      eye:eye,// 眼睛

      NameType:'找回',
      Mailtype:_display,// 密码找回 灰色样式
      Phonetype:{},// 密码找回 灰色样式
      displayMail:'block',
      PhoneMail:'none',
    };
  }
  renderSubmit = () => {
    if (this.state.submit == false) {
      return <Button className="btn" style={{color:"#888"}}  onClick={function(){
        // 如果是 手机
        if ( this.state.displayMail=='none' && this.state.PhoneMail=='block' ) {
          if ( !(/^1[34578]\d{9}$/.test(this.state.mobile)) ) {
            Toast.info('手机格式不正确', 2, null, false );return
          }else if (this.state.password < 8) {
            Toast.info('新密码要大于8位', 2, null, false );return
          }else if (this.state.Code.length != 6) {
            Toast.info('验证码不正确', 2, null, false );return
          }
        // 如果是邮箱
        }else if ( this.state.displayMail=='block' && this.state.PhoneMail=='none' ) {
          if (!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.state.mailBox)) ) {Toast.info('邮箱不正确', 2, null, false );return}
        }
      }.bind(this)}>{this.state.NameType}</Button>
    }else if (this.state.submit == 'mailBox') {
      return <Button className="btn" onClick={function(){
        this.setState({submit:'loading'})
        const _this = this;
        fetch(
          appConfig.forgeturl + '?email=' + _this.state.mailBox,{
          method: "GET",
          contentType: "application/json; charset=utf-8"
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          if (json.result=="0") {
            Toast.success('已将重置链接发至您的邮箱!!!', 1);
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
      }.bind(this)} type="ghost">找回</Button>
    }else if (this.state.submit == 'mobile') {
      return <Button className="btn" onClick={function(){
        this.setState({submit:'loading'})
        const _this = this;
        const _json = {
          passwd:_this.state.password,
          authAction:'forgetPw',
          messageContent:_this.state.Code,
          mobile:_this.state.mobile
        }
        fetch(
          appConfig.forgetPwtToMob,{
          method: "POST",
          contentType: "application/json; charset=utf-8",
          body:JSON.stringify(_json)
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          if (json.result=="0") {
            Toast.success('恭喜你密码重置成功!!!', 1);
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
      }.bind(this)} type="ghost">重置</Button>
    }else if (this.state.submit == "loading") {
      return <Button className="btn" onClick={function(){}.bind(this)} loading>找回</Button>
    }
  }
  renderVerification = () => {
    let _message = "点击获取"
    if (this.state.renderVerification) {
      return <div className={styles.Code} onClick={function(){
        const _this = this;
        // 过滤
        if ( !(/^1[34578]\d{9}$/.test(_this.state.mobile)) ) {
          Toast.info('请输入新的手机号码', 2, null, false );
          return
        }
        _message = "正在获取"
        const _json = {
          mobile:_this.state.mobile,
          authAction:"forgetPw"
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
  mailBoxFilter = (event) => {
    this.setState({
      mailBox:event.target.value
    })
    if ( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(event.target.value) && this.state.displayMail=='block' && this.state.PhoneMail=='none' ) {
      this.setState({submit:'mailBox'})
    }else {
      this.setState({submit:false})
    }
  }
  mobileFilter = (event) => {
    let _state = assign({},this.state);
      _state.mobile = event.target.value
    if ( this.state.password.length >= 8 && /^1[34578]\d{9}$/.test(event.target.value) && this.state.VerificationCode && this.state.Code.length == 6 ) {
      _state.submit = 'mobile';
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
    _state.Code = event.target.value
    if ( this.state.password >= 8 && /^1[34578]\d{9}$/.test(this.state.mobile) && _state.VerificationCode && event.target.value.length == 6 ) {
      _state.submit = 'mobile';
    }else {
      _state.submit = false;
    }
    this.setState(_state)
  }
  passwordFilter = (event) => {
    let _state = assign({},this.state);
    _state.password = event.target.value;
    if ( event.target.value.length >= 8 && /^1[34578]\d{9}$/.test(this.state.mobile) && this.state.VerificationCode && this.state.Code.length == 6 ) {
      _state.submit = 'mobile';
    }else {
      _state.submit = false;
    }
    this.setState(_state)
  }
  render() {
    return (
      <div>
        <div style={{display:this.state.displayMail}}>
          <WhiteSpace size="lg" />
            <div className={styles.newInput}>
              <div>
                <input placeholder="您的邮箱" value={this.state.mailBox} onChange={function(){this.mailBoxFilter(event)}.bind(this)}/>
              </div>
            </div>
          <WhiteSpace size="lg" />
        </div>
        <div style={{display:this.state.PhoneMail}}>
          <WhiteSpace size="lg" />
            <div className={styles.newInput}>
              <div>
                <input placeholder="您的手机" value={this.state.mobile} onChange={function(){this.mobileFilter(event)}.bind(this)}/>
              </div>
            </div>
          <WhiteSpace size="lg" />
            <div className={styles.VerificationCode}>
              <div>
              <input placeholder="验证码" value={this.state.Code} onChange={function(){this.messageContentFilter(event)}.bind(this)}/>
              {this.renderVerification()}
              </div>
            </div>
          <WhiteSpace size="lg" />
            <div className={styles.newInput}>
              <div>
                <input placeholder="输入你的新密码" id="password" type={this.state.passwordType} value={this.state.password} onChange={function(){this.passwordFilter(event)}.bind(this)}/>
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
        </div>
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
          <div className={styles.forget}>
            <div className={styles.forgetMail}><div onClick={function(){
              if ( this.state.displayMail=='none' && this.state.PhoneMail=='block' ) {
                let _state = assign({},this.state);
                _state.Phonetype = {};
                _state.Mailtype=_display;
                _state.displayMail='block';
                _state.PhoneMail='none';
                _state.NameType="找回"
                _state.submit=false;
                this.setState(_state);
              }
            }.bind(this)} style={this.state.Mailtype}>邮箱找回</div></div>
            <div className={styles.forgetPhone}><div onClick={function(){
              if ( this.state.displayMail=='block' && this.state.PhoneMail=='none' ) {
                let _state = assign({},this.state);
                _state.Mailtype = {};
                _state.Phonetype=_display;
                _state.displayMail='none';
                _state.PhoneMail='block';
                _state.submit=false;
                _state.NameType="重置"
                this.setState(_state);
              }
            }.bind(this)} style={this.state.Phonetype}>手机找回</div></div>
          </div>
      </div>
    )
  }
}


forget.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  user:state.reducer.user,
  routing:state.routing.locationBeforeTransitions
})

export default forget = connect(
  mapStateToProps
)(forget)






