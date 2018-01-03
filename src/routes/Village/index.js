import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';


import MyNavBar from './../../components/MyNavBar/index';
import MyTabBar from './../../components/MyTabBar/index';
import config from './../../config/index';
import cookies from './../../utils/cookies';

import { Toast, Modal } from 'antd-mobile';

class Village extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'village': [
        // {
        //   'brandId': 25,
        //   'brandName': '潜游沙巴·仙本那',
        //   'createBy': 33,
        //   'createTime': 1503252103000,
        //   'earnest': 0.01,
        //   'initiatePrice': 1000,
        //   'isDelete': 'N',
        //   'label': '热卖',
        //   'recommendation': '<p>卡帕莱岛的海水晶莹剔透，名符其实的是一座漂浮在水上天堂。</p><p>独特的卡帕莱却不全然是一个岛屿，因为它的五十一间别墅小屋，是建在海中的高跷建筑物，每一间小屋都附有包括泡茶或冲咖啡橱台在内的基本设施。在这里，无论您转身面向任何角度，展现在眼前的都是浩瀚壮观，令人屏息的西里伯斯海海景。游客们在连接着彷若在海上漂游着的别墅小屋，坚固的木板栈道上行走漫步时，脚下就可观赏到在梭游的海洋生物。</p><p><br></p>',
        //   'refundRuleId': 29,
        //   'resortCode': 'KPL',
        //   'resortDesc': '<p><b>卡帕莱岛</b></p><p><i>KAPALAI</i></p><p><i><br></i></p><p>KAPALAI岛（卡帕莱岛）位于马来西亚的沙巴州(Sabah)斗湖市(Tawau)，途经仙</p>',
        //   'resortId': 1,
        //   'resortImg': '/source/image/product/thum/thum_8f217c44-f783-408a-9cc1-9c230c680769.JPG',
        //   'resortName': '卡帕莱',
        //   'resortThumb': '/source/image/product/thum/thum_8f217c44-f783-408a-9cc1-9c230c680769.JPG',
        //   'updateBy': 29,
        //   'updateTime': 1510429308000,
        // }
      ]
    };

    this.jumpToVillageDetail.bind(this);
  }

  componentDidMount() {
    const _this = this;

    this.getVillageProduct().then((json) => {
      if (json.result === '0') {
        _this.setState({'village': json.data.list})
      } else {
        Modal.alert('获取度假村直定信息失败', `请求服务器成功, 但是返回的度假村直定信息有误! 原因: ${json.message}`);
      }
    })

  }

  getVillageProduct() {
    return fetch(`${config.URLvillage}/product/resort/1/0/list.do`, {
      'method': 'GET',
      'contentType': 'application/json; charset=utf-8'
    }).then(
      (response) => ( response.json() ),
      (error) => ({'result': '1', 'message': error})
    ).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求度假村直定信息失败, 原因: ${error}`);
    })
  }

  jumpToVillageDetail(id) {
    this.props.dispatch(routerRedux.push(`/village/detail?productId=${id}`))
  }

  render() {
    return (
      <div className="Village">
        <MyNavBar
          navName='度假村直定'
        />

        {this.state.village.map((val, key) => (
          <div className='Village-List' key={key} onClick={() => this.jumpToVillageDetail(key)}>
            <img className='List-img' src={`${config.URLbase}${val.resortThumb}`} />
            <div className='List-Main'>
              <div className='List-head'>{val.resortName}</div>
              <div className='List-bottom'>
                <div className='List-brandName'>{val.brandName}</div>
                <div className='List-price'>{val.earnest} RMB</div>
              </div>
            </div>
          </div>
        ))}

        <MyTabBar
          selectedTab='Village'
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Village);
