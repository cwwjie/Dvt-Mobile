import { connect } from 'react-redux'
import React, {Component} from 'react';


import {  WhiteSpace , List , WingBlank , Steps , Modal , Button} from 'antd-mobile';


import appConfig from './../../../config/index.js';
import styles from './styles.scss';
import assign from 'lodash.assign'




class travel extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      modal1: false,
      productList:[]
    }
  }
  componentDidMount() {
    // 只要有一个不符合就弹出 链接失效
    if (this.props.product.productId != this.props.Nav.productId || this.props.product.productId == null || this.props.Nav.productId == null) {
      this.setState({
        modal1:true
      })
    }
    this.setState({
      productList:this.props.product.travel
    })
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
        {this.state.productList.map((product, key) => (
          <div>
            <WhiteSpace size="lg" />
            <WingBlank size="md">第{(key+1)}天 {product.tripBrief}</WingBlank>
            <WhiteSpace size="lg" />
            <List>
              <div className={styles.List}>
                <div className={styles.attrValue} dangerouslySetInnerHTML={{__html:product.tripDesc}}/>
              </div>
            </List>
          </div>
        ))}
        <Modal
          title="链接失效"
          transparent
          maskClosable={false}
          visible={this.state.modal1}
          onClose={
            this.onClose('modal1')
          }
          footer={[{ text: '返回首页', onPress: () => {
            this.onClose('modal1')();
          }}]}
        >
        </Modal>
      </div>
    )
  }
}

travel.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  product:state.reducer.product
})


export default travel = connect(
  mapStateToProps
)(travel)


