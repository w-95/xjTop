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
					<button open-type='contact' class='kefu' session-from='weapp'>
						<image src='../../static/images/tips.png'></image>
						联系客服
					</button> 
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
				userData: {},
				
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
		created(){},
		methods:{ 
			//开启订阅消息
			openMsg() {
			    var that = this
			    // 获取用户的当前设置，判断是否点击了“总是保持以上，不在询问”
			    wx.getSetting({
			        withSubscriptions:true,  //是否获取用户订阅消息的订阅状态，默认false不返回
					success(res) {
						console.log(res)
						if(res.authSetting['scope.subscribeMessage']) { //用户点击了“总是保持以上，不再询问”
							uni.openSetting({ // 打开设置页
								success(res) {
									// that.setCloud()
								}
							});
						}else { // 用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息
							var templateid = that.setting.templateid.map(item => item.tempid)
							uni.requestSubscribeMessage({
								tmplIds: ['KohP-FGpzCeJNYdw9xrn9ru1ojglnmnEzNzHpxMDUBM','UPKS3vw8D4tv8z4iOU5lvoHx_ViP17rs8HDA4t8DST4'],
								success (res) { 
									console.log(res)
								},
								fail (res) {  
									console.log("fail:"+res);  
								 },  
								 complete (res) {  
									 console.log("complete:"+res);  
								 }  
							})
						}
					}
			    })
			},
			//权限申请
			openVip(){
				this.openMsg()
				if(JSON.stringify(this.userData) != '{}'){
					let params = {
						userId: this.userData.uid,
						domainId: this.userData.oid,
						type: 1
					}
					http.getAddDomain(params).then(res =>{
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
