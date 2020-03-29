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
			//权限申请
			openVip(){
				let that = this;
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
						that.openMsg()
						uni.navigateTo({
							url: '../myData/index?id='+this.userData.uid+'&typeid=3'
						})
					})
				}
			},
			openMsg() {
			    var that = this;
				if (wx.requestSubscribeMessage) {
					uni.requestSubscribeMessage({
						tmplIds: ['UPKS3vw8D4tv8z4iOU5lvoHx_ViP17rs8HDA4t8DST4'],
						success(res){
							if(res['UPKS3vw8D4tv8z4iOU5lvoHx_ViP17rs8HDA4t8DST4'] === 'accept'){
								uni.openSetting({
									success(res){
										console.log('openSetting的成功回调数据：', res);
										that.guidSubscribeMessageAuthAfter();
									}
								})
							}else if(res['UPKS3vw8D4tv8z4iOU5lvoHx_ViP17rs8HDA4t8DST4'] === 'reject'){
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
							(itemSettings['UPKS3vw8D4tv8z4iOU5lvoHx_ViP17rs8HDA4t8DST4'] === 'accept')
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
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/no-vip.scss";
</style>
