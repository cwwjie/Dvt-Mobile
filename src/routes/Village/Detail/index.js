import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import CustomerNode from './../../../components/CustomerNode/index';

import config from './../../../config';
import convertDate from './../../../utils/convertDate';
import onMenuShare from './../../../utils/weixin-onMenuShare';

import less from './../../../assets/less.png';
import plus from './../../../assets/plus.png';

import { Toast, Modal, List, Carousel, Tabs, DatePicker } from 'antd-mobile';

class VillageDetail extends Component {
  constructor(props) {
    super(props);

    this.product = {
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
    };
    this.productId = window.location.hash.substring(27, window.location.hash.length);

    this.state = {
      'resortName': '产品详情',
      'resortDesc': '正在加载...',
      'carousel': [{ 'src': '', 'width': '' }],
      'checkInDate': new Date(),
      'leaveDate': new Date(Date.parse(new Date()) + 86400000 ),
      'apartmentList': [
        // {
        //   'adultMax': 2,
        //   'adultMin': 1,
        //   'adultPrices': null,
        //   'adultUnitPrice': null,
        //   'apartmentCode':" KPLyjf",
        //   'apartmentDesc':" 房间描述信息↵房间描述信息↵房间描述信息↵房间描述信息↵房间描述信息↵房间描述信息",
        //   'apartmentId': 1,
        //   'apartmentImg':"/ source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg",
        //   'apartmentName':" 园景房",
        //   'apartmentThumb':"/ source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg",
        //   'bedType':" 大床,双人床",
        //   'calMethod':" 1",
        //   'childPrices': null,
        //   'childUnitPrice': null,
        //   'childrenMax': 2,
        //   'childrenMin': 0,
        //   'codes': null,
        //   'createBy': 1,
        //   'createTime': 1505328965000,
        //   'facilities':" 冰箱,浴室,空调",
        //   'haveDays': null,
        //   'ids': null,
        //   'initiatePrice': null,
        //   'isAvePrice': null,
        //   'isDelete':" N",
        //   'isSaleOut':" Y",
        //   'notice':" 入住须知↵入住须知↵入住须知↵入住须知↵入住须知",
        //   'peopleMax': 4,
        //   'peopleMin': 0,
        //   'policy':"", 
        //   'resortCode':" KPL",
        //   'resortId': 1,
        //   'resortName':" 卡帕莱",
        //   'skuNum': null,
        //   'suggestedNum': 2,
        //   'updateBy': 29,
        //   'updateTime': 1508799022000,
        // }
      ],

      'submitData': [
        // {
        //   'selected': 0,
        //   'initiatePrice': 0,
        // }
      ]
    }
    
    this.getResortby.bind(this);
    this.dealwithResort.bind(this);
    this.getResortImg.bind(this);
    this.renderClickPriceNode.bind(this);
    this.ApartmentSelected.bind(this);
    this.onMenuShare.bind(this);
  }

  componentDidMount() {
    const _this = this;

    this.getVillageProduct()
    .then(json => {
      if (json.result === '0') {
        _this.product = json.data.list[_this.productId];
        if (_this.product) {
          _this.setState({
            'resortName': _this.product.resortName,
            'resortDesc': _this.product.resortDesc
          });

          _this.getResortImg()
          .then(json => {
            if (json.result === '0') {
              _this.onMenuShare(`${config.URLbase}${json.data[0].gallery.thumbUrl}`);
              _this.setState({
                'carousel': json.data.map((val) => `${config.URLbase}${val.gallery.thumbUrl}`)
              })
            } else {
              alert('度假村图片加载失败，原因:' + json.message)
            }
          });
      
          _this.getResortby()
          .then(json => {
            if (json.result === '0') {
              _this.dealwithResort(json.data);
            } else {
              Modal.alert('数据有误', `成功请求服务器, 但是度假村直定信息有误， 原因: ${json.message}`);
            }
          });
        } else {
          Modal.alert('数据有误', '成功请求服务器, 但是度假村直定信息有误， 原因: 不存在此产品的productId', [{
            text: '确定',
            onPress: () => {
              _this.props.dispatch(routerRedux.push('/village/index'));
            },
            style: 'default'
          }]);
        }
      } else {
        Modal.alert('获取度假村直定信息失败', `请求服务器成功, 但是返回的度假村直定信息有误! 原因: ${json.message}`);
      }
    })
  }

  onMenuShare(imgUrl) {
    onMenuShare(
      this.product.resortName,
      this.product.resortDesc,
      window.location.href
    ).then({}, (error) => console.log(error));
  }

