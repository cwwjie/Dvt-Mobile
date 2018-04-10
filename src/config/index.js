let config = (() => {
    let NODE_ENV = process.env.NODE_ENV || '';

    if (NODE_ENV === 'development') {
        let URLbase = 'http://192.168.0.100:8080';

        return {
            URLbase: URLbase,
            URLversion: `${URLbase}/Dvt-web`,
            URLvillage: `${URLbase}/Dvt-reserve`
        }
    } else {
		/**
		* 本地环境 http://192.168.0.100:8080
		* 生产环境 www.divingtime.asia
		* 生产环境 http://112.74.92.97:8443
		* document.location.protocol + '//' + location.host + (document.location.protocol === 'https:' ? ':8443' :':8080');
		*/
        // let URLbase = 'http://112.74.92.97:8080'
        let URLbase = `${document.location.protocol}//112.74.92.97:${document.location.protocol === 'https:' ? '8443' :'8080'}`;

        return {
            URLbase: URLbase,
            URLversion: `${URLbase}/dvtweb`,
            URLvillage: `${URLbase}/dvtreserve`
        }
        // return {
        //     URLbase: 'http://192.168.0.100:8080',
        //     URLversion: 'http://192.168.0.100:8080/Dvt-web',
        //     URLvillage: 'http://192.168.0.100:8080/Dvt-reserve'
        // }
    }
})();

export default config
