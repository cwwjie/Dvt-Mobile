import { connect } from 'react-redux'
import React, {Component} from 'react';


import { Carousel , WhiteSpace , List , WingBlank , Steps , Modal } from 'antd-mobile';



import appConfig from './../../../config/index.js';
import styles from './styles.scss';
import assign from 'lodash.assign'

const Item = List.Item;
const Brief = Item.Brief;
const Step = Steps.Step;


function RefundIcon(Num) {
  return (
    <div style={{
      fontSize:'14px',
      position:"relative",
      top:'7.5px'
    }}>{Num}</div>
  )
}




class Detail extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      modal: false,

      selectedTab: 'redTab',
      hidden: false,
      carousel: [{src:null,width:null}],
      initialHeight:120,
      productDetail:{
        productPrice:0,
        promotePrice:0
      },
      productTravel:[],
      productRoute:[],
      productInclude:[],
      productRule:{
        ruleItemList:[]
      }
    };
  }
  componentDidMount() {
    let _this = this;

    // 过滤
    if (_this.props.product.productId == null || _this.props.product.productId != _this.props.Nav.productId) {
      this.setState({
        modal:true
      })
    }
    // 请求(轮播图)
    fetch(
      appConfig.URLversion+"/product/relProductGallery/" + _this.props.product.productId + "/findByProductId.do",{
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
            src:appConfig.URLbase + _data[i].gallery.thumbUrl,
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
    // 请求(内容) => product
      // 产品信息相关
      fetch(
        appConfig.URLversion+"/product/" + _this.props.product.productId + "/get.do",{
        method: 'GET',
        contentType: "application/json; charset=utf-8"
       }).then(function(response) {
        return response.json()
       }).then(function(json) {
        // console.log('产品信息相关')
        // console.log(json)
        if (json.result=="0") {
          _this.props.dispatch({
            type:'product_Infor',
            data:json.data
          });
          _this.setState({
            productDetail:json.data
          });
          Rule(json.data.refundRuleId);
        }else {
          alert("标题&产品详情请求失败，原因"+json.message)
        }
      })
      // 套餐说明，交通信息相关
      fetch(
        appConfig.URLversion+"/product/attribute/findByProductId.do?productId=" + _this.props.product.productId,{
        method: 'GET',
        contentType: "application/json; charset=utf-8"
       }).then(function(response) {
        return response.json()
       }).then(function(json) {
        // console.log('套餐说明，交通信息相关')
        // console.log(json)
        if (json.result=="0") {
          _this.setState({
            productTravel:json.data
          });
        }else {
          alert("套餐说明&交通信息请求失败，原因"+json.message)
        }
      })
      // 套餐行程相关
      fetch(
        appConfig.URLversion+"/product/trip/findByProductId.do?productId=" + _this.props.product.productId,{
        method: 'GET',
        contentType: "application/json; charset=utf-8"
       }).then(function(response) {
        return response.json()
       }).then(function(json) {
        // console.log('套餐行程相关')
        // console.log(json)
        if (json.result=="0") {
          _this.props.dispatch({
            type:'product_travel',
            data:json.data
          })
          _this.setState({
            productRoute:json.data
          });
        }else {
          alert("套餐行程请求失败，原因"+json.message)
        }
      })
      // 套餐包含相关
      fetch(
        appConfig.URLversion+"/product/costIncludes/findByProductId.do?productId=" + _this.props.product.productId,{
        method: 'GET',
        contentType: "application/json; charset=utf-8"
       }).then(function(response) {
        return response.json()
       }).then(function(json) {
        // console.log('套餐包含相关')
        // console.log(json)
        if (json.result=="0") {
          _this.setState({
            productInclude:json.data
          });
        }else {
          alert("套餐包含请求失败，原因"+json.message)
        }
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
          // console.log('退款说明相关')
          // console.log(json)
          if (json.result=="0") {
            _this.setState({
              productRule:json.data
            });
          }else {
            alert("退款说明相关请求失败，原因"+json.message)
          }
        })
      }
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
    let _this = this
    let _data = assign({},_this.props.Nav);


    _data.productId=false;
    _data.navtitle=['潜游时光'];
    _data.PreURL=['/'];
    _data.leftContent={
      return:false,
      logo:'home'
    };
    _data.hidden=false;
    _data.selectedTab='Home';

    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    });

    this.context.router.push('/');
    this.setState({
      [key]: false,
    });
  }
  render() {
    return (
      <div>

        <div>
          <Carousel autoplay={true} infinite selectedIndex={0}>
            {this.state.carousel.map(data => (
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
            ))}
          </Carousel>
        </div>

        <div className={styles.main}>
          <WhiteSpace size="lg" />
          <List>
            <div className={styles.List}>
            <div className={styles.ListTitle}>{this.state.productDetail.productName}</div>
            <div className={styles.ListPrice}><span>¥ </span> {this.state.productDetail.productPrice}<span>.00</span></div>
            <div className={styles.ListAct}>{this.state.productDetail.productDesc}</div>
            </div>
          </List>
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
          <WhiteSpace size="lg" />
          <WingBlank size="md">套餐行程</WingBlank>
          <WhiteSpace size="lg" />
          <List>
            <Item arrow="horizontal" onClick={() => {
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
            }} multipleLine>
              <div style={{color:"#000"}}>查看行程详情</div>
            </Item>
            {this.state.productRoute.map(data => (
              <Item extra={"第"+data.tripDay+"天"} align="top" multipleLine>
              {data.tripPlace}
                <Brief>{data.tripEvent}</Brief>
              </Item>
            ))}
          </List>
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
          <WhiteSpace size="lg" />
          <WingBlank size="md">退款说明</WingBlank>
          <WhiteSpace size="lg" />
          <List>
            <div className={styles.Refunds}>
            <Steps>
              {this.state.productRule.ruleItemList.map(
                (data, key) => {
                  let _title = "";
                  if (key == 0) {
                    _title = data.beginDay + "天以上";
                  }else {
                    _title = data.beginDay + "天 - " + data.endDay + "天";
                  }
                  return (
                  <Step status="process" title={_title} icon={RefundIcon(data.deductionRatio)} description={data.ruleDesc} />
                  )
                }
              )}
            </Steps>
            </div>
          </List>
        </div>

        <div className={styles.bottomNav}>
          <div className={styles.botNavLeft}>
            <div className={styles.botNavLeftA}>起价套餐价格包含优惠价</div>
            <div className={styles.botNavLeftB}>
              <span>¥ </span> {
                this.state.productDetail.productPrice - this.state.productDetail.promotePrice
              }<span>.00</span>
            </div>
          </div>
          <div className={styles.botNavMid}><div onClick={()=>{
            let _this = this
            let _data = assign({},_this.props.Nav);

            _data.productId=false;
            _data.navtitle=['客服中心'];
            _data.PreURL=['/Cus'];
            _data.leftContent={
              return:false,
              logo:'home'
            };
            _data.hidden=false;
            _data.selectedTab='Service';

            _this.props.dispatch({
              type:'Chan_Nav',
              data:_data
            });

            _this.context.router.push('/Cus');
          }}>联系客服</div></div>
          <div className={styles.botNavRight}><div onClick={()=>{
            let _this = this
            let _data = assign({},_this.props.Nav);

            _data.navtitle.push("预定套餐");
            _data.PreURL.push("/Detail/submit");

            _this.props.dispatch({
              type:'Chan_Nav',
              data:_data
            });

            _this.context.router.push("/Detail/submit");
          }}>预定套餐</div></div>
        </div>

        <Modal
          title="链接失效"
          transparent
          maskClosable={false}
          visible={this.state.modal}
          onClose={
            this.onClose('modal')
          }
          footer={[{ text: '返回首页', onPress: () => {
            this.onClose('modal')();
          }}]}
         >
        </Modal>
      </div>
    )
  }
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


