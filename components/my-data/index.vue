<template>
	<view class="logo-box">
		<view class="logo">
			<viwe class='login-new'>
				<view class="user-icon" v-if='isAuth'>
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="user-name" v-if='isAuth'>
					<open-data type="userNickName"></open-data>
				</view>
				<view class="auth-icon" v-if='!isAuth'>
					<image :src='authData.articleAuthor.userAvatarURL'></image>
				</view>
				<view class="auth-name" v-if='!isAuth'>
					{{authData.articleAuthorName}}
				</view>
				<view class="operation-follow" v-if='isShowFollow'>
					<button class='add-follow' @click="addFollow('add')" v-if='!isAddFollow'>+关注</button>
					<button class='clean-follow' @click="addFollow('clear')" v-else>取消关注</button>
				</view>
			</viwe>
			<view class="text" v-if='isAuth'>加入时间: {{authData.userUpdateTime}}</view>
			<view class="text" v-if='!isAuth'>加入时间: {{authData.articleAuthor.userUpdateTime}}</view>
			<view class="my-autograph">
				“走自己的路让别人跟着走”
			</view>
			<view class='follow-type' @click='goFollow' v-if='isShowFans'>
				<view v-for='(item,index) in followTabParams' :key='index'>
					<text class='follow-left'>{{item.count}}</text>
					<text class='fans-right'>{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 我的页面头部个人信息组件(头像、昵称、是否显示关注、加入时间、签名、是否显示关注粉丝)
	 * isShowFollow 是否显示关注按钮默认false
	 * isShowFans   是否显示粉丝和关注默认false
	 * authData     所展示的信息对象
	 * isAuth       是否展示自己的头像昵称 默认true
	 * */
	import http from '../../utils/http.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				followTabParams:[{
					name: '关注',
					count: 20,
					type: 'follow'
				},{
					name: '粉丝',
					count: 20,
					type: 'fans'
				}],
				isAddFollow: false
			}
		},
		props: {
			authData: {
				type: Object,
				default: ()=> {}
			},
			isShowFollow: {
				type: Boolean,
				default: false
			},
			isShowFans: {
				type: Boolean,
				default: false
			},
			isAuth: {
				type: Boolean,
				default: true
			},
			type: {
				type: String,
				default: 'my'
			}
		},
		computed: {
			...mapState(['auth'])
		},
		created(){
			if(this.isShowFollow){
				this.isFollow()
			}
			console.log(this.type)
			this.getCount()
		},
		methods: {
			//开启订阅消息
			openMsg() {
			    var that = this;
				if (wx.requestSubscribeMessage) {
					uni.requestSubscribeMessage({
						tmplIds: ['KohP-FGpzCeJNYdw9xrn9ru1ojglnmnEzNzHpxMDUBM'],
						success(res){
							if(res['KohP-FGpzCeJNYdw9xrn9ru1ojglnmnEzNzHpxMDUBM'] === 'accept'){
								uni.openSetting({
									success(res){
										console.log('openSetting的成功回调数据：', res);
										that.guidSubscribeMessageAuthAfter();
									}
								})
							}else if(res['KohP-FGpzCeJNYdw9xrn9ru1ojglnmnEzNzHpxMDUBM'] === 'reject'){
								that.guideOpenSubscribeMessage();
							}else {
								uni.showToast({
								  title: '授权订阅消息有误',
								  icon: 'none'
								});
							 }
						},
						fail(res){
							//20004:用户关闭了主开关，无法进行订阅,引导开启
							console.log('fail res==',res)
							if(res.errCode == 20004){
								that.guideOpenSubscribeMessage();
							}
						}
					})
				}else {
					uni.showToast({
						title: '请更新您微信版本，来获取订阅消息功能',
						icon: 'none'
					})
				}
			},
			guideOpenSubscribeMessage() {
				//引导用户，手动引导用户去设置页开启，
				let that = this;
				uni.showModal({
				    title: '',
				    content: '检测到您没有开启订阅消息的权限，是否去设置？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.openSetting({
								success(res){
									console.log('openSetting的成功回调数据：', res);
									that.guidSubscribeMessageAuthAfter();
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
							uni.showToast({
								title: '您已拒绝订阅消息授权',
								icon: 'none'
							})
				        }
				    }
				});
			 },
			guidSubscribeMessageAuthAfter() {
			    //引导用户 开启订阅消息 之后，「openSetting」 接口暂时不会返回，用户手动设置后的状态，所以采用「getSetting」接口重新进行查询
			    wx.getSetting({
					withSubscriptions: true,
					success: res => {
						console.log('guidSubscribeMessageAuthAfter res==',res)
						let {
							authSetting = {},
							subscriptionsSetting: { mainSwitch = false, itemSettings = {} } = {}
						} = res;
						console.log('authSetting ==',authSetting)
						console.log('itemSettings ==',itemSettings)
						if (
							(authSetting['scope.subscribeMessage'] || mainSwitch) &&
							(itemSettings['KohP-FGpzCeJNYdw9xrn9ru1ojglnmnEzNzHpxMDUBM'] === 'accept')
							) {
								// this.submitClock();
								// console.log('用户手动开启同意了，订阅消息');
							} else {
							uni.showToast({
								title: '您没有同意授权订阅消息，订阅失败',
								icon: 'none'
							})
						}
					}
			    });
			},
			//获取粉丝，关注count
			getCount(){
				let params = {
					userId: ''
				}
				if(this.type == 'my'){
					params.userId = this.auth.userId
					console.log(this.auth)
				}else if(this.type == 'detail'){
					params.userId = this.authData.articleAuthorId || this.authData.userId;
				}
				http.getFansCount(params).then(res => {
					this.followTabParams[0].count = res.gzCount;
					this.followTabParams[1].count = res.fsCount
				})
			},
			//获取关注状态
			isFollow(){
				let params = {
					userId: this.auth.userId,
					followedUserId: this.authData.articleAuthorId
				}
				http.checkFollow(params).then(res =>{
					this.isAddFollow = res
				})
			},
			goFollow(){
				let id = +this.authData.articleAuthorId || this.authData.userId;
				let name = this.authData.articleAuthorName || this.authData.userName;
				uni.navigateTo({
					url: '../followTab/index?id='+id+'&name='+name
				})
			},
			addFollow(type){
				console.log(this.auth.userId)
				let params = {
					userId: this.auth.userId,
					followedUserId: this.authData.articleAuthorId
				},that = this;
				http.follow(params).then(data => {
					if(type == 'add'){
						this.isAddFollow = true;
						uni.showToast({
							title: '关注成功',
							mask: true,
							duration: 1500
						})
						that.openMsg()
					}else if(type == 'clear'){
						this.isAddFollow = false;
						uni.showToast({
							title: '取消关注成功',
							mask: true,
							duration: 1500
						})
					}
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.logo-box{
		height: 370upx;
		background-color: #007BFB;
		border: 1px solid  #007BFB;
		width: 750upx;
		box-sizing: border-box;
		line-height: 65upx;
		.logo{
			width: 90%;
			margin: 0 auto;
			box-sizing: border-box;
			margin-top: 80upx;
			padding: 15upx;
			min-height: 500upx;
			background-color: white;
			border-top-left-radius: 20upx;
			border-top-right-radius: 20upx;
			font-size: 35upx;
			font-weight: bold;
			.login-new{
				width: 100%;
				display: flex;
				align-items: center;
				.user-icon {
					width: 65upx;
					height: 65upx;
					line-height: 80upx;
					margin: 0;
					padding: 0;
					margin-left: 20upx;
					border-radius: 50%;
					overflow: hidden;
				}
				.user-name {
					margin: 0;
					padding: 0;
					margin-left: 30upx;
					height: 80upx;
					line-height: 80upx;
					overflow: hidden;
				}
				.auth-icon {
					width: 65upx;
					height: 65upx;
					line-height: 80upx;
					margin: 0;
					padding: 0;
					margin-left: 20upx;
					border-radius: 50%;
					overflow: hidden;
					image{
						width: 65upx;
						height: 65upx;
					}
				}
				.auth-name {
					width:346rpx;
					margin: 0;
					padding: 0;
					margin-left: 30upx;
					height: 80upx;
					line-height: 80upx;
					overflow: hidden;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.operation-follow{
					.add-follow{
						color: white;
						text-align: center;
						font-size: 24rpx;
						background-color: #42E1A4;
						margin-left: 20upx
					}
					.clean-follow{
						color: white;
						text-align: center;
						font-size: 24rpx;
						background-color: #808080;
						margin-left: 20upx
					}
				}
				button::after{ border: none;background: none;}
				.vip{
					width: 150upx;
					height: 50upx;
					line-height: 50upx;
					border-radius: 10upx;
					text-align: center;
					color: white;
					margin-left: 20upx;
					font-size: 28upx;
					margin-left: 225upx;
					background-color: #535A63;
				}
			}
			.text{
				background-color: white;
				display: block;
				width: 90%;
				text-align: center;
				font-size: 24upx;
				color: #808080;
				font-family: PingFang SC;
			}
			.my-autograph{
				background-color: white;
				width: 90%;
				text-align: center;
				font-size: 30upx;
				font-weight: bold;
				font-family: PingFang SC;
			}
			.follow-type{
				background-color: white;
				width: 90%;
				font-size: 30upx;
				display: flex;
				align-items:center;
				font-family: PingFang SC;
				view{
					display: flex;
					align-items: center;
				}
				view:first-child{
					margin-left: 115upx;
				}
				.follow-left{
					font-weight: bold;
					font-family: PingFang SC;
				}
				.fans-right{
					margin-left: 10upx;
					margin-right: 20upx;
					font-weight: 300;
					color: #808080;
					font-size: 22upx;
					font-family: PingFang SC;
				}
			}
		}
	}
</style>
