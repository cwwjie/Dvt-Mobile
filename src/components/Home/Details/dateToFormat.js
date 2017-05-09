// Date 转换 xxxx-xx-xx 字符串
function dateToFormat(_data) {

  const year = _data.getFullYear();//获取完整的年份(4位,1970)

  let month = _data.getMonth()+1;//获取月份(0-11,0代表1月,用的时候记得加上1)

  if( month <= 9 ){
    month = "0"+month;
  }

  let date = _data.getDate();//获取日(1-31)

  if( date <= 9 ){
    date = "0"+date;
  }

  return year+"-"+month+"-"+date;
}

export default dateToFormat