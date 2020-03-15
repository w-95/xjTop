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
			}
		},
		computed: {
			...mapState(['auth'])
		},
		created(){
			if(this.isShowFollow){
				this.isFollow()
			}
		},
		methods: {
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
				uni.navigateTo({
					url: '../followTab/index?id='+this.authData.articleAuthorId
				})
			},
			addFollow(type){
				let params = {
					userId: this.auth.userId,
					followedUserId: this.authData.articleAuthorId
				}
				http.follow(params).then(data => {
					if(type == 'add'){
						this.isAddFollow = true;
						uni.showToast({
							title: '关注成功',
							mask: true,
							duration: 1500
						})
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
