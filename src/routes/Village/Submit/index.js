import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import AddPassenger from './../../../components/AddPassenger/index';

import config from './../../../config';
import convertDate from './../../../utils/convertDate';
import cookies from './../../../utils/cookies';

import { Toast, Modal, List, DatePicker, Picker, Stepper, WhiteSpace, WingBlank, Checkbox } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;

class VillageSubmit extends Component {
  constructor(props) {
    super(props);

    this.returnURL = localStorage.getItem('returnURL') || '/village/index';
    localStorage.removeItem('returnURL');

    const VillageSubmitData = localStorage.getItem('VillageSubmitData');
    localStorage.removeItem('VillageSubmitData'); // 一次失效
    this.submitData = VillageSubmitData ? JSON.parse(VillageSubmitData) : false;
    // {
    //   'resortCode': "KPL",
    //   'checkInDate': "2018-01-03T02:45:48.000Z",
    //   'leaveDate': "2018-01-04T02:45:48.000Z",
    //   'resort': [
    //      {
    //        'adultMax': 2,
    //        'adultMin': 1,
    //        'adultPrices': null,
    //        'adultUnitPrice': null,
    //        'apartmentCode':" KPLyjf",
    //        'apartmentDesc':" 房间描述信息↵房间描述信息↵房间描述信息↵房间描述信息↵房间描述信息↵房间描述信息",
    //        'apartmentId': 1,
    //        'apartmentImg':"/ source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg",
    //        'apartmentName':" 园景房",
    //        'apartmentThumb':"/ source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg",
    //        'bedType':" 大床,双人床",
    //        'calMethod':" 1",
    //        'childPrices': null,
    //        'childUnitPrice': null,
    //        'childrenMax': 2,
    //        'childrenMin': 0,
    //        'codes': null,
    //        'createBy': 1,
    //        'createTime': 1505328965000,
    //        'facilities':" 冰箱,浴室,空调",
    //        'haveDays': null,
    //        'ids': null,
    //        'initiatePrice': null,
    //        'isAvePrice': null,
    //        'isDelete':" N",
    //        'isSaleOut':" Y",
    //        'notice':" 入住须知↵入住须知↵入住须知↵入住须知↵入住须知",
    //        'peopleMax': 4,
    //        'peopleMin': 0,
    //        'policy':"", 
    //        'resortCode':" KPL",
    //        'resortId': 1,
    //        'resortName':" 卡帕莱",
    //        'skuNum': null,
    //        'suggestedNum': 2,
    //        'updateBy': 29,
    //        'updateTime': 1508799022000,
    //      }
    //   ]
    // }

    this.state = {
      'resort': this.submitData !== false ? this.submitData.resort.map(val => ({
        'apartmentCode': val.apartmentCode,
        'apartmentName': val.apartmentName,
        'bedType': [val.bedType.split(',')[0]],
        'childrenNum': val.childrenMin,
        'adultNum': val.adultMin
      })) : [],
      'popSelectPassenger': false,
      'popAddPassenger': false,
      'passenger': [
        // {
        //   select: undefined,
        //   age: 1,
        //   birthday: "2017-10-15",
        //   chineseName: "葛武荣",
        //   divingCount: 3,
        //   divingRank: 2,
        //   email: "gewurong@divingtime.asia",
        //   gender: 1,
        //   isDelete: "N",
        //   mobile: "18503025768",
        //   passportNo: "E132535366",
        //   pinyinName: "GeWuRong",
        //   userId: null,
        //   userinfoId: 8,
        // }
      ]
    }

    this.bedTypeHandle.bind(this);
    this.childrenNumHandle.bind(this);
    this.adultNumHandle.bind(this);
    this.onChangePassenger.bind(this);
  }

  componentDidMount() {
    const _this = this;

    this.getPassenger.call(this);
    this.submitData === false ? Modal.alert('产品失效', '非常抱歉, 该产品预订链接已失效. 请重新预订!', [{
      text: '确定',
      style: 'default',
      onPress: () => _this.props.dispatch(routerRedux.push(this.returnURL)),
    }]) : null;
  }

