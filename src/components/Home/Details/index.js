import assign from 'lodash.assign'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import { Carousel , WhiteSpace , List , WingBlank , Steps , Modal, Toast } from 'antd-mobile';

import appConfig from './../../../config/index.js';
import styles from './styles.scss';

class Detail extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      'modal': false,

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
    };
  }

  componentDidMount() {
    let _this = this;

    // 过滤
    if (_this.props.product.productId == null || _this.props.product.productId != _this.props.Nav.productId) {
      this.setState({ modal: true });
      return
    }

    // 请求(轮播图)
    let p1 = new Promise((resolve, reject) => {
      fetch( `${appConfig.URLversion}/product/relProductGallery/${_this.props.product.productId}/findByProductId.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8'
      })
      .then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then(function(json) {
        if (json.result == '0') {
          let _W = document.body.clientWidth;
          let _data = json.data,
            _Array = [],
            _Width =1200 * _W / 1680;
          for (let i = 0; i < _data.length; i++) {
            let obj = {
              src:appConfig.URLbase + _data[i].gallery.thumbUrl,
              width:_Width
            }
            _Array.push(obj);
          }
          _this.setState({
            'carousel': _Array
          });
          resolve();
        }else {
          alert('轮播图加载失败，原因'+json.message)
        }
      })
    })

    // 请求(内容) => product
      // 产品信息相关
      let p2 = new Promise((resolve, reject) => {
        fetch(`${appConfig.URLversion}/product/${_this.props.product.productId}/get.do`, {
          'method': 'GET',
          'contentType': "application/json; charset=utf-8"
        }).then(
          (response) => ( response.json() ),
          (error) => ({'result': '1', 'message': error})
        ).then(function(json) {
          if (json.result=="0") {
            _this.props.dispatch({
              type:'product_Infor',
              data:json.data
            });
            _this.setState({
              productDetail:json.data
            });
            Rule(json.data.refundRuleId);
            resolve();
          }else {
            alert("标题&产品详情请求失败，原因"+json.message)
          }
        })
      })
      // 套餐说明，交通信息相关
      let p3 = new Promise((resolve, reject) => {
        fetch(`${appConfig.URLversion}/product/attribute/findByProductId.do?productId=${_this.props.product.productId}`, {
          'method': 'GET',
          'contentType': "application/json; charset=utf-8"
        }).then(
          (response) => ( response.json() ),
          (error) => ({'result': '1', 'message': error})
        ).then(function(json) {
          if (json.result=="0") {
            _this.setState({
              'productTravel': json.data
            });
            resolve();
          }else {
            alert("套餐说明&交通信息请求失败，原因"+json.message)
          }
        })
      })
      // 套餐行程相关
      let p4 = new Promise((resolve, reject) => {
        fetch(`${appConfig.URLversion}/product/trip/findByProductId.do?productId=${_this.props.product.productId}`, {
          'method': 'GET',
          'contentType': "application/json; charset=utf-8"
        }).then(
          (response) => ( response.json() ),
          (error) => ({'result': '1', 'message': error})
        ).then(function(json) {
          if (json.result=="0") {
            _this.props.dispatch({
              'type': 'product_travel',
              'data': json.data
            })
            _this.setState({
              'productRoute': json.data
            });
            resolve();
          }else {
            alert("套餐行程请求失败，原因"+json.message)
          }
        })
      })
      // 套餐包含相关
      let p5 = new Promise((resolve, reject) => {
        fetch(`${appConfig.URLversion}/product/costIncludes/findByProductId.do?productId=${_this.props.product.productId}`, {
          'method': 'GET',
          'contentType': "application/json; charset=utf-8"
        }).then(
          (response) => ( response.json() ),
          (error) => ({'result': '1', 'message': error})
        ).then(function(json) {
          if (json.result=="0") {
            _this.setState({
              'productInclude': json.data
            });
            resolve();
          }else {
            alert("套餐包含请求失败，原因"+json.message)
          }
        })
      })
      // 退款说明相关
      function Rule(refundRuleId) {
        fetch(
          appConfig.URLversion+"/product/refundrule/"+ refundRuleId +"/item/list.do",{
          method: 'GET',
          contentType: "application/json; charset=utf-8"
         }).then(function(response) {
          return response.json()
         }).then(function(json) {
          if (json.result=="0") {
            if (json.data) {
              _this.setState({
                productRule: json.data
              });
            }
          }else {
            alert("退款说明相关请求失败，原因"+json.message)
          }
        })
      }
    Promise.all([p1, p2, p3, p4, p5]).then(values => {
      Toast.hide();
    });
    const bindScroll = (() => {
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
    })();
  }

  showModal = key => (e) => {
    // 现象：如果弹出的弹框上的 x 按钮的位置、和手指点击 button 时所在的位置「重叠」起来，
    // 会触发 x 按钮的点击事件而导致关闭弹框 (注：弹框上的取消/确定等按钮遇到同样情况也会如此)
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }

  onClose = key => () => {
    let Navdata = assign({},this.props.Nav);

    Navdata.productId = false;
    Navdata.navtitle = ['潜游时光'];
    Navdata.PreURL = ['/'];
    Navdata.leftContent = { return: false, logo:'home' };
    Navdata.hidden = false;
    Navdata.selectedTab = 'Home';

    this.props.dispatch({
      type: 'Chan_Nav',
      data: Navdata
    });

    this.context.router.push('/');
    this.setState({
      [key]: false,
    });
  }

  renderCarousel() {
    return this.state.carousel.map(data => (
      <img
        src={data.src}
        style={{
          height:data.width+"px",
          width:"100%"
        }}
        onLoad={() => {
          // fire window resize event to change height
          window.dispatchEvent(new Event('resize'));
          this.setState({
            initialHeight:data.width+"px"
          });
        }}
      />
    ))
  }

  jumpToTravel() {
    // 页面跳转
    let _this = this
    let _data = assign({},_this.props.Nav);
    _data.navtitle.push("行程详情");
    _data.PreURL.push("/Detail/travel");
    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    })
    _this.context.router.push('/Detail/travel');
  }

  jumpToCustomer() {
    let _this = this
    let NavData = assign({},_this.props.Nav);

    NavData.productId = false;
    NavData.navtitle = ['客服中心'];
    NavData.PreURL = ['/Cus'];
    NavData.leftContent = { return: false, logo: 'home' };
    NavData.hidden = false;
    NavData.selectedTab = 'Service';

    _this.props.dispatch({ 'type': 'Chan_Nav', 'data': NavData });

    _this.context.router.push('/Cus');
  }

  jumpToSubmit() {
    let _this = this
    let _data = assign({},_this.props.Nav);

    _data.navtitle.push("预定套餐");
    _data.PreURL.push("/Detail/submit");

    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    });

    _this.context.router.push("/Detail/submit");
  }

  renderNav() {
    const _this = this;

    let navList = [
      ['说明', 'Description'], 
      ['交通', 'Travel'], 
      ['行程', 'Trip'], 
      ['包含', 'Include'], 
      ['退款', 'Refunds']
    ];

    if (this.state.productInclude.length === 0) {
      navList = [
        ['说明', 'Description'], 
        ['交通', 'Travel'], 
        ['行程', 'Trip'], 
        ['退款', 'Refunds']
      ];
    }

    return <div className={this.state.isNavShow ? styles.navTopShow : styles.navTopHide}>
      <div className={styles.navContent}>
        {navList.map((val) => {
          if (val[1] === _this.state.navPosition) {
            return <div className={styles.select}>{val[0]}</div>
          }
          return <div>{val[0]}</div>
        })}
      </div>
    </div>
  }

  ruleItemList() {
    let myruleItemList = this.state.productRule.ruleItemList || [];

    if (myruleItemList.length != 0) {
      return <List>
        <div className={styles.Refunds}>
          <Steps>
            {myruleItemList.map( (data, key) => (
            <Step status="process" 
              title={renderMyTitle(key, data.beginDay, data.endDay)}
              icon={RefundIcon(data.deductionRatio)} 
              description={data.ruleDesc}
            />
          ))}
          </Steps>
        </div>
      </List>
    }
    return <div></div>
  }
  
  render() {
    const _this = this;

    return (
      <div>
        {this.renderNav.call(this)}

        <div>
          <Carousel autoplay={true} infinite selectedIndex={0}>
            {this.renderCarousel.call(this)}
          </Carousel>
        </div>

        <div className={styles.main} id='Description'>
          <WhiteSpace size="lg" />
          <List>
            <div className={styles.List}>
            <div className={styles.ListTitle}>{this.state.productDetail.productName}</div>
            <div className={styles.ListPrice}><span>¥ </span> {this.state.productDetail.productPrice}<span>.00</span></div>
            <div className={styles.ListAct}>{this.state.productDetail.productDesc}</div>
            </div>
          </List>
          <div id='Travel'>
          {this.state.productTravel.map(data => (
            <div>
              <WhiteSpace size="lg" />
              <WingBlank size="md">{data.attrName}</WingBlank>
              <WhiteSpace size="lg" />
              <List>
                <div className={styles.List}>
                  <div className={styles.attrValue} dangerouslySetInnerHTML={{__html:data.attrValue}}/>
                </div>
              </List>
            </div>
          ))}
          </div>
          <WhiteSpace size="lg" />
          <div id='Trip'>
            <WingBlank size="md">套餐行程</WingBlank>
          </div>
          <WhiteSpace size="lg" />
          <List>
            <Item arrow="horizontal" onClick={this.jumpToTravel.bind(this)} multipleLine>
              <div style={{color:"#000"}}>查看行程详情</div>
            </Item>
            {this.state.productRoute.map(data => (
              <Item extra={ `第${data.tripDay}天` } align="top" multipleLine>
              {data.tripPlace}
                <Brief>{data.tripEvent}</Brief>
              </Item>
            ))}
          </List>
          <div id='Include'>
            {this.state.productInclude.map(data => (
              <div>
                <WhiteSpace size="lg" />
                <WingBlank size="md">{data.costTitle}</WingBlank>
                <WhiteSpace size="lg" />
                <List>
                  <div className={styles.List}>
                    <div className={styles.attrValue} dangerouslySetInnerHTML={{__html:data.costContent}}/>
                  </div>
                </List>
              </div>
            ))}
          </div>
          <WhiteSpace size="lg" />
          <div id='Refunds'>
          <WingBlank size="md">{ this.state.productRule.ruleItemList.length === 0 ? '' : '退款说明'}</WingBlank>
          </div>
          <WhiteSpace size="lg" />
          {this.ruleItemList.call(this)}
        </div>

        <div className={styles.bottomNav}>
          <div className={styles.botNavLeft}>
            <div className={styles.botNavLeftA}>
              <span>¥ </span> {
                this.state.productDetail.productPrice - this.state.productDetail.promotePrice
              }<span>.00 起</span></div>
            {/* <div className={styles.botNavLeftB}>
              <span>¥ </span> {
                this.state.productDetail.productPrice - this.state.productDetail.promotePrice
              }<span>.00 起</span>
            </div> */}
          </div>
          <div className={styles.botNavMid}>
            <div onClick={this.jumpToCustomer.bind(this)}>联系客服</div>
          </div>
          <div className={styles.botNavRight} style={{background: '#01b969'}}>
            <div onClick={this.jumpToSubmit.bind(this)}>预定套餐</div>
          </div>
        </div>

        <Modal
          title="链接失效"
          transparent
          maskClosable={false}
          visible={ this.state.modal }
          onClose={ this.onClose('modal') }
          footer={[{ text: '返回首页', onPress: () => { this.onClose('modal')() }}]}
         >
        </Modal>
      </div>
    )
  }
}

const Item = List.Item;
const Brief = Item.Brief;
const Step = Steps.Step;

const renderMyTitle = (key, beginDay, endDay) => {
  if (key == 0) {
    return `${beginDay}天以上`;
  }
  return `${beginDay}天 - ${endDay}天`;
}

const RefundIcon = (Num) => {
  return (
    <div style={{
      fontSize:'14px',
      position:"relative",
      top:'7.5px'
    }}>{Num}</div>
  )
}

Detail.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  product:state.reducer.product
})


export default Detail = connect(
  mapStateToProps
)(Detail)


