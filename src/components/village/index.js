import { connect } from 'react-redux'
import React, {Component} from 'react'
import moment from 'moment'
import timeConversion from './../../method/timeConversion.js'

import { Radio, Popup, WhiteSpace, DatePicker, List } from 'antd-mobile'

import assign from 'lodash.assign'
import appConfig from './../../config/index.js'
import styles from './css/styles.scss'

class village extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      village: {
        list: []
      }
    }

    this.changeDatePicker.bind(this)
  }
  componentWillMount() {
    const _this = this

    fetchProduct()
    .then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        _this.setState({'village': json.data})
      } else {
        alert(`度假村查询失败，原因：${json.message}`);
      }
    })
  }

  onClose = (sel) => {
    this.setState({ sel });
    Popup.hide();
  };

  changeDatePicker(date, villageItemData) {
    const _this = this,
      radioData = [
        {value: 86400000, label: '两天一晚'},
        {value: 172800000, label: '三天二晚'},
        {value: 259200000, label: '四天三晚'},
        {value: 345600000, label: '五天四晚'},
        {value: 432000000, label: '六天五晚'}
      ];

    Popup.show(<div>
      <List className="popup-list"
        renderHeader={() => (
        <div style={{ position: 'relative' }}>
          请选择几天几晚
          <span style={{ 'position': 'absolute', 'right': 3, 'top': -5 }}
            onClick={() => _this.onClose('cancel')}
          >X</span>
        </div>
      )}>
      {radioData.map(i => (
        <RadioItem key={i.value} onChange={function () {
          _this.onClose('cancel');

          let navData = assign({}, _this.props.Nav);
          navData.navtitle.push(villageItemData.resortName + '度假村');
          navData.PreURL.push('/village/detail');
          navData.leftContent = {
            return: 'left',
            logo: false
          };
          navData.hidden = true;
          _this.props.dispatch({
            type: 'Chan_Nav',
            data: navData
          });

          villageItemData.villageTime = date._d;
          villageItemData.villageLeave = i.value;
          _this.props.dispatch({
            type: 'Selected_village',
            data: villageItemData
          });

          _this.context.router.push('/village/detail');
        }.bind(this)}>
          {i.label}
        </RadioItem>
      ))}
      </List>
    </div>, { animationType: 'slide-up', maskProps, maskClosable: false })

  }

  render() {
    return (
      <div>
        {this.state.village.list.map((villageItemData, key) => {
          const _this = this;

          return <DatePicker
            mode="date"
            title="选择出发日期"
            minDate={setoffDate}
            onChange={(date) => _this.changeDatePicker(date, villageItemData)}>
            <div className={styles.Division}>
              <img src={appConfig.URLbase + villageItemData.resortThumb} />
              <div>
                <div className={styles.DivisionHead}>{villageItemData.resortName}</div>
                <div className={styles.DivisionContent}>{villageItemData.resortDesc}</div>
                <div className={styles.DivisionBottom}>
                  <div>{villageItemData.brandName}</div>
                  <div className={styles.DivisionPrice}>{villageItemData.earnest}RMB</div>
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

let fetchProduct = () => (fetch(appConfig.URLbase + '/Dvt-reserve/product/resort/1/0/list.do', {
    method: 'GET',
    contentType: 'application/json; charset=utf-8'
}));

village.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Nav: state.reducer.Nav,
  village: state.reducer.village,
  routing: state.routing.locationBeforeTransitions
})

// 初始化时间DatePicker
let nawDate = new Date()
nawDate = timeConversion.dateToFormat(nawDate) + ' +0800'
const setoffDate = moment(nawDate, 'YYYY-MM-DD Z')

// 初始化单选按钮
const RadioItem = Radio.RadioItem
// 初始化弹出层Popup
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  }
}

export default village = connect(
  mapStateToProps
)(village)
