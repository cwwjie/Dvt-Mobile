import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';

import MyNavBar from './../../../components/MyNavBar/index';

import request from './../../../utils/request';
import config from './../../../config';

import { Button, Flex, WingBlank, WhiteSpace, Toast, Checkbox, Modal } from 'antd-mobile';

class UserForget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignUpByMail: true,

      mailBox: '',
      canMailSubmit: false,

      password: '',
      
      phone: '',
      code: '',
      VerifiCodeName: '获取验证码',
      passwordType: 'password',
      canPhoneSubmit: false,
    };

    this.password = '';
    
    this.mailBox = '';
    this.phone = '';
    this.code = '';
    this.codeCount = 60;

    this.switchSignupBy.bind(this);
    this.checkPhoneBase.bind(this);
    this.checkPhoneValue.bind(this);
  }

  switchSignupBy(type) {
    if (type === 'mailBox') {
      this.setState({
        'isSignUpByMail': true
      })
    } else {
      this.setState({
        'isSignUpByMail': false
      })
    }
  }

  // 不验证 验证码之外的输入
  checkMailBoxBase() {
    if (
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.mailBox) && 
      this.password.length >= 8 
    ) {
      this.setState({ 'canMailSubmit': true });
      return request.success();
    } else {
      this.setState({ 'canMailSubmit': false });
      if (this.mailBox === '') {
        return request.error('邮箱不能为空!');
      }
      if (this.password.length === 0) {
        return request.error('密码不能为空!');
      }
      if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.mailBox) == false) {
        return request.error('邮箱格式不正确!');
      }
      if (this.password.length < 8) {
        return request.error('密码要大于8位!');
      }
    }
  }

  mailBoxFilter(event) {
    this.mailBox = event.target.value;
    this.setState({'mailBox': event.target.value});
    this.checkMailBoxBase.call(this)
  }

  // 不验证 验证码之外的输入
  checkPhoneBase() {
    if (this.phone === '') {
      return request.error('手机号码不能为空!');
    }
    if (/^1[34578]\d{9}$/.test(this.phone) === false ) {
      return request.error('手机号码格式不正确!');
    }

    return request.success();
  }

  // 包含 验证码的所有验证
  checkPhoneValue() {
    let checkBase = this.checkPhoneBase();
    if (checkBase.result !== 1) {
      return checkBase;
    }

    if (this.code === '') {
      return request.error('验证码不能为空!');
    }
    if (this.password === '') {
      return request.error('密码不能为空!');
    }
    if (this.code.length !== 6) {
      return request.error('验证码不正确!');
    }
    if (this.password.length  < 8) {
      return request.error('密码要大于8位!');
    }

    return request.success();
  }

  setPhoneInputState() {
    let checkValue = this.checkPhoneValue();

    if (checkValue.result === 1) {
      this.setState({'canPhoneSubmit': true});
    } else {
      this.setState({'canPhoneSubmit': false});
    }

    this.checkMailBoxBase.call(this);
  }

  phoneFilter(event) {
    this.phone = event.target.value;
    this.setState({'phone': event.target.value}, this.setPhoneInputState.call(this));
  }
  
  codeFilter(event) {
    this.code = event.target.value;
    this.setState({'code': event.target.value}, this.setPhoneInputState.call(this));
  }
  
  passwordFilter(event) {
    this.password = event.target.value;
    this.setState({'password': event.target.value}, this.setPhoneInputState.call(this));
  }

  signupByMail() {
    const _this = this;
    
    Toast.loading('正在提交...');
    
    fetch(`${config.URLversion}/user/register.do`, {
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'body': JSON.stringify({
        'passwd': this.state.password,
        'email': this.state.mailBox
      })
    }).then(
      (response) => (response.json()),
      (error) => ({'result':'1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        Modal.alert('注册成功', '恭喜你注册成功，请马上登录你的邮箱进行激活!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/login'));
          },
          style: 'default'
        }]);
      } else if (json.result === '-7') {
        Modal.alert('注册失败', '该邮箱已被占用!');
      } else {
        Modal.alert('注册失败', `服务器发生错误, 原因: ${json.message}`);
      }
      Toast.hide();
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
      Toast.hide();
    })
  }

  getVerifiCode() {
    const _this = this;
    let checkBase = this.checkPhoneBase();
    if (checkBase.result !== 1) {
      return Toast.info(checkBase.message, 1.5);
    }

    this.setState({VerifiCodeName: '正在获取'});

    fetch(`${config.URLversion}/user/getMobileCode.do`,{
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'body': JSON.stringify({
        'mobile': this.state.phone,
        'authAction': 'register'
      })
    }).then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        for(let i = 0; i < 60; i++ ){
          (function(x){
            setTimeout(() => {
              _this.codeCount--;
              _this.setState({'VerifiCodeName': `${_this.codeCount} 秒重新获取`});

              if (x === 59) {
                _this.codeCount = 60;
                _this.setState({'VerifiCodeName': '获取验证码'});
              }

            }, x * 1000);
          })(i)
        }
      }else {
        _this.setState({'VerifiCodeName': '获取验证码'});
        Modal.alert('数据有误', `获取验证码失败，原因: ${json.message}`);
      }
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
    });

  }

  signupByPhone() {
    const _this = this;

    Toast.loading('正在提交...');

    fetch(`${config.URLversion}/user/registerMobile.do`,{
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'body': JSON.stringify({
        'authAction':'register',
        'mobile': this.state.phone,
        'messageContent': this.state.code,
        'passwd': this.state.password
      })
    }).then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        Modal.alert('注册成功', '恭喜你注册成功!!!', [{
          text: '马上登录',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/login'));
          },
          style: 'default'
        }]);
      } else if (json.result === '-1') {
        Modal.alert('注册失败', '您输入的验证码有误!');
      } else if (json.result === '100022') {
        Modal.alert('注册失败', '该手机号已被占用!');
      }else {
        Modal.alert('注册失败', `服务器发生错误, 原因: ${json.message}`);
      }
      Toast.hide();
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
      Toast.hide();
    });

  }

  renderEyeSvg() {
    const Svgstyle = (Svg) => ({
      'background': `url(${Svg}) center center /  23px 23px no-repeat`
    });

    return this.state.passwordType === 'password' ? <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'text'})
      }}
      style={Svgstyle(eye)}
    /> : <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'password'})
      }}
      style={Svgstyle(eye_hover)}
    />;
  }

  render() {
    const mailBoxStyle = this.state.isSignUpByMail ? { display: 'block' } : { display: 'none' };
    const phoneStyle = this.state.isSignUpByMail ? { display: 'none' } : { display: 'block' };

    const mailBoxsubmitNode = this.state.canMailSubmit ? 
      <div className="submit-btn btn-permit" onClick={this.signupByMail.bind(this)}>注册</div> : 
      <div className="submit-btn btn-primary" onClick={() => {
        let checkValue = this.checkMailBoxBase.call(this);
        Toast.info(checkValue.message, 1.5)}
      }>注册</div>;

    const phonesubmitNode = this.state.canPhoneSubmit ? 
      <div className="submit-btn btn-permit" onClick={this.signupByPhone.bind(this)}>注册</div> : 
      <div className="submit-btn btn-primary" onClick={() => {
        let checkValue = this.checkPhoneValue();
        Toast.info(checkValue.message, 1.5);
      }}>注册</div>;

    const VerifiCodeNode = this.state.VerifiCodeName === '获取验证码' ? 
      <div 
        className="input-verifi"
        onClick={this.getVerifiCode.bind(this)}
      >获取验证码</div> :
      <div className="input-verifi">{this.state.VerifiCodeName}</div>;

    return (
      <div className="User-Login User-Forget">
        <MyNavBar
          navName='注册账号'
          returnURL='/user/login'
        />

        <WhiteSpace size="lg" />

        <div style={mailBoxStyle}>

          <div className="User-input">
            <input 
              placeholder="请输入你的邮箱" 
              value={this.state.mailBox} 
              onChange={this.mailBoxFilter.bind(this)}
            />
          </div>

          <div className="User-input">
            <input 
              placeholder="你的密码" 
              type={this.state.passwordType}
              value={this.state.password} 
              onChange={this.passwordFilter.bind(this)}
            />
            {this.renderEyeSvg()}
          </div>

          <div className="User-submit">
            {mailBoxsubmitNode}
          </div>

        </div>

        <div style={phoneStyle}>
          <div className="User-input">
            <input 
              placeholder="请输入你的手机号码" 
              value={this.state.phone} 
              onChange={this.phoneFilter.bind(this)}
            />
          </div>
          
          <div className="User-input">
            <input 
              placeholder="验证码" 
              value={this.state.code} 
              onChange={this.codeFilter.bind(this)}
            />
            {VerifiCodeNode}
          </div>

          <div className="User-input">
            <input 
              placeholder="你的密码" 
              type={this.state.passwordType}
              value={this.state.password} 
              onChange={this.passwordFilter.bind(this)}
            />
            {this.renderEyeSvg()}
          </div>

          <div className="User-submit">
            {phonesubmitNode}
          </div>
        </div>

        <div className="Forget-select">
          <div
            className={this.state.isSignUpByMail ? "btn-primary" : "btn-actived"}
            onClick={() => {this.switchSignupBy('mailBox')}}
          ><div>邮箱注册</div></div>
          <div 
            className={this.state.isSignUpByMail ? "btn-actived" : "btn-primary"}
            onClick={() => {this.switchSignupBy('phone')}}
          ><div>手机注册</div></div>
        </div>

      </div>
    )
  }
}

let emailHash = {
  'qq.com': 'http://mail.qq.com',
  'gmail.com': 'http://mail.google.com',
  'sina.com': 'http://mail.sina.com.cn',
  '163.com': 'http://mail.163.com',
  '126.com': 'http://mail.126.com',
  'yeah.net': 'http://www.yeah.net/',
  'sohu.com': 'http://mail.sohu.com/',
  'tom.com': 'http://mail.tom.com/',
  'sogou.com': 'http://mail.sogou.com/',
  '139.com': 'http://mail.10086.cn/',
  'hotmail.com': 'http://www.hotmail.com',
  'live.com': 'http://login.live.com/',
  'live.cn': 'http://login.live.cn/',
  'live.com.cn': 'http://login.live.com.cn',
  '189.com': 'http://webmail16.189.cn/webmail/',
  'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
  'yahoo.cn': 'http://mail.cn.yahoo.com/',
  'eyou.com': 'http://www.eyou.com/',
  '21cn.com': 'http://mail.21cn.com/',
  '188.com': 'http://www.188.com/',
  'foxmail.com': 'http://www.foxmail.com',
  'outlook.com': 'http://www.outlook.com'
}

const mapStateToProps = (state) => ({
})

export default connect()(UserForget);
