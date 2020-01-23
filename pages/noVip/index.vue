<template>
	<view class="box">
		<view class="logo">
			<image src="../../static/images/vip.png" mode=""></image>
			<view class="">
				您还未开通对应领域会员，不能发布消息
			</view>
		</view>
		<view class="musin">
			<view class="title">领域权益</view>
			<view class="tips-box">
				<view class="box-left">
					<image src="../../static/images/mao.png" mode=""></image>
					发布信息
				</view>
				<view class="box-right">
					<image src="../../static/images/tips.png" mode=""></image>
					回复信息
				</view>
			</view>
			<view class="phone">
				
				<view class="tips-box">
					<view class="box-left" @click="goDial">
						<image src="../../static/images/phone.png" mode=""></image>
						<view class="title">联系客服</view>
					</view>
				</view>
			</view>
		</view>
		<button type="primary" @click='openVip' class='open-vip-btn'>申请开通</button>
	</view>
</template>

<script>
	import http from '../../utils/http.js';
	export default {
		data() {
			return {
				phone: '13006617634',
				userData: {}
			}
		},
		onLoad(e){
			this.userData = e
			uni.showToast({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			
			uni.setNavigationBarTitle({
			    title: '开通领域权限' 
			})
			uni.hideToast()
		},
		methods:{
			goDial(){
				let that = this
				uni.makePhoneCall({
				 	// 手机号
				    phoneNumber: that.phone, 
				
					// 成功回调
					success: (res) => {
						console.log('调用成功!')	
					},
				
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
					
				  });
			},
			// 是否申请过
			isResetDomain(){
				let that = this;
				if(JSON.stringify(this.userData) != '{}'){}
				let params = {
					userId: this.userData.uid,
					title: that.userData.title
				}
				http.getUserDiction(params).then(data => {
					console.log(data)
				})
			},
			//权限申请
			openVip(){
				if(JSON.stringify(this.userData) != '{}'){
					let params = {
						userId: this.userData.uid,
						domainId: this.userData.oid,
						type: 1
					}
					http.getAddDomain(params).then(res =>{
						console.log(res)
						uni.showToast({
							title: '申请成功!',
							icon: 'none'
						})
						uni.navigateTo({
							url: '../myData/index?id='+this.userData.uid+'&typeid=3'
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 600upx;
		margin: 0 auto;
		font-size: 24upx;
		.logo{
			text-align: center;
			image{
				width: 150upx;
				height: 150upx;
				margin-top: 100upx;
			}
			view{
				color: #7A7A7A;
				font-size: 32upx;
				margin-top: 50upx;
				font-weight: bold;
			}
		}
		.musin{
			width: 600upx;
			border: 1px solid #E6E6E6;
			margin-top: 50upx;
			border-radius: 10upx;
			.title{
				font-size: 28upx;
				font-weight: bold;
				margin: 20upx 20upx;
				color: #5F5F5F;
			}
			.phone{
				width: 100%;
				border-right: 1px solid #E6E6E6;
				border-bottom-right-radius: 10upx;
				// padding: 15upx 0upx;
				margin-top: 20upx;
				background-color: #E6E6E6;
				.title{
					font-size: 28upx;
					font-weight: bold;
					margin: 20upx 0;
					color: #5F5F5F;
				}
				.box-left,.box-right{
					display: flex;
					align-items: center;
					font-size: 35upx;
					color: #919191;
					font-weight: bold;
					image{
						width: 50upx;
						height: 50upx;
						margin-right: 20upx;
					}
				}
			}
			.tips-box{
				width: 560upx;
				display: flex;
				justify-content: space-around;
				padding: 0 20upx;
				.box-left,.box-right{
					color: #919191;
					display: flex;
					align-items: center;
					image{
						width: 35upx;
						height: 35upx;
						margin-right: 20upx;
					}
				}
			}
		}
		
		.open-vip-btn{
			font-size: 24upx;
			margin-top: 50px;
			width:100%;
			padding: 10rpx 0;
			text-align:center;
			background-color: #2EE3A5;
		}
	}
</style>
