export default {
    // 2017-10-1 23:04
    timestampToyyyyMMddHHmmFormat: function(timestamp) {
        let myDate = new Date(timestamp);

        let year = myDate.getFullYear();
        
        let month = myDate.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
    
        let theDate = myDate.getDate();
        theDate = theDate < 10 ? '0' + theDate : theDate;

        let hours = myDate.getHours();
        hours = hours < 10 ? '0' + hours : hours;

        let minutes = myDate.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${year}-${month}-${theDate} ${hours}:${minutes}`;
    }
}