import assign from 'lodash.assign'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import { WhiteSpace , WingBlank , Button , Toast} from 'antd-mobile';

import cookie from './../../cookie.js';
import appConfig from './../../../config/index.js';

import eye from './../svg/eye.svg';
import eye_hover from './../svg/eye_hover.svg';

import styles from './../index.scss';


class mailbox extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      submit:false,   // false true loading
      mailBox:"",
      password:"",
      passwordType:"password",
      eye:eye,
    };
  }
  renderSubmit = () => {
    if (this.state.submit == false) {
      return <Button className="btn" style={{color:"#888"}}  onClick={function(){
        if ( this.state.password.length < 8 ) {Toast.info('密码应该大于8位', 2, null, false );return}
        else if ( !(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.state.mailBox)) ) {Toast.info('邮箱不正确', 2, null, false );return}
      }.bind(this)}>修改</Button>
    }else if (this.state.submit == true) {
      return <Button className="btn" onClick={function(){
        this.setState({submit:'loading'})
        const _this = this;
        const _json = {
          passwd:_this.state.password,
          email:_this.state.mailBox
        }
        fetch(
          appConfig.updateEmail,{
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
            Toast.success('修改邮箱成功!!!', 1);
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
    this.setState({
      password:event.target.value
    })
    if ( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.state.mailBox) && event.target.value.length > 8 ) {
      this.setState({submit:true})
    }else {
      this.setState({submit:false})
    }
  }
  mailBoxFilter = (event) => {
    this.setState({
      mailBox:event.target.value
    })
    if ( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(event.target.value) && this.state.password.length > 8 ) {
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
            <input placeholder="新的登录邮箱" id="mailBox" value={this.state.mailBox} onChange={function(){this.mailBoxFilter(event)}.bind(this)}/>
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


mailbox.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  user:state.reducer.user,
  routing:state.routing.locationBeforeTransitions
})

export default mailbox = connect(
  mapStateToProps
)(mailbox)






