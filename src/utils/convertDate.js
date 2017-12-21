export default {
  // Date 转换 xxxx-xx-xx 字符串
  dateToFormat: (myDate) => {
    let yyyy = myDate.getFullYear();

    let mm = myDate.getMonth() + 1;
    let mmstring = mm < 10 ? '0' + mm : mm;

    let dd = myDate.getDate();
    let ddstring = dd < 10 ? '0' + dd : dd;

    return '' + yyyy + '-' + mmstring + '-' + ddstring;
  }
}