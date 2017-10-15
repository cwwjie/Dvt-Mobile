import { connect } from 'react-redux'
import React, {Component} from 'react'
import moment from 'moment'
import timeConversion from './../timeConversion.js'
import cookie from './../cookie.js'

import { Popup, Modal, Toast, List, WhiteSpace, WingBlank, Stepper, Picker, Checkbox } from 'antd-mobile'

import assign from 'lodash.assign'
import appConfig from './../../config/index.js'
import styles from './css/styles.scss'

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
  }
  componentWillMount() {
    let _this = this

    // 验证 过滤
    if (_this.props.village.selected === false) {
      _this.setState({
        modal: true
      })
      return
    }

    // 下面是初始化 每间房 人数 和 床型
    let _state = assign({}, _this.state)
    _state.roomType = _this.props.village.roomType
    for (let i = 0; i < _this.props.village.roomType.length; i++) {
      let selectedDate = [],
        bedTypeDate = []
      for (var j = 0; j < _this.props.village.roomType[i].selected; j++) {
        // 初始化 每间房人数 数据格式
        selectedDate.push({
          children:0,
          adult:1
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
          List:bedTypeForm,
          value:null
        })
      }
      _state.roomType[i].selectedDate = selectedDate;
      _state.roomType[i].bedTypeDate = bedTypeDate;
    }


    // 加载旅客信息
    _state.passenger = _this.props.Passenger.data;


    // 初始化入住日期
    _state.checkInDate = _this.props.village.villageSelected.villageTime;
    _state.leaveDate = new Date(Date.parse(_this.props.village.villageSelected.villageTime) + _this.props.village.villageSelected.villageLeave);


    _this.setState(_state);
  }
  componentWillReceiveProps(nextProps) {
    let _state = assign({},this.state);
    _state.passenger = nextProps.Passenger.data;
    this.setState(_state);
  }
  onClosemodal = key => () => {
    let _this = this
    let _data = assign({},_this.props.Nav);

    _data.productId=false;
    _data.navtitle=['潜游时光'];
    _data.PreURL=['/village'];
    _data.leftContent={
      return:false,
      logo:'home'
    };
    _data.hidden=false;
    _data.selectedTab='Order';

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
  render() {
    return (
      <div>
        <List renderHeader={() => '日期'}>
          <Item extra={(function(){
            if (this.state.checkInDate == null) {return}
            return timeConversion.dateToFormat(this.state.checkInDate);
          }.bind(this))()} arrow="horizontal" onClick={function(){
            // 储存必要的信息
            this.props.dispatch({
              type:'ADD_roomType',
              data:this.state.roomType
            });
            // 这里返回上一页
            let _data = assign({},this.props.Nav);
            let _Url = this.props.Nav.PreURL[(_data.PreURL.length-2)]
            _data.PreURL.pop();
            _data.navtitle.pop();
            this.props.dispatch({type:'Chan_Nav',data:_data})
            this.context.router.push(_Url);
          }.bind(this)}>入住日期</Item>
          <Item extra={(function(){
            if (this.state.checkInDate == null) {return}
            return timeConversion.dateToFormat(this.state.leaveDate);
          }.bind(this))()} arrow="horizontal" onClick={function(){
            // 储存必要的信息
            this.props.dispatch({
              type:'ADD_roomType',
              data:this.state.roomType
            });
            // 这里返回上一页
            let _data = assign({},this.props.Nav);
            let _Url = this.props.Nav.PreURL[(_data.PreURL.length-2)]
            _data.PreURL.pop();
            _data.navtitle.pop();
            this.props.dispatch({type:'Chan_Nav',data:_data})
            this.context.router.push(_Url);
          }.bind(this)}>退房日期</Item>
        </List>
        <List renderHeader={() => '房型'}>
          <Item arrow="horizontal" onClick={function(){
            // 储存必要的信息
            this.props.dispatch({
              type:'ADD_roomType',
              data:this.state.roomType
            });
            // 这里返回上一页
            let _data = assign({},this.props.Nav);
            let _Url = this.props.Nav.PreURL[(_data.PreURL.length-2)]
            _data.PreURL.pop();
            _data.navtitle.pop();
            this.props.dispatch({type:'Chan_Nav',data:_data})
            this.context.router.push(_Url);
          }.bind(this)}>添加房间</Item>
        </List>
          {this.state.roomType.map(function(val,ref){
            if (val.selected == undefined) {
              return <div></div>
            }else {
              let _array = [];
              for (let i = 0; i < val.selected; i++) {
                _array.push(
                  <List renderHeader={function(){
                    return '房间' + (i + 1);
                   }}>
                    <div onClick={function(){
                      let _this = this;
                      if (confirm("确认要删除？")) {
                        let roomNum = 0;
                        for (let i = 0; i < _this.state.roomType.length; i++) {
                          if (_this.state.roomType[i].selected != undefined) {
                            roomNum = roomNum + _this.state.roomType[i].selected;
                          }
                        }
                        if (roomNum <= 1) {
                          Toast.fail('至少有一间房', 1);
                          return
                        }
                        let _state = assign({},this.state);
                        _state.roomType[ref].selected -= 1;
                        _state.roomType[ref].selectedDate.splice(i,1);
                        _state.roomType[ref].bedTypeDate.splice(i,1);
                        this.setState(_state);
                        Toast.success('删除成功!!!', 1);
                      }
                    }.bind(this)}>
                    <Item extra="删除" arrow="horizontal">{val.apartmentName}</Item>
                    </div>
                    <Picker
                      data={this.state.roomType[ref].bedTypeDate[i].List}
                      cols={1}
                      value={this.state.roomType[ref].bedTypeDate[i].value}
                      title="请选择您的房型"
                      onChange={function(val){
                        let _data = assign({},this.state);
                        _data.roomType[ref].bedTypeDate[i].value = val;
                        this.setState(_data)
                      }.bind(this)}>
                      <List.Item arrow="horizontal">床型</List.Item>
                    </Picker>
                    <Item extra={
                      <Stepper
                        style={{ width: '100%', minWidth: '2rem' }}
                        showNumber
                        max={this.state.roomType[ref].childrenMax}
                        min={this.state.roomType[ref].childrenMin}
                        value={this.state.roomType[ref].selectedDate[i].children}
                        onChange={function(val){
                          let peopleNum = val + this.state.roomType[ref].selectedDate[i].adult;
                          if (peopleNum <= this.state.roomType[ref].peopleMax) {
                            let _state = assign({},this.state);
                            _state.roomType[ref].selectedDate[i].children = val;
                            this.setState(_state);
                          }else {
                            Toast.fail('超越推荐人数', 1);
                          }
                        }.bind(this)}
                        useTouch={false}
                      />}
                      wrap
                    >儿童<Brief>儿童:0-12岁</Brief></Item>
                    <Item extra={
                      <Stepper
                        style={{ width: '100%', minWidth: '2rem' }}
                        showNumber
                        max={this.state.roomType[ref].adultMax}
                        min={this.state.roomType[ref].adultMin}
                        value={this.state.roomType[ref].selectedDate[i].adult}
                        onChange={function(val){
                          let peopleNum = val + this.state.roomType[ref].selectedDate[i].children;
                           if (peopleNum <= this.state.roomType[ref].peopleMax) {
                            let _state = assign({},this.state);
                            _state.roomType[ref].selectedDate[i].adult = val;
                            this.setState(_state);
                          }else {
                            Toast.fail('超越推荐人数', 1);
                          }
                        }.bind(this)}
                        useTouch={false}
                      />}
                      wrap
                    >成人<Brief>成人: >12岁</Brief></Item>
                  </List>
                )
              }
              return _array;
            }
          }.bind(this))}
        <List renderHeader={() => '客人信息 (至少提供一人信息)'}>
          <List.Item extra="选择" arrow="horizontal" onClick={function(){
            Popup.show(
              <div>
                <List renderHeader={() => (
                  <div style={{ position: 'relative' }}>
                    选择旅客信息
                    <span
                      style={{
                        position: 'absolute', right: 3, top: -5,
                      }}
                      onClick={() => this.onClosePopup('cancel')}
                    >
                      X
                    </span>
                  </div>)}
                  className="popup-list"
                >
                {temporarily(this)}
                {this.state.passenger.map(function(value, ref) {
                  if (value.select == undefined) {
                    return <div>
                      <WhiteSpace size="lg" />
                        <List>
                          <CheckboxItem key={ref} onChange={function(event){
                            let _state = assign({},this.state);
                            if (event.target.checked == true) {
                              _state.passenger[ref].select = true;
                            }else {
                              _state.passenger[ref].select = false;
                            }
                            this.setState(_state);
                          }.bind(this)}>
                            {value.chineseName}
                          </CheckboxItem>
                        </List>
                    </div>
                  }else if (value.select == true) {
                    return <div>
                      <WhiteSpace size="lg" />
                        <List>
                          <CheckboxItem key={ref} onChange={function(event){
                            let _state = assign({},this.state);
                            if (event.target.checked == true) {
                              _state.passenger[ref].select = true;
                            }else {
                              _state.passenger[ref].select = false;
                            }
                            this.setState(_state);
                          }.bind(this)} defaultChecked>
                            {value.chineseName}
                          </CheckboxItem>
                        </List>
                    </div>
                  }else {
                    return <div>
                      <WhiteSpace size="lg" />
                        <List>
                          <CheckboxItem key={ref} onChange={function(event){
                            let _state = assign({},this.state);
                            if (event.target.checked == true) {
                              _state.passenger[ref].select = true;
                            }else {
                              _state.passenger[ref].select = false;
                            }
                            this.setState(_state);
                          }.bind(this)}>
                            {value.chineseName}
                          </CheckboxItem>
                        </List>
                    </div>
                  }
                }.bind(this))}
                <WingBlank size="md"><div onClick={function(){
                  this.onClosePopup('cancel');
                  const _this = this;
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
                }.bind(this)} className={styles.addPassenger}>新增旅客信息</div></WingBlank>
                <WingBlank size="md"><div onClick={() => this.onClosePopup('cancel')} className={styles.PopupConfirm}>确认</div></WingBlank>
                </List>
              </div>
              ,{ animationType: 'slide-up', maskProps, maskClosable: false }
            );
          }.bind(this)}>选择旅客信息</List.Item>
          {renderpPassenger(this)}
        </List>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className={styles.bottomPay}>
          <div className={styles.bottomPay} onClick={function(){
            let _this = this;
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
                    inFor = '请选择房型';
                    romm_allow = false;
                  }else {
                    billItem.itemSize = _this.state.roomType[i].bedTypeDate[j].value[0];
                  }
                  _json.billItemList.push(billItem);
                }
              }
            }
            if (romm_allow == false) {
              Toast.fail(inFor, 1);
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
            if (choke == true) {return}
            Toast.info('正在提交!!!', 2, null, false);
            choke = true;
            fetch(
              appConfig.URLversion+'/order/'//
                + _this.props.village.villageSelected.resortCode + "/"//
                + timeConversion.timestampToxxxx(Date.parse(_this.state.checkInDate)) + "/"//
                + timeConversion.timestampToxxxx(Date.parse(_this.state.leaveDate)) + "/custom.do",{
              method: "POST",
              headers:{
                "Content-Type": "application/json; charset=utf-8",
                token:cookie.getItem('token'),
                digest:cookie.getItem('digest')
              },
              body:JSON.stringify(_json)
             }).then(function(response) {
              return response.json()
             }).then(function(json) {
              if (json.result == "0") {
                Toast.info('恭喜你提交成功!!!', 2, null, false);
                let _data = assign({},_this.props.Nav);

                _data.navtitle.push('全部订单');
                _data.PreURL.push('/village/submit');
                _data.leftContent = {
                  return:'left',
                  logo:false
                };

                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });
                _this.props.dispatch({
                  type:'ADD_summary',
                  data:json.data
                });

                _this.context.router.push('/village/summary');
              }else {
                alert('发生未知错误，错误代码:'+json.result);
              }
              choke = false;
            })



          }.bind(this)}>立即预定</div>
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
            this.onClosemodal('modal')();
          }}]}
         >
        </Modal>
      </div>
    )
  }
}


