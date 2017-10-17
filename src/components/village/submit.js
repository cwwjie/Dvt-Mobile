import { connect } from 'react-redux'
import React, {Component} from 'react'
import moment from 'moment'
import timeConversion from './../timeConversion.js'
import cookie from './../cookie.js'

import { Popup, Modal, Toast, List, WhiteSpace, WingBlank, Stepper, Picker, Checkbox } from 'antd-mobile'

import assign from 'lodash.assign'
import appConfig from './../../config/index.js'
import styles from './css/styles.scss'


class villageSubmit extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      modal: false,

      checkInDate: null,
      leaveDate: null,
      setoffDate: setoffDate,

      roomType: [],

      passenger: []
    }

    this.deleteRoom.bind(this);
    this.changeChildrenNum.bind(this);
    this.changeAdultNum.bind(this);
  }

  componentWillMount() {
    let _this = this

    // 验证 过滤
    if (_this.props.village.selected === false) {
      _this.setState({ modal: true })
      return
    }

    // 下面是初始化 每间房 人数 和 床型
    let myState = assign({}, _this.state)

    myState.roomType = _this.props.village.roomType;

    for (let i = 0; i < _this.props.village.roomType.length; i++) {
      let selectedDate = [],
        bedTypeDate = []
      for (var j = 0; j < _this.props.village.roomType[i].selected; j++) {
        // 初始化 每间房人数 数据格式
        selectedDate.push({
          children: 0,
          adult: 1
        });
        // 初始化 每间房床型 数据格式
        let bedType = _this.props.village.roomType[i].bedType.split(","),
          bedTypeForm = [];
        for (var z = 0; z < bedType.length; z++) {
          bedTypeForm.push({
            label: bedType[z],
            value: bedType[z],
          });
        }
        bedTypeDate.push({
          List: bedTypeForm,
          value: null
        })
      }
      myState.roomType[i].selectedDate = selectedDate;
      myState.roomType[i].bedTypeDate = bedTypeDate;
    }

    // 加载旅客信息
    myState.passenger = _this.props.Passenger.data;

    // 初始化入住日期
    myState.checkInDate = _this.props.village.villageSelected.villageTime;
    myState.leaveDate = new Date(Date.parse(_this.props.village.villageSelected.villageTime) + _this.props.village.villageSelected.villageLeave);

    _this.setState(myState);
  }

  componentWillReceiveProps(nextProps) {
    let myState = assign({},this.state);

    myState.passenger = nextProps.Passenger.data;
    this.setState(myState);
  }

  onClosemodal = key => () => {
    let _this = this
    let _data = assign({},_this.props.Nav);

    _data.productId = false;
    _data.navtitle = ['潜游时光'];
    _data.PreURL = ['/village'];
    _data.leftContent = {
      return:false,
      logo:'home'
    };
    _data.hidden = false;
    _data.selectedTab = 'Order';
    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    });

    this.context.router.push('/village');
    this.setState({
      [key]: false,
    });
  }

  onClosePopup = (sel) => {
    this.setState({ sel });
    Popup.hide();
  }

  renderCheckInDate() {
    if (this.state.checkInDate == null) { return }
    return timeConversion.dateToFormat(this.state.checkInDate);
  }

  renderLeaveDate() {
    if (this.state.checkInDate == null) { return }
    return timeConversion.dateToFormat(this.state.checkInDate);
  }

  deleteRoom(i, ref) {
    const _this = this;

    if (confirm("确认要删除？")) {
      let roomNum = 0;

      for (let i = 0; i < _this.state.roomType.length; i++) {
        if (_this.state.roomType[i].selected != undefined) {
          roomNum = roomNum + _this.state.roomType[i].selected;
        }
      }

      if (roomNum <= 1) {
        Toast.fail('删除失败, 订单必须至少有一间房!', 1);
        return
      }

      let _state = assign({}, _this.state);
      _state.roomType[ref].selected -= 1;
      _state.roomType[ref].selectedDate.splice(i,1);
      _state.roomType[ref].bedTypeDate.splice(i,1);
      _this.setState(_state);

      Toast.success('删除成功!!!', 1);
    }
  }

  changeChildrenNum(val, ref, i) {
    const _this = this;
    let peopleNum = val + _this.state.roomType[ref].selectedDate[i].adult;

    if (peopleNum <= _this.state.roomType[ref].peopleMax) {
      let _state = assign({}, _this.state);
      _state.roomType[ref].selectedDate[i].children = val;
      _this.setState(_state);

    }else {
      Toast.fail('超越推荐人数', 1);
    }
  }

  changeAdultNum(val, ref, i) {
    const _this = this;
    let peopleNum = val + this.state.roomType[ref].selectedDate[i].children;

    if (peopleNum <= this.state.roomType[ref].peopleMax) {
      let _state = assign({},this.state);
      _state.roomType[ref].selectedDate[i].adult = val;
      this.setState(_state);
    }else {
      Toast.fail('超越推荐人数', 1);
    }
  }

  renderRoom() {
    const _this = this;

    return this.state.roomType.map((val, ref) => {
      if (val.selected == undefined) {
        return <div></div>
      }else {
        let _array = [];
        for (let i = 0; i < val.selected; i++) { _array.push(

          <List renderHeader={ () => ('房间' + (i + 1))}>
            <div onClick={ () => _this.deleteRoom(i, ref) }>
              <Item extra="删除" arrow="horizontal">{val.apartmentName}</Item>
            </div>
            <Picker data={this.state.roomType[ref].bedTypeDate[i].List} cols={1}
              value={this.state.roomType[ref].bedTypeDate[i].value}
              title="请选择您的床型"
              onChange={(val) => {
                let myState = assign({}, _this.state);
                myState.roomType[ref].bedTypeDate[i].value = val;
                  _this.setState(myState)
              }}>
              <List.Item arrow="horizontal">床型</List.Item>
            </Picker>
            <Item wrap extra={
              <Stepper style={{ width: '100%', minWidth: '2rem' }}
                showNumber
                max={this.state.roomType[ref].childrenMax}
                min={this.state.roomType[ref].childrenMin}
                value={this.state.roomType[ref].selectedDate[i].children}
                onChange={(val) => {_this.changeChildrenNum(val, ref, i)}}
                useTouch={false}
              />
            }>儿童<Brief>儿童:0-12岁</Brief>
            </Item>
            <Item extra={
              <Stepper style={{ width: '100%', minWidth: '2rem' }}
                showNumber
                max={this.state.roomType[ref].adultMax}
                min={this.state.roomType[ref].adultMin}
                value={this.state.roomType[ref].selectedDate[i].adult}
                onChange={(val) => {_this.changeAdultNum(val, ref, i)}}
                useTouch={false}
              />}
              wrap
            >成人<Brief>成人: >12岁</Brief></Item>
          </List>

        )}
        return _array;
      }
    })
  }

  renderSelectedPassenger() {
    const _this = this,
      passengerList = _this.state.passenger;

    return passengerList.map((val, i) => {
      if (val.select === true) {
        return  <div onClick={() => {
          let myNavData = assign({}, _this.props.Nav);

          myNavData.navtitle.push('旅客信息');
          myNavData.PreURL.push('/Cent/Passenger');
          myNavData.leftContent = {
            return:'left',
            logo:false
          };

          _this.props.dispatch({
            'type': 'Chan_Nav',
            'data': myNavData
          });

          _this.props.dispatch({
            'type': 'filter_Order',
            'data': 'complete'
          });

          _this.context.router.push('/Cent/Passenger');
        }}>
          <Item extra="编辑" align="top" multipleLine>
            {val.chineseName}<Brief>{val.mobile}</Brief>
          </Item>
        </div>
      }
    })
  }

  renderPassengerList() {
    const _this = this,
      passengerList = _this.state.passenger;
    
    if (passengerList.length == 0) {
      return <div style={{ 'width': '100%', 'textAlign': 'center', 'padding': '20px 0px 0px 0px' }}>
        暂无数据
      </div>
    } else {
      return <div>
        <WhiteSpace size="lg" />
        <List>
          {passengerList.map(function(value, ref) {
            if (value.select == true) {
              return <CheckboxItem key={ref} 
                defaultChecked
                onChange={function(event){
                  let _state = assign({}, this.state);
                  if (event.target.checked == true) {
                    _state.passenger[ref].select = true;
                  }else {
                    _state.passenger[ref].select = false;
                  }
                  this.setState(_state);
                }.bind(this)}
              >{value.chineseName}</CheckboxItem>
            }else {
              return <CheckboxItem key={ref}
                onChange={function(event){
                  let _state = assign({}, this.state);
                  if (event.target.checked == true) {
                    _state.passenger[ref].select = true;
                  }else {
                    _state.passenger[ref].select = false;
                  }
                  this.setState(_state);
                }.bind(this)}
              >{value.chineseName}</CheckboxItem>
            }
          }.bind(this))}
        </List>
      </div>
    }

  }

  jumpToEditPassenger() {
    const _this = this;
    this.onClosePopup('cancel');
    // 页面跳转
    let _data = assign({},_this.props.Nav);

    _data.navtitle.push("编辑旅客信息");
    _data.PreURL.push("/Cent/Passenger/edit");

    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    });
    _this.props.dispatch({
      type:'select_Passenger',
      data:{
        type:'add',
        select:false
      }
    })

    _this.context.router.push('/Cent/Passenger/edit');
  }

  submitData() {
    const _this = this;
    // 最终提交的数据
    let _json = {
      userInfoList:[],
      address:{},
      billItemList:[]
    };

    // 验证是否选择日期
    if ( _this.state.checkInDate == null || _this.state.leaveDate == null ) {
      Toast.fail('请选择日期', 1);
      return
    }

    // 验证人数以及床型
    let romm_allow = true,
      inFor = '';
    for (let i = 0; i < _this.state.roomType.length; i++) {
      if (_this.state.roomType[i].selected != undefined && _this.state.roomType[i].selected != 0) {
        for (let j = 0; j < _this.state.roomType[i].selected; j++) {
          let billItem = {
            "itemId": null,
            "itemNum": null,
            "itemCode": _this.state.roomType[i].apartmentCode,
            "itemName": _this.state.roomType[i].apartmentName,
          };
          // 验证人数
          let peopleNum = _this.state.roomType[i].selectedDate[j].children + _this.state.roomType[i].selectedDate[j].adult;
          if (peopleNum == 0) {
            inFor = '房型人数必须有一人';
            romm_allow = false;
          }else if (peopleNum < _this.state.roomType[i].peopleMin && peopleNum > _this.state.roomType[i].peopleMax) {
            inFor = '房型人数超过推荐人数';
            romm_allow = false;
          }else {
            billItem.childNum = _this.state.roomType[i].selectedDate[j].children;
            billItem.adultNum = _this.state.roomType[i].selectedDate[j].adult;
          }
          // 验证床型
          if(_this.state.roomType[i].bedTypeDate[j].value == null){
            inFor = '你未选择床型';
            romm_allow = false;
          }else {
            billItem.itemSize = _this.state.roomType[i].bedTypeDate[j].value[0];
          }
          _json.billItemList.push(billItem);
        }
      }
    }
    if (romm_allow == false) {
      Toast.fail(inFor, 1.5);
      return
    }

    // 验证旅客信息
    let passenger_allow = false;
    for (let i = 0; i < _this.state.passenger.length; i++) {
      if (_this.state.passenger[i].select == true) {
        passenger_allow = true;
        let tem_Obj = {};
        tem_Obj.relId = null;
        tem_Obj.orderId = null;
        tem_Obj.chineseName =_this.state.passenger[i].chineseName;
        tem_Obj.pinyinName =_this.state.passenger[i].pinyinName;
        tem_Obj.gender =_this.state.passenger[i].gender;
        tem_Obj.passportNo =_this.state.passenger[i].passportNo;
        tem_Obj.email =_this.state.passenger[i].email;
        tem_Obj.divingCount =_this.state.passenger[i].divingCount;
        tem_Obj.divingRank =_this.state.passenger[i].divingRank;
        tem_Obj.birthday =_this.state.passenger[i].birthday;
        tem_Obj.age =_this.state.passenger[i].age;
        tem_Obj.mobile =_this.state.passenger[i].mobile;
        _json.userInfoList.push(tem_Obj);
      }
    }
    if (passenger_allow == false) {
      Toast.info('请选旅客信息!!!', 2, null, false);
      return
    }

    // 进入提交阶段，进行阻塞
    if (choke === true) { return }
    Toast.info('正在提交!!!', 2, null, false);
    choke = true;

    const resortCode = _this.props.village.villageSelected.resortCode,
      myCheckInDate = timeConversion.timestampToxxxx(Date.parse(_this.state.checkInDate)),
      myLeaveDate = timeConversion.timestampToxxxx(Date.parse(_this.state.leaveDate));

    fetch( `${appConfig.URLversion}/order/${resortCode}/${myCheckInDate}/${myLeaveDate}/custom.do`, {
      method: "POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        'token' :cookie.getItem('token'),
        'digest' :cookie.getItem('digest')
      },
      body: JSON.stringify(_json)
     }).then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then(function(json) {
      if (json.result == "0") {
        Toast.info('恭喜你提交成功!!!', 2, null, false);
        let _data = assign({},_this.props.Nav);

        _data.navtitle.push('全部订单');
        _data.PreURL.push('/village/submit');
        _data.leftContent = {
          return: 'left',
          logo: false
        };

        _this.props.dispatch({
          type: 'Chan_Nav',
          data: _data
        });

        _this.props.dispatch({
          type: 'ADD_summary',
          data: json.data
        });

        _this.context.router.push('/village/summary');
      }else {
        alert('发生未知错误，错误代码:' + json.result);
      }
      choke = false;
    })

  }

  render() {
    return (
      <div>
        <List renderHeader={() => '日期'}>
          <Item extra={this.renderCheckInDate.call(this)}>入住日期</Item>
          <Item extra={this.renderLeaveDate.call(this)}>退房日期</Item>
        </List>

        {this.renderRoom.call(this)}

        <List renderHeader={() => '客人信息 (至少提供一人信息)'}>
          <List.Item extra="选择" arrow="horizontal" onClick={function(){ Popup.show(
            <div>
              <List className="popup-list" renderHeader={() => (
                <div style={{ position: 'relative' }}>
                  选择旅客信息
                  <span style={{'position': 'absolute', 'right': 3, 'top': -5}}
                    onClick={() => this.onClosePopup('cancel')}
                  >X</span>
                </div>
              )}>

              {this.renderPassengerList.call(this)}

              <WingBlank size="md">
                <div className={styles.addPassenger}
                  onClick={ this.jumpToEditPassenger.bind(this) }
                >新增旅客信息</div>
              </WingBlank>
              <WingBlank size="md">
                <div className={styles.PopupConfirm}
                  onClick={() => this.onClosePopup('cancel')}
                >确认</div>
              </WingBlank>
              </List>
            </div> , { animationType: 'slide-up', maskProps, maskClosable: false })}.bind(this)}
          >选择旅客信息</List.Item>
          {this.renderSelectedPassenger.call(this)}
        </List>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className={styles.bottomPay}>
          <div className={styles.bottomPay} 
            onClick={this.submitData.bind(this)}
          >立即预定</div>
        </div>

        <Modal
          title="链接失效"
          transparent
          maskClosable={false}
          visible={this.state.modal}
          onClose={ this.onClosemodal('modal') }
          footer={[{ text: '返回首页', onPress: () => { this.onClosemodal('modal')() }}]}
        />
      </div>
    )
  }
}

const Item = List.Item
const Brief = Item.Brief
const CheckboxItem = Checkbox.CheckboxItem
let choke = false// 阻塞提交，防止重复提交

let nawDate = new Date()
nawDate = timeConversion.dateToFormat(nawDate)+' +0800'
const setoffDate = moment(nawDate, 'YYYY-MM-DD Z')

// 弹窗口
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let maskProps
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  }
}

villageSubmit.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  'Nav': state.reducer.Nav,
  'village': state.reducer.village,
  'Passenger': state.reducer.Passenger,
  'routing': state.routing.locationBeforeTransitions
})


export default villageSubmit = connect(
  mapStateToProps
)(villageSubmit)

// 渲染
function temporarily(_this) {
}




















