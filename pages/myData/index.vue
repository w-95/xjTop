<template>
	<view class="box">
		<view class="logo-box">
			<view class="logo">
				<viwe class='login-new'>
					<view class="user-icon">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view class="user-name">
						<open-data type="userNickName"></open-data>
					</view>
				</viwe>
				<view class="text">加入时间: {{auth.userUpdateTime}}{{activeTitleItem}}</view>
				<view class="my-autograph">
					“走自己的路让别人跟着走”
				</view>
			</view>
		</view>
		<view class="service-and-specil">
			<view class="title-box">
				<view v-for="(t, i) in areaTitleList" :key="t.id" :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'"
					@click="handleColumnTap(t)">
					<text>{{t.label}}</text>
				</view>
			</view>
		</view>
		<view v-if='(postArr.length == 0 && activeTitleItem == 1) || (repliesArr.length == 0 && activeTitleItem == 2)' class='tips-box'>{{activeTitleItem == 1 ? '暂无帖子内容':'暂无回帖内容'}}</view>
		<view class="service-and-specil-a" v-else>
			<view class="service-column-wrapper animated fadeInLeft" v-if="activeTitleItem == 1">
				<Post :deailDataList='postArr' :show=true></Post>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 2">
				<view class='left' v-for='(item,index) in repliesArr' :key='index'>
					<view class='left-box'>
						<view class="icon">
							<image :src="item.commentArticleAuthorThumbnailURL != ''? item.commentArticleAuthorThumbnailURL : '../../static/images/gongren.png'"></image>
						</view>
						<text class="title">{{item.commentArticleAuthorName}} · {{item.commentArticleTitle}}</text>
					</view>
					<view class='content'>
						<view v-html='item.commentContent'></view>
					</view>
				</view>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 3">
				<view class='list-box'>
					<ListBox :listBox='arrData' type='alreadyOpened'></ListBox>
				</view>
			</view>
			<text class="loading-text" v-if='showLoadType'>
				{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
			</text>
		</view>
	</view>
	
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import Post from '../../components/user-post/index.vue'
	import http from '../../utils/http.js'
	import time from '../../utils/validate.js'
	import ListBox from './ownDomain/index.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				list: [],
				userId: '',
				userData : {},
				activeTitleItem: 1,
				arrData:[],
				areaTitleList: [{
					id: 1,
					num: 4,
					label: '帖子'
				},{
					id: 2,
					num: 20,
					label: '回帖'
				},{
					id: 3,
					num: 20,
					label: '会员申请'
				}],
				show: false,
				page: 1,
				size: 10,
				repliesArr: null,
				postArr: null,
				vipTitle: '',
				
				start: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
				    contentdown:'加载更多中...', //0
				    contentrefresh: '正在加载...', //1
				    contentnomore: '没有更多数据了' //else
				},
				showLoadType: true,
			}
		},
		components: {
			Post,comment,ListBox
		},
		onLoad(e) {
			let that = this
			console.log(e)
			if(e.typeid){
				that.activeTitleItem = e.typeid
			}
			console.log(this.activeTitleItem)
			this.userId = e.id
			uni.showToast({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			uni.setNavigationBarTitle({
			    title: '我的' 
			})
			this.getUserArticles(that.activeTitleItem)
		},
		created(){},
		onReady() {},
		computed: {
			...mapState(['province', 'auth']),
		},
		onShow() {},
		methods: {
			...mapMutations(['setAuth']),
			commentItem(){
				
			},
			// 下拉刷新
			onPullDownRefresh() {
				this.start = 'top'
				this.page = 1
				this.size = 10
				uni.showNavigationBarLoading();
				if(this.activeTitleItem == 1){
					this.getUserArticles(this.activeTitleItem)
				}else if(this.activeTitleItem == 2){
					this.getUserComments(this.activeTitleItem)
				}
				uni.showToast({
					title: '已经是最新了',
					mask: true,
					icon: 'success',
					duration: 1500
				})
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			},
			// 上拉加载
			onReachBottom: function() {
				uni.showLoading({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				})
				let _self = this
				console.log(_self.activeTitleItem)
				if (_self.loadingType != 0) {//loadingType!=0;直接返回
					uni.hideLoading()
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading();//显示加载动画
				_self.page++
				let params = {
					userId: this.userId,
					pageNum: _self.page,
					pageSize: _self.size
				}
				if(_self.activeTitleItem == 1){
					http.getUserArticles(params).then(data => {
						if(data.length == 0){
							_self.loadingType = 2;
							uni.hideNavigationBarLoading();//关闭加载动画
							uni.hideLoading()
							return false
						}
						_self.postArr = _self.postArr.concat(data)
						_self.loadingType = 0;//将loadingType归0重置
						uni.hideNavigationBarLoading()
						uni.hideLoading()
						uni.hideToast()
					})
				}else if(_self.activeTitleItem == 2){
					http.getUserArticles(params).then(data => {
						if(data.length == 0){
							_self.loadingType = 2;
							uni.hideNavigationBarLoading();//关闭加载动画
							uni.hideLoading()
							return false
						}
						if(data.length<=5){
							_self.showLoadType = false
						}
						_self.repliesArr = _self.repliesArr.concat(data)
						_self.loadingType = 0;//将loadingType归0重置
						uni.hideNavigationBarLoading()
						uni.hideLoading()
						uni.hideToast()
					})
				}else if(_self.activeTitleItem == 3){
					uni.hideLoading()
					_self.loadingType = 3
				}
			},
			setUserData(data){
				this.setAuth(data)
			},
			//获取用户回帖列表
			getUserComments(id){
				let params = {
					userId: this.userId,
					pageNum: this.page,
					pageSize: this.size
				}
				http.getUserComments(params).then(data => {
					if(data.length<=5){
						this.showLoadType = false
						this.loadingType = 2
					}
					this.repliesArr = data
					uni.hideToast()
					this.activeTitleItem = id
				})
			},
			//获取用户帖子列表
			getUserArticles(id){
				let params = {
					userId: this.userId,
					pageNum: this.page,
					pageSize: this.size
				}
				if(id == 3){
					this.ownDomain(id)
				}else{
					http.getUserArticles(params).then(data => {
						if(data.length > 0 && data.length< 10){
							this.loadingType = 2
						}
						this.postArr = data
						uni.hideToast()
						this.activeTitleItem = id
					})
				}
				
			},
			ownDomain(id){
				let that = this
				uni.getStorage({
					key: "userId",
					success(res){
						http.getOwnDomain({userId:res.data}).then(res => {
							let arr = []
							if(res.length > 0){
								if(res.length > 0 && res.length< 10){
									that.loadingType = 2
								}
								arr = res.sort(function(a,b){return b.userCreateTime-a.userCreateTime})
								for(let i of arr){
									i.userCreateTime = time.formatTime(i.userCreateTime,"Y-M-D h:m:s")
									i.userEndTime = time.formatTime(i.userEndTime,"Y-M-D h:m:s")
								}
							}
							that.arrData = arr
							console.log(that.arrData)
						})
						uni.hideToast()
						that.activeTitleItem = id
					},fail(err){
						uni.navigateTo({
							url: '../login/index'
						})
					}
				})
			},
			handleColumnTap(item){
				uni.showToast({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				})
				this.page = 1
				this.size = 10
				this.start = ''
				this.loadingType = 0
				if(item.id == 1){
					this.getUserArticles(item.id)
				}else if(item.id == 2) {
					this.getUserComments(item.id)
				}else if(item.id == 3) {
					this.ownDomain(item.id)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		.tips-box{
			box-sizing: border-box;
			width: 750upx;
			height: 400upx;
			font-size: 28upx;
			text-align: center;
			display: flex;
			justify-content:center;
			align-items: center;
			font-weight: bold;
		}
		.logo-box{
			// background-image: url('../../static/images/timg.jpg');
			// background-size: 100% 100%;
			height: 370upx;
			background-color: #007BFB;
			border: 1px solid  #007BFB;
			// border-radius: 50%;
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
					button {
						margin-left: 20upx;
						font-size: 28upx;
						background: none;
						color: blue;
						left: 225upx;
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
					}
					.my-autograph{
						background-color: white;
						width: 90%;
						text-align: center;
						font-size: 30upx;
						font-weight: bold;
					}
				}
			}
			
		
		@keyframes fadeInRight {
			from {
				opacity: 0;
				-webkit-transform: translate3d(100%, 0, 0);
				transform: translate3d(100%, 0, 0);
			}
			to {
				opacity: 1;
				-webkit-transform: translate3d(0, 0, 0);
				transform: translate3d(0, 0, 0);
			}
		}
		
		.fadeInRight {
			-webkit-animation-name: fadeInRight;
			animation-name: fadeInRight;
		}
		@keyframes fadeInLeft {
			from {
				opacity: 0;
				-webkit-transform: translate3d(-100%, 0, 0);
				transform: translate3d(-100%, 0, 0);
			}
		
			to {
				opacity: 1;
				-webkit-transform: translate3d(0, 0, 0);
				transform: translate3d(0, 0, 0);
			}
		}
		
		.fadeInLeft {
			-webkit-animation-name: fadeInLeft;
			animation-name: fadeInLeft;
		}
	}
	.loading-text{
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.list-box{
		padding: 0 20upx;
		box-sizing: border-box;
	}
	.service-and-specil {
		background-color: white;
		width: 90%;
		margin: 0 auto;
		margin-top: 0upx;
		box-sizing: border-box;
		padding: 0 20upx;
		.title-box {
			width: 100%;
			display: flex;
			padding: 0 32upx;
			box-sizing: border-box;
			margin-bottom: 10upx;
			display: flex;
			justify-content: space-between;
			.title-item {
				font-size: 32upx;
				font-weight: 600;
				color: #656565;
				padding-bottom: 14upx;
				line-height: 45upx;
				&.active {
					font-size: 30upx;
					color: #333333;
					border-bottom: 3px #007BFB solid;
				}
				&:first-child {
					// margin-right: 62upx;
				}
			}
		}
		.service-column-wrapper {
			width: 100%;
			border-top: 1px solid #EEEEEE;
			box-sizing: border-box;
			padding: 0 20upx;
			.column-box {
				width: 686upx;
				padding: 24upx 36upx 56upx 36upx;
				border-radius: 8px;
				box-sizing: border-box;
				border: 1px solid rgba(151, 151, 151, 0.2);
				margin-bottom: 24upx;
				box-shadow: -2upx 12upx 20upx -16upx rgba(0, 0, 0, .2);
				.title {
					display: flex;
					.icon {
						width: 50upx;
						height: 50upx;
						flex: 0 0 50upx;
						display: inline-block;
					}
					.label {
						margin-left: 20upx;
						font-size: 34upx;
						font-weight: 500;
						flex: 1;
					}
					.right-more {
						font-size: 24upx;
						color: #999999;
						line-height: 56upx;
						image {
							width: 18upx;
							height: 18upx;
							margin-left: 8upx;
						}
					}
				}
				.list-wrapper {
					display: flex;
					flex-wrap: wrap;
					.item {
						flex: 0 0 50%;
						font-size: 28upx;
						margin-top: 36upx;
						font-weight: 400;
						color: #333333;
						box-sizing: border-box;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						&.double {
							border-left: 1upx solid #eeeeee;
							padding-left: 30upx;
						}
					}
				}
			}
		}
	}
	.service-and-specil {
		background-color: white;
		width: 90%;
		margin: 0 auto;
		margin-top: 0upx;
		box-sizing: border-box;
		padding: 0 20upx;
		.title-box {
			width: 100%;
			display: flex;
			padding: 0 32upx;
			box-sizing: border-box;
			margin-bottom: 10upx;
			display: flex;
			justify-content: space-between;
			.title-item {
				font-size: 32upx;
				font-weight: 600;
				color: #656565;
				padding-bottom: 14upx;
				line-height: 45upx;
				&.active {
					font-size: 30upx;
					color: #333333;
					border-bottom: 3px #007BFB solid;
				}
				&:first-child {
					margin-right: 0upx;
				}
			}
		}
		.service-column-wrapper-a {
			width: 100%;
			border-top: 1px solid #EEEEEE;
			box-sizing: border-box;
			.column-box {
				width: 686upx;
				padding: 24upx 36upx 56upx 36upx;
				border-radius: 8px;
				box-sizing: border-box;
				border: 1px solid rgba(151, 151, 151, 0.2);
				margin-bottom: 24upx;
				box-shadow: -2upx 12upx 20upx -16upx rgba(0, 0, 0, .2);
				.title {
					display: flex;
					.icon {
						width: 50upx;
						height: 50upx;
						flex: 0 0 50upx;
						display: inline-block;
					}
					.label {
						margin-left: 20upx;
						font-size: 34upx;
						font-weight: 500;
						flex: 1;
					}
					.right-more {
						font-size: 24upx;
						color: #999999;
						line-height: 56upx;
						image {
							width: 18upx;
							height: 18upx;
							margin-left: 8upx;
						}
					}
				}
				.list-wrapper {
					display: flex;
					flex-wrap: wrap;
					.item {
						flex: 0 0 50%;
						font-size: 28upx;
						margin-top: 36upx;
						font-weight: 400;
						color: #333333;
						box-sizing: border-box;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						&.double {
							border-left: 1upx solid #eeeeee;
							padding-left: 30upx;
						}
					}
				}
			}
		}
	}
	.animated {
		-webkit-animation-duration: .3s;
		animation-duration: .3s;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
		.left{
			padding: 40upx 20upx;
			border-bottom: 20rpx solid #f7f7f7;
			.left-box{
				margin-left: 10upx;
				display: flex;
				align-items: center;
				color: #656565;
				font-size: 24upx;
				box-sizing: border-box;
				.icon{
					width: 30upx;
					height: 30upx;
					border: 1px solid white;
					border-radius: 50%;
					margin-right: 15upx;
					overflow: hidden;
					image{
						width: 30upx;
						height: 30upx;
					}
				}
			}
			.toast{
				height: 60rpx;
				width: 250upx;
				position: relative;
				display: table;
				text-align: center;
				border-radius: 5px;
				background-color: #000;
				opacity: 0.7;
				top: -57upx;
				left: 380upx;
				color: white;
				font-size: 24upx;
				padding: 10upx 10upx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				float: left;
				view{
					display: flex;
					align-items:center;
					justify-content: space-between;
				}
				image{
					width:40upx;
					height: 40upx;
					margin-right: 10upx;
				}
			}
			.toast:after{
				content: '';
				display: block;
				width: 0;
				height: 0;
				border: 6px solid transparent;
				position: absolute;
				top: 9px;
				border-left: 8px solid #000;
				right: -14px;
		
			}
			.content{
				display: flex;
				align-items: center;
				font-size: 28upx;
				box-sizing: border-box;
				word-wrap:break-word; 
				word-break:break-all;
				overflow: hidden;
				margin-left: 60upx;
				padding: 0 30upx 0 20upx;
				justify-content: space-between;
				image{
					transform:rotate(90deg);
					width: 60upx;
					height: 60upx;
				}
			}
		}
	}
</style>
