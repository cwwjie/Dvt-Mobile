import React, {Component} from 'react';
import { connect } from 'dva';
import { Modal , WhiteSpace , List , InputItem , Picker , DatePicker , WingBlank , Toast} from 'antd-mobile';
import convertToPinyinLower from './../../utils/convertToPinyinLower';
import convertDate from './../../utils/convertDate';
import cookies from './../../utils/cookies';
import config from './../../config';

// 以后有时间再改这个吧~
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
  
  submitData() {
    const _this = this;
    let isSubmiting = _this.isSubmiting;

    if (isSubmiting) { return }

    if (JudgeAll(_this.state) == false) { return }

    let _sex = 0,
      _diving = 0;

    _this.isSubmiting = true;
      
    if (_this.state.sex[0] == 'Boy') {
      _sex = 1
    }else {
      _sex = 2
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
      "birthday":  convertDate.dateToFormat(_this.state.birthday),
      "age":  '' + _this.state.age,
      "mobile": _this.state.mobile,
      "email": _this.state.email,
      "passportNo": _this.state.passportNo,
      "divingRank": _diving,
      "divingCount": _this.state.divingCount
    }


    fetch( `${config.URLversion}/user/userinfo/add.do`, {
      method: "POST",
      contentType: "application/json; charset=utf-8",
      headers:{
        token: cookies.getItem('token'),
        digest: cookies.getItem('digest')
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
    }).catch(error => {
      _this.isSubmiting = false;
      alert(`请求添加旅客信息发生错误, 原因: ${error}`);
    })
  }

  render() {
    const _this = this;

    return (
      <div className='Home-Submit'>
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
              this.setState({pinyinName: val});
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
              this.setState({passportNo: val})
            }.bind(this)}
          >护照号码</InputItem>

          <Picker
            data={sexList}
            cols={1}
            value={this.state.sex}
            title="请选择您的性别"
            onChange={function(val){
              this.setState({sex: val})
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
              let myDate = new Date();
              let StateDate = new Date(Date.parse(val));
              this.setState({
                birthday: val,
                age: myDate.getFullYear() - StateDate.getFullYear()
              })
            }.bind(this)}
          >
            <List.Item arrow="horizontal">出生日期</List.Item>
          </DatePicker>

          <InputItem
            placeholder='手机号码(必填)'
            value={this.state.mobile}
            onChange={function(val){
              this.setState({mobile: val})
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
              this.setState({email: val})
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
              this.setState({diving: val})
            }.bind(this)}
          >
            <List.Item arrow="horizontal">潜水等级</List.Item>
          </Picker>

          <InputItem
            placeholder='请填写100以下次数'
            value={this.state.divingCount}
            onChange={function(val){
              this.setState({divingCount: val})
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
        <WingBlank size="md">
          <div className='Popup-confirm'
            onClick={() => {
              _this.submitData.call(_this);
            }}
          >新增</div>
        </WingBlank>
      </div>
    )
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

let _minDate = new Date(-1351929600000);
let _maxDate = new Date();

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


const mapStateToProps = (state) => ({
})

export default connect()(AddPassenger);
