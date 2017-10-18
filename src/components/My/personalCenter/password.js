import assign from 'lodash.assign'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import { WhiteSpace , WingBlank , Button , Toast} from 'antd-mobile';

import cookie from './../../../method/cookie.js';
import appConfig from './../../../config/index.js';

import eye from './../svg/eye.svg';
import eye_hover from './../svg/eye_hover.svg';

import styles from './../index.scss';


class password extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      submit:false,   // false true loading
      oldPassword:"",
      newPassword:"",
      passwordType:"password",
      eye:eye,
    };
  }
  renderSubmit = () => {
    if (this.state.submit == false) {
      return <Button className="btn" style={{color:"#888"}}  onClick={function(){
        if ( this.state.oldPassword.length < 8 ) {Toast.info('原密码应该大于8位', 2, null, false );return}
        else if ( this.state.newPassword.length < 8 ) {Toast.info('新密码应该大于8位', 2, null, false );return}
      }.bind(this)}>修改</Button>
    }else if (this.state.submit == true) {
      return <Button className="btn" onClick={function(){
        if (this.state.oldPassword == this.state.newPassword) {
          Toast.info('旧密码不能与新密码相同', 2, null, false);
          return
        }
        this.setState({submit:'loading'})
        const _this = this;
        const _json = {
          oldPw:_this.state.oldPassword,
          newPw:_this.state.newPassword
        }
        fetch(
          appConfig.changePw,{
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
            Toast.success('修改密码成功!!!', 1);
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
  oldPasswordFilter = (event) => {
    this.setState({
      oldPassword:event.target.value
    })
    if (event.target.value.length > 8 && this.state.newPassword.length > 8) {
      this.setState({submit:true})
    }else {
      this.setState({submit:false})
    }
  }
  newPasswordFilter = (event) => {
    this.setState({
      newPassword:event.target.value
    })
    if (event.target.value.length > 8 && this.state.oldPassword.length > 8) {
      this.setState({submit:true})
    }else {
      this.setState({submit:false})
    }
  }
  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
          <div className={styles.newInput}>
            <div>
              <input placeholder="旧密码" id="oldPassword" value={this.state.oldPassword} onChange={function(){this.oldPasswordFilter(event)}.bind(this)}/>
            </div>
          </div>
        <WhiteSpace size="lg" />
          <div className={styles.newInput}>
            <div>
              <input placeholder="新密码" id="newPassword" type={this.state.passwordType} value={this.state.newPassword} onChange={function(){this.newPasswordFilter(event)}.bind(this)}/>
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
      </div>
    )
  }
}


password.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  user:state.reducer.user,
  routing:state.routing.locationBeforeTransitions
})

export default password = connect(
  mapStateToProps
)(password)






