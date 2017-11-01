import { connect } from 'react-redux'
import React, {Component} from 'react';
import assign from 'lodash.assign';
import appConfig from './../../../config/index.js';
import cookie from './../../../method/cookie.js';

import { WhiteSpace , List } from 'antd-mobile';

import styles from './../index.scss';

const Item = List.Item;
const Brief = Item.Brief;

class Passenger extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      'data': []
    };

    this.jumpToEdit.bind(this);
  }

  componentWillMount(){
    this.setState({'data': this.props.Passenger.data})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({'data': nextProps.Passenger.data});
  }

  jumpToADD() {
    const _this = this;
    // 页面跳转
    let navData = assign({}, this.props.Nav);

    navData.navtitle.push("编辑旅客信息");
    navData.PreURL.push("/Cent/Passenger/edit");

    this.props.dispatch({
      'type': 'Chan_Nav',
      'data': navData
    });

    this.props.dispatch({
      'type': 'select_Passenger',
      'data': {
        'type': 'add',
        'select': false
      }
    })

    this.context.router.push('/Cent/Passenger/edit');
  }

  renderList() {
    const _this = this;

    return this.state.data.map((value, ref) => (
      <div>
        <WhiteSpace size="lg" />
          <List>
            <div onClick={() => { _this.jumpToEdit(ref) }}>
              <Item extra={'编辑'} arrow="horizontal" multipleLine>
                {value.chineseName}
                <Brief>{value.pinyinName}</Brief>
              </Item>
            </div>
          </List>
      </div>
    ))
  }

  jumpToEdit(ref) {
    let navData = assign({}, this.props.Nav);

    navData.navtitle.push("编辑旅客信息");
    navData.PreURL.push("/Cent/Passenger/edit");

    this.props.dispatch({
      'type': 'Chan_Nav',
      'data': navData
    });

    this.props.dispatch({
      'type': 'select_Passenger',
      'data': {
        'type': 'edit',
        'select': ref
      }
    })

    this.context.router.push('/Cent/Passenger/edit');
  }

  render() {
    return (
      <div style={{'position': 'relative'}}>
        <div style={{'width': '100%', 'textAlign': 'center', 'position':  'absolute', 'padding': '20px 0px 0px 0px'}}>
          暂无数据
        </div>
        {this.renderList.call(this)}
        <div className={styles.bottomPay}>
          <div className={styles.bottomPay} onClick={this.jumpToADD.bind(this)}>新增旅客信息</div>
        </div>
      </div>
    )
  }
}



Passenger.contextTypes = {
  router: Object
}
const mapStateToProps = (state, ownProps) => ({
  Passenger:state.reducer.Passenger,
  Nav:state.reducer.Nav,
  // routing:state.routing.locationBeforeTransitions
})


export default Passenger = connect(
  mapStateToProps
)(Passenger)













