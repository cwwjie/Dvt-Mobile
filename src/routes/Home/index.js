import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Carousel, Toast, List, TabBar } from 'antd-mobile';

import taobao from './../../assets/taobao.png';
import weibo from './../../assets/weibo.png';
import weixin from './../../assets/weixin.png';

import Homesvg from './../../assets/Home.svg';
import Home_hover from './../../assets/Home_hover.svg';
import Servicesvg from './../../assets/Service.svg';
import Service_hover from './../../assets/Service_hover.svg';
import Ordersvg from './../../assets/Order.svg';
import Order_hover from './../../assets/Order_hover.svg';
import Mesvg from './../../assets/Me.svg';
import Me_hover from './../../assets/Me_hover.svg';

import config from './../../config';
import convertToPinyinLower from './../../utils/convertToPinyinLower';

import MyNavBar from './../../components/MyNavBar/index';

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
      'isNavFixed': false
    }

    this.hasCanceled = false;
    this.jumpToDetail.bind(this);
  }

  componentDidMount() {
    let _this = this;

    Promise.all([
      this.getProductData(),
      this.getCarousel()
    ]).then(() => {
      _this.bindScroll()
    });
  }

  componentWillUnmount() {
    const documentDOM = document || window.document;
    documentDOM.onscroll = null;
    this.hasCanceled = true;
  }

  bindScroll() {
    const _this = this;
    const ProductList = [].slice.call(document.getElementById('Product-List').childNodes);

    const navHight = document.body.clientWidth * 540 / 1680 + 50;

    const documentDOM = document || window.document;
    documentDOM.onscroll = () => {
      // 滚动的距离
      const myScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let mySelectNumber = 0;

      if (myScrollTop > navHight) {
        if (_this.state.isNavFixed === false) {
          _this.setState({isNavFixed: true});
        }
      } else {
        if (_this.state.isNavFixed) {
          _this.setState({isNavFixed: false});
        }
      }
        
      ProductList.map((val, key) => {
        if (myScrollTop > (val.offsetTop - 70) ) {
          mySelectNumber = key;
        }
      });

      if (_this.state.activeNav !== mySelectNumber) {
        _this.setState({ 'activeNav': mySelectNumber});
      }
    }
  }

  getProductData() {
    let _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/product/listWithCat.do`, {
        method: 'GET',
        contentType: "application/json; charset=utf-8"
      }).then(
          (response) => (response.json()),
          (error) => ({'result':'1', 'message': error})
      ).then((val) => {
        if (_this.hasCanceled) { // 取消
          reject();
          return
        }

        if (val.result === '0') {
          _this.setState({'dataList': val.data});
          resolve();
        } else {
          Toast.fail(`加载产品数据有误, 原因 ${val.message}`, 3);
          reject();
        }
      }).catch((error) => {
        Toast.fail(`加载产品出错, 原因 ${error}`, 3);
        reject();
      })
    });
  }

  getCarousel() {
    let _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/system/carousel/findByElement.do`, {
        method: 'GET',
        contentType: "application/json; charset=utf-8"
      }).then(
          (response) => (response.json()),
          (error) => ({'result':'1', 'message': error})
      ).then((val) => {
        if (_this.hasCanceled) { // 取消
          reject();
          return
        }

        if (val.result === '0') {
          let myWidth = 540 * document.body.clientWidth / 1680;

          _this.setState({
            'carousel': val.data.map((jsonItem, key) => ({
              'src': config.URLbase + jsonItem.carouselUrl,
              'onclick': jsonItem.leadUrl,
              'width': myWidth
            }))
          });
          resolve();
        } else {
          Toast.fail(`获取的轮播图数据有误, 原因 ${val.message}`, 3);
        reject();
      }
      }).catch((error) => {
        Toast.fail(`加载轮播图出错, 原因 ${error}`, 3);
        reject();
      })
    });
  }

  renderHomeNav() {
    const _this = this,
      dataList = this.state.dataList,
      navClassName = this.state.isNavFixed ? 'Home-nav Home-Fixed' : 'Home-nav';

    const changeNav = (key) => {
      _this.setState({activeNav: key});
      window.scrollTo(0, document.getElementById(`list-position${key}`).offsetTop);
    }

    return dataList.length === 0 ? (<div id='Home-nav'></div>) : (
      <div id='Home-nav' className={navClassName}>{dataList.map((val, key) => {
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

  jumpToDetail(id) {
    this.props.dispatch(routerRedux.push(`/home/detail?productId=${id}`));
  }

  renderHomeMain() {
    const _this = this,
      dataList = this.state.dataList;

    return dataList.length === (<div id='Product-List'></div>) ? null : (
      <div id='Product-List' className='Product-List'>{dataList.map((ListItem, Listkey) => (
        <div id={`list-position${Listkey}`} key={Listkey}>
          <div className='List-title'>
            <div className='title-name'>{ListItem.catName}</div>
            <div className='title-name-ping'>{convertToPinyinLower.getFullChars(ListItem.catName)}</div>
            <img src={`${config.URLbase}${ListItem.productList[ListItem.productList.length - 1].productThumb}`} />
          </div>
          {ListItem.productList.map((productItem, productItemKey) => (
            <div className="List-Item" key={productItemKey}>
              <div className="Item-content"
                onClick={() => { _this.jumpToDetail(productItem.productId) }}
              >
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

    return (
      <div className='Home'>
        <MyNavBar
          navName='潜游时光'
        />

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

        <Copyright/>
        <MyTabBar/>
      </div>
    )
  }
}

class MyTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      selectedTab: 'Home'
    }
  }

  render() {
    const myIcon = (svg) => (
      <div style={{
        width: '23px',
        height: '23px',
        background: `url(${svg}) center center /  22px 22px no-repeat` }}
      />
    )

    return (
      <div className="TabBar">
        <div style={{height:"49px"}}></div>
        <div className="TabBar-content">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={this.state.isHidden}
          >
            <TabBar.Item
              icon={myIcon(Homesvg)}
              selectedIcon={myIcon(Home_hover)}
              title="首页"
              key="首页"
              selected={this.state.selectedTab === 'Home'}
              onPress={() => {}}
            />
            <TabBar.Item
              icon={myIcon(Ordersvg)}
              selectedIcon={myIcon(Order_hover)}
              title="度假村"
              key="度假村"
              selected={this.state.selectedTab === 'Order'}
              onPress={() => {}}
            />
            <TabBar.Item
              icon={myIcon(Servicesvg)}
              selectedIcon={myIcon(Service_hover)}
              title="客服"
              key="客服"
              selected={this.state.selectedTab === 'Service'}
              onPress={() => {}}
            />
            <TabBar.Item
              icon={myIcon(Mesvg)}
              selectedIcon={myIcon(Me_hover)}
              title="我的"
              key="我的"
              selected={this.state.selectedTab === 'Me'}
              onPress={() => {}}
              >
            </TabBar.Item>
          </TabBar>
        </div>
      </div>
    )
  }
}

class Copyright extends Component {
  render() {
    return (
      <div className="Copyright">
        <List>
          <div className="Copyright-link">
            <a href="./other/aboutUs.html">关于我们</a> | <a href="./other/teamStory.html">团队故事</a> | <a href="./other/joinUs.html">加入我们</a> | <a href="./other/help.html">帮助</a> | <a href="./other/Privacy.html">隐私声明</a> | <a href="./other/policy.html">政策条款</a>
          </div>
        </List>
        <List>
          <div className="Copyright-icon">
            <div>
              <i style={{background: `url(${taobao}) center center /  42px 42px no-repeat` }}/>
              <span> | </span>
              <i style={{background: `url(${weibo}) center center /  42px 42px no-repeat` }}/>
              <span> | </span>
              <i style={{background: `url(${weixin}) center center /  42px 42px no-repeat` }}/>
            </div>
          </div>
        </List>
        <List>
          <div style={{textAlign:'center',padding:'16px 8px',fontSize:'14px',color:"#888"}}>
          Copyright © 2016 DivingTime. 潜游时光 版权所有
          </div>
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isFirstVisit: state.user.isFirstVisit
})

export default connect(mapStateToProps)(Home);
