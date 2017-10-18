import moment from 'moment';
import assign from 'lodash.assign';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { Modal , WhiteSpace , List , InputItem , Picker , DatePicker , WingBlank , Toast} from 'antd-mobile';

import appConfig from './../../config/index.js';
import cookie from './../../method/cookie.js';
import convertToPinyinLower from './../../method/convertToPinyinLower.js';
import dateToFormat from './../../method/dateToFormat.js';

import styles from './css/styles.scss'

class AddPassenger extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      userinfoId: null,
      chineseName: null,
      pinyinName: null,
      passportNo: null,
      age: null,
      mobile: null,
      email: null,
      divingCount: null,
      type: false,
      birthday: null,//生日
      sex: null,
      diving: null,
    };

    
    this.isSubmiting = false;
  }

  render() {
    const _this = this;

    return (
      <div>
        <div className={styles.AddPassenger}>
          <List>

            <InputItem
              placeholder='姓名/中文(必填)'
              value={this.state.chineseName}
              onChange={function(val){
                this.setState({chineseName: val})
              }.bind(this)}
              onBlur={function(val) {
                if (val == '') {
                  Toast.info('中文姓名为必填', 1.2);
                }else if ( !(/^[\u2E80-\u9FFF]+$/.test(val)) ) {
                  Toast.info('必须全为中文(不能有空格)', 1.5);
                }else {
                  this.setState({pinyinName: convertToPinyinLower.getFullChars(val)});
                }
              }.bind(this)}
            >姓名中文</InputItem>

            <InputItem
              placeholder='姓名/拼音(必填)'
              value={this.state.pinyinName}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.pinyinName = val
                this.setState(_data)
              }.bind(this)}
              onBlur={function(val){
                if (val == '') {
                  Toast.info('拼音为必填', 1.2);
                }else if ( !(/^[a-zA-Z]{0,100}$/.test(val)) ) {
                  Toast.info('必须全为拼音(不能有空格)', 1.5);
                }
              }}
            >姓名拼音</InputItem>

            <InputItem
              placeholder='护照号码'
              value={this.state.passportNo}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.passportNo = val
                this.setState(_data)
              }.bind(this)}
            >护照号码</InputItem>

            <Picker
              data={sexList}
              cols={1}
              value={this.state.sex}
              title="请选择您的性别"
              onChange={function(val){
                let _data = assign({},this.state);
                _data.sex = val;
                this.setState(_data)
              }.bind(this)}
            >
              <List.Item arrow="horizontal">性别</List.Item>
            </Picker>

            <DatePicker
              mode="date"
              title="选择出生日期"
              extra="请选择"
              value={this.state.birthday}
              minDate={_minDate}
              maxDate={_maxDate}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.birthday = val;
                let myDate = new Date();
                let StateDate = new Date(Date.parse(val._d));
                _data.age = myDate.getFullYear() - StateDate.getFullYear();
                this.setState(_data)
              }.bind(this)}
            >
              <List.Item arrow="horizontal">出生日期</List.Item>
            </DatePicker>

            <InputItem
              placeholder='年龄(必填)'
              value={this.state.age}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.age = val
                this.setState(_data)
              }.bind(this)}
              onBlur={function(val){
                if (val == '') {
                  Toast.info('年龄为必填', 1.2);
                }
              }}
            >年龄</InputItem>

            <InputItem
              placeholder='手机号码(必填)'
              value={this.state.mobile}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.mobile = val
                this.setState(_data)
              }.bind(this)}
              onBlur={function(val){
                if (val == '') {
                  Toast.info('手机号码为必填', 1.2);
                }else if ( !(/^1[34578]\d{9}$/.test(val)) ) {
                  Toast.info('手机号码格式不正确', 1.5);
                }
              }}
            >手机号码</InputItem>

            <InputItem
              placeholder='邮箱(必填)'
              value={this.state.email}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.email = val
                this.setState(_data)
              }.bind(this)}
              onBlur={function(val){
                if (val == '') {
                  Toast.info('邮箱为必填', 1.2);
                }else if ( !(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val)) ) {
                  Toast.info('邮箱格式不正确', 1.5);
                }
              }}
            >邮箱</InputItem>

            <Picker
              data={divingList}
              cols={1}
              value={this.state.diving}
              title="请选择潜水等级"
              onChange={function(val){
                let _data = assign({},this.state);
                _data.diving = val
                this.setState(_data)
              }.bind(this)}
            >
              <List.Item arrow="horizontal">潜水等级</List.Item>
            </Picker>

            <InputItem
              placeholder='请填写100以下次数'
              value={this.state.divingCount}
              onChange={function(val){
                let _data = assign({},this.state);
                _data.divingCount = val
                this.setState(_data)
              }.bind(this)}
              onBlur={function(val){
                if ( val == null || val == '') {
                }else {
                  if (!(/^[0-9]*$/.test(val))) {
                    Toast.info('潜水次数必须为数字', 1.5);
                    return false
                  }else if ( parseInt(val) > 100) {
                    Toast.info('只能填写100以下的数字', 1.5);
                    return false
                  }
                }
              }}
            >潜水次数</InputItem>

          </List>
        </div>

        <WingBlank size="md">
          <div className={styles.PopupConfirm}
            onClick={() => {
              _this.submitData.call(_this);
            }}
          >新增</div>
        </WingBlank>
      </div>
    )
  }

  submitData() {
    const _this = this;
    let isSubmiting = _this.isSubmiting;

    if (isSubmiting) { return }

    if (JudgeAll(_this.state) == false) { return }

    let _sex = 0,
      _diving=0;

    _this.isSubmiting = true;
      
    if (_this.state.sex[0] == 'Boy') {
      _sex = 0
    }else {
      _sex = 1
    }

    if (_this.state.diving == null) {
      _diving = null
    }else {
      if (_this.state.diving[0] == 'null') {
        _diving = null
      }else if (_this.state.diving[0] == '1') {
        _diving = 1
      }else if (_this.state.diving[0] == '2') {
        _diving = 2
      }
    }

    const mySubmit = {
      "chineseName": _this.state.chineseName,
      "pinyinName": _this.state.pinyinName,
      "gender":  _sex,
      "birthday":  dateToFormat(new Date(Date.parse(_this.state.birthday._d))),
      "age":  '' + _this.state.age,
      "mobile": _this.state.mobile,
      "email": _this.state.email,
      "passportNo": _this.state.passportNo,
      "divingRank": _diving,
      "divingCount": _this.state.divingCount
    }

    fetch( appConfig.userinfoAdd, {
      method: "POST",
      contentType: "application/json; charset=utf-8",
      headers:{
        token: cookie.getItem('token'),
        digest: cookie.getItem('digest')
      },
      body: JSON.stringify(mySubmit)
    }).then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        _this.props.close();
      }else {
        alert(`添加旅客信息发生错误, 原因: ${json.message}`);
      }
      _this.isSubmiting = false;
    })
  }

}

