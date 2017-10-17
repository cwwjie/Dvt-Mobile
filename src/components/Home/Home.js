import { connect } from 'react-redux'
import React, {Component} from 'react';


import { Carousel , Card , WhiteSpace , List } from 'antd-mobile';


import assign from 'lodash.assign'
import appConfig from './../../config/index.js';
import styles from './index.scss';

import More from './img/More.svg';
import taobao from './img/taobao.png';
import weibo from './img/weibo.png';
import weixin from './img/weixin.png';


class Home extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      carousel: [{src:null,onclick:null}],
      initialHeight:230,
      product:[]
    };
  }
  componentDidMount() {
    let _this = this;
    // 图片 fetch
    fetch(
      appConfig.findByElement,{
      method: 'GET',
      contentType: "application/json; charset=utf-8"
     }).then(function(response) {
      return response.json()
     }).then(function(json) {
      if (json.result=="0") {
        let _W = document.body.clientWidth;
        let _data = json.data,
          _Array = [],
          _Width =540 * _W / 1680;
        for (let i = 0; i < _data.length; i++) {
          let obj = {
            src:appConfig.URLbase + _data[i].carouselUrl,
            onclick:_data[i].leadUrl,
            width:_Width
          }
          _Array.push(obj);
        }
        _this.setState({
          carousel:_Array
        });
      }else {
        alert("轮播图加载失败，原因"+json.message)
      }
    })
    // 首页数据 fetch
    fetch(
      appConfig.listWithCat,{
      method: 'GET',
      contentType: "application/json; charset=utf-8"
     }).then(function(response) {
      return response.json()
     }).then(function(json) {
      if (json.result=="0") {
        _this.setState({
          product:json.data
        });
      }else {
        alert("轮播图加载失败，原因"+json.message)
      }
    })
  }
  checkPrice(Price,Promote,StartTime,EndTime) {
    var timestamp = Date.parse(new Date());
      if (Promote == null || Promote == 0) {
      }else {
        if (timestamp >= StartTime && timestamp <= EndTime) {
          // 此时是促销
          return <div><span style={{paddingRight:'10px',textDecoration:'line-through'}}>原价:¥{Price}</span>促销:¥{Promote}</div>
        }
      }
      // 其他情况都不是促销
      return <div>价格:¥{Price}</div>
  }
  render() {
    return (
      <div>
        <div>
        <Carousel
          className={styles.Carousel} autoplay={true} infinite selectedIndex={0}
          >
          {this.state.carousel.map(data => (
            <a href={data.onclick} key={data}>
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
            </a>
          ))}
        </Carousel>
        </div>
        {this.state.product.map((data,num) => (
          <div>
            <div className={styles.subtitle}>{data.catName}
              <div className="right" style={{display:'inline-block',float:'right',paddingRight:'16px'}}>
              <a href='https://divet.taobao.com/?spm=a1z10.1-c.0.0.8cxl3q' target='_blank'>
                更多
              </a>
              <i style={{
                position: 'relative',
                top:'2px',
                paddingLeft: '4px',
                display:'inline-block',
                width: '0.28rem',
                height: '0.28rem',
                background: 'url('+More+') center center /  0.28rem 0.28rem no-repeat' }}
              />
              </div>
            </div>
            {data.productList.map((product, key) => (
              <div key={key} style={{cursor:'pointer'}} onClick={()=>{
                  // 页面跳转
                  let _this = this
                  let _data = assign({},_this.props.Nav);
                  _data.navtitle.push("订单详情");
                  _data.PreURL.push("/Detail");
                  _data.leftContent={
                    return:'left',
                    logo:false
                  };
                  _data.hidden = true;
                  _data.productId = _this.state.product[num].productList[key].productId;
                  _this.props.dispatch({
                    type:'Chan_Nav',
                    data:_data
                  });
                  _this.props.dispatch({
                    type:'product_Id',
                    data:_this.state.product[num].productList[key].productId
                  })
                  _this.context.router.push('/Detail');
                }}>
                <div>
                  <Card full>
                    <Card.Header
                      title={product.productName}
                      />
                    <Card.Body>
                      <div className={styles.body}><img src={appConfig.URLbase + product.productThumb} /></div>
                    </Card.Body>
                    <Card.Footer className={styles.Footer} content={product.apartment} extra={
                      this.checkPrice(product.productPrice,product.promotePrice,product.promoteStartTime,product.promoteEndTime)
                    } />
                  </Card>
                </div>
                <WhiteSpace size="lg" />
              </div>
            ))}
          </div>
        ))}
        <div>
          <List>
            <div className={styles.List}>
              <div>
              <a href="./other/aboutUs.html">关于我们</a> | <a href="./other/teamStory.html">团队故事</a> | <a href="./other/joinUs.html">加入我们</a> | <a href="./other/help.html">帮助</a> | <a href="./other/Privacy.html">隐私声明</a> | <a href="./other/policy.html">政策条款</a>
              </div>
            </div>
          </List>
          <List>
            <div className={styles.botIcon}>
              <div onClick={function(){
                // 页面跳转
                let _this = this
                let _data = assign({},_this.props.Nav);



                _data.navtitle=["客服中心"];
                _data.PreURL=["/Cus"];

                _data.hidden = false;
                _data.selectedTab = 'Service';



                _this.props.dispatch({
                  type:'Chan_Nav',
                  data:_data
                });
                _this.context.router.push('/Cus');
              }.bind(this)}>
                <i style={{
                  position: 'relative',
                  top:'2px',
                  paddingLeft: '4px',
                  display:'inline-block',
                  width: '42px',
                  height: '42px',
                  background: 'url('+taobao+') center center /  42px 42px no-repeat' }}
                /><span> | </span><i style={{
                  position: 'relative',
                  top:'2px',
                  paddingLeft: '4px',
                  display:'inline-block',
                  width: '42px',
                  height: '42px',
                  background: 'url('+weibo+') center center /  42px 42px no-repeat' }}
                /><span> | </span><i style={{
                  position: 'relative',
                  top:'2px',
                  paddingLeft: '4px',
                  display:'inline-block',
                  width: '42px',
                  height: '42px',
                  background: 'url('+weixin+') center center /  42px 42px no-repeat' }}
                />
              </div>
            </div>
          </List>
          <List>
            <div style={{textAlign:'center',padding:'16px 8px',fontSize:'14px',color:"#888"}}>
            Copyright © 2016 DivingTime. 潜游时光 版权所有
            </div>
          </List>
        </div>
      </div>
    )
  }
}

Home.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav
})


export default Home = connect(
  mapStateToProps
)(Home)