  getVillageProduct() {
    return fetch(`${config.URLvillage}/product/resort/1/0/list.do`, {
      'method': 'GET',
      'contentType': 'application/json; charset=utf-8'
    }).then(
      response => response.json(),
      error => ({'result': '1', 'message': error})
    ).catch(error => {
      Modal.alert('请求出错', `向服务器发起请求度假村直定信息失败, 原因: ${error}`);
    })
  }

  dealwithResort(data) {
    this.setState({
      'apartmentList': data.list,
      'submitData': data.list.map(val => ({
        'selected': 0,
        'initiatePrice': val.initiatePrice
      }))
    });
  }

  getResortby(checkIn, leave) {
    let checkInDate = convertDate.dateToYYYYmmNumber(checkIn || this.state.checkInDate);
    let leaveDate = convertDate.dateToYYYYmmNumber(leave || this.state.leaveDate);

    return fetch(`${config.URLvillage}/product/apartment/1/0/searchSource.do?startDate=${checkInDate}&endDate=${leaveDate}&resortCode=${this.product.resortCode}`, {
      'method': 'GET',
      'contentType': 'application/json; charset=utf-8'
    }).then(
      response => response.json(),
      error => ({'result': '1', 'message': error})
    ).catch(error => {
      Modal.alert('请求出错', `向服务器发起请求度假村直定信息失败, 原因: ${error}`);
    })
  }