villageSubmit.contextTypes = {
  router: Object
}

const mapStateToProps = (state, ownProps) => ({
  Passenger:state.reducer.Passenger,
  Nav:state.reducer.Nav,
  village:state.reducer.village,
  routing:state.routing.locationBeforeTransitions
})


export default villageSubmit = connect(
  mapStateToProps
)(villageSubmit)





function renderpPassenger(_this) {
  let _array = [];
  const _data = _this.state.passenger;
  for (let i = 0; i < _data.length; i++) {
    if (_data[i].select == true) {
      _array.push(
        <div onClick={function(){
          // 页面跳转
          let _data = assign({},_this.props.Nav);

          _data.navtitle.push('旅客信息');
          _data.PreURL.push('/Cent/Passenger');
          _data.leftContent = {
            return:'left',
            logo:false
          };

          _this.props.dispatch({
            type:'Chan_Nav',
            data:_data
          });
          _this.props.dispatch({
            type:'filter_Order',
            data:'complete'
          });

          _this.context.router.push('/Cent/Passenger');
        }}>
          <Item extra="编辑" align="top" multipleLine>
            {_data[i].chineseName}<Brief>{_data[i].mobile}</Brief>
          </Item>
        </div>
      )
    }
  }
  return _array;
}


// 渲染
function temporarily(_this) {
  if (_this.state.passenger.length == 0) {
    return <div style={{
      width:'100%',
      textAlign:'center',
      padding:'20px 0px 0px 0px'
    }}>暂无数据</div>
  }
}




















