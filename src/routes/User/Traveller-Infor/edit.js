import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import request from './../../../utils/request';
import convertDate from './../../../utils/convertDate';
import convertToPinyinLower from './../../../utils/convertToPinyinLower';

import { Toast, Modal, List, InputItem, Picker, DatePicker } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;

// userinfo = {
//   'age': 26,
//   'birthday': '1992-10-31',
//   'chineseName': '曾杰杰',
//   'divingCount': null,
//   'divingRank': null,
//   'email': '454766952@qq.com',
//   'gender': 0,
//   'isDelete': 'N',
//   'mobile': '15976713287',
//   'passportNo': null,
//   'pinyinName': 'Rejiejay',
//   'userId': null,
//   'userinfoId': 17
// }

class EditTraveller extends Component {
  constructor(props) {
    super(props);

    let EmptyUserinfo = {
      'age': null,
      'birthday': new Date(),
      'chineseName': null,
      'divingCount': null,
      'divingRank': null,
      'email': null,
      'gender': ['1'],
      'isDelete': null,
      'mobile': null,
      'passportNo': null,
      'pinyinName': null,
      'userId': null,
      'userinfoId': null
    };

    this.EditTravellerType = localStorage.getItem('Edit-Traveller-Type') || 'Add';
    this.EditTravellerUserinfo = localStorage.getItem('Edit-Traveller-Userinfo') ? JSON.parse(localStorage.getItem('Edit-Traveller-Userinfo')) : EmptyUserinfo;

    this.state = this.EditTravellerType === 'Edit' ? {
      'age': this.EditTravellerUserinfo.age,
      'birthday': new Date(this.EditTravellerUserinfo.birthday),
      'chineseName': this.EditTravellerUserinfo.chineseName,
      'divingCount': this.EditTravellerUserinfo.divingCount,
      'divingRank': this.EditTravellerUserinfo.divingRank,
      'email': this.EditTravellerUserinfo.email,
      'gender': [new Number(this.EditTravellerUserinfo.gender).toString()],
      'isDelete': this.EditTravellerUserinfo.isDelete,
      'mobile': this.EditTravellerUserinfo.mobile,
      'passportNo': this.EditTravellerUserinfo.passportNo,
      'pinyinName': this.EditTravellerUserinfo.pinyinName,
      'userId': this.EditTravellerUserinfo.userId,
      'userinfoId': this.EditTravellerUserinfo.userinfoId
    } : EmptyUserinfo;

    this.chineseNameHandle.bind(this);
    this.checkingAll.bind(this);
  }

  chineseNameHandle(val) {
    const chineseName = val || this.state.chineseName;

    if (chineseName === '' || chineseName === null) {
      return request.error('姓名中文不能为空');
    } else if ( /^[\u2E80-\u9FFF]+$/.test(chineseName) === false ) {
      return request.error('必须中文格式');
    } else {
      return request.success();
    }
  }

  onChangechineseNameHandle(val) {
    if (this.chineseNameHandle(val).result === 1) {
      this.setState({
        'chineseName': val,
        'pinyinName': convertToPinyinLower.getFullChars(val)
      })
    } else {
      this.setState({'chineseName': val})
    }
  }

  pinyinNameHandle() {
    const pinyinName = this.state.pinyinName;

    if (pinyinName === '' || pinyinName === null) {
      return request.error('拼音姓名不能为空');
    } else if ( /^[a-zA-Z]{0,100}$/.test(pinyinName) === false ) {
      return request.error('必须英文格式');
    } else {
      return request.success();
    }
  }

  mobileHandle() {
    const mobile = this.state.mobile;

    if (mobile === '' || mobile === null) {
      return request.error('旅客手机号码不能为空');
    } else if ( /^1[34578]\d{9}$/.test(mobile) === false ) {
      return request.error('必须正确手机格式号码');
    } else {
      return request.success();
    }
  }

