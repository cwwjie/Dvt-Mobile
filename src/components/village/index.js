import { connect } from 'react-redux'
import React, {Component} from 'react'
import moment from 'moment'
import timeConversion from './../timeConversion.js'

import { Radio, Popup, WhiteSpace, DatePicker, List } from 'antd-mobile'

import assign from 'lodash.assign'
import appConfig from './../../config/index.js'
import styles from './css/styles.scss'

// 初始化时间DatePicker
let nawDate = new Date()
nawDate = timeConversion.dateToFormat(nawDate) + ' +0800'
const setoffDate = moment(nawDate, 'YYYY-MM-DD Z')

// 初始化单选按钮
const RadioItem = Radio.RadioItem
// 初始化弹出层Popup
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let maskProps
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  }
}

class village extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      village: {
        list: []
      }
    }
  }
  componentWillMount() {
    const _this = this
    // 图片fetch
    fetch(appConfig.URLbase + '/Dvt-reserve/product/resort/1/0/list.do', {
      method: 'GET',
      contentType: 'application/json; charset=utf-8'
    }).then(function (response) {
      return response.json()
    }).then(function (json) {
      if (json.result === '0') {
        _this.setState({village: json.data})
      } else {
        alert('度假村查询失败，原因：' + json.message)
      }
    })
  }
  onClose = (sel) => {
    this.setState({ sel })
    Popup.hide()
  };
  render() {
    const radioData = [
      {value: 86400000, label: '两天一晚'},
      {value: 172800000, label: '三天二晚'},
      {value: 259200000, label: '四天三晚'},
      {value: 345600000, label: '五天四晚'},
      {value: 432000000, label: '六天五晚'}
    ]
    return (
      <div>
        {this.state.village.list.map((data, key) => {
          return <DatePicker
            mode="date"
            title="选择出发日期"
            minDate={setoffDate}
            onChange={function (date) {
              Popup.show(<div>
                <List renderHeader={() => (
                  <div style={{ position: 'relative' }}>
                    请选择几天几晚
                    <span
                      style={{
                        position: 'absolute', right: 3, top: -5
                      }}
                      onClick={() => this.onClose('cancel')}
                    >
                      X
                    </span>
                  </div>)}
                  className="popup-list"
                >
                {radioData.map(i => (
                  <RadioItem key={i.value} onChange={function () {
                    this.onClose('cancel')
                    // 页面跳转
                    let _this = this
                    let _data = assign({}, _this.props.Nav)
                    _data.navtitle.push(data.resortName + '度假村')
                    _data.PreURL.push('/village/detail')
                    _data.leftContent = {
                      return: 'left',
                      logo: false
                    }
                    _data.hidden = true

                    data.villageTime = date._d
                    data.villageLeave = i.value
                    _this.props.dispatch({
                      type: 'Selected_village',
                      data: data
                    })
                    _this.props.dispatch({
                      type: 'Chan_Nav',
                      data: _data
                    })
                    _this.context.router.push('/village/detail')
                  }.bind(this)}>
                    {i.label}
                  </RadioItem>
                ))}
                </List>
              </div>, { animationType: 'slide-up', maskProps, maskClosable: false })
            }.bind(this)}>
            <div className={styles.Division} onClick={function () {
            }}>
              <img src={appConfig.URLbase + data.resortThumb} />
              <div>
                <div className={styles.DivisionHead}>{data.resortName}</div>
                <div className={styles.DivisionContent}>{data.resortDesc}</div>
                <div className={styles.DivisionBottom}>
                  <div>{data.brandName}</div>
                  <div className={styles.DivisionPrice}>{data.earnest}RMB</div>
                </div>
              </div>
            </div>
          </DatePicker>
        })}
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
      </div>
    )
  }
}

village.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Nav: state.reducer.Nav,
  village: state.reducer.village,
  routing: state.routing.locationBeforeTransitions
})

export default village = connect(
  mapStateToProps
)(village)
