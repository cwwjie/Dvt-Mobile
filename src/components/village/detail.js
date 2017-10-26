import { connect } from 'react-redux'
import React, {Component} from 'react'
import moment from 'moment'

import { DatePicker, Modal, Popup, List, Tabs, WhiteSpace, Carousel, Toast } from 'antd-mobile'

import assign from 'lodash.assign'
import appConfig from './../../config/index.js'
import styles from './css/styles.scss'
import timeConversion from './../../method/timeConversion.js'

import less from './img/less.png'
import plus from './img/plus.png'

import QQ from './../Service/img/QQ.svg'
import weche from './../Service/img/weche.svg'
import weche2Dcode from './../Service/img/weche.jpg'
import company from './../Service/img/company.jpg'
import divingtime from './../Service/img/divingtime.png'

class villageDetail extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      modal: false,
      carousel: [{src: null, onclick: null}],
      initialHeight: 230,
      sel: '',

      checkInDate: null,
      leaveDate: null,
      setoffDate: setoffDate,

      roomType: [],
      total: 0,

      myNavIsFixed: false,

      defaultActiveKey: '1'
    }

    this.changeCheckInDate.bind(this);
    this.renderRoomByTime.bind(this);
    this.showModal.bind(this);
    this.RenderModal.bind(this);
  }

  componentWillMount() {
    let _this = this;
    // 判断是否过期
    if (this.props.village.selected === false) {
      this.setState({ modal: true })
      return
    }

    // 查询所有度假村图片
    fetchImgByResortId(_this.props.village.villageSelected.resortId)
    .then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then(function (json) {
      if (json.result === '0') {
        _this.setState({
          'carousel': json.data.map((val) => ({
            'src': val.gallery.thumbUrl,
            'onclick': null
          }))
        })
      } else {
        alert('度假村图片加载失败，原因:' + json.message)
      }
    })

    // 查询所有房型
    const resortCode = _this.props.village.villageSelected.resortCode,
      villageTimeStamp = Date.parse(_this.props.village.villageSelected.villageTime),
      villageLeaveStamp = _this.props.village.villageSelected.villageLeave;

    fetchApartmentByResortId(villageTimeStamp, villageLeaveStamp, resortCode)
    .then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        _this.setState({ 'roomType': json.data.list })
        _this.props.dispatch({
          'type': 'ADD_roomType',
          'data': json.data.list
        })
      } else {
        alert('房型加载失败，原因:' + json.message)
      }
    })

    // 初始化时间
    let _villageTime = timeConversion.dateToFormat(_this.props.village.villageSelected.villageTime) + ' +0800'
    let checkInDate = moment(_villageTime, 'YYYY-MM-DD Z')
    _this.setState({
      'checkInDate': checkInDate,
      'leaveDate': todefine(villageTimeStamp + _this.props.village.villageSelected.villageLeave),
      'setoffDate': todefine(villageTimeStamp + 86400000)
    })


      
    const bindScroll = (() => {
      let isFixed = false;
      const documentDOM = document || window.document;

      documentDOM.onscroll = (event) => {
        let yScroll;
        if (self.pageYOffset) {
          yScroll = self.pageYOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
          yScroll = document.documentElement.scrollTop;
        } else if (document.body) {
          yScroll = document.body.scrollTop;
        }

        if (yScroll > 370 && isFixed === false) {
          isFixed = true;
          _this.setState({myNavIsFixed: true});
        }

        if (yScroll < 370 && isFixed === true) {
          isFixed = false;
          _this.setState({myNavIsFixed: false});
        }
      }
    })();
  }

  _onClick = () => {
    Popup.show(<div>
      <div>123</div>
    </div>, { animationType: 'slide-up', maskProps, maskClosable: false })
  };

  _onClose = (sel) => {
    this.setState({ sel })
    Popup.hide()
  };

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
  };

  renderPrice(value, ref, _this) {
    if (value.isSaleOut === 'Y') {
      return '售罄'
    } else {
      if (value.selected === undefined || value.selected === 0) {
        return <div style={{
          paddingLeft: '0.1rem',
          width: '0.44rem',
          height: '0.44rem',
          background: 'url(' + plus + ') center center /  0.42rem 0.42rem no-repeat'
        }} onClick={function () {
          let _state = assign({}, _this.state)
          _state.roomType[ref].selected = 1
          _this.setState(_state)
        }}></div>
      } else {
        return <div className={styles.DivisionButton}>
          <div
            style={{
              width: '0.44rem',
              height: '0.44rem',
              background: 'url(' + less + ') center center /  0.42rem 0.42rem no-repeat'
            }}
            onClick={function () {
              let _state = assign({}, _this.state)
              _state.roomType[ref].selected -= 1
              _this.setState(_state)
            }
          } />
          <div
            style={{
              position: 'relative',
              top: '2.5px'
            }}>
            {value.selected}
          </div>
          <div
            style={{
              width: '0.44rem',
              height: '0.44rem',
              background: 'url(' + plus + ') center center /  0.42rem 0.42rem no-repeat'
            }}
            onClick={function () {
              let _state = assign({}, _this.state)
              // 必须小于库存量
              if ((_state.roomType[ref].selected + 1) <= value.skuNum) {
                _state.roomType[ref].selected += 1
              } else {
                Toast.fail('此房型最大库存为:' + value.skuNum, 1)
              }
              _this.setState(_state)
            }} />
        </div>
      }
    }
  }

  RenderModal(value, img) {
    const _this = this;

    return <div>
      <List className="popup-list"
        renderHeader={() => (
        <div style={{ 'position': 'relative' }}>
          {value.apartmentName}
          <span style={{'position': 'absolute', 'right': 3, 'top': -5}}
            onClick={() => _this._onClose('cancel')}
          >X</span>
        </div>)}
      />
      <div className={styles.roomLine}></div>
      <Carousel className={styles.Carousel} autoplay={false} infinite selectedIndex={0}>{img.data.map(data => (
        <div style={{ 'height': _this.state.initialHeight, 'width': '100%' }}>
          <img style={{ 'height': '230px', 'width': '100%' }}
          src={appConfig.URLbase + data.gallery.thumbUrl}
          onLoad={() => {
            window.dispatchEvent(new Event('resize'))
            _this.setState({ 'initialHeight': '230px' })
          }}
        /></div>
      ))}</Carousel>
      <div className={styles.roomType}>
        <div>{value.apartmentDesc}</div>
        <div className={styles.roomrelative}>
          <div className={styles.roomLeft}>￥ {value.initiatePrice} 间/晚</div>
          <div className={styles.roomRight}>预定</div>
        </div>
        <div className={styles.roomLine}></div>
        <div className={styles.roomTitle}>入住规格:</div>
        <div>建议入住:{value.suggestedNum}</div>
        <div>最多入住:{value.peopleMax}</div>
        <div>床型:{value.bedType}</div>
        <div className={styles.roomLine}></div>
        <div className={styles.roomTitle}>费用说明:</div>
        <div>起始价格:{value.initiatePrice}</div>
        <div>成人单价:{value.adultUnitPrice}</div>
        <div>儿童单价:{value.childUnitPrice}</div>
      </div>
    </div>
  }

  showModal(value) {
    const _this = this;

    fetch(appConfig.URLbase + '/Dvt-reserve/product/relApartmentGallery/' + value.apartmentId + '/findByApartmentId.do', {
      method: 'GET',
      contentType: 'application/json; charset=utf-8'
    })
    .then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        Popup.show(<div>{_this.RenderModal(value, json)}</div>, { animationType: 'slide-up', maskProps, maskClosable: false })
      } else {
        alert('度假村图片加载失败，原因:' + json.message)
      }
    })
  }

  renderRoomByType() {
    const _this = this;

    return this.state.roomType.map((value, ref) => (
      <div style={{position: 'relative'}}>
        <div className={styles.onClickPrice}> 
          {_this.renderPrice(value, ref, _this)}</div>
        <div className={styles.Division} onClick={() => {
            _this.showModal(value)
        }}>
          <img src={appConfig.URLbase + value.apartmentThumb} />
          <div>
            <div className={styles.DivisionHead}>{value.apartmentName}</div>
            <div className={styles.DivisionContent2}>
              <div>建议入住:{value.suggestedNum}</div>
              <div>床型:{value.bedType}</div>
            </div>
            <div className={styles.DivisionBottom}>
              <div>￥ {value.initiatePrice} 起</div>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  renderRoomByTime(stampIn, stampOut) {
    const _this = this;

    Toast.info('正在查询!!!', 1)
  
    let villageSelectedDate = _this.props.village.villageSelected;
  
    villageSelectedDate.villageTime = new Date(stampIn);
    villageSelectedDate.villageLeave = stampOut - stampIn;
  
    fetch(`${appConfig.URLbase}/Dvt-reserve/product/apartment/1/0/searchSource.do?startDate=${timeConversion.timestampToxxxx(stampIn)}&endDate=${timeConversion.timestampToxxxx(stampOut)}&resortCode=${_this.props.village.villageSelected.resortCode}`, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8'
    }).then(function (response) {
      return response.json()
    }).then(function (json) {
      if (json.result === '0') {
        Toast.success('查询完毕!!!', 1)
  
        _this.setState({
          roomType: json.data.list
        })
  
        _this.props.dispatch({
          type: 'Selected_village',
          data: villageSelectedDate
        })
        _this.props.dispatch({
          type: 'ADD_roomType',
          data: json.data.list
        })
      } else {
        alert('房型加载失败，原因:' + json.message)
      }
    })
  };

  changeCheckInDate(date) {
    // 退房日期
    let leaveTamp = Date.parse(this.state.leaveDate._d)
    this.setState({
      checkInDate: date,
      setoffDate: todefine(Date.parse(date._d) + 86400000)
    })
    // 退房日期 必须大于 入住日期+1
    if (Date.parse(this.state.leaveDate._d) < (Date.parse(date._d) + 86400000)) {
      // 如果小于 表示 需要修改 退房日期
      leaveTamp = Date.parse(date._d) + 86400000
      this.setState({
        leaveDate: todefine(leaveTamp)
      })
    }
    this.renderRoomByTime(Date.parse(date._d), leaveTamp)
  }

  renderEarnest() {
    let roomNum = 0
    for (let i = 0; i < this.state.roomType.length; i++) {
      if (this.state.roomType[i].selected !== undefined) {
        roomNum = roomNum + this.state.roomType[i].selected
      }
    }
    return roomNum * this.props.village.villageSelected.earnest
  }

  jumpToSubmit() {
    const _this = this;
    let roomNum = 0;

    for (let i = 0; i < _this.state.roomType.length; i++) {
      if (_this.state.roomType[i].selected !== undefined) {
        roomNum = roomNum + _this.state.roomType[i].selected
      }
    }

    if (roomNum < 1) {
      Toast.fail('至少选择一间房', 1)
      return
    }

    let NavData = assign({}, _this.props.Nav);
    NavData.navtitle.push('度假村预定');
    NavData.PreURL.push('/village/submit');
    NavData.leftContent = {
      return: 'left',
      logo: false
    }
    NavData.hidden = true;
    _this.props.dispatch({
      type: 'Chan_Nav',
      data: NavData
    })

    _this.props.dispatch({
      type: 'ADD_roomType',
      data: _this.state.roomType
    })

    _this.context.router.push('/village/submit');
  }

  render() {
    const _this = this;

    return (
      <div>
        <div className={this.state.myNavIsFixed ? styles.detailNavShow : styles.NavHidden}>
          <Tabs defaultActiveKey="1" activeKey={this.state.defaultActiveKey} animated={false} onChange={(key) => {_this.setState({defaultActiveKey: key})}}>
            <TabPane tab="房型" key="1"/>
            <TabPane tab="详情" key="2"/>
            <TabPane tab="联系客服" key="3"/>
          </Tabs>
        </div>
        <div>
          <Carousel className='my-carousel' autoplay={true} selectedIndex={0} >{this.state.carousel.map((data) => (
            <img style={{ 'height': `${_this.state.initialHeight}px`, 'width': '100%' }}
              src={appConfig.URLbase + data.src}
              onLoad={() => {
                window.dispatchEvent(new Event('resize'));
                _this.setState({ 'initialHeight': 320 });
              }}
            />
          ))}</Carousel>
        </div>
        <div className={styles.TabPane}>
          <Tabs defaultActiveKey="1" activeKey={this.state.defaultActiveKey} onChange={(key) => {_this.setState({defaultActiveKey: key})}}>
            <TabPane tab="房型" key="1">
              <div>
                <List renderHeader={() => '选择日期'}>
                  <DatePicker
                    mode="date"
                    title="选择日期"
                    minDate={setoffDate}
                    value={this.state.checkInDate}
                    onChange={(date) => { _this.changeCheckInDate(date) }}>
                    <List.Item arrow="horizontal">入住日期</List.Item>
                  </DatePicker>
                </List>
                <List>
                  <DatePicker
                    mode="date"
                    title="选择日期"
                    minDate={this.state.setoffDate}
                    value={this.state.leaveDate}
                    onChange={function (date) {
                      this.setState({leaveDate: date})
                      this.renderRoomByTime(Date.parse(this.state.checkInDate._d), Date.parse(date._d))
                    }.bind(this)}>
                    <List.Item arrow="horizontal">退房日期</List.Item>
                  </DatePicker>
                </List>
                {this.renderRoomByType.call(this)}
              </div>
            </TabPane>
            <TabPane tab="详情" key="2">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem' }}>
                {this.props.village.villageSelected.resortDesc}
              </div>
            </TabPane>
            <TabPane tab="联系客服" key="3">
              <WhiteSpace size="lg" />
              <List>
                <Item thumb={weche} arrow="horizontal" onClick={() => { Popup.show(
                  <div>
                    <List className="popup-list" renderHeader={() => (
                        <div style={{ position: 'relative' }}>
                          二维码
                          <span style={{ 'position': 'absolute', 'right': 3, 'top': -5 }}
                            onClick={() => _this._onClose('cancel')}
                          >X</span>
                        </div>
                    )} />
                    <div className={styles.Popup}>
                      <div>海浪</div>
                      <img src={weche2Dcode} />
                      <div>公众号</div>
                      <img src={company} />
                    </div>
                  </div>, { animationType: 'slide-up', maskProps, maskClosable: false })
                }}>微信</Item>
              </List>
              <WhiteSpace size="lg" />
              <List>
                <Item thumb={QQ}
                  arrow="horizontal"
                  onClick={() => { window.location.href = 'http://wpa.qq.com/msgrd?v=3&uin=2546623187&site=qq&menu=yes' }}
                >QQ</Item>
              </List>
              <WhiteSpace size="lg" />
              <List>
                <Item thumb={divingtime}
                  arrow="horizontal"
                  onClick={() => { window.location.href = 'https://divet.taobao.com/index.htm?spm=a1z10.1-c.w5002-2373231309.2.2zP0yr' }}
                >潜游时光淘宝客服</Item>
              </List>
            </TabPane>
          </Tabs>
        </div>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <div className={styles.bottomNav}>
          <div className={styles.botNavLeft}>
            <div>定金 {this.renderEarnest.call(this)} RMB</div>
          </div>
          <div className={styles.botNavRight}>
            <div onClick={ this.jumpToSubmit.bind(this) }>预定度假村</div>
          </div>
        </div>

        <Modal title="链接失效"
          transparent
          maskClosable={false}
          visible={ this.state.modal }
          onClose={ this.onClosemodal('modal') }
          footer={[{ text: '返回首页', onPress: () => { this.onClosemodal('modal')() }}]}
        />
      </div>
    )
  }
}

const fetchImgByResortId = (resortId) => (
  fetch(appConfig.URLbase + '/Dvt-reserve/product/relResortGallery/' + resortId + '/findByResortId.do',
  {
    method: 'GET',
    contentType: 'application/json; charset=utf-8'
}))

const fetchApartmentByResortId = (myTimestamp, myStampLeave, resortCode) => (
  fetch(`${appConfig.URLbase}/Dvt-reserve/product/apartment/1/0/searchSource.do?startDate=${timeConversion.timestampToxxxx(myTimestamp)}&endDate=${timeConversion.timestampToxxxx((myTimestamp + myStampLeave))}&resortCode=${resortCode}`, {
    method: 'GET',
    contentType: 'application/json; charset=utf-8'
  })

)

let nawDate = new Date()
nawDate = timeConversion.dateToFormat(nawDate) + ' +0800'
const setoffDate = moment(nawDate, 'YYYY-MM-DD Z')

const Item = List.Item
const TabPane = Tabs.TabPane

// 初始化弹出层Popup
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let maskProps
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: (e) => {
      Popup.hide()
      e.preventDefault()
    }
  }
}

// 将 时间戳 转换成为 指定格式
function todefine(arg) {
  let defineDate = new Date(arg)
  let defineTime = timeConversion.dateToFormat(defineDate) + ' +0800'
  return moment(defineTime, 'YYYY-MM-DD Z')
}

villageDetail.contextTypes = {
  router: Object
}
const mapStateToProps = (state, ownProps) => ({
  Nav: state.reducer.Nav,
  village: state.reducer.village,
  routing: state.routing.locationBeforeTransitions
})

export default villageDetail = connect(
  mapStateToProps
)(villageDetail)
