export function formatDate(date, fmt) {  //fmt是日期格式
	if (/(y+)/.test(fmt)) {  //匹配以y开头的年份格式
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	//date.getFullYear()是直接转化为字符串，substr是截取从什么位置开始截取多少个字符串，substr（start,length）
	//如果没有的length的话，则从start位置开始截取所有的字符串
	//RegExp.$1应该就是4个y
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		//构造正则表达式
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			//转化为str
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};
//补0
function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}
