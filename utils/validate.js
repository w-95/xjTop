
//数据转化
const formatNumber = function(n) {
	 n = n.toString()
	 return n[1] ? n : '0' + n
};
export default {
	//去掉字符串头尾空格
	trim: function(str){
		return str.replace(/(^\s*)|(\s*$)/g, '');
	},
	
	
	/**
	 * 时间戳转化为年 月 日 时 分 秒
	 * number: 传入时间戳
	 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
	*/
	formatTime:function(number,format){
		var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
		  var returnArr = [];
		  var date = new Date(number);
		  returnArr.push(date.getFullYear());
		  returnArr.push(formatNumber(date.getMonth() + 1));
		  returnArr.push(formatNumber(date.getDate()));
		  returnArr.push(formatNumber(date.getHours()));
		  returnArr.push(formatNumber(date.getMinutes()));
		  returnArr.push(formatNumber(date.getSeconds()));
		  for (var i in returnArr) {
		    format = format.replace(formateArr[i], returnArr[i]);
		  }
		  return format;
	},
	timestampToTime: function(timestamp) {
		console.log(toString(timestamp))
	        if(toString(timestamp).length == 10){
				var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			}else if(toString(timestamp).length == 13){
				var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			}
	        Y = date.getFullYear() + '-';
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	        D = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()+ ' ';
	        h = date.getHours() < 10 ? '0'+date.getHours()+ ':' : date.getHours() + ':';
	        m = date.getMinutes() < 10 ? '0'+date.getMinutes()+ ':' : date.getMinutes() + ':';
	        s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
			return Y+M+D+h+m+s;
	}
};