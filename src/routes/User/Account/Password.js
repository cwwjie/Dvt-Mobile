import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';

import { Toast, WhiteSpace, List, Modal } from 'antd-mobile';


class Password extends Component {
  constructor(props) {
    super(props);
    
    this.returnURL = localStorage.getItem('returnURL');
    localStorage.removeItem('returnURL');

    this.state = {
      'oldPassword': '',
      'newPassword': '',
      'passwordType': 'password',
    };
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

    if (this.state.oldPassword === '') {
      Modal.alert('数据有误', '原密码不能为空！');
      return
    }

    if (this.state.oldPassword.length < 8) {
      Modal.alert('数据有误', '原密码应该大于8位！');
      return
    }

    if (this.state.newPassword === '') {
      Modal.alert('数据有误', '新密码不能为空！');
      return
    }

    if (this.state.newPassword.length < 8) {
      Modal.alert('数据有误', '新密码应该大于8位！');
      return
    }

    if (this.state.oldPassword === this.state.newPassword) {
      Modal.alert('数据有误', '旧密码不能与新密码相同！');
      return
    }

    const fetchBody = JSON.stringify({
      'oldPw': this.state.oldPassword,
      'newPw': this.state.newPassword
    })

    Toast.loading('正在提交..');
    fetch(`${config.URLversion}/user/changePw.do`, {
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
        Modal.alert('修改密码成功', '恭喜你已成功修改您的密码!!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/index'));
          },
          style: 'default'
        }]);
      } else if (json.result === '-6') {
        Modal.alert('修改密码失败', '你输入的原密码有误');
      } else {
        Modal.alert('修改密码失败', `请求服务器成功, 但是请求数据有误! 原因: ${json.message}`);
      }
    }).catch((error) => {
      Toast.hide();
      Modal.alert('请求出错', `向服务器发起请求修改密码失败, 原因: ${error}`);
    })
  }

  render() {
    return (
      <div className="Account">
        <MyNavBar
          navName='修改密码'
          returnURL={this.returnURL || '/user/personal/account'}
        />

        <WhiteSpace size="lg" />

        <div className="Account-input">
          <input 
            placeholder="原密码" 
            value={this.state.oldPassword} 
            onChange={(event) => this.setState({'oldPassword': event.target.value})}
          />
        </div>

        <div className="Account-input">
          <input 
            placeholder="新密码" 
            type={this.state.passwordType}
            value={this.state.newPassword} 
            onChange={(event) => this.setState({'newPassword': event.target.value})}
          />
          {this.renderEyeSvg()}
        </div>


        <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.submitData.bind(this)}>修改密码</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Password);
