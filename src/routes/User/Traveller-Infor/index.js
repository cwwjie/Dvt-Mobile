import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import { Toast, Modal, List } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;

class TravellerInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: [
        // {
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
      ]
    };

    this.getUserInfo.bind(this);
    this.jumpToTravellerBy.bind(this);
  }

  componentDidMount() {
    const _this = this;
    this.getUserInfo()
    .then((val) => {
      _this.setState({'userinfo': val});
    });
  }
  
  getUserInfo() {
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
        } else {
          reject(Modal.alert('获取旅客信息失败', `请求服务器成功, 但是返回的旅客信息有误! 原因: ${json.message}`));
        }
      }).catch((error) => {
        reject(Modal.alert('请求出错', `向服务器发起请求旅客信息失败, 原因: ${error}`));
      })
    })
  }

  jumpToTravellerBy(type, key) {
    if (type === 'Edit') {
      localStorage.setItem('Edit-Traveller-Type', 'Edit');
      localStorage.setItem('Edit-Traveller-Userinfo', JSON.stringify(this.state.userinfo[key]));
    } else {
      localStorage.setItem('Edit-Traveller-Type', 'Add');
    }
    this.props.dispatch(routerRedux.push('/user/traveller/edit'));
  }

  render() {
    const _this = this;

    return (
      <div className="Traveller-Infor">
        <MyNavBar
          navName='常用旅客信息'
          returnURL='/user/index'
        />

        {this.state.userinfo.length === 0 ? 
        <div className='Infor-none'>暂无数据</div> : this.state.userinfo.map((val, key) => (
        <div className='Infor-Item' key={key}>
          <List>
            <Item extra={<div>编辑</div>} arrow="horizontal" multipleLine onClick={() => _this.jumpToTravellerBy('Edit', key)}>
              {val.chineseName} <Brief>{val.pinyinName}</Brief>
            </Item>
          </List>
        </div>
        ))}

        <div className='submit-bottom'>
          <div className='submit-btn' onClick={() => this.jumpToTravellerBy()}>新增旅客信息</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(TravellerInfor);