  emailHandle() {
    const email = this.state.email;

    if (email === '' || email === null) {
      return request.error('旅客邮箱号码不能为空');
    } else if ( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email) === false ) {
      return request.error('必须正确邮箱格式号码');
    } else {
      return request.success();
    }
  }

  divingCountHandle() {
    const divingCount = this.state.divingCount;

    if (divingCount === null || divingCount === '') {
      return request.success(null);
    } else {
      if (/^[0-9]*$/.test(divingCount) === false) {
        return request.error('潜水次数格式必须为数字');
      } else if ( parseInt(divingCount) > 100 ) {
        return request.error('只能填写100以下的数字');
      } else {
        return request.success(null);
      }
    }
  }
  
  checkingAll() {
    const chineseNameChecked = this.chineseNameHandle.call(this);
    if (chineseNameChecked.result !== 1) {
      return chineseNameChecked;
    }

    const pinyinNameChecked = this.pinyinNameHandle.call(this);
    if (pinyinNameChecked.result !== 1) {
      return pinyinNameChecked;
    }

    console.log(this.state.gender)
    if (this.state.gender[0] !== '1' && this.state.gender[0] !== '2') {
      return request.error('请选择性别');
    }

    const mobileChecked = this.mobileHandle.call(this);
    if (mobileChecked.result !== 1) {
      return mobileChecked;
    }

    const emailChecked = this.emailHandle.call(this);
    if (emailChecked.result !== 1) {
      return emailChecked;
    }

    const divingCountChecked = this.divingCountHandle.call(this);
    if (divingCountChecked.result !== 1) {
      return divingCountChecked;
    }

    return request.success();
  }

  DatePickerHandle(val) {
    let myDate = new Date();
    let StateDate = new Date(Date.parse(val));

    this.setState({
      'birthday': val,
      'age': myDate.getFullYear() - StateDate.getFullYear()
    });
  }

  request(Url, data, requestType) {
    return fetch(Url, (requestType === 'POST' ? {
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      },
      'body': JSON.stringify(data)
    } : {
      'method': 'GET',
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      }
    })).then(
      (response) => (response.json()),
      (error) => ({'result': 1, 'message': error})
    ).catch((error) => {
      Modal.alert('请求旅客信息出错', `向服务器发起请求旅客信息失败, 原因: ${error}`);
      Toast.hide();
    })
  }

  submitEditTraveller() {
    const _this = this;
    const checkedAll = this.checkingAll();

    if (checkedAll.result !== 1) {
      return Toast.info( checkedAll.message, 1.2);
    }

    Toast.loading('正在修改...');
    this.request(`${config.URLversion}/user/userinfo/update.do`, {
      'userinfoId': this.state.userinfoId,
      'chineseName': this.state.chineseName,
      'pinyinName': this.state.pinyinName,
      'gender': this.state.gender[0],
      'birthday': convertDate.dateToFormat(new Date(this.state.birthday)),
      'age': `${this.state.age}`,
      'mobile': this.state.mobile,
      'email': this.state.email,
      'passportNo': this.state.passportNo,
      'divingRank': this.state.divingRank,
      'divingCount': this.state.divingCount
    }, 'POST')
    .then((val) => {
      if (val.result === '0') {
        Modal.alert('修改旅客信息成功', '已将成功修改旅客信息!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/traveller/index'));
          },
          style: 'default'
        }]);
      } else {
        Modal.alert('修改旅客信息失败', `成功请求服务器! 但是返回的数据有误, 原因: ${val.message}`);
      }
      Toast.hide();
    })
  }

  submitAddTraveller() {
    const _this = this;
    const checkedAll = this.checkingAll();

    if (checkedAll.result !== 1) {
      return Toast.info( checkedAll.message, 1.2);
    }
    
    Toast.loading('正在添加...');
    this.request(`${config.URLversion}/user/userinfo/add.do`, {
      'chineseName': this.state.chineseName,
      'pinyinName': this.state.pinyinName,
      'gender': this.state.gender[0],
      'birthday': convertDate.dateToFormat(new Date(this.state.birthday)),
      'age': `${this.state.age}`,
      'mobile': this.state.mobile,
      'email': this.state.email,
      'passportNo': this.state.passportNo,
      'divingRank': this.state.divingRank,
      'divingCount': this.state.divingCount
    }, 'POST')
    .then((val) => {
      if (val.result === '0') {
        Modal.alert('新增旅客信息成功', '已将成功新增旅客信息!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/traveller/index'));
          },
          style: 'default'
        }]);
      } else {
        Modal.alert('新增旅客信息失败', `成功请求服务器! 但是返回的数据有误, 原因: ${val.message}`);
      }
      Toast.hide();
    })
  }

  deleteTraveller() {
    const _this = this;
    Modal.alert('请确认', '你确认删除旅客信息?', [{
      text: '确定',
      onPress: () => {
        _this.request(`${config.URLversion}/user/userinfo/delete.do?userinfoId=${_this.state.userinfoId}`)
        .then((val) => {
          if (val.result === '0') {
            Modal.alert('成功', '旅客信息成功取消', [{
              text: '确定',
              onPress: () => {
                _this.props.dispatch(routerRedux.push('/user/traveller/index'));
              },
              style: 'default'
            }]);
          } else {
            Modal.alert('旅客信息删除失败', `请求服务器成功发起, 但是旅客信息删除失败, 原因: ${val.message}`);
          }
        })
      },
      style: 'default'
    },{
      text: '取消',
      style: 'default'
    }]);
  }

  render() {
    return (
      <div className="Traveller-Edit">
        <MyNavBar
          navName={this.EditTravellerType === 'Edit' ? '编辑旅客信息' : '添加旅客信息'}
          returnURL='/user/traveller/index'
        />

        <div className="Edit-Main">

          <div className="Edit-List">
            <List>
              <InputItem
                placeholder="请输入旅客中文姓名"
                error={this.chineseNameHandle().result !== 1}
                onErrorClick={()=> Toast.info(this.chineseNameHandle().message)}
                onChange={this.onChangechineseNameHandle.bind(this)}
                value={this.state.chineseName}
              >姓名中文</InputItem>
            </List>
          </div>

          <div className="Edit-List">
            <List>
              <InputItem
                placeholder="请输入旅客拼音姓名"
                error={this.pinyinNameHandle.call(this).result !== 1}
                onErrorClick={()=> Toast.info(this.pinyinNameHandle.call(this).message)}
                onChange={(val) => this.setState({pinyinName: val})}
                value={this.state.pinyinName}
              >姓名拼音</InputItem>
            </List>
          </div>

          <div className="Edit-List">
            <List>
              <InputItem
                placeholder="请输入护照号码"
                onChange={(val) => this.setState({passportNo: val})}
                value={this.state.passportNo}
              >护照号码</InputItem>
            </List>
          </div>

          <div className="Edit-List">
            <Picker
              data={[ { label: '男', value: '1', }, { label: '女', value: '2', } ]}
              cols={1}
              value={this.state.gender}
              title="请选择您的性别"
              onChange={(val) => this.setState({gender: val})}
            >
              <List.Item arrow="horizontal">性别</List.Item>
            </Picker>
          </div>

          <div className="Edit-List">
            <DatePicker
              mode="date"
              title="选择出生日期"
              extra="请选择"
              value={this.state.birthday}
              minDate={new Date(-1351929600000)}
              maxDate={new Date()}
              onChange={this.DatePickerHandle.bind(this)}
            >
              <List.Item arrow="horizontal">出生日期</List.Item>
            </DatePicker>
          </div>

          <div className="Edit-List">
            <InputItem
              placeholder='请输入旅客手机号码'
              error={this.mobileHandle.call(this).result !== 1}
              onErrorClick={()=> Toast.info(this.mobileHandle.call(this).message)}
              onChange={(val) => this.setState({mobile: val})}
              value={this.state.mobile}
            >手机号码</InputItem>
          </div>

          <div className="Edit-List">
            <InputItem
              placeholder='请输入旅客邮箱号码'
              error={this.emailHandle.call(this).result !== 1}
              onErrorClick={()=> Toast.info(this.emailHandle.call(this).message)}
              onChange={(val) => this.setState({email: val})}
              value={this.state.email}
            >邮箱号码</InputItem>
          </div>

          <div className="Edit-List">
            <Picker
              data={[{label: '无', value: 'null'}, {label: 'OW(初级潜水员)', value: '1'}, {label: 'AOW以上', value: '2'}]}
              cols={1}
              value={this.state.divingRank}
              title="请选择潜水等级"
              onChange={(val) => this.setState({divingRank: val})}
            >
              <List.Item arrow="horizontal">潜水等级</List.Item>
            </Picker>
          </div>

          <div className="Edit-List">
            <InputItem
              placeholder='请填写100以下次数'
              value={this.state.divingCount}
              error={this.divingCountHandle.call(this).result !== 1}
              onErrorClick={()=> Toast.info(this.divingCountHandle.call(this).message)}
              onChange={(val) => this.setState({divingCount: val})}
            >潜水次数</InputItem>
          </div>
        </div>

        <div className='submit-bottom'>
          {this.EditTravellerType === 'Edit' ?
            <div className='submit-Content'>
              <div className='submit-Edit' onClick={this.submitEditTraveller.bind(this)}>编辑</div>
              <div className='submit-Delete' onClick={this.deleteTraveller.bind(this)}>删除</div>
            </div> :
            <div className='submit-btn' onClick={this.submitAddTraveller.bind(this)}>新增旅客信息</div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(EditTraveller);
