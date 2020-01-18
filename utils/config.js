const commonUrl =" http://47.96.115.210:8080/api/"  //公共路径
 
// post请求封装
function postRequest(url, data) {
	console.log(url,data)
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		console.log(commonUrl + url)
		uni.request({
			url: "http://47.96.115.210:8080/api/" + url,
			data: postData,
			method: 'POST',
			header: {
				'content-type': 'application/json',
				// 'token': uni.getStorageSync("token")
			},
			success: function (res) {
				console.log(res)
				if (res.statusCode == 200 && res.data.code == 0) {
					resolve(res.data);
				} else {
					resolve(res.data);
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 1500
					})
				}
			},
			error: function(e) {
				uni.navigateTo({
					url: '../page/fieldPage/index'
				})
				reject('网络出错');
			}
		})
	});
	return promise;
}
 
// get请求封装
function getRequest(url, data) {
	
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		if(data != undefined && JSON.stringify(data) != '{}'){
			for(let i in data){
				url+='/'+data[i]
			}
		}
		uni.request({
			url: 'http://47.96.115.210:8080/api/'+url,
			method: 'GET',
			success: function (res) {
				if (res.statusCode == 200 && res.data.code == 0) {
					resolve(res.data.data);
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 1500
					})
				}
			},
			error: function(e) {
				reject('网络出错');
			}

		})
	});
	return promise;
}
 
 
module.exports = {
	postRequest,
	getRequest
}