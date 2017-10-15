import { connect } from 'react-redux'
import React, {Component} from 'react'
import timeConversion from './../timeConversion.js'
import {WhiteSpace, List, Modal} from 'antd-mobile'
import assign from 'lodash.assign'
import appConfig from './../../config/index.js'
import styles from './css/styles.scss'
import cookie from './../cookie.js'

const Item = List.Item

class summary extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      modal: false,
      val: {
        cancelTime: null,
        city: null,
        consignee: null,
        countDown: null,
        departureDate: null,
        discount: null,
        discountRate: null,
        district: null,
        earnest: null,
        haveDays: null,
        isDelete: null,
        leaveDate: null,
        mobile: null,
        orderAmount: null,
        orderDesc: null,
        orderId: null,
        orderItemList: [
          {
            adultNum: null,
            adultUnitPrice: null,
            apartment: null,
            apartmentNum: null,
            bedType: null,
            childNum: null,
            childUnitPrice: null,
            isAvePrice: null,
            itemType: null,
            orderId: null,
            orderItemId: null,
            peopleNum: null,
            period: null,
            productBrief: null,
            productId: null,
            productImg: null,
            productName: null,
            productNum: null,
            productPrice: null,
            productSn: null,
            productThumb: null,
            promotePrice: null
          }
        ],
        orderName: null,
        orderSn: null,
        orderStatus: null,
        orderTime: null,
        orderType: null,
        payInfoId: null,
        paymentInfo: {
          notPayAmount: null,
          payAmount: null,
          payInfoId: null,
          payName: null,
          payStatus: null,
          payTime: null
        },
        productAmount: null,
        province: null,
        refundTime: null,
        reserveTime: null,
        street: null,
        telephone: null,
        userId: null,
        zipcode: null
      }
    }
  }
  componentWillMount() {
    // 下面是初始化 数据
    if (this.props.village.summary === false) {
      this.setState({
        modal: true
      })
      return
    }
    let _state = assign({}, this.state)
    _state.val = this.props.village.summary
    this.setState(_state)
  }
  onClosemodal = key => () => {
    let _this = this
    let _data = assign({}, _this.props.Nav)

    _data.productId = false
    _data.navtitle = ['潜游时光']
    _data.PreURL = ['/village']
    _data.leftContent = {
      return: false,
      logo: 'home'
    }
    _data.hidden = false
    _data.selectedTab = 'Order'

    _this.props.dispatch({
      type: 'Chan_Nav',
      data: _data
    })

    this.context.router.push('/village')
    this.setState({
      [key]: false
    })
  }
  render() {
    return (
      <div>
        <List renderHeader={() => '订单状态'}>
          <Item>预定成功，待支付定金</Item>
        </List>
        <List renderHeader={() => '订单信息'}>
          <Item>订单名称: {this.state.val.orderName}</Item>
          <Item>订单编号: {this.state.val.orderSn}</Item>
          <Item>下单时间: {(function () {
            if (this.state.val.orderTime == null) { return }
            return timeConversion.timestampToFormat(this.state.val.orderTime)
          }.bind(this))()}</Item>
          <Item>入住信息: {(function () {
            if (this.state.val.departureDate == null) { return }
            return timeConversion.timestampToFormat(this.state.val.departureDate)
          }.bind(this))()}</Item>
          <Item>离开日期: {(function () {
            if (this.state.val.leaveDate == null) { return }
            return timeConversion.timestampToFormat(this.state.val.leaveDate)
          }.bind(this))()}</Item>
        </List>
        <List renderHeader={() => '支付信息'}>
          <Item>订单总额: {this.state.val.orderAmount}</Item>
          <Item>已支付: {this.state.val.paymentInfo.payAmount}</Item>
          <Item>预定金额: {this.state.val.earnest}</Item>
          <Item>折扣金额: {this.state.val.discount}</Item>
        </List>
        {this.state.val.orderItemList.map(function (val, ref) {
          return <div>
            <List renderHeader={function () {
              return '房间信息' + (ref + 1)
            }}>
              <Item>房型: {val.apartment}</Item>
              <Item>床型型: {val.bedType}</Item>
              <Item>成人: {val.adultNum}位</Item>
              <Item>儿童: {val.childNum}位</Item>
            </List>
          </div>
        })}
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className={styles.bottomPay}>
          <div id="alipayMob"></div>
          <div className={styles.bottomPay2} onClick={function () {
            let _this = this
            document.getElementById('alipayMob').innerHTML = '正在付款'
            // 证明该订单为度假村直订（C:custom）显示支付定金按钮
            fetch(appConfig.URLversion + '/payment/' + _this.state.val.data.orderSn + '/E/alipay4Custom.do?dev=Mobile', {
              method: 'GET',
              headers: {
                token: cookie.getItem('token'),
                digest: cookie.getItem('digest')
              }
            }).then(function (response) {
              response
                .text()
                .then(function (text) {
                  if (response === 'FAILED') {
                    alert('您在30分钟内未完成付款，交易已关闭')
                  } else {
                    document.getElementById('alipayMob').innerHTML = text
                    document.getElementById('alipaysubmit').submit();
                  }
                  document.getElementById('alipayMob').innerHTML = '去付款'
                })
            })
          }.bind(this)}>支付定金</div>
        </div>

        <Modal
          title="链接失效"
          transparent
          maskClosable={false}
          visible={this.state.modal}
          onClose={
            this.onClosemodal('modal')
          }
          footer={[{ text: '返回首页', onPress: () => {
            this.onClosemodal('modal')()
          }}]}
        />
      </div>
    )
  }
}

summary.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Nav: state.reducer.Nav,
  village: state.reducer.village,
  routing: state.routing.locationBeforeTransitions
})

export default summary = connect(
  mapStateToProps
)(summary)
