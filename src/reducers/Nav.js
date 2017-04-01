let _state = {
  selectedTab: 'Home',      // 表示选择 底部TabBar   Home Service Order Me
  nav:{display:"block"},    // 表示显示隐藏 顶部所有  nav
  hidden: false,            // 表示显示隐藏 底部所有  TabBar
  leftContent:{
    return:false,           // 表示显示返回按钮       false   'left'
    logo:'home'             // 表示显示显示首页logo   false   'home'
  },
  RightContent:'login',     // 表示还登录状态 'login' 'successful'
  navtitle:'潜游时光',      // 表示标题
  PreURL:['/']                // 表示要返回的URL
}




const Nav = (state = _state, action) => {
  switch (action.type) {
    case 'Chan_Nav':
      state = action.data;
      let newstate = Object.assign({},state)
      return newstate
    case 'Chan_Url':
      // 左上角的切换
      state.PreURL = action.data;
      let URLstate = Object.assign({},state)
      return URLstate
    case 'Chan_Url_Tab':
      // 底部的切换
      state.PreURL = action.data.PreURL;
      state.selectedTab = action.data.selectedTab;
      state.leftContent = action.data.leftContent;
      let UTstate = Object.assign({},state)
      return UTstate
    default:
      return state
  }
}

export default Nav
