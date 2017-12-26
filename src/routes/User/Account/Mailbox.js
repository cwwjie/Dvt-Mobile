import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';

import { Toast, WhiteSpace, List, Modal } from 'antd-mobile';


class Mailbox extends Component {
  constructor(props) {
    super(props);
    
    this.returnURL = localStorage.getItem('returnURL');
    localStorage.removeItem('returnURL');

    this.state = {
      'password': '',
      'passwordType': 'password',
      'mailbox': '',
    };
    
    this.codeCount = 60;
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

  submitData() {
    const _this = this;

    if (this.state.password === '') {
      Modal.alert('数据有误', '原密码不能为空！');
      return
    }

    if (this.state.password.length < 8) {
      Modal.alert('数据有误', '原密码应该大于8位！');
      return
    }

    if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.state.mailbox) === false) {
      Modal.alert('数据有误', '你输入的邮箱不正确');
      return
    }

    const fetchBody = JSON.stringify({
      'passwd': this.state.password,
      'email': this.state.mailbox
    })

    Toast.loading('正在提交..');
    fetch(`${config.URLversion}/user/updateEmail.do`, {
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'headers':{
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      },
      body: fetchBody
    }).then(
      (response) => ( response.json() ),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      Toast.hide();
      if (json.result === '0') {
        Modal.alert('绑定邮箱成功', '恭喜你已成功绑定您的邮箱!!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/index'));
          },
          style: 'default'
        }]);
      } else if (json.result === '-6') {
        Modal.alert('绑定邮箱失败', '你输入的密码有误!');
      } else if (json.result === '-7') {
        Modal.alert('绑定邮箱失败', '此邮箱已被绑定!');
      } else {
        Modal.alert('绑定邮箱失败', `请求服务器成功, 但是请求数据有误! 原因: ${json.message}`);
      }
    }).catch((error) => {
      Toast.hide();
      Modal.alert('请求出错', `向服务器发起请求绑定邮箱失败, 原因: ${error}`);
    })
  }

  render() {
    return (
      <div className="Account">
        <MyNavBar
          navName='绑定邮箱'
          returnURL={this.returnURL || '/user/personal/account'}
        />

        <WhiteSpace size="lg" />

        <div className="Account-input">
          <input 
            placeholder="请输入您的密码" 
            type={this.state.passwordType}
            value={this.state.password} 
            onChange={(event) => this.setState({'password': event.target.value})}
          />
          {this.renderEyeSvg()}
        </div>

        <div className="Account-input">
          <input 
            placeholder="新邮箱" 
            value={this.state.mailbox} 
            onChange={(event) => this.setState({'mailbox': event.target.value})}
          />
        </div>

        <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.submitData.bind(this)}>绑定新邮箱</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Mailbox);
