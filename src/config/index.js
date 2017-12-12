/**
 * 本地环境 http://192.168.0.100:8080
 * 生产环境 www.divingtime.asia
 * 生产环境 http://112.74.92.97:8080
 */
const URLbase = "http://192.168.0.100:8080";
/**
 * 本地 /Dvt-web
 * 生产 /dvtweb
 */
const URLversion = "/Dvt-web"
/**
 * 本地 /Dvt-reserve
 * 生产 /dvtreserve
 */
var URLvillage = "/Dvt-reserve"
const appConfig = {
	URLbase: URLbase,
	URLvillage: URLbase + URLvillage,
	URLversion: URLbase + URLversion,
	listWithCat: URLbase + URLversion+"/product/listWithCat.do",
	findByElement: URLbase + URLversion+"/system/carousel/findByElement.do",
	findByElement: URLbase + URLversion+"/system/carousel/findByElement.do",
	logurl: URLbase + URLversion+"/user/login.do",
	forgeturl: URLbase + URLversion+"/user/forgetPw.do",
	sigupturl: URLbase + URLversion+"/user/register.do",
	active: URLbase + URLversion+"/user/activate.do",
	updateEmailActivate: URLbase + URLversion+"/user/updateEmailActivate.do",
	forgetPwCheck: URLbase + URLversion+"/user/forgetPwCheck.do",
	forgetPwSubmit: URLbase + URLversion+"/user/forgetPwSubmit.do",
	forgetPwtToMob: URLbase + URLversion+"/user/forgetPwtToMob.do",
	registerMobile: URLbase + URLversion+"/user/registerMobile.do",
	getMobileCode: URLbase + URLversion+"/user/getMobileCode.do",
	changePw: URLbase + URLversion+"/user/changePw.do",
	getUserInfo: URLbase + URLversion+"/user/getUserInfo.do",
	logout: URLbase + URLversion+"/user/logout.do",
	findByOrderId: URLbase +  URLversion+"/order/orderUserinfo/findByOrderId.do",
	findByUserId: URLbase + URLversion+"/user/address/findByUserId.do",
	addAddress: URLbase + URLversion+"/user/address/add.do",
	deleteAddress: URLbase + URLversion+"/user/address/delete.do",
	updateAddress: URLbase + URLversion+"/user/address/update.do",
	updateUser: URLbase + URLversion+"/user/update.do",
	getOrder: URLbase +  URLversion+"/order/list.do",
	getOrderById: URLbase + URLversion+ "/order/id/",
	getOrderBySn: URLbase + URLversion+ "/order/sn/",
	updateEmail: URLbase + URLversion+"/user/updateEmail.do",
	checkMobile: URLbase + URLversion+"/user/checkMobile.do",
	checkEmail: URLbase + URLversion+"/user/checkEmail.do",
	updateMobile: URLbase + URLversion+"/user/updateMobile.do",
	userinfoFindByUserId: URLbase + URLversion+"/user/userinfo/findByUserId.do",
	userinfoAdd: URLbase + URLversion+"/user/userinfo/add.do",
	userinfoId: URLbase + URLversion+"/user/userinfo/delete.do?userinfoId=",
	userupdate: URLbase + URLversion+"/user/userinfo/update.do",
	selectProvince: URLbase + URLversion+"/system/region/regiontype/",
	// allListRoom: URLbase + URLversion+"/product/apartment/1/0/list.do"
}


export default appConfig
