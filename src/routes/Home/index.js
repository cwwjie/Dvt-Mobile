import React, {Component} from 'react';
import { connect } from 'dva';
import { Router, Switch, Route } from 'dva/router';
import { NavBar, Carousel, Toast } from 'antd-mobile';

import logo from './../../assets/logo.png';
import config from './../../config';
import convertToPinyinLower from './../../utils/convertToPinyinLower';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'carousel': [{
        'src': '',
        'onclick': '',
        'width': ''
      }],
      'dataList': [
        // {
        //   sortOrder: null,
        //   updateBy: null,
        //   updateTime: null,
        //   catDesc: null,
        //   catId: 13,
        //   catName: "潜游双人套餐",
        //   createBy: null,
        //   createTime: null,
        //   isDelete: null,
        //   isShow: null,
        //   parentId: null,
        //   productList: [
        //     {
        //       apartment: "邦邦 沙滩屋",
        //       apartmentNum: 1,
        //       bedType: null,
        //       brandId: null,
        //       clickCount: null,
        //       createBy: null,
        //       createTime: null,
        //       isDelete: null,
        //       isNew: "Y",
        //       isOnsale: null,
        //       period: 3,
        //       productBrief: "未经雕琢的天然小岛--邦邦岛",
        //       productDesc: null,
        //       productId: 64,
        //       productImg: "/source/image/product/thum/thum_34867ce5-d61a-4576-b4fb-060365c7d638.jpg",
        //       productName: "天然小岛邦邦 3天2晚蜜月/闺蜜行",
        //       productPrice: 5700,
        //       productSn: "000006",
        //       productThumb: "/source/image/product/thum/thum_34867ce5-d61a-4576-b4fb-060365c7d638.jpg",
        //       productType: "package",
        //       productView: null,
        //       promoteEndTime: 0,
        //       promotePrice: 0,
        //       promoteStartTime: 0,
        //       refundRuleId: null,
        //       updateBy: null,
        //       updateTime: null
        //     }
        //   ]
        // }
      ],
      'activeNav': 0,
    }
  }

  componentDidMount() {
    this.getProductData();
    this.getCarousel();
  }

  getProductData() {
    let _this = this;

    fetch(`${config.URLversion}/product/listWithCat.do`, {
      method: 'GET',
      contentType: "application/json; charset=utf-8"
    }).then(
        (response) => (response.json()),
        (error) => ({'result':'1', 'message': error})
    ).then((val) => {
      if (val.result === '0') {
        _this.setState({'dataList': val.data});
      } else {
        Toast.fail(`加载产品数据有误, 原因 ${val.message}`, 3);
      }
    }).catch((error) => {
      Toast.fail(`加载产品出错, 原因 ${error}`, 3);
    })
  }

  getCarousel() {
    let _this = this;

    fetch(`${config.URLversion}/system/carousel/findByElement.do`, {
      method: 'GET',
      contentType: "application/json; charset=utf-8"
    }).then(
        (response) => (response.json()),
        (error) => ({'result':'1', 'message': error})
    ).then((val) => {
      if (val.result === '0') {
        let myWidth = 540 * document.body.clientWidth / 1680;

        _this.setState({
          'carousel': val.data.map((jsonItem, key) => ({
            'src': config.URLbase + jsonItem.carouselUrl,
            'onclick': jsonItem.leadUrl,
            'width': myWidth
          }))
        });
      } else {
        Toast.fail(`获取的轮播图数据有误, 原因 ${val.message}`, 3);
      }
    }).catch((error) => {
      Toast.fail(`加载轮播图出错, 原因 ${error}`, 3);
    })
  }

  renderHomeNav() {
    const _this = this,
      dataList = this.state.dataList;

    const changeNav = (key) => {
      _this.setState({activeNav: key});
      window.scrollTo(0, document.getElementById(`list-position${key}`).offsetTop);
    }

    return dataList.length === 0 ? null : (
      <div className='Home-nav'>{dataList.map((val, key) => {
        if (_this.state.activeNav === key) {
          return <div className='Home-nav-active' key={key}>
            {val.catName}
          </div>
        } else {
          return <div key={key} onClick={() => {changeNav(key)}}>
            {val.catName}
          </div>
        }
      })}</div>
    )
  }

  renderHomeMain() {
    const _this = this,
      dataList = this.state.dataList;

    return dataList.length === 0 ? null : (
      <div id='Product-List' className='Product-List'>{dataList.map((ListItem, Listkey) => (
        <div id={`list-position${Listkey}`} key={Listkey}>
          <div className='List-title'>
            <div className='title-name'>{ListItem.catName}</div>
            <div className='title-name-ping'>{convertToPinyinLower.getFullChars(ListItem.catName)}</div>
            <img src={`${config.URLbase}${ListItem.productList[ListItem.productList.length - 1].productThumb}`} />
          </div>
          {ListItem.productList.map((productItem, productItemKey) => (
            <div className="List-Item" key={productItemKey}>
              <div className="Item-content">
                <img src={`${config.URLbase}${productItem.productThumb}`} />
                <div className="Item-description">
                  <div className="description-tiltle">{productItem.productName}</div>
                  <div className="description-caption">
                    <div className="description-price">￥{productItem.productPrice} 起</div>
                    <div className="description-opera">预定</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}</div>
    )
  }

  render() {
    const logoComponet = <div style={{
      width: '60px',
      height: '23px',
      background: 'url('+logo+') center center /  60px 23px no-repeat' }}
    />

    return (
      <div className='Home'>
        <NavBar
          mode="light"
          icon={logoComponet}
          rightContent={<div>登录</div>}
        >潜游时光</NavBar>

        <Carousel autoplay={true} infinite selectedIndex={0}>{this.state.carousel.map(data => (
          <a href={data.onclick} key={data}>
            <img
              style={{ width: '100%', verticalAlign: 'top' }}
              src={data.src}
              onLoad={() => { window.dispatchEvent(new Event('resize')); this.setState({ imgHeight: 'auto' }); }}
            />
          </a> 
        ))}</Carousel>

        {this.renderHomeNav.call(this)}
        {this.renderHomeMain.call(this)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isFirstVisit: state.user.isFirstVisit
})

export default connect(mapStateToProps)(Home);
