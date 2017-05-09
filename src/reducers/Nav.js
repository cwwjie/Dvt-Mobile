import assign from 'lodash.assign'

let _state = {
  nav:{display:"block"},    // 顶部 nav 显隐


  RightContent:'login',     // 登录状态 'login' 'successful'


  productId:false,          // 产品ID  false -> 失效


  navtitle:['潜游时光'],    // 中心标题
  PreURL:['/'],             // 返回 URL
  leftContent:{
    return:false,           // 返回按钮  首页->false   'left'
    logo:'home'             // 返回logo  首页->'home'   false
  },

  hidden: false,            // 底部  TabBar 显隐
  selectedTab: 'Home'       // 底部  TabBar 选择  Home Service Order Me
}




const Nav = (state = _state, action) => {
  switch (action.type) {

    case 'Chan_Nav':
      // 这个是全部改变
      state = action.data;
      let newstate = assign({},state)
      return newstate

    case 'Chan_Part':
      // 这个是部分改变 貌似用不到，瞎操心了！算了，放在这里蹦？
      for (_name in state) {
        for (_target in action.data) {
          if (_name == _target) {
            state[_name] = action.data[_target];
          }
        }
      }
      let statePart = assign({},state)
      return statePart

    case 'Chan_Url':
      // 左上角的切换
      state.PreURL = action.data;
      let URLstate = assign({},state)
      return URLstate

    case 'Chan_Url_Tab':
      // 底部的切换
      state.PreURL = action.data.PreURL;
      state.selectedTab = action.data.selectedTab;
      state.leftContent = action.data.leftContent;
      let UTstate = assign({},state)
      return UTstate

    default:
      return state
  }
}

export default Nav
