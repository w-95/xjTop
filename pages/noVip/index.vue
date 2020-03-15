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
	@import "@/styles/no-vip.scss";
</style>