  getPassenger() {
    const _this = this;
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/user/userinfo/findByUserId.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8',
        'headers':{
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          resolve(json.data);
          _this.setState({'passenger': json.data});
        } else {
          reject('获取旅客信息失败', `请求服务器成功, 但是返回的旅客信息有误! 原因: ${json.message}`);
          Modal.alert('获取旅客信息失败', `请求服务器成功, 但是返回的旅客信息有误! 原因: ${json.message}`);
        }
      }).catch((error) => {
          reject('请求出错', `向服务器发起请求旅客信息失败, 原因: ${error}`);
          Modal.alert('请求出错', `向服务器发起请求旅客信息失败, 原因: ${error}`);
      })
    })
  }

  onChangePassenger(isTrue, myKey) {
    let myPassenger = this.state.passenger.concat([]);

    myPassenger[myKey].select = isTrue ? true : false;

    this.setState({'passenger': myPassenger});
  }

  renderPassengerList() {
    const _this = this,
      passengerList = this.state.passenger;
    
    if (passengerList.length == 0) {
      return <div>
        <div style={{ 'width': '100%', 'textAlign': 'center', 'padding': '20px 0px 0px 0px' }}>
          暂无数据
        </div>
        <WhiteSpace size="lg" />
        <List>
          <div onClick={() => this.setState({ 'popAddPassenger': true})}>
            <Item extra="新增" arrow="horizontal">新增旅客信息</Item>
          </div>
        </List>
      </div>
    } else {
      return <div>
        <div className='Popup-Passenger-Hight'>
          <WhiteSpace size="lg" />
          <List>
            {passengerList.map((value, ref) => {
              return value.select == true ? 

              <CheckboxItem
                key={ref} 
                defaultChecked
                onChange={(event) => {_this.onChangePassenger(event.target.checked, ref)}}
              >{value.chineseName}</CheckboxItem> : 

              <CheckboxItem
                key={ref}
                onChange={(event) => {_this.onChangePassenger(event.target.checked, ref)}}
              >{value.chineseName}</CheckboxItem>;
            })}
          </List>
        </div>
        <WhiteSpace size="lg" />
        <List>
          <div onClick={() => this.setState({ 'popAddPassenger': true})}>
            <List.Item extra="新增" arrow="horizontal">新增旅客信息</List.Item>
          </div>
        </List>
      </div>
    }
  }

  bedTypeHandle(val, key) {
    let resort = this.state.resort.concat([]);

    resort[key].bedType = val;
    this.setState({'resort': resort});
  }

  childrenNumHandle(val, key) {
    let resort = this.state.resort.concat([]);

    resort[key].childrenNum = val;
    this.setState({'resort': resort});
  }

  adultNumHandle(val, key) {
    let resort = this.state.resort.concat([]);

    resort[key].adultNum = val;
    this.setState({'resort': resort});
  }

  submitOrder() {
    const _this = this;
    let cuontPassenger = 0;
    let userInfoList = [];

    this.state.passenger.map(val => {
      if (val.select === true) {
        cuontPassenger++;
        userInfoList.push({
          'relId': null,
          'orderId': null,
          'chineseName': val.chineseName,
          'pinyinName': val.pinyinName,
          'gender': val.gender,
          'passportNo': val.passportNo,
          'email': val.email,
          'divingCount': val.divingCount,
          'divingRank': val.divingRank,
          'birthday': val.birthday,
          'age': val.age,
          'mobile': val.mobile
        });
      }
    });
    
    if (cuontPassenger === 0) {
      Modal.alert('未选择旅客信息', '预订度假村至少提供一名旅客信息!');
      return
    }

    let submitData = {
      'address': {},
      'userInfoList': userInfoList,
      'billItemList': this.state.resort.map(val => ({
        'itemId': null,
        'itemNum': null,
        'itemCode': val.apartmentCode,
        'itemName': val.apartmentName,
        'childNum': val.childrenNum,
        'adultNum': val.adultNum,
        'itemSize': val.bedType[0]
      }))
    }

    Toast.loading('正在提交...');
    const resortCode = this.submitData.resortCode;
    const checkInDate = convertDate.dateToYYYYmmNumber(new Date(this.submitData.checkInDate));
    const leaveDate = convertDate.dateToYYYYmmNumber(new Date(this.submitData.leaveDate));

    fetch(`${config.URLversion}/order/${resortCode}/${checkInDate}/${leaveDate}/custom.do`, {
      'method': 'POST',
      'headers':{
        "Content-Type": "application/json; charset=utf-8",
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      },
      'body': JSON.stringify(submitData)
    }).then(
      response => response.json(),
      error => ({'result': '1', 'message': error})
    ).then(val => {
      if (val.result === '0') {
        Modal.alert('预订成功', '恭喜你成功预订度假村, 请在30分钟内未完成付款!', [{
          text: '确定',
          onPress: () => _this.props.dispatch(routerRedux.push('/user/order/index')),
          style: 'default'
        }]);
      } else {
        Modal.alert('预订失败', `预订度假村直定失败, 原因: ${val.message}`);
      }
      Toast.hide();
    }).catch(error => {
      Modal.alert('请求出错', `向服务器发起请求预订度假村直定失败，原因: ${error}`);
      Toast.hide();
    })
  }

  render() {
    const _this = this;

    const passengerNode = this.state.passenger.map((val, key) => {
      if (val.select === true) {
        return <div key={key}
          onClick={() => {
            if ( confirm('确认要删除吗?') ) {
              let myState =  _this.state.passenger.concat([])
              myState[key].select = false;
              _this.setState({'passenger': myState});
            }
          }}>
          <Item extra="删除" align="top" multipleLine>
            {val.chineseName}<Brief>{val.mobile}</Brief>
          </Item>
        </div>
      }
    });

    return (
      <div className="Village-Submit">
        <MyNavBar
          navName='预定度假村'
          returnURL={this.returnURL}
        />

        <List renderHeader='日期'>
          <DatePicker
            mode="date"
            title="入住日期"
            disabled={true}
            value={this.submitData !== false ? new Date(this.submitData.checkInDate) : new Date()}
          >
            <List.Item>入住日期</List.Item>
          </DatePicker>
        </List>
        <List>
          <DatePicker
            mode="date"
            title="退房日期"
            disabled={true}
            value={this.submitData !== false ? new Date(this.submitData.leaveDate) : new Date()}
          >
            <List.Item>退房日期</List.Item>
          </DatePicker>
        </List>

        {this.submitData !== false ? this.submitData.resort.map((val, key) => (
          <div key={key} className='resort-item'>
            <List renderHeader={ () => `房间${key + 1}`}>
              <List.Item>{val.apartmentName}</List.Item>
              <Picker
                data={val.bedType.split(',').map(val => ({ label: val, value: val }))}
                cols={1}
                value={this.state.resort[key].bedType}
                title="请选择床型"
                onChange={bed => this.bedTypeHandle(bed, key)}
              >
                <List.Item arrow="horizontal">床型</List.Item>
              </Picker>
              <List.Item wrap extra={
                <Stepper style={{ width: '100%', minWidth: '100px' }}
                  showNumber
                  max={val.childrenMax}
                  min={val.childrenMin}
                  value={this.state.resort[key].childrenNum}
                  onChange={children => this.childrenNumHandle(children, key)}
                />}
              >儿童<List.Item.Brief>0-12岁</List.Item.Brief></List.Item>
              <List.Item wrap extra={
                <Stepper style={{ width: '100%', minWidth: '100px' }}
                  showNumber
                  max={val.adultMax}
                  min={val.adultMin}
                  value={this.state.resort[key].adultNum}
                  onChange={adult => this.adultNumHandle(adult, key)}
                />}
              >成人<List.Item.Brief>>12岁</List.Item.Brief></List.Item>
            </List>
          </div>
        )) : ''}

        <List renderHeader={() => '旅客信息(至少提供一人信息)'} className="my-list">
          <List.Item arrow="horizontal"
            extra="选择"
            onClick={() => this.setState({ 'popSelectPassenger': true})}
          >选择旅客信息</List.Item>
        </List>

        {passengerNode}

        <Modal
          maskClosable={false}
          popup={true}
          visible={this.state.popSelectPassenger}
          animationType="slide-up"
        >
          <div className="Home-Submit-Popup">
            <List renderHeader={() => (
              <div className="list-Header">
                选择旅客信息
                <span
                  onClick={() => this.setState({ 'popSelectPassenger': false})}
                >X</span>
              </div>
            )}>

            {_this.renderPassengerList.call(_this)}

            <WingBlank size="md">
              <div className='Submit-Popup'
                onClick={() => this.setState({ 'popSelectPassenger': false})}
              >确认</div>
            </WingBlank>
            </List>
          </div>
        </Modal>

        <Modal
          maskClosable={false}
          popup={true}
          visible={this.state.popAddPassenger}
          animationType="slide-up"
        >
          <div className="Home-Submit-Popup">
            <List renderHeader={() => (
              <div className="list-Header">
                新增旅客信息
                <span onClick={() => {this.setState({ 'popAddPassenger': false})}}
                >X</span>
              </div>
            )}>
            <WhiteSpace size="lg" />
            <AddPassenger
              close={() => {
                _this.getPassenger().then((val) => {
                  _this.setState({ 'popAddPassenger': false})
                });
              }}
            />
            </List>
          </div>
        </Modal>

        <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.submitOrder.bind(this)}>立即预定</div>
        </div>
      </div>
    )
  }
}

export default connect()(VillageSubmit);
