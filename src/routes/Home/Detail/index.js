import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Carousel, WhiteSpace, List, WingBlank, Steps } from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import onMenuShare from './../../../utils/weixin-onMenuShare';

const Item = List.Item;
const Brief = Item.Brief;
const Step = Steps.Step;

class HomeDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'isNavShow': false,
      'navPosition': 'Description', // Description Travel Trip Include Refunds

      'selectedTab': 'redTab',

      'hidden': false,
      'carousel': [{'src': null, 'width': null}],
      'initialHeight': 120,

      'productDetail': { 'productPrice': 0, 'promotePrice': 0 },
      'productTravel': [],
      'productRoute': [],
      'productInclude': [],
      'productRule': {
        'ruleItemList': []
      }
    }

    this.productId;
    this.refundRule.bind(this);
    this.onMenuShare.bind(this);
  }

  componentDidMount() {
    const _this = this;

    this.productId = window.location.hash.substring(24, window.location.hash.length);

    Promise.all([
      this.getrelGallery.call(this), // 轮播图
      this.getrelProduct.call(this), // 产品信息相关
      this.getAttribute.call(this), // 套餐说明，交通信息相关
      this.getTrip.call(this), // 套餐行程相关
      this.getCostIncludes.call(this) // 套餐包含相关
    ]).then(values => {
      _this.bindScroll()
      _this.onMenuShare()
    });
  }

  onMenuShare() {
    onMenuShare(
      this.state.productDetail.productName,
      this.state.productDetail.productDesc,
      window.location.href
    ).then({}, (error) => console.log(error));
  }
  
  componentWillUnmount() {
    const documentDOM = document || window.document;
    documentDOM.onscroll = null;
  }

  bindScroll() {
    const _this = this;
    let myNavState = 'hide';
    const documentDOM = document || window.document,
      DomList = [
        {'name': 'Description', 'DOM': document.getElementById('Description')},
        {'name': 'Travel', 'DOM': document.getElementById('Travel')},
        {'name': 'Trip', 'DOM': document.getElementById('Trip')},
        {'name': 'Include', 'DOM': document.getElementById('Include')},
        {'name': 'Refunds', 'DOM': document.getElementById('Refunds')},
      ];

    documentDOM.onscroll = (event) => {
      let yScroll;
      if (self.pageYOffset) {
        yScroll = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
        yScroll = document.documentElement.scrollTop;
      } else if (document.body) {
        yScroll = document.body.scrollTop;
      }

      if (yScroll > 50 && myNavState === 'hide') {
        _this.setState({'isNavShow': true});
        myNavState = 'show';
      }

      if (yScroll < 50 && myNavState === 'show') {
        _this.setState({'isNavShow': false});
        myNavState = 'hide';
      }

      let myPosition = 'Description';
      DomList.map((val) => {
        if (yScroll > val.DOM.offsetTop) {
          myPosition = val.name;
        }
      });
      this.setState({navPosition: myPosition})
    }
  }

  getrelGallery() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch( `${config.URLversion}/product/relProductGallery/${_this.productId}/findByProductId.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result == '0') {
          let _W = document.body.clientWidth;
          let _data = json.data,
            _Array = [],
            _Width =1200 * _W / 1680;

          for (let i = 0; i < _data.length; i++) {
            let obj = {
              'src': config.URLbase + _data[i].gallery.thumbUrl,
              'width': _Width
            }
            _Array.push(obj);
          }
          _this.setState({
            'carousel': _Array
          });
          resolve();
        }else {
          reject();
          Toast.fail(`轮播图加载失败，原因 ${json.message}`, 3);
        }
      }).catch((error) => {
        Toast.fail(`加载产品出错, 原因 ${error}`, 3);
        reject();
      })
    })
  }

  getrelProduct() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/${_this.productId}/get.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          _this.setState({
            productDetail:json.data
          });
          _this.refundRule( json.data.refundRuleId );
          resolve();
        }else {
          Toast.fail(`标题&产品详情请求数据有误，原因 ${json.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`标题&产品详情请求失败，原因 ${error}`, 3);
        reject();
      })
    })
  }

  getAttribute() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/attribute/findByProductId.do?productId=${_this.productId}`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          _this.setState({
            'productTravel': json.data
          });
          resolve();
        }else {
          Toast.fail(`套餐说明&交通信息请求数据有误，原因 ${json.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`套餐说明&交通信息请求失败，原因 ${error}`, 3);
        reject();
      })
    })
  }

  getTrip() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/trip/findByProductId.do?productId=${_this.productId}`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          _this.setState({
            'productRoute': json.data
          });
          resolve();
        }else {
          Toast.fail(`套餐行程请求数据有误，原因 ${json.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`套餐行程请求失败，原因 ${error}`, 3);
        reject();
      })
    })
  }

  getCostIncludes() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/costIncludes/findByProductId.do?productId=${_this.productId}`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          _this.setState({
            'productInclude': json.data
          });
          resolve();
        }else {
          Toast.fail(`套餐包含请求数据有误，原因 ${json.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`套餐包含请求失败，原因 ${error}`, 3);
        reject();
      })
    })
  }

  refundRule(refundRuleId) {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/refundrule/${refundRuleId}/item/list.do`,{
        method: 'GET',
        contentType: 'application/json; charset=utf-8'
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then(function(json) {
        if (json.result === '0') {
          resolve();
          if (json.data) {
            _this.setState({
              'productRule': json.data
            });
          }
        }else {
          Toast.fail(`退款说明相关请求失败，原因 ${json.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`退款说明相关请求失败，原因 ${error}`, 3);
        reject();
      })
    })
  }

  renderNav() {
    const _this = this;

    const navList = this.state.productInclude.length === 0 ? [
      ['说明', 'Description'], 
      ['交通', 'Travel'], 
      ['行程', 'Trip'], 
      ['退款', 'Refunds']
    ] : [
      ['说明', 'Description'], 
      ['交通', 'Travel'], 
      ['行程', 'Trip'], 
      ['包含', 'Include'], 
      ['退款', 'Refunds']
    ];

    const navTopShowName = this.state.isNavShow ? 'detail-navTop' : 'detail-navTop navTop-hidden';

    return <div className={navTopShowName}>
      <div className='navTop-content'>{navList.map((val, key) => {
          return val[1] === _this.state.navPosition ? <div key={key} className='navTop-select'>{val[0]}</div> : <div key={key}>{val[0]}</div>;
      })}</div>
    </div>
  }

  jumpToTravel() {
    this.props.dispatch(routerRedux.push(`/home/detail-travel?productId=${this.productId}`));
  }

  jumpToSubmit() {
    localStorage.setItem('returnURL', window.location.hash.slice(1));

    if (this.props.isLogin) {
      localStorage.setItem('product', JSON.stringify({
        'productId': this.productId,
        'productName': this.state.productDetail.productName
      }));
      return this.props.dispatch(routerRedux.push('/home/submit'));
    }

    return this.props.dispatch(routerRedux.push('/user/login'));
  }

  render() {
    const _this = this;
    const imgCarouselStyle = {
      height: document.body.clientWidth * 950 / 1280,
      width: '100%',
      verticalAlign: 'top'
    };
    
    return (
      <div className="HomeDetail">
        <MyNavBar
          navName='产品详情'
          returnURL='/'
        />

        {this.renderNav.call(this)}

        <Carousel autoplay={true} infinite selectedIndex={0}>{this.state.carousel.map(data => (
          <div key={data}>
            <img
              style={imgCarouselStyle}
              src={data.src}
              onLoad={() => { window.dispatchEvent(new Event('resize')); this.setState({ imgHeight: 'auto' }); }}
            />
          </div>
        ))}</Carousel>

        <div className='detail-main'>
          <WhiteSpace size="lg" />
          <div id='Description'>
            <List>
              <div className='main-list'>
              <div className='main-listTitle' >{this.state.productDetail.productName}</div>
              <div className='main-listPrice' ><span>¥ </span> {this.state.productDetail.productPrice}<span>.00</span></div>
              <div className='main-listAct' >{this.state.productDetail.productDesc}</div>
              </div>
            </List>
          </div>

          <div id='Travel'>{this.state.productTravel.map((data, key) => (
            <div key={key}>
              <WhiteSpace size="lg" />
              <WingBlank size="md">{data.attrName}</WingBlank>
              <WhiteSpace size="lg" />
              <List>
                <div className='main-list'>
                  <div className='detail-attrValue' dangerouslySetInnerHTML={{__html:data.attrValue}}/>
                </div>
              </List>
            </div>
          ))}</div>

          <div id='Trip'>
            <WhiteSpace size="lg" />
            <WingBlank size="md">套餐行程</WingBlank>
            <WhiteSpace size="lg" />
            <List>
              <Item arrow="horizontal" onClick={this.jumpToTravel.bind(this)} multipleLine>
                <div>查看行程详情</div>
              </Item>
              {this.state.productRoute.map((data, key) => (
                <div key={key}>
                  <Item extra={`第${data.tripDay}天`} wrap>
                    {data.tripPlace}
                    <Brief>{data.tripEvent}</Brief>
                  </Item>
                </div>
              ))}
            </List>
          </div>

          <div id='Include'>
            {this.state.productInclude.map((data, key) => (
              <div key={key}>
                <WhiteSpace size="lg" />
                <WingBlank size="md">{data.costTitle}</WingBlank>
                <WhiteSpace size="lg" />
                <List>
                  <div className='main-list'>
                    <div className='main-attrValue' dangerouslySetInnerHTML={{__html:data.costContent}}/>
                  </div>
                </List>
              </div>
            ))}
          </div>
          
          <div id='Refunds'>{this.state.productRule.ruleItemList.length === 0 ? null : (
            <div>
              <WhiteSpace size="lg" />
                <WingBlank size="md">退款说明</WingBlank>
              <WhiteSpace size="lg" />
              <List>
                <div className='Refunds-content'>
                  <Steps>
                    {this.state.productRule.ruleItemList.map( (data, key) => (
                      <Step 
                        key={key}
                        status="process" 
                        title={key == 0 ? `${data.beginDay}天以上` : `${data.beginDay}天 - ${data.endDay}天`}
                        icon={
                          <div style={{
                            fontSize: '14px',
                            position: 'relative',
                            top: '7.5px'
                          }}>{data.deductionRatio}</div>
                        } 
                        description={data.ruleDesc}
                      />
                    ))}
                  </Steps>
                </div>
              </List>
            </div>
          )}</div>
        </div>

        <div className='detail-bottom'>
          <div className='bottom-left'>
            <div>
              <span>¥ </span> {
                this.state.productDetail.productPrice - this.state.productDetail.promotePrice
              }<span>.00 起</span>
            </div>
          </div>
          <div className='bottom-mid'
            onClick={() => this.props.dispatch(routerRedux.push('/service'))}
          >
            联系客服
          </div>
          <div className='bottom-right' onClick={this.jumpToSubmit.bind(this)}>
            预定套餐
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLogin: state.user.isLogin
})

export default connect(mapStateToProps)(HomeDetail);
