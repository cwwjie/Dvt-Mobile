import { connect } from 'react-redux'
import React, {Component} from 'react';

import { Toast } from 'antd-mobile';

import appConfig from './../../config/index.js';
import styles from './styles.scss';

class Home extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      'selectNumber': 0,
      'dataList': [
        {
          'catName': '一日游'
        },
        {
          'catName': '包车'
        },
        {
          'catName': '保险'
        },
        {
          'catName': '沙巴中转酒店'
        },
        {
          'catName': '潜水课程'
        },
        {
          'catName': '装备租售'
        }
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
        //       'productName': '天然小岛邦邦 3天2晚蜜月/闺蜜行',
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
  }

  componentDidMount() {
    const _this = this;

    getProductData()
    .then( (response) => (response.json()), (error) => (alert(`加载数据出错, 原因${error}`)) )
    .then((val) => {
      if (val.result === '0') {
        return false
        _this.setState({dataList: val.data}, () => {
          bindScroll();
        });
      } else if (val.message) {
        alert(`加载的数据有误, 原因${val.message}`)
      }
    })

    let bindScroll = () => {
      const DOMProductMain = document.getElementById('ProductMain');

      DOMProductMain.onscroll = (event) => {
        // console.log(DOMProductMain.scrollTop)
      }
    }
    bindScroll();
  }

  renderNavLeft() {
    const selectNumber = this.state.selectNumber,
      myList = this.state.dataList;

    return <div>
      {myList.map((val, key) => {
        if (selectNumber === key) {
          return <div className={styles.activeItem}>{val.catName}</div>
        }
        return <div className={styles.item}>{val.catName}</div>
      })}
    </div>
  }

  renderProductMain() {
    const myList = this.state.dataList;

    return <div>
      {myList.map((val, key) => {
        return <div className={styles.item}>{val.catName}</div>
      })}
    </div>
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.navLeft}>
          {this.renderNavLeft.call(this)}
          <span></span>
        </div>
        <div id='ProductMain' className={styles.main}>
          
          {this.renderProductMain.call(this)}
          <div style={{height: '1000px'}}>11</div>
          <div style={{height: '1000px'}}>11</div>
          <div style={{height: '1000px'}}>11</div>
        </div>
      </div>
    )
  }
}

const getProductData = () => (fetch( appConfig.listWithCat, {
  method: 'GET',
  contentType: "application/json; charset=utf-8"
}));

Home.contextTypes = { router: Object };

const mapStateToProps = (state, ownProps) => ({ Nav:state.reducer.Nav });

export default Home = connect(
  mapStateToProps
)(Home)


