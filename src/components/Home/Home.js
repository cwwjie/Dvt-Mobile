import React, {Component} from 'react';
import { Carousel , Card , WhiteSpace , List } from 'antd-mobile';
import appConfig from './../../config/index.js';
import styles from './styles.scss';
import More from './More.svg';


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
    console.log(document.body.clientWidth)
    var _this = this;
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
      console.log(json)
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
          className={styles.Carousel} autoplay={false} infinite selectedIndex={0}
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
        {this.state.product.map(data => (
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
            {data.productList.map(product => (
              <div>
                <div onClick={()=>{
                  // 页面跳转
                  }}>
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
        <List>
          <div className={styles.List}>
            <a href="./other/aboutUs.html">关于我们</a> | <a href="./other/teamStory.html">团队故事</a> | <a href="./other/joinUs.html">加入我们</a> | <a href="./other/help.html">帮助</a> | <a href="./other/Privacy.html">隐私声明</a> | <a href="./other/policy.html">政策条款</a>
          </div>
        </List>
      </div>
    )
  }
}

export default Home