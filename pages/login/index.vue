<template>
	<view class="page index-page">
		<view class="my-info-bar">
			<view class="user-icon">
				<open-data type="userAvatarUrl"></open-data>
			</view>
			<p class='title'>鞋业社区</p>
			<!-- <view class="user-name" @click="handleLogin()">{{auth? auth.nickName: '请登录'}}</view> -->
		</view>
		<button class='get-phone' open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">登录</button>
		<button class='clone' @click='goIndex'>取消登陆</button>
		
		<!-- <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="get-phone">获取手机号注册</button> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import http from '../../utils/http.js'
	import time from '../../utils/validate.js'
	export default {
		data() {
			return {
				session_key: '',
				userId: ''
			}
		},
		components: {},
		
		onLoad() {},
		onReady() {},
		computed: {
			...mapState(['province', 'auth','isDetails','detailData','openData']),
		},
		onShow() {},
		methods: {
			...mapMutations(['setAuth','setIsDetails','setDetailData']),
			//取消注册
			goIndex(){
				uni.reLaunch({
					url: '../index/index'
				})
			},
			//获取用户信息
			getuserinfo(e){
				let that = this
				if(e.detail.userInfo) {
					let params = {
						"openId":"",
						"userName": e.detail.userInfo.nickName,
						"phoneNum":"123",
						"userAvatarURL": e.detail.userInfo.avatarUrl,
						"userCity": e.detail.userInfo.city
					}
					if(that.openData != null && that.openData.openid){
						params.openId = that.openData.openid
						that.login(params)
					}
				}
			},
			//登录注册
			login(params){
				let that = this
				http.userLogin(params).then(data =>{
					if(data.code == 0 && data.data) {
						that.userId = data.data.userId
						data.data.userUpdateTime = time.formatTime(data.data.userUpdateTime,"Y-M-D h:m:s")
						this.setAuth(data.data)
						that.goPage()
					}
					
				})
			},
			//用户是否选择默认领域
			getUserDefault(userid){
				return http.getUserList({userId: userid}).then(data => {
					for(let i of data.data){
						if(!i.isExpired){ //设置了权限
							return true
						}
					}
					return false
				})
			},
			//登录成功的回调
			goPage(){
				let that = this
				if(that.isDetails){
					uni.redirectTo({
						url: '../postingDetail/index?id='+that.detailData.id+'&title='+that.detailData.title
					})
				}else {
					that.getUserDefault(that.userId).then(res =>{
						if(res){
							uni.reLaunch({
								url: '../index/index'
							})
						}else {
							uni.navigateTo({
								url: '../choiceField/index?id='+that.userId
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		.my-info-bar {
			width: 686upx;
			background: #FFFFFF;
			margin-top: 150upx;
			.title{
				font-size: 32upx;
				font-weight: bold;
				margin: 0 auto;
				text-align: center;
				padding: 80upx 0 0 0;
			}
			.user-icon {
				width: 100upx;
				height: 100upx;
				margin: 0 auto;
				border-radius: 50%;
				overflow: hidden;
			}
			.user-name {
				font-weight: 300;
				flex: 1;
				line-height: 76upx;
				font-size: 32upx;
				margin-left: 22upx;
				color: rgba(0, 0, 0, 1);
			}
		}
		.get-phone{
			margin-top: 80upx;
			width: 80%;
			font-size: 32upx;
			background-color: #42E1A4;
			color: white;
			border: none;
		}
		.clone{
			margin-top: 50upx;
			width: 80%;
			font-size: 32upx;
			border: none;
			background-color: rgba(102,102,102,1);
			color: #F1F1F1;
		}
	}
</style>
