import React, {Component} from 'react';
import { connect } from 'dva';

import MyNavBar from './../../../components/MyNavBar/index';
import AddPassenger from './../../../components/AddPassenger/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import { WhiteSpace, WingBlank, List, DatePicker, Stepper, Modal, Checkbox, Toast } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;

class DetailTravel extends Component {
  constructor(props) {
    super(props);

    this.product = JSON.parse(localStorage.getItem('product'));
    this.product = {
      productId: '64',
      productName: '天然小岛邦邦 3天2晚蜜月/闺蜜行',
      productPrice: 7450,
      promotePrice: 0
    }

    this.state = {
      popSelectPassenger: false,
      popAddPassenger: false,
      departureDate: null,
      productNum: 1,
      passenger: [
        // {
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
    this.onChangePassenger.bind(this);
  }

  componentDidMount() {
    this.getPassenger.call(this);
  }

  getPassenger() {
    const _this = this;
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/user/userinfo/findByUserId.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8',
        'headers': {
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        response => response.json(),
        error => ({'result': '1', 'message': error})
      ).then(json => {
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

  submitData() {
    const _this = this;

    if (this.state.departureDate === null) {
      Toast.info('请选择出发日期!', 2);
      return
    }

    let passengerNum = 0;
    let Mypassenge = [];
    this.state.passenger.map((val, key) => {
      if (val.select) {
        passengerNum++
        Mypassenge.push({
          'relId':  null,
          'orderId':  null,
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
        })
      }
    })

    if (passengerNum === 0) {
      Toast.info('请选旅客信息!!!', 2);
      return
    }

    let fetchbody = JSON.stringify({
      userInfoList: Mypassenge,
      address: {}
    })

    fetch(`${config.URLversion}/order/${this.product.productId}/${this.state.productNum}/${DateToYYYYDDMM(this.state.departureDate)}/reserve.do`, {
      'method': 'POST',
      'headers':{
        'Content-Type': 'application/json; charset=utf-8',
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      },
      'body': fetchbody
    }).then(
      (response) => ( response.json() ),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        Modal.alert('恭喜你提交成功!', '你已成功预订套餐, 请在30分钟内付定金!', [{
          text: '确定',
          onPress: () => {
            // 跳转到个人中心
            _this.props.dispatch(routerRedux.push('/user/index'));
          },
          style: 'default'
        }]);
      } else {
        Modal.alert('预订套餐失败', `请求服务器成功, 但是返回的预订信息有误! 原因: ${json.message}`);
      }
    }).catch((error) => {
        Modal.alert('请求出错', `向服务器发起请求预订信息失败, 原因: ${error}`);
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
      <div className="Home-Submit">
        <MyNavBar
          navName='确认订单'
          returnURL={localStorage.getItem('returnURL')}
        />

        <List renderHeader={() => '订单'} className="my-list">
          <Item>{this.product.productName}</Item>
        </List>

        <List renderHeader={() => '请选择'} className="my-list">
          <DatePicker
            mode="date"
            title="选择日期"
            minDate={new Date()}
            value={this.state.departureDate}
            onChange = {(date) => { this.setState({ 'departureDate': date}); }}
          >
            <Item arrow="horizontal">请选择出发日期</Item>
          </DatePicker>
          <Item wrap extra={
            <Stepper
              style={{ width: '100%', minWidth: '100px' }}
              showNumber
              max={100}
              min={1}
              value={this.state.productNum}
              onChange={(val) => {this.setState({ 'productNum': val });}}
            ></Stepper>}
          >选择套餐数量</Item>
        </List>

        <List renderHeader={() => '旅客信息(至少提供一人信息)'} className="my-list">
          <List.Item arrow="horizontal"
            extra="选择"
            onClick={() => this.setState({ 'popSelectPassenger': true})}
          >选择旅客信息</List.Item>
        </List>

        {passengerNode}

        <List renderHeader={() => '合计'} className="my-list">
          <List.Item extra={this.product.productPrice.toFixed(2)}>单价</List.Item>
          <List.Item extra={this.product.promotePrice.toFixed(2)}>优惠</List.Item>
          <List.Item extra={((this.product.productPrice - this.product.promotePrice) * this.state.productNum).toFixed(2)}>总价</List.Item>
        </List>

        <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.submitData.bind(this)}>预定套餐</div>
        </div>

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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(DetailTravel);

const DateToYYYYDDMM = (data) => {
  let _date = new Date(data);
  let _string = '';
  _string += _date.getFullYear();
  ( (_date.getMonth()+1)<10) ? (_string += "0" + (_date.getMonth()+1)) : (_string += (_date.getMonth()+1) );
  ( (_date.getDate()<10) ? (_string += "0" + _date.getDate()) : (_string += _date.getDate()) );

  return _string
}