const sexList = [
    {
      label: '男',
      value: 'Boy',
    },
    {
      label: '女',
      value: 'Girl',
    }
  ],
  divingList = [
    {
      label: '无',
      value: 'null',
    },
    {
      label: 'OW(初级潜水员)',
      value: '1',
    },
    {
      label: 'AOW以上',
      value: '2',
    }
  ];

const alert = Modal.alert;
const Item = List.Item;
const Brief = Item.Brief;

let minDate = new Date(-1351929600000);
minDate = dateToFormat(minDate)+' +0800';
const _minDate = moment(minDate,'YYYY-MM-DD Z');

let maxDate = new Date();
maxDate = dateToFormat(maxDate)+' +0800';
const _maxDate = moment(maxDate,'YYYY-MM-DD Z');


export default AddPassenger


let repeatedSubmit = true;
function RenderSubmit(type, _this) {
  if (type == false) {
    return <div className={styles.bottomPay}><div>正在加载...</div></div>
  }else if (type == 'edit') {
    return <div className={styles.bottomEdit}>
      <div className={styles.Edit} onClick={function(){
        if (JudgeAll(_this.state) == false) {
          return
        }
        let _sex = 0,
          _diving=0;

        if (_this.state.sex[0] == 'Boy') {
          _sex = 0
        }else {
          _sex = 1
        }

        if (_this.state.diving == null) {
          _diving = null
        }else {
          if (_this.state.diving[0] == 'null') {
            _diving = null
          }else if (_this.state.diving[0] == '1') {
            _diving = 1
          }else if (_this.state.diving[0] == '2') {
            _diving = 2
          }
        }

        const _json = {
          'userinfoId': _this.state.userinfoId,
          'chineseName': _this.state.chineseName,
          'pinyinName': _this.state.pinyinName,
          'gender': _sex,
          'birthday': dateToFormat(new Date(Date.parse(_this.state.birthday._d))),
          'age': '' + _this.state.age,
          'mobile': _this.state.mobile,
          'email': _this.state.email,
          'passportNo': _this.state.passportNo,
          'divingRank': _diving,
          'divingCount': _this.state.divingCount
        }
        fetch( appConfig.userupdate, {
          method: "POST",
          contentType: "application/json; charset=utf-8",
          headers: {
            token: cookie.getItem('token'),
            digest: cookie.getItem('digest')
          },
          body: JSON.stringify(_json)
         }).then(function(response) {
          return response.json()
         }).then(function(json) {
          if (json.result=="0") {
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
            location.reload();
          }else {
            alert("未知错误，可能是输入参数有误，请重试");
          }
        })
      }.bind(_this)}>修改</div>
      <div className={styles.Delete} onClick={function(){
        alert('删除', '是否确定删除?', [
          { text: '取消'},
          { text: '确定', onPress:function(){
            fetch(
              appConfig.userinfoId + _this.state.userinfoId,{
              method: "GET",
              contentType: "application/json; charset=utf-8",
              headers:{
                token:cookie.getItem('token'),
                digest:cookie.getItem('digest')
              }
             }).then(function(response) {
              return response.json()
             }).then(function(json) {
              if (json.result=="0") {
                Toast.info('成功删除', 1.5);
                // 返回 Passenger
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
                location.reload();
              }else {
                alert("删除失败");
              }
            })
          }.bind(_this), style: { fontWeight: 'bold' } },
        ])
      }.bind(_this)}>删除</div>
    </div>
  }else if (type == 'add') {
    return <div className={styles.bottomPay}><div onClick={function(){
      if (repeatedSubmit == false) {
        return
      }
      if (JudgeAll(_this.state) == false) {
        return
      }
      let _sex = 0,
        _diving=0;
      if (_this.state.sex[0] == 'Boy') {
        _sex = 0
      }else {
        _sex = 1
      }
      if (_this.state.diving == null) {
        _diving = null
      }else {
        if (_this.state.diving[0] == 'null') {
          _diving = null
        }else if (_this.state.diving[0] == '1') {
          _diving = 1
        }else if (_this.state.diving[0] == '2') {
          _diving = 2
        }
      }
      const _json = {
        "chineseName": _this.state.chineseName,
        "pinyinName": _this.state.pinyinName,
        "gender":  _sex,
        "birthday":  dateToFormat(new Date(Date.parse(_this.state.birthday._d))),
        "age":  '' + _this.state.age,
        "mobile": _this.state.mobile,
        "email": _this.state.email,
        "passportNo": _this.state.passportNo,
        "divingRank": _diving,
        "divingCount": _this.state.divingCount
      }
      repeatedSubmit = false;
      fetch(
        appConfig.userinfoAdd,{
        method: "POST",
        contentType: "application/json; charset=utf-8",
        headers:{
          token: cookie.getItem('token'),
          digest: cookie.getItem('digest')
        },
        body:JSON.stringify(_json)
       }).then(function(response) {
        return response.json()
       }).then(function(json) {
        if (json.result=="0") {
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
          location.reload();
        }else {
          alert("未知错误，可能是输入参数有误，请重试");
        }
        repeatedSubmit = true;
      })
    }.bind(_this)}>添加</div></div>
  }
}




