import { connect } from 'react-redux'
import React, {Component} from 'react';
import moment from 'moment';
import dateToFormat from './dateToFormat.js';

import { WhiteSpace , WingBlank , List , DatePicker , Stepper , Modal , Toast } from 'antd-mobile';


import appConfig from './../../../config/index.js';
import styles from './styles.scss';
import assign from 'lodash.assign'



let nawDate = new Date();
nawDate = dateToFormat(nawDate)+' +0800';
const minDate = moment(nawDate,'YYYY-MM-DD Z');





class travel extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      modal: false,

      choke:false, // 阻塞

      date:null,

      Num:1,

      productPrice:null,
      promotePrice:null,
      totalPrice:null
    }
  }
  componentDidMount() {
    const _this = this
    // 过滤
    if (_this.props.product.productId == null || _this.props.product.productId != _this.props.Nav.productId) {
      this.setState({
        modal:true
      })
      return
    }
    const _total = _this.props.product.productInfor.productPrice - _this.props.product.productInfor.promotePrice;
    _this.setState({
      productPrice:_this.props.product.productInfor.productPrice,
      promotePrice:_this.props.product.productInfor.promotePrice,
      totalPrice:_total
    });
  }
  showModal = key => (e) => {
    // 现象：如果弹出的弹框上的 x 按钮的位置、和手指点击 button 时所在的位置「重叠」起来，
    // 会触发 x 按钮的点击事件而导致关闭弹框 (注：弹框上的取消/确定等按钮遇到同样情况也会如此)
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  onClose = key => () => {
    let _this = this
    let _data = assign({},_this.props.Nav);


    _data.productId=false;
    _data.navtitle=['潜游时光'];
    _data.PreURL=['/'];
    _data.leftContent={
      return:false,
      logo:'home'
    };
    _data.hidden=false;
    _data.selectedTab='Home';

    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    });

    this.context.router.push('/');
    this.setState({
      [key]: false,
    });
  }
  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
        <WingBlank size="md">请选择</WingBlank>
        <WhiteSpace size="lg" />
        <List>
          <DatePicker
            mode="date"
            title="选择日期"
            minDate={minDate}
            value={this.state.date}
            onChange = {(date) => {
              this.setState({
                date:date
              });
            }}
          >
            <List.Item arrow="horizontal">请选择出发日期</List.Item>
          </DatePicker>
          <List.Item extra={
            <Stepper
              style={{ width: '100%', minWidth: '2rem' }}
              showNumber max={100} min={1}
              value={this.state.Num}
              useTouch={false}
              onChange={
                (num) => {
                  const _Price = num * (this.state.productPrice-this.state.promotePrice)
                  this.setState({
                    Num:num,
                    totalPrice:_Price
                  });
                }
              }
            />}
            wrap
          >
          选择套餐数量
          </List.Item>
        </List>
        <WhiteSpace size="lg" />
        <WingBlank size="md">合计</WingBlank>
        <WhiteSpace size="lg" />
        <List>
          <List.Item extra={this.state.productPrice}>单价</List.Item>
          <List.Item extra={this.state.promotePrice}>优惠</List.Item>
          <List.Item extra={this.state.totalPrice}>总价</List.Item>
        </List>
        <div className={styles.bottomPay}>
          <div className={styles.bottomPay} onClick={function(){
            let _this = this;
            if (_this.state.date == null) {
              Toast.info('请选择时间!!!', 2, null, false);
              return
            }
            _this.setState({
              choke: true
            });
                                                                                                                                       
                                                                                                                                       
                                                                                                                                       
          }.bind(this)}>预定套餐</div>
        </div>
        <Modal
          title="链接失效"
          transparent
          maskClosable={false}
          visible={this.state.modal}
          onClose={
            this.onClose('modal')
          }
          footer={[{ text: '返回首页', onPress: () => {
            this.onClose('modal')();
          }}]}
         >
        </Modal>
      </div>
    )
  }
}

travel.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  product:state.reducer.product
})


export default travel = connect(
  mapStateToProps
)(travel)


