import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SwitchBolck from './../../../components/UserSame/SwitchBolck';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import ajaxs from './ajaxs';

import { Toast, Modal, List } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;

class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'address': false
    }
  }

  componentDidMount() {
    const _this = this;

    ajaxs.getAddressInfo()
    .then(val => {
      if (val.length > 0) {
        _this.setState({'address': val});
      }
    }, error => Modal.alert('获取旅客信息失败', `向服务器发起请求旅客信息失败, 原因: ${error}`));
  }

  jumpToAddAddress() {
    localStorage.setItem('Address-Type', 'add');
    localStorage.setItem('Address-edit-returnedUrl', '/user/address/index'); 
    this.props.dispatch(routerRedux.push('/user/address/edit'));
  }

  jumpToEditAddress(data) {
    localStorage.setItem('Address-Type', 'edit');
    localStorage.setItem('Address-edit-returnedUrl', '/user/address/index'); 
    localStorage.setItem('Address-Info', JSON.stringify({
      'addressId': data.addressId,
      'consignee': data.consignee,
      'province': data.province,
      'city': data.city,
      'district': data.district,
      'street': data.street,
      'mobile': data.mobile,
      'zipcode': data.zipcode,
      'telephone': data.telephone
    }));
    this.props.dispatch(routerRedux.push('/user/address/edit'));
  }

  renderAddressList() {
    const _this = this;

    if (this.state.address) {
      return (
        <div className='address-list'>
          {this.state.address.map((val, key) => (
            <div className='address-Item' key={key}>
              <List>
                <Item 
                  extra={<div>编辑</div>} 
                  arrow="horizontal" 
                  multipleLine 
                  onClick={() => _this.jumpToEditAddress(val)}
                >{val.consignee} <Brief>{val.street}</Brief>
                </Item>
              </List>
            </div>
          ))}
        </div>
      );

    }

    return (<div className='address-none'>暂无数据</div>);
  }

  render() {
    return (
      <div className="address">
        <MyNavBar
          navName='收货地址'
          returnURL='/user/index'
        />

        {this.renderAddressList.call(this)}

        <div className='submit-bottom'>
          <div className='submit-btn' 
            onClick={this.jumpToAddAddress.bind(this)}
          >新增收货地址</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Address);
