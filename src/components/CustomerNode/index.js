import React, {Component} from 'react';
import { connect } from 'dva';
import { List, WhiteSpace, Modal } from 'antd-mobile';

import weche from './../../assets/weche.svg';
import WeChatOfficialAccounts from './../../assets/WeChatOfficialAccounts.svg';
import QQ from './../../assets/QQ.svg';
import divingtime from './../../assets/divingtime.png';
import company from './../../assets/company.png';
import weche2Dcode from './../../assets/weche.png';

class CustomerNode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popWeche: false,
      popcompany: false,
    }
  }

  render() {
    return (
      <div className="CustomerService">
        <WhiteSpace size="lg" />
        <List>
          <List.Item
            thumb={weche}
            arrow="horizontal"
            onClick={() => this.setState({ 'popWeche': true})}
          >微信客服</List.Item>
        </List>

        <WhiteSpace size="lg" />
        <List>
          <List.Item
            thumb={WeChatOfficialAccounts}
            arrow="horizontal"
            onClick={() => this.setState({ 'popcompany': true})}
            >公众号</List.Item>
        </List>

        <WhiteSpace size="lg" />
        <List>
          <List.Item
            thumb={QQ}
            arrow="horizontal"
            onClick={() => {
              window.location.href="http://wpa.qq.com/msgrd?v=3&uin=2546623187&site=qq&menu=yes";
            }}
          >QQ</List.Item>
        </List>

        <WhiteSpace size="lg" />
        <List>
          <List.Item
            thumb={divingtime}
            arrow="horizontal"
            onClick={() => {
              window.location.href="https://divet.taobao.com/index.htm?spm=a1z10.1-c.w5002-2373231309.2.2zP0yr";
            }}
          >潜游时光淘宝客服</List.Item>
        </List>

        <Modal
          maskClosable={false}
          popup={true}
          visible={this.state.popWeche}
          animationType="slide-up"
          >
          <div className="Service-Popup">
            <List renderHeader={() => (
              <div className="Popup-Header">
                微信客服
                <span onClick={() => {this.setState({ 'popWeche': false})}}
                >X</span>
              </div>
            )}>
            <WhiteSpace size="lg" />
            <div>
              <img src={weche2Dcode} />
            </div>
            </List>
          </div>
        </Modal>

        <Modal
          maskClosable={false}
          popup={true}
          visible={this.state.popcompany}
          animationType="slide-up"
          >
          <div className="Service-Popup">
            <List renderHeader={() => (
              <div className="Popup-Header">
                公众号
                <span onClick={() => {this.setState({ 'popcompany': false})}}
                >X</span>
              </div>
            )}>
            <WhiteSpace size="lg" />
            <div>
              <img src={company} />
            </div>
            </List>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect()(CustomerNode);
