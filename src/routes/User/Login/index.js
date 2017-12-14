import React, {Component} from 'react';
import { connect } from 'dva';

import MyNavBar from './../../../components/MyNavBar/index';
import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';
import register from './../../../assets/register.svg';
import findback from './../../../assets/findback.svg';

import { Button, Flex, WingBlank, WhiteSpace, Toast, Checkbox } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class UserLogin extends Component {
  constructor(props) {
    super(props);

    this.returnURL = localStorage.getItem('returnURL');
    localStorage.removeItem('returnURL');

    this.state = {
      'submitType': 'default', // 'default' 'loading' 'permit'
      'account': '',
      'password': '',
      'passwordType': 'password',
      'automatiSave': false
    };

    this.accountFilter.bind(this);
  }

  accountFilter(event) {
    this.setState({'account': event.target.value});
  }

  passwordFilter(event) {
    this.setState({'password': event.target.value});
  }

  Svgstyle(Svg) {
    return {
      'background': `url(${Svg}) center center /  23px 23px no-repeat`
    }
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
      style={this.Svgstyle(eye)}
    /> : <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'password'})
      }}
      style={this.Svgstyle(eye_hover)}
    />;
  }

  render() {
    let SubmitNode = ({
      'default': <div className="submit-btn btn-primary">登录</div>,
      'loading': <div className="submit-btn btn-loading"><Button className="btn" loading>登录</Button></div>,
      'permit': <div className="submit-btn btn-permit">登录</div>,
    })[this.state.submitType];

    return (
      <div className="User-Login">
        <MyNavBar
          navName='用户登录'
          returnURL={this.returnURL}
        />

        <WhiteSpace size="lg" />
        <div className="login-input">
          <input 
            placeholder="账号" 
            value={this.state.account} 
            onChange={this.accountFilter.bind(this)}
          />
        </div>

        <div className="login-input">
          <input 
            placeholder="密码" 
            type={this.state.passwordType}
            value={this.state.password} 
            onChange={this.passwordFilter.bind(this)}
          />
          {this.renderEyeSvg()}
        </div>

        <div className="login-submit">
          {SubmitNode}
        </div>

        <Flex>
          <Flex.Item>
            <AgreeItem data-seed="logId" onChange={(event) => {
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
              <span>找回密码</span>
            </div>
            <div className='link-signup'>
              <div style={this.Svgstyle(register)}/>
              <span>注册账号</span>
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
