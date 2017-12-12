import assign from 'lodash.assign';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { Card, WhiteSpace, Toast, Carousel } from 'antd-mobile';

import appConfig from './../../config/index.js';

import styles from './index.scss';

class Home extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      'carousel': [{'src':null, 'onclick':null}],
      'initialHeight':230,
      'selectNumber': 0,
      'dataList': [
        // {
        //   'catDesc': null,
        //   'catId': 13,
        //   'catName': "潜游双人套餐",
        //   'createBy': null,
        //   'createTime': null,
        //   'isDelete': null,
        //   'isShow': null,
        //   'parentId': null,
        //   'sortOrder': null,
        //   'updateBy': null,
        //   'updateTime': null,
        //   'productList': [
        //     {
        //       'apartment': '邦邦 沙滩屋',
        //       'apartmentNum': 1,
        //       'bedType': null,
        //       'brandId': null,
        //       'clickCount': null,
        //       'createBy': null,
        //       'createTime': null,
        //       'isDelete': null,
        //       'isNew': 'Y',
        //       'isOnsale': null,
        //       'period': 3,
        //       'productBrief': '未经雕琢的天然小岛--邦邦岛',
        //       'productDesc': null,
        //       'productId': 64,
        //       'productImg': '/source/image/product/thum/thum_34867ce5-d61a-4576-b4fb-060365c7d638.jpg',
        //       'productName': '天然小岛邦邦 3天2晚蜜月',
        //       'productPrice': 5700,
        //       'productSn': '000006',
        //       'productThumb': '/source/image/product/thum/thum_34867ce5-d61a-4576-b4fb-060365c7d638.jpg',
        //       'promoteEndTime': 0,
        //       'promotePrice': 0,
        //       'promoteStartTime': 0,
        //       'refundRuleId': null,
        //       'updateBy': null,
        //       'updateTime': null,
        //     }
        //   ]
        // }
      ]
    };
    this.selecting = false,

    this.jumpToDetail.bind(this);
  }

  componentDidMount() {
    const _this = this;

    getProductData().then((val) => {
      if (val.result === '0') {
        _this.setState({'dataList': val.data});
      } else {
        alert(`加载的数据有误, 原因${val.message}`)
      }
    })

    getCarousel().then((val) => {
      if (val.result === '0') {
        let carouselArray = [],
          myWidth = 540 * document.body.clientWidth / 1680;

        _this.setState({
          'carousel': val.data.map((jsonItem, key) => ({
            'src': appConfig.URLbase + jsonItem.carouselUrl,
            'onclick': jsonItem.leadUrl,
            'width': myWidth
          }))
        });
      } else {
        alert(`加载轮播图有误, 原因 ${val.message}`)
      }
    })

    const bindScroll = () => {
      return 
      const ProductDOM = document.getElementById('ProductList'),
        clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
        ProductList = [].slice.call(ProductDOM.childNodes);

      ProductDOM.onscroll = (event) => {
        // 滚动的距离
        const myScrollTop = ProductDOM.scrollTop + clientHeight - 95;
        let mySelectNumber = 0;

        ProductList.map((val, key) => {
          if (myScrollTop > val.offsetTop ) {
            mySelectNumber = key;
          }
        });
        if (_this.selecting === false) {
          _this.selecting = true
          return
        }
        _this.setState({ 'selectNumber': mySelectNumber})
      }
    }
    bindScroll();
  }

  renderNavLeft() {
    const _this = this,
      selectNumber = this.state.selectNumber,
      myList = this.state.dataList;
      
    return <div className={styles.navLeft}>
      <div id='NavList'>{myList.map((val, key) => {
        if (selectNumber === key) {
          return <div className={styles.activeItem}>{val.catName}</div>
        }
        return <div
          className={styles.item}
          onClick={() => {
            _this.setState({'selectNumber': key});
            return 
            _this.selecting = false;
            document.getElementById('ProductList').scrollTop = document.getElementById('ProductList').childNodes[key].offsetTop;
          }}
        >{val.catName}</div>
      })}</div>
      <span></span>
    </div>
  }

  jumpToDetail(id) {
    // 页面跳转
    let _this = this,
      myNavData = assign({}, _this.props.Nav);

    myNavData.navtitle.push('订单详情');
    myNavData.PreURL.push('/Detail');
    myNavData.leftContent = {
      'return': 'left',
      'logo': false
    };
    myNavData.hidden = true;
    myNavData.productId = id;
    _this.props.dispatch({
      'type': 'Chan_Nav',
      'data': myNavData
    });
    _this.props.dispatch({
      'type':  'product_Id',
      'data':  id
    });
    Toast.loading('加载中...');
    _this.context.router.push('/Detail');
  }

  renderProductMain() {
    const _this = this,
      myList = this.state.dataList;

    return <div id='ProductList' className={styles.main}>
      {myList.map((ListItem, Listkey) => {
        if (Listkey === _this.state.selectNumber) {
          return <div>
            {ListItem.productList.map((productItem, productItemKey) => (
              <div 
                key={productItemKey}
                style={{'padding': '10px'}}
                onClick={() => { _this.jumpToDetail(productItem.productId) }}
              >
                <div className={styles.productItem}>
                  <div>
                    <div className={styles.productItemimg}>
                      <img src={appConfig.URLbase + productItem.productThumb} />
                    </div>
                    <div className={styles.itemMain}>
                      <div>
                        <div className={styles.productName}>{productItem.productName}</div>
                        <div className={styles.itemOther}>
                          <div className={styles.itemapartment} dangerouslySetInnerHTML={{__html: (productItem.productType === 'package'? productItem.apartment : '&nbsp')}}></div>
                          <div className={styles.itemproductPrice}>￥{productItem.productPrice}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
        return <span></span>
      })}
    </div>
  }

  render() {
    const _this = this;

    return (
      <div>
        <div>
        <Carousel
          className={styles.Carousel} autoplay={true} infinite selectedIndex={0}>
          {this.state.carousel.map(data => (
            <a href={data.onclick} key={data}>
              <img style={{ height: `${data.width}px`, width: '100%' }}
                src={data.src}
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'));
                  _this.setState({ 'initialHeight': `${data.width}px`});
                }}
              />
            </a>
          ))}
        </Carousel>
        </div>
        <div className={styles.content}>
          {this.renderNavLeft.call(this)}
          {this.renderProductMain.call(this)}
        </div>
      </div>
    )
  }
}

const getProductData = () => (
  fetch( appConfig.listWithCat, {
    method: 'GET',
    contentType: "application/json; charset=utf-8"
  }).then(
    (response) => (response.json()),
    (error) => ({'result':'1', 'message': error})
));

const getCarousel = () => (
  fetch( appConfig.findByElement, {
    method: 'GET',
    contentType: "application/json; charset=utf-8"
  }).then(
    (response) => (response.json()),
    (error) => ({'result':'1', 'message': error})
));

Home.contextTypes = { router: Object };

const mapStateToProps = (state, ownProps) => ({ Nav:state.reducer.Nav });

export default Home = connect(
  mapStateToProps
)(Home)


