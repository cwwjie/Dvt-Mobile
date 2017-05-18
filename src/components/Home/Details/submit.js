import { connect } from 'react-redux'
import React, {Component} from 'react';
import moment from 'moment';
import dateToFormat from './dateToFormat.js';

import { Popup , InputItem , Picker , Checkbox , WhiteSpace , WingBlank , List , DatePicker , Stepper , Modal , Toast } from 'antd-mobile';


import appConfig from './../../../config/index.js';
import styles from './styles.scss';
import assign from 'lodash.assign'
import cookie from './../../cookie.js'



let nawDate = new Date();
nawDate = dateToFormat(nawDate)+' +0800';
const setoffDate = moment(nawDate,'YYYY-MM-DD Z');

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}


const alert = Modal.alert;
const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;
let choke = false;


let minDate = new Date(-1351929600000);
minDate = dateToFormat(minDate)+' +0800';
const _minDate = moment(minDate,'YYYY-MM-DD Z');

let maxDate = new Date();
maxDate = dateToFormat(maxDate)+' +0800';
const _maxDate = moment(maxDate,'YYYY-MM-DD Z');



class travel extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      modal: false,
      sel: '',

      date:null,
      Num:1,

      switch:{
        main:'block',
        list:'none',
        detail:'none',
        submit:'block',
        add:'none',
        edit:'none'
      },

      passenger:[],
      Listselect:false,

      productPrice:null,
      promotePrice:null,
      totalPrice:null,
      productName:null,


      userinfoId:null,
      chineseName:null,
      pinyinName:null,
      passportNo:null,
      age:null,
      mobile:null,
      email:null,
      divingCount:null,
      type:false,
      birthday: null,//生日
      sexList:[
        {
          label: '男',
          value: 'Boy',
        },
        {
          label: '女',
          value: 'Girl',
        }
      ],
      sex:null,
      divingList:[
        {
          label: '无',
          value: 'null',
        },
        {
          label: 'OW(初级潜水员)',
          value: '1',
        },
        {
          label: 'OW以上',
          value: '2',
        }
      ],
      diving:null
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
    let _state = assign({},_this.state);

    _state.passenger = _this.props.Passenger.data;
    _state.productPrice = _this.props.product.productInfor.productPrice.toFixed(2);
    _state.promotePrice = _this.props.product.productInfor.promotePrice.toFixed(2);
    const _total = (_this.props.product.productInfor.productPrice - _this.props.product.productInfor.promotePrice).toFixed(2);
    _state.totalPrice = _total;
    _state.productName = _this.props.product.productInfor.productName;

    _this.setState(_state);
  }
  componentWillReceiveProps(nextProps) {
    let _state = assign({},this.state);
    _state.passenger = nextProps.Passenger.data;
    this.setState(_state);
  }
  onClosePopup = (sel) => {
    this.setState({ sel });
    Popup.hide();
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
        <div style={{display:this.state.switch.main}}>
          <WhiteSpace size="lg" />
          <WingBlank size="md">订单</WingBlank>
          <WhiteSpace size="lg" />
          <List>
            <List.Item>{this.state.productName}</List.Item>
          </List>
          <WhiteSpace size="lg" />
          <WingBlank size="md">请选择</WingBlank>
          <WhiteSpace size="lg" />
          <List>
            <DatePicker
              mode="date"
              title="选择日期"
              minDate={setoffDate}
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
                    const _Price = ( num * (this.state.productPrice-this.state.promotePrice)).toFixed(2);
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
          <WingBlank size="md">客人信息</WingBlank>
          <WhiteSpace size="lg" />
          <List>
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
          <WingBlank size="md">合计</WingBlank>
          <WhiteSpace size="lg" />
          <List>
            <List.Item extra={this.state.productPrice}>单价</List.Item>
            <List.Item extra={this.state.promotePrice}>优惠</List.Item>
            <List.Item extra={this.state.totalPrice}>总价</List.Item>
          </List>
        </div>

        <div className={styles.bottomPay} style={{display:this.state.switch.submit}}>
          <div className={styles.bottomPay} onClick={function(){
            let _this = this;
            if (_this.state.date == null) {
              Toast.info('请选择时间!!!', 2, null, false);
              return
            }
            if (_this.state.passenger.length == 0) {
              Toast.info('请选旅客信息!!!', 2, null, false);
              return
            }
            if (choke == true) {return}
            choke = true;
            let _json = {
              userInfoList:[],
              address:{}
            };
            for (let i = 0; i < _this.state.passenger.length; i++) {
              if (_this.state.passenger[i].select = true) {
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
            let _date = new Date(Date.parse(_this.state.date._d));
            let _string = '';
            _string += _date.getFullYear();
            ( (_date.getMonth()+1)<10) ? (_string += "0" + (_date.getMonth()+1)) : (_string += (_date.getMonth()+1) );
            ( (_date.getDate()<10) ? (_string += "0" + _date.getDate()) : (_string += _date.getDate()) );
            fetch(
              appConfig.URLversion+'/order/'//
                + _this.props.product.productId + "/"//
                + _this.state.Num + "/"//
                + _string + "/reserve.do",{
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
                _data.PreURL.push('/Cent/Order');
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
                data:'all'
                });

                _this.context.router.push('/Cent/Order');
              }else {
                alert('发生未知错误，错误代码:'+json.result);
              }
            })
          }.bind(this)}>预定套餐</div>
        </div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
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
  Passenger:state.reducer.Passenger,
  Nav:state.reducer.Nav,
  product:state.reducer.product
})


export default travel = connect(
  mapStateToProps
)(travel)


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