function JudgeAll(state) {
  // 判断中文姓名
  if ( state.chineseName == null || state.chineseName == '') {
    Toast.info('中文姓名为必填', 1.2);
    return false
  }else if ( !(/^[\u2E80-\u9FFF]+$/.test(state.chineseName)) ) {
    Toast.info('必须全为中文(不能有空格)', 1.5);
    return false
  }


  // 判断拼音
  if ( state.pinyinName == null || state.pinyinName == '') {
    Toast.info('拼音为必填', 1.2);
    return false
  }else if ( !(/^[a-zA-Z]{0,100}$/.test(state.pinyinName)) ) {
    Toast.info('必须全为拼音(不能有空格)', 1.5);
    return false
  }




  // 判断性别
  if ( state.sex == null ) {
    Toast.info('性别为必选', 1.2);
    return false
  }

  // 判断生日
  if ( state.birthday == null ) {
    Toast.info('生日为必选', 1.2);
    return false
  }

  // 判断年龄
  if ( state.age == null || state.age == '' ) {
    Toast.info('年龄为必填', 1.2);
    return false
  }

  // 判断手机
  if ( state.mobile == null || state.mobile == '' ) {
    Toast.info('手机为必填', 1.2);
    return false
  }else if ( !(/^1[34578]\d{9}$/.test(state.mobile)) ) {
    Toast.info('手机格式不正确', 1.5);
    return false
  }

  // 判断邮箱
  if ( state.email == null || state.email == '') {
    Toast.info('邮箱为必填', 1.2);
    return false
  }else if ( !(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(state.email)) ) {
    Toast.info('邮箱格式不正确', 1.5);
    return false
  }


  // 判断潜水次数
  if ( state.divingCount == null || state.divingCount == '') {
  }else {
    if (!(/^[0-9]*$/.test(state.divingCount))) {
      Toast.info('潜水次数必须为数字', 1.5);
      return false
    }
  }
  return true
}



const showAlert = () => {
  const alertInstance = alert('删除', '确定删除么???', [
    { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
    { text: 'OK', onPress: () => console.log('ok'), style: { fontWeight: 'bold' } },
  ]);
  setTimeout(() => {
    // 可以调用close方法以在外部close
    alertInstance.close();
  }, 1000);
};