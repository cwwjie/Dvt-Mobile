import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';

import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';
import register from './../../../assets/register.svg';
import findback from './../../../assets/findback.svg';

import cookies from './../../../utils/cookies';
import request from './../../../utils/request';
import config from './../../../config';

import { Button, Flex, WingBlank, WhiteSpace, Toast, Checkbox, Modal } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class UserLogin extends Component {
  constructor(props) {
    super(props);

    this.returnURL = localStorage.getItem('returnURL');
    localStorage.removeItem('returnURL');

    let automatiSave = localStorage.getItem('automatiSave');
    if (automatiSave) {
      automatiSave = JSON.parse(automatiSave);
    }

    this.state = {
      'submitType': automatiSave ? 'permit' : 'default', // 'default' 'loading' 'permit'
      'account': automatiSave ? automatiSave.account : '',
      'password': automatiSave ? automatiSave.password : '',
      'passwordType': 'password',
      'automatiSave': automatiSave ? true : false
    };

    this.account = automatiSave ? automatiSave.account : '';
    this.password = automatiSave ? automatiSave.password : '';

    this.checkValue.bind(this);
  }

  checkValue() {
    if (this.account == '') {
      return request.error('账号不能为空!');
    }
    if (this.password.length < 8) {
      return request.error('密码不能小于8位数!');
    }

    return request.success();
  }

  setInputState() {
    let checkValue = this.checkValue();

    if (checkValue.result === 1) {
      this.setState({'submitType': 'permit'});
    } else {
      this.setState({'submitType': 'default'});
    }
  }

  accountFilter(event) {
    this.account = event.target.value;
    this.setState({'account': event.target.value}, this.setInputState.call(this));
  }

  passwordFilter(event) {
    this.password = event.target.value;
    this.setState({'password': event.target.value}, this.setInputState.call(this));
  }

  alertdefault() {
    let checkValue = this.checkValue();
    Toast.info(checkValue.message, 1.5);
  }

  submitData() {
    const _this = this;
    let body = {};

    if (
      /^1[34578]\d{9}$/.test( this.state.account ) === false &&
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test( this.state.account) === false
    ) {
      Modal.alert('账号有误', '请输入正确格式的邮箱或手机号码');
      return
    }

    this.setState({'submitType': 'loading'});

    if (/^1[34578]\d{9}$/.test(this.account)) {
      body = {
        'mobile': this.account,
        'passwd': this.password
      };
    } else {
      body = {
        'email': this.account,
        'passwd': this.password
      };
    }

    fetch(`${config.URLversion}/user/login.do`,{
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify(body)
    }).then(
      (response) => (response.json()),
      (error) => ({'result':'1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        const vEnd = new Date( Date.parse( new Date() ) + 604800000 );
        cookies.setItem('token', json.data.token, vEnd, '/');
        cookies.setItem('digest', json.data.digest, vEnd, '/');

        // 如果有自动储存
        if (_this.state.automatiSave) {
          localStorage.setItem('automatiSave', JSON.stringify({
            'account': _this.account,
            'password': _this.password
          }))
        } else {
          localStorage.removeItem('automatiSave');
        }

        if (_this.returnURL) {
          _this.props.dispatch(routerRedux.push(_this.props.returnURL));
        } else {
          _this.props.dispatch(routerRedux.push('/'));
        }

        return
      } else if (json.result == -9) {
        Modal.alert('账户未激活', `您的账号尚未激活`);
      } else if (json.result == -5) {
        Modal.alert('账号不存在', `此账号不存在`);
      } else if (json.result == -6) {
        Modal.alert('密码错误', `您输入的密码是错误, 请输入正确的密码！`);
      } else {
        Modal.alert('数据有误', `请求服务器成功, 但是返回的数据有误! 原因: ${json.message}`);
      }

      this.setState({'submitType': 'permit'});
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
    })
  }

  Svgstyle(Svg) {
    return {
      'background': `url(${Svg}) center center /  23px 23px no-repeat`
    }
  }

  renderEyeSvg() {
    return this.state.passwordType === 'password' ? <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'text'})
      }}
      style={this.Svgstyle(eye)}
    /> : <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'password'})
      }}
      style={this.Svgstyle(eye_hover)}
    />;
  }

  jumpToforget() {
    this.props.dispatch(routerRedux.push('/user/forget'));
  }

  jumpTosignup() {
    this.props.dispatch(routerRedux.push('/user/signup'));
  }

  render() {
    let SubmitNode = ({
      'default': <div className="submit-btn btn-primary" onClick={this.alertdefault.bind(this)}>登录</div>,
      'loading': <div className="submit-btn btn-loading"><Button className="btn" loading>登录</Button></div>,
      'permit': <div className="submit-btn btn-permit" onClick={this.submitData.bind(this)}>登录</div>,
    })[this.state.submitType];

    return (
      <div className="User-Login">
        <MyNavBar
          navName='用户登录'
          returnURL={this.returnURL}
        />

        <WhiteSpace size="lg" />
        <div className="User-input">
          <input 
            placeholder="账号" 
            value={this.state.account} 
            onChange={this.accountFilter.bind(this)}
          />
        </div>

        <div className="User-input">
          <input 
            placeholder="密码" 
            type={this.state.passwordType}
            value={this.state.password} 
            onChange={this.passwordFilter.bind(this)}
          />
          {this.renderEyeSvg()}
        </div>

        <div className="User-submit">
          {SubmitNode}
        </div>

        <Flex>
          <Flex.Item>
            <AgreeItem
              defaultChecked={this.state.automatiSave}
              data-seed="logId" 
              onChange={(event) => {
              this.setState({'automatiSave': event.target.checked})
            }}>
              自动保存密码
            </AgreeItem>
          </Flex.Item>
        </Flex>

        <WhiteSpace size="lg" />

        <WingBlank>
          <div className='login-link'>
            <div className='link-forget'>
              <div style={this.Svgstyle(findback)}/>
              <span onClick={this.jumpToforget.bind(this)}>找回密码</span>
            </div>
            <div className='link-signup'>
              <div style={this.Svgstyle(register)}/>
              <span onClick={this.jumpTosignup.bind(this)}>注册账号</span>
            </div>
          </div>
        </WingBlank>
      </div>
    )
  }
}

 


const mapStateToProps = (state) => ({
})

export default connect()(UserLogin);
