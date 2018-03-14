import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import request from './../../../utils/request';

import { createForm } from 'rc-form';
import { Toast, Modal, List, InputItem, TextareaItem, Picker } from 'antd-mobile';

class EditAddress extends Component {
  constructor(props) {
    super(props);

    let myState;
    let initAddress = {
      'addressId': null, // number
      'consignee': null, // 收货人 string

      'region': [{ 'value': '1', 'label': '省', 'children': [{ 'value': '2', 'label': '市', 'children': [{ 'value': '3', 'label': '区', }] }] }],
      'regionPicker': null,

      // 'province': null, // 省 number
      // 'city': null, // 市 number
      // 'district': null, // 区 number
      'street': null, // 街道 string
      'mobile': null, // 手机 string or number
      'zipcode': null, // 邮政编码 string or number
      'telephone': null, // 电话 string or number
    }

    this.AddressType = localStorage.getItem('Address-Type') ? localStorage.getItem('Address-Type') : 'add';

    if (this.AddressType === 'add') {
      myState = initAddress;
      myState.error = false;
      myState.type = 'add';

    } else {
      let addressInfo = localStorage.getItem('Address-Info') ? JSON.parse(localStorage.getItem('Address-Info')): false;

      if (addressInfo === false) {
        myState = initAddress;
        myState.error = true;
      } else {
        myState = {
          'error': false, 
          'type': 'edit', 
          'region': initAddress.region, 
          'regionPicker': [
            addressInfo.province,
            addressInfo.city,
            addressInfo.district,
          ], 
          'addressId': addressInfo.addressId, 
          'consignee': addressInfo.consignee, 
          'street': addressInfo.street, 
          'mobile': addressInfo.mobile, 
          'zipcode': addressInfo.zipcode, 
          'telephone': addressInfo.telephone, 
        };
      }
    }

    this.state = myState;
  }

  componentDidMount() {
    const _this = this;

    this.getRegion()
    .then((val) => {
      _this.setState({'region': val});
    });
  }

  getRegion() {
    const _this = this;

    return new Promise((resolve, reject) => {
      Promise.all([
        _this.getRegionByType(1),
        _this.getRegionByType(2),
        _this.getRegionByType(3)
      ]).then((values) => {
        let provinceList = values[0];
        let cityList = values[1];
        let districtList = values[2];

        resolve(_this.dealWithRegion(provinceList, cityList, districtList));
      }, error => reject(Modal.alert(error)));
    })

  }

  getRegionByType(type) {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/system/region/regiontype/${type}/list.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          resolve(json.data.regionList);
        } else {
          reject('获取地区列表信息失败', `请求服务器成功, 但是返回的地区列表序列号${type} 有误! 原因: ${json.message}`);
        }
      }).catch((error) => {
        reject(`请求出错, 向服务器发起请求地区列表序列号${type} 失败, 原因: ${error}`);
      })
    })
  }

  dealWithRegion(provinceList, cityList, districtList) {
    let regionCity = cityList.map(cityval => {
      let cityItem = {
        'parentId': cityval.parentId,
        'value': cityval.regionId,
        'label': cityval.regionName,
        'children': []
      }

      districtList.map(districtval => {
        if (districtval.parentId == cityval.regionId) {
          cityItem.children.push({
            'value': districtval.regionId,
            'label': districtval.regionName,
          });
        }
      });

      return cityItem;
    });

    return provinceList.map(provinceval => {
      let provinceItem = {
        'value': provinceval.regionId,
        'label': provinceval.regionName,
        'children': []
      }

      regionCity.map(regionCityval => {
        if (regionCityval.parentId == provinceval.regionId) {
          provinceItem.children.push(regionCityval);
        }
      });

      return provinceItem;
    });
  }

  submitAdd() {

  }

  submitEdit() {
    
  }

  submitDelete() {
    
  }

  renderSubmit() {
    return this.AddressType === 'add' ?
    <div className='submit-btn' 
      onClick={this.submitAdd.bind(this)}
    >新增</div> :
    <div className='submit-Content'>
      <div className='submit-Edit' onClick={this.submitEdit.bind(this)}>编辑</div>
      <div className='submit-Delete' onClick={this.submitDelete.bind(this)}>删除</div>
    </div> 
  }

  consigneeHandle() {
    const consignee = this.state.consignee;

    if (consignee === '' || consignee === null) {
      return request.error('收货人不能为空');
    } else {
      return request.success();
    }
  }

  streetHandle() {
    const street = this.state.street;

    if (street === '' || street === null) {
      return request.error('收地址不能为空');
    } else {
      return request.success();
    }
  }

  mobileHandle() {
    const mobile = this.state.mobile;

    if (mobile === '' || mobile === null) {
      return request.error('收货人不能为空');
    } else {
      return request.success();
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className="address-edit">
        <MyNavBar
          navName={this.EditAddressType === 'Edit' ? '编辑收货地址' : '添加收货地址'}
          returnURL='/user/address/index'
        />

        <div className="address-main">
          <List>

            <InputItem
              placeholder="请输入收货人中文姓名"
              error={this.consigneeHandle().result !== 1}
              onErrorClick={()=> Toast.info(this.consigneeHandle().message)}
              onChange={(val) => this.setState({'consignee': val})}
              value={this.state.consignee}
            >收货姓名</InputItem>

            <Picker extra="请选择区域"
              data={this.state.region}
              value={this.state.regionPicker}
              onChange={(val) => this.setState({'regionPicker': val})}
            >
              <List.Item arrow="horizontal">收货地址</List.Item>
            </Picker>

            <TextareaItem
              autoHeight
              title="详细地址"
              placeholder="请输入您的详细地址"
              value={this.state.street}
              onChange={(val) => this.setState({'street': val})}
              error={this.streetHandle().result !== 1}
              onErrorClick={()=> Toast.info(this.streetHandle().message)}
            />

            <InputItem
              placeholder="请输入手机号码"
              type="phone"
              error={this.mobileHandle().result !== 1}
              onErrorClick={()=> Toast.info(this.mobileHandle().message)}
              onChange={(val) => this.setState({'mobile': val})}
              value={this.state.mobile}
            >手机号码</InputItem>

            <InputItem
              placeholder="请输入邮政编码"
              type="number"
              onChange={(val) => this.setState({'mobile': val})}
              value={this.state.zipcode}
            >邮政编码</InputItem>

            <InputItem
              placeholder="请输入电话号码"
              type="number"
              onChange={(val) => this.setState({'mobile': val})}
              value={this.state.telephone}
            >电话号码</InputItem>
          </List>
        </div>

        <div className='submit-bottom'>
          {this.renderSubmit.call(this)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default createForm()(EditAddress);

// export default connect()(EditAddress);
