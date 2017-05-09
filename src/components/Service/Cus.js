import { connect } from 'react-redux'
import React, {Component} from 'react';

import { Popup , List , WhiteSpace } from 'antd-mobile';

import styles from './styles.scss'
import QQ from './QQ.svg';
import weche from './weche.svg';
import weche2Dcode from './weche.jpg';
import divingtime from './divingtime.png';

const Item = List.Item;
const Brief = Item.Brief;


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: (e) => {
      Popup.hide();
      e.preventDefault();
    },
  };
}

class Cus extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      sel: ''
    };
  }
  _onClick = () => {
    Popup.show(<div>
      <div>123</div>
    </div>, { animationType: 'slide-up', maskProps, maskClosable: false });
  };
  _onClose = (sel) => {
    this.setState({ sel });
    Popup.hide();
  };
  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
        <List>
          <Item
            thumb={weche}
            arrow="horizontal"
            onClick={function(){
              Popup.show(<div>
                <div className={styles.Popup}>
                  <img src={weche2Dcode} />
                </div>
              </div>, { animationType: 'slide-up', maskProps, maskClosable: false });
            }.bind(this)}
          >微信</Item>
        </List>
        <WhiteSpace size="lg" />
        <List>
          <Item
            thumb={QQ}
            arrow="horizontal"
            onClick={() => {
              window.location.href="http://wpa.qq.com/msgrd?v=3&uin=2546623187&site=qq&menu=yes";
            }}
          >QQ</Item>
        </List>
        <WhiteSpace size="lg" />
        <List>
          <Item
            thumb={divingtime}
            arrow="horizontal"
            onClick={() => {
              window.location.href="https://divet.taobao.com/index.htm?spm=a1z10.1-c.w5002-2373231309.2.2zP0yr";
            }}
          >潜游时光淘宝客服</Item>
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  routing:state.routing.locationBeforeTransitions
})


export default Cus = connect(
  mapStateToProps
)(Cus)
