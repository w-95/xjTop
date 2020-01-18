
<script>
	var openId = '',session_key = '';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import http from './utils/http.js';
	import time from './utils/validate.js';
	export default {
		
		computed: {
			...mapState(['province', 'auth']),
		},
		methods: {
			...mapMutations(['setAuth']),
			setUser(data){
				this.setAuth(data)
			}
		},
		onLaunch: function () {
			//获取用户信息, 取code
			let that = this
			uni.login({
				provider: 'weixin',
				success: function (res) {
					//拿code换取openId
					console.log('登录的code===',res.code)
					http.getWxchatOpenid({code: res.code}).then(data =>{
						console.log('拿code换来的openid===',JSON.stringify(data))
						openId = data.openid
						session_key = data.session_key
						uni.setStorage({
							key: "userData",
							data: data
						})
					})
					//用户之前同意授权直接登录
					uni.getSetting({
						success: res1 =>{
							console.log('用户之前是否同意授权==',res1.authSetting['scope.userInfo'])
							if(res1.authSetting['scope.userInfo']) {  //用户是否允许授权
								uni.getUserInfo({
									success: res2 =>{
										let params = {
											"openId": openId,
											"userName": res2.userInfo.nickName,
											"phoneNum": '123',
											"userAvatarURL": res2.userInfo.avatarUrl,
											"userCity": res2.userInfo.city
										}
										http.userLogin(params).then(data =>{
											console.log('初始化登录成功的userid==',data.data.userId)
											if(data.code == 0 && data.data){
												data.data.userUpdateTime = time.formatTime(data.data.userUpdateTime,"Y-M-D h:m:s")
												that.setUser(data.data)
												uni.setStorage({
													key: "userId",
													data: data.data.userId
												})
											}
										})
									},
								})
							}
							
						}
					})
				}
			});
		},
		onShow: function () {
			console.log('App Show，欢迎回来')
		},
		onHide: function () {
			console.log('App Hide，已经隐藏');
		},
		onError: function (err) {
			console.log(err);
		},
	}
</script>

<style>
	/*每个页面公共css */
	/* @import url("./styles/common.css"); */
</style>
