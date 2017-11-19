# 潜游时光手机端


### 打包到实际环境! 
src\components\My\Order\taobaoList.js  
// 实际环境  
window.location.href="./../info/gather.html";  
// 测试环境
window.location.href="./../Dvt-web/info/gather.html";  


src\config\index.js
const URLbase = "http://192.168.0.100:8080";
const URLversion = "/Dvt-web";


src\entry.js
import vconsole from 'vconsole';
new vconsole();
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),