  getResortImg() {
    return fetch(`${config.URLvillage}/product/relResortGallery/${this.product.resortId}/findByResortId.do`, {
      'method': 'GET',
      'contentType': 'application/json; charset=utf-8'
    }).then(
      (response) => ( response.json() ),
      (error) => ({'result': '1', 'message': error})
    ).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求度假村直定轮播图图片失败, 原因: ${error}`);
    })
  }

  renderEarnest() {
    let countEarnest = 0;
    
    this.state.submitData.map((val, key) => {
      countEarnest += val.initiatePrice * val.selected;
    });
    return countEarnest;
  }

  Svgstyle(Svg) {
    return {
      'background': `url(${Svg}) center center /  23px 23px no-repeat`
    }
  }

  ApartmentSelected(key, operat) {
    let mysubmit = this.state.submitData.concat([]);

    operat === 'add' ? mysubmit[key].selected++ : mysubmit[key].selected--;

    this.setState({'submitData': mysubmit});
  }

  renderClickPriceNode(apartmentItem, key) {
    const submitData = this.state.submitData[key];

    if (apartmentItem.isSaleOut === 'Y') {
      return <div>售罄</div>;
    }

    if (submitData.selected === 0) {
      return <div
        className='ClickPrice-add'
        onClick={() => this.ApartmentSelected(key, 'add')}
        style={this.Svgstyle(plus)}
      />;
    } if (submitData.selected > 0 && submitData.selected < apartmentItem.skuNum) {
      return <div className='ClickPrice-List'>
        <div
          className='ClickPrice-less'
          onClick={() => this.ApartmentSelected(key, 'reduce')}
          style={this.Svgstyle(less)}
        />
        <div className='ClickPrice-Name'>{submitData.selected}</div>
        <div
          className='ClickPrice-add'
          onClick={() => this.ApartmentSelected(key, 'add')}
          style={this.Svgstyle(plus)}
        />
      </div>;
    } else {
      return <div className='ClickPrice-List'>
        <div className='ClickPrice-limit'>上限 {submitData.selected}</div>
        <div
          className='ClickPrice-less'
          onClick={() => this.ApartmentSelected(key, 'reduce')}
          style={this.Svgstyle(less)}
        />
      </div>;
    }
  }

  checkInHandle(val) {
    const _this = this;
    const checkInTimeStamp = Date.parse(val);
    const leaveTimeStamp = Date.parse(this.state.leaveDate);

    if (checkInTimeStamp >= leaveTimeStamp) {
      const newLeaveDate = new Date(checkInTimeStamp + 86400000) 
      this.setState({
        'checkInDate': val,
        'leaveDate': newLeaveDate
      });

      Toast.loading('正在查询...');
      this.getResortby(val, newLeaveDate)
      .then(json => {
        if (json.result === '0') {
          _this.dealwithResort(json.data);
        } else {
          Modal.alert('数据有误', `成功请求服务器, 但是度假村直定信息有误， 原因: ${json.message}`);
        }
        Toast.hide();
      });
    } else {
      this.setState({
        'checkInDate': val
      });
    }
  }

  leaveHandle(val) {
    const _this = this;

    this.setState({ 'leaveDate': val });

    Toast.loading('正在查询...');
    this.getResortby(this.state.checkInDate, val)
    .then(json => {
      if (json.result === '0') {
        _this.dealwithResort(json.data);
      } else {
        alert('度假村直定信息加载失败，原因:' + json.message)
      }
      Toast.hide();
    });
  }

  SubmitJump() {
    const _this = this;

    if (this.props.isLogin === false) {
      Modal.alert('请登录', '你尚未登录, 暂不能预订此产品!', [{
        text: '取消',
        style: 'default'
      }, {
        text: '登录',
        onPress: () => _this.props.dispatch(routerRedux.push('/user/login')),
        style: 'default'
      }]);
      return
    }

    let countResort = 0;
    let resort = [];
    
    this.state.submitData.map((val, key) => {
      countResort += val.selected;

      if (val.selected > 0) {
        for (let i = 0; i < val.selected; i++) {
          let apartmentItem = this.state.apartmentList[key];
          
          resort.push(apartmentItem);
        }
      }
    });

    if (countResort === 0) {
      Modal.alert('请选择房型', '您尚未选择房型, 请选择房型！');
      return
    }

    localStorage.setItem('VillageSubmitData', JSON.stringify({
      'resortCode': this.product.resortCode,
      'checkInDate': this.state.checkInDate,
      'leaveDate': this.state.leaveDate,
      'resort': resort
    }));

    localStorage.setItem('returnURL', `/village/detail?productId=${this.productId}`);
    this.props.dispatch(routerRedux.push('/village/submit'));
  }

  render() {
    const tabs = [
      { title: '房型' },
      { title: '详情' },
      { title: '联系客服' },
    ];

    return (
      <div className="Village-Detail">
        <MyNavBar
          navName={this.state.resortName}
          returnURL='/village/index'
        />

        <Carousel autoplay={true} infinite selectedIndex={0}>{this.state.carousel.map(data => (
          <div key={data}>
            <img
              style={{ width: '100%', verticalAlign: 'top' }}
              src={data}
              onLoad={() => window.dispatchEvent(new Event('resize'))}
            />
          </div>
        ))}</Carousel>

        <Tabs tabs={tabs} initialPage={0} >
          <div className="Village-Detail">
            <List renderHeader='选择日期'>
              <DatePicker
                mode="date"
                title="入住日期"
                minDate={new Date()}
                value={this.state.checkInDate}
                onChange={this.checkInHandle.bind(this)}
              >
                <List.Item arrow="horizontal">入住日期</List.Item>
              </DatePicker>
            </List>
            <List>
              <DatePicker
                mode="date"
                title="退房日期"
                minDate={new Date(Date.parse(this.state.checkInDate) + 86400000 )}
                value={this.state.leaveDate}
                onChange={this.leaveHandle.bind(this)}
              >
                <List.Item arrow="horizontal">退房日期</List.Item>
              </DatePicker>
            </List>

            {this.state.apartmentList.map((val, key) => <div key={key} className='Village-Apartment'>
              <div className='Apartment-Main'>
                <img className='Apartment-img' src={`${config.URLbase}${val.apartmentThumb}`} />
                <div className='Apartment-Content'>
                  <div className='Apartment-Head'>{val.apartmentName}</div>
                  <div className='Apartment-Des'>
                    <div>建议入住: {val.suggestedNum}人</div>
                    <div>床型: {val.bedType}</div>
                  </div>
                  <div className='Apartment-Bottom'>
                    <div>{val.initiatePrice ? `￥ ${val.initiatePrice} 起` : '售罄'}</div>
                  </div>
                </div>
              </div>
              <div className='Apartment-ClickPrice'>
                {this.renderClickPriceNode(val, key)}
              </div>
            </div>)}
          </div>

          <div>
            <div className="Village-Detail-resortDesc" dangerouslySetInnerHTML={{__html: this.state.resortDesc}} />
          </div>

          <div>
            <CustomerNode/>
          </div>
        </Tabs>

        <div style={{'height': '75px'}}></div>
        <div className='Detail-Submit'>
          <div className='Submit-Earnest'>合计 {this.renderEarnest.call(this)} RMB</div>
          <div className='Submit-Jump' onClick={this.SubmitJump.bind(this)}
          >预定度假村</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLogin: state.user.isLogin
})

export default connect(mapStateToProps)(VillageDetail);
