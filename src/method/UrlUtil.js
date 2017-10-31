module.exports = {

	/*URL模板，使用方法：
	import UrlUtil from "../../util/UrlUtil";
	var url = UrlUtil.parseUrl("/product/{productId}/get.do",{productId:1});
	template:URL模板格式"/{param1}/{param2}/{param3}/get.do"或者"/{param1}/{param2.p1}/get.do"
	context:上下文格式，{param1:val1,param2:val2}或者{param1:val1,param2:{p1:v1}}*/
	parseUrl(template, context) {

		var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

		return template.replace(tokenReg, function(word, slash1, token, slash2) {
			if (slash1 || slash2) {
				return word.replace('\\', '');
			}

			var variables = token.replace(/\s/g, '').split('.');
			var currentObject = context;
			var i, length, variable;

			for (i = 0, length = variables.length, variable = variables[i]; i < length; ++i) {
				currentObject = currentObject[variable];
				if (currentObject === undefined || currentObject === null) return '';
			}

			return currentObject;
		})
	}

}