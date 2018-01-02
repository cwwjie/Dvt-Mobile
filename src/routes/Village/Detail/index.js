import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import CustomerNode from './../../../components/CustomerNode/index';

import config from './../../../config';
import convertDate from './../../../utils/convertDate';

import less from './../../../assets/less.png';
import plus from './../../../assets/plus.png';

import { Toast, Modal, List, Carousel, Tabs, DatePicker } from 'antd-mobile';

class VillageDetail extends Component {
  constructor(props) {
    super(props);

    this.product = JSON.parse(localStorage.getItem('VillageProduct'));

    this.state = {
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
    this.renderClickPriceNode.bind(this);
    this.ApartmentSelected.bind(this);
  }

  componentDidMount() {
    const _this = this;

    this.getResortImg.call(this)
    .then(json => {
      if (json.result === '0') {
        _this.setState({
          'carousel': json.data.map((val) => `${config.URLbase}${val.gallery.thumbUrl}`)
        })
      } else {
        alert('度假村图片加载失败，原因:' + json.message)
      }
    });

    this.getResortby()
    .then(json => {
      if (json.result === '0') {
        _this.setState({
          'apartmentList': json.data.list,
          'submitData': json.data.list.map(val => ({
            'selected': 0,
            'initiatePrice': val.initiatePrice
          }))
        });
      } else {
        alert('度假村直定信息加载失败，原因:' + json.message)
      }
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

  render() {
    const tabs = [
      { title: '房型' },
      { title: '详情' },
      { title: '联系客服' },
    ];

    return (
      <div className="Village-Detail">
        <MyNavBar
          navName={this.product.resortName || '产品详情'}
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
            <div className="Village-Detail-resortDesc" dangerouslySetInnerHTML={{__html: this.product.resortDesc}} />
          </div>

          <div>
            <CustomerNode/>
          </div>
        </Tabs>

        <div style={{'height': '75px'}}></div>
        <div className='Village-Submit'>
          <div className='Submit-Earnest'>合计 {this.renderEarnest.call(this)} RMB</div>
          <div className='Submit-Jump'>预定度假村</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLogin: state.user.isLogin
})

export default connect(mapStateToProps)(VillageDetail);
