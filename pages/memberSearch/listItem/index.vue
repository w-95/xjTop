<template>
	<view class='box-item'>
		<view v-for='(item,index) in listBox' :key='index' class='list-box' v-if="type == 'apply'">
			<view class='logo-icon'>
				<image :src="item.user.userAvatarURL || item.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='content-item'>
				<view class='title'>
					<text>{{item.user.userName}}</text>
					<view>申请：{{item.userCreateTime}}</view>
					<view class='end'>开通：{{item.userEndTime}}</view>
				</view>
				<view class='title-bom'>
					<text>{{item.domainURI}}</text>
				</view>
			</view>
			<view class='right-item' @click='goOpenArea(item)'>
				去开通
				<image src="../../../static/images/right.png" mode="widthFix"></image>
			</view>
			<view class='right-tong' v-if="type == 'alreadyOpened'">
				<image src="../../../static/images/tong.png" mode="widthFix"></image>
			</view>
			<view class='time'>{{item.sendTime}}</view>
		</view>
		<view v-for='(item,index) in listBox' :key='index' class='list-box' v-if="type == 'alreadyOpened'">
			<view class='logo-icon'>
				<image :src="item.user.userAvatarURL || item.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='content-item'>
				<view class='title'>
					<text>{{item.user.userName}}</text>
					<view>申请：{{item.userCreateTime}}</view>
					<view class='end'>开通：{{item.userEndTime}}</view>
				</view>
				<view class='title-bom'>
					<text>{{item.domainURI}}</text>
				</view>
			</view>
			<view class='right-tong' v-if="type == 'alreadyOpened'">
				<image src="../../../static/images/tong.png" mode="widthFix"></image>
				<!-- <image src="../../../static/images/no-tong.png" mode="widthFix"></image> -->
			</view>
			<view class='time'>{{item.sendTime}}</view>
		</view>
		<button open-type='contact'  session-from='weapp' v-for='(item,index) in listBox' :key='index' class='list-box' v-if="type == 'message'">
			<view class='logo-icon'>
				<image :src="item.user.userAvatarURL || item.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='message message-name'>
				<view>{{item.user.userName}}</view>
				<view class='mesage-text'>{{item.message}}</view>
			</view>
			<view class='time'>{{item.sendTime}}</view>
		</button>
		
		<view v-for='(item,index) in listBox' :key='index' class='list-box' v-if="type == 'userList'">
			<view class='logo-icon'>
				<image :src="item.user.userAvatarURL || item.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='time'>{{item.sendTime}}</view>
			<view class='message'>
				<view>{{item.userName}}</view>
				<view class='mesage-text'>加入时间:{{item.userUpdateTime}}</view>
			</view>
			<view class='right-item' @click='gocontactUsers(item)'>
				联系用户
				<image src="../../../static/images/right.png" mode="widthFix"></image>
			</view>
		</view>
		
		<!-- <view v-for='(item,index) in listBox' :key='index' class='list-box' v-if='true'>
			<view class='logo-icon'>
				<image :src="item.user.userAvatarURL || item.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='content-item' v-if="type == 'apply' || type == 'alreadyOpened'">
				<view class='title'>
					<text>{{item.user.userName}}</text>
					<view>申请：{{item.userCreateTime}}</view>
					<view class='end'>开通：{{item.userEndTime}}</view>
				</view>
				<view class='title-bom'>
					<text>{{item.domainURI}}</text>
				</view>
			</view>
			<view class='right-item' v-if="type == 'apply'" @click='goOpenArea(item)'>
				去开通
				<image src="../../../static/images/right.png" mode="widthFix"></image>
			</view>
			<view class='right-tong' v-if="type == 'alreadyOpened'">
				<image src="../../../static/images/tong.png" mode="widthFix"></image>
			</view>
			<view v-if="type == 'message'" class='message'>
				<view>{{item.user.userName}}</view>
				<view class='mesage-text'>{{item.message}}</view>
			</view>
			<view class='time'>{{item.sendTime}}</view>
			<view v-if="type == 'userList'" class='message'>
				<view>{{item.userName}}</view>
				<view class='mesage-text'>加入时间:{{item.userUpdateTime}}</view>
			</view>
			<view class='right-item' v-if="type == 'userList'" @click='gocontactUsers(item)'>
				联系用户
				<image src="../../../static/images/right.png" mode="widthFix"></image>
			</view>
		</view> -->
		<view class='service' @click='goService' v-if="type == 'message'">
			<image src='../../../static/images/tips.png'></image>
			<view>客服</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {}
		},
		props:{
			listBox: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: 'apply'
			}
		},
		components: {},
		onLoad(e) {},
		created(){
			console.log(this.type)
		},
		onReady() {},
		computed: {
			...mapState(['itemDomain']),
		},
		onShow() {},
		methods: {
			...mapMutations(['setItemDomain']),
			goOpenArea(item){
				if(this.type == 'alreadyOpened'){
					return false
				}
				this.setItemDomain(item)
				uni.navigateTo({
					url: '../openArea/index'
				})
			},
			gocontactUsers(item){
				console.log(item)
				uni.navigateTo({
					url: '../contactUsers/index?id='+item.oId+'&name='+item.userName
				})
			},
			goService(){
				console.log(11)
				uni.navigateToMiniProgram({
				  appId: 'wx277c9f1d194fce2f',
				  path: '',
				  success(res) {
					  console.log(res)
				    // 打开成功
				  },
				  fail(err){
					  console.log(err)
				  },
				  complete(tips) {
					  console.log(tips)
				  }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-item{
		width: 100%;
		box-sizing: border-box;
		.list-box::after{ border: none;}
		.list-box{
			// width: 100%;
			box-sizing: border-box;
			padding: 5upx 35upx;
			display: flex;
			align-items: center;
			justify-content:space-between;
			border-bottom: 1px solid rgba(238,238,238,1);
			background-color:white;
			.logo-icon{
				width: 100upx;
				height: 100upx;
				border-radius: 8upx;
				overflow: hidden;
				image{
					width: 100upx;
					height: auto;
				}
			}
			.content-item{
				width: 60%;
				box-sizing: border-box;
				padding: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title{
					font-family:PingFang SC;
					font-size: 24upx;
					view{
						font-family:PingFang SC;
						font-size: 20upx;
						color: #C3C3C3;
						display: flex;
						justify-content: space-between;
						margin-top: 10upx;
					}
					.end{
						margin-top: 3upx;
					}
				}
				.title-bom{
					font-family:PingFang SC;
					font-size: 24upx;
					min-width: 130upx;
					text-align: center;
				}
			}
			.right-item{
				min-width: 100upx;
				font-family:PingFang SC;
				font-size: 24upx;
				color: #1296db;
				display: flex;
				align-items:center;
				image{
					width: 30upx;
					height: auto;
				}
			}
			.right-tong{
				image{
					width: 50upx;
					height: auto;
				}
			}
			.message-name{
				view{
					text-align: left
				}
			}
			.message{
				width: 60%;
				font-family:PingFang SC;
				font-size: 24upx;
				line-height: 50upx;
				padding: 20upx 0;
				.mesage-text{
					width: 100%;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					color: #C3C3C3;
				}	
			}
			.time{
				font-family:PingFang SC;
				font-size: 24upx;
				color: #C3C3C3;
			}
		}
	}
	.service{
		position: fixed;
		right: 50rpx;
		bottom: 150rpx;
		width: 80rpx;
		font-family: PingFang SC;
		height: 80rpx;
		border: 1px solid #D3D3D3;
		border-radius: 25%;
		font-size: 20rpx;
		text-align: center;
		background-color: white;
		-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.19), inset 0 1px 0 rgba(255, 255, 255, 0.4);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.19), inset 0 1px 0 rgba(255, 255, 255, 0.4);
		image{
			margin: 7rpx 0 0rpx 0;
			width: 40rpx;
			height: 40rpx;
		}
	}
	.kefu{
		width: 100%;
		display: flex;
	}
</style>
