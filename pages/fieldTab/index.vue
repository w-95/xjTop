<template>
	<view class="box-tab">
		<view class="box">
			<icon type="search" size="15" color='#999999'></icon>
			<input class="uni-input" confirm-type='search' placeholder="搜索"  @click='getFocus' :focus="false" disabled=true/>
		</view>
		<view class="service-and-specil">
			<scroll-view scroll-x="true" class="title-box" v-if="areaTitleList.length > 0">
				<block v-for="(t, i) in areaTitleList" :key="t.id">
					<view :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'" @click="handleColumnTap(t,i)">
						<text>{{t.domainTitle}}</text>
					</view>		
				</block>
			</scroll-view>
			<view class="service-column-wrapper animated fadeInLeft" v-if="list.length > 0">
				<Post :deailDataList='list'></Post>
			</view>
		</view>
		<!-- 无数据 -->
		<view class="tipsa" v-if="list.length == 0 && loadingType == 2">
			<image src="../../static/images/no_data.png" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>暂无更多数据！</view>
		</view>
		<text class="loading-text" v-if='showLoadType && list.length > 0'>
			{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
		
		<view class="my-data" @click="goMyDetail">
			<image src="../../static/images/login.png" mode=""></image>
			<view>我的</view>
			<view class='dot'></view>
		</view>
		<view class="is-domain" @click="choiceField">
			<!-- <image src="../../static/images/bianji.png" mode=""></image> -->
		</view>
	</view>
</template>

<script>
	import data from '../../common/data/d1.js';
	import ServerList from '../../common/data/d1.js';
	import Post from '../../components/post/index.vue'
	import http from '../../utils/http.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				list: [],
				activeTitleItem: null,
				areaTitleList: [],
				page: 1,
				size: 10,
				//领域title
				domainTitke: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
				    contentdown:'加载更多中...', //0
				    contentrefresh: '正在加载...', //1
				    contentnomore: '没有更多数据了' //else
				},
				start: '',
				showLoadType: true,
				//是否显示暂无提示
				showTips: false
			}
		},
		components: {
			Post
		},
		onShareAppMessage(res) {
		    return {
				title: '鞋匠帮',
				path: '/pages/index/index'
		    }
		 },
		onLoad(e) {
			let that = this
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.domainTitke = e.domainTitke
			this.getDomainList()
			this.getList('init')
			
		},
		// 下拉刷新
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.page = 1
			this.size = 10
			uni.showNavigationBarLoading();
			this.getList('refresh');
		},
		// 上拉加载
		onReachBottom: function() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			let that = this
			if (that.loadingType != 0) {//loadingType!=0;直接返回
				uni.hideLoading()
				return false;
			}
			that.loadingType = 1;
			uni.showNavigationBarLoading();//显示加载动画
			that.page++
			that.getList('load')
		},
		mounted(){
			
		},
		onReady() {},
		computed: {
			...mapState(['province', 'auth']),
		},
		onShow() {},
		methods: {
			getFocus(){
				uni.navigateTo({
					url: '../search/index'
				})
			},
			//获取tab导航列表
			getDomainList(){
				let that = this
				http.getDomain().then(data => {
					let num = 0
					for(let i of data){
						i.id = num++
					}
					//.reverse()
					that.areaTitleList = data
					for(let i of data){
						if(that.domainTitke == i.domainTitle){
							console.log(i)
							that.activeTitleItem = i.id
						}
					}
					console.log(that.activeTitleItem)
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
			choiceField(){
				let that = this
				if(that.auth != null && that.auth.userId){
					that.getUserDefault(that.auth.userId).then(res =>{
						if(res){
							uni.navigateTo({
								url: '../vip/index?id='+that.auth.userId
							})
						}else{
							uni.navigateTo({
								url: '../choiceField/index?id='+that.auth.userId
							})
						}
					})
				}else {
					uni.navigateTo({
						url: '../login/index'
					})
				}
			},
			//tab导航切换点击
			handleColumnTap(item){
				this.showLoadType = true
				uni.showLoading({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				})
				this.activeTitleItem = item.id
				this.domainTitke = item.domainTitle
				this.resetParams()
				this.getList('init')
				
			},
			//初始化数据
			resetParams(){
				this.list = []
				this.loadingType = 0;
				this.showLoadType = true
				this.componentShow = true
				this.start = ''
				this.page = 1
				this.size = 10
			},
			goMyDetail(){
				let that = this;
				if(that.auth!= null && that.auth.userId){
					that.getUserDefault(that.auth.userId).then(res =>{
						if(res){
							uni.navigateTo({
								url: '../myData/index?id='+that.auth.userId
							})
						}else{
							uni.navigateTo({
								url: '../choiceField/index?id='+that.auth.userId
							})
						}
					})
				}else {
					uni.navigateTo({
						url: '../login/index'
					})
				}
			},
			/**
			 * 拉取数据
			 * @param {Object} item
			 * init 初始化加载   load上拉加载   refresh下拉刷新
			 */
			getList(item) {
				let that = this
				let params = {
					domainURI: that.domainTitke,
					pageNum: that.page,
					pageSize: that.size
				}
				http.getDomainList(params).then(data => {
					if(item == 'init') { //初始化
						that.list = data.articles
						if(data.articles.length == 0){
							that.loadingType = 2
						}else if(that.list.length <= 3){
							that.loadingType = 2
							// that.showLoadType = false
						}
						uni.hideLoading()
					}else if(item == 'refresh'){ //下啦刷新
						that.list = data.articles
						uni.hideLoading()
						uni.showToast({
							title: '已经是最新了',
							mask: true,
							icon: 'success',
							duration: 1500
						})
						uni.stopPullDownRefresh();
						uni.hideNavigationBarLoading();
					}else if(item == 'load'){
						that.list = that.list.concat(data.articles)
						if(data.articles.length == 0){
							that.loadingType = 2
							uni.hideNavigationBarLoading();
							uni.hideLoading()
							return false
						}else {
							that.loadingType = 0;//将loadingType归0重置
							uni.hideNavigationBarLoading()
							uni.hideLoading()
						}
						
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-tab{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		font-family:PingFang SC;
		.box{
			width: 690upx;
			display: flex;
			align-items: center;
			font-family:PingFang SC;
			padding: 10upx;
			.uni-input{
				width: 100%;
				height: 72upx;
				font-size: 24upx;
				border:1px solid rgba(238,238,238,1);
				padding: 0 30upx 0 70upx;
				border-radius:12upx;
				font-family:PingFang SC;
				color:rgba(153,153,153,1);
				background:rgba(246,246,246,1);
			}
			icon{
				position: absolute;
				color: #999999;
				left: 55upx;
			}
		}
		.service-and-specil {
			width: 100%;
			margin-top: 30upx;
			box-sizing: border-box;
			.title-box {
				width: 100%;
				white-space: nowrap; // 滚动必须加的属性
				display: flex;
				padding: 0 32upx;
				box-sizing: border-box;
				font-family:PingFang SC;
				margin-bottom: 10upx;
				display: flex;
				justify-content: space-around;
				::-webkit-scrollbar {
						width: 0;
						height: 0;
						background-color: transparent;
					} 
				.title-item {
					font-size: 28upx;
					margin: 0 25upx;
					display: inline-block;
					font-weight: 600;
					color: #656565;
					font-family:PingFang SC;
					padding-bottom: 14upx;
					line-height: 45upx;
					&.active {
						display: inline-block;
						font-size: 28upx;
						margin: 0 25upx;
						font-family:PingFang SC;
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
	}
	.animated {
		-webkit-animation-duration: .3s;
		animation-duration: .3s;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
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
	
	.my-data{
		position: fixed;
		right: 50upx;
		bottom: 200upx;
		width: 80upx;
		font-family:PingFang SC;
		height: 80upx;
		border: 1px solid #D3D3D3;
		border-radius: 25%;
		font-size: 20upx;
		text-align: center;
		background-color: white;
		// padding: 10upx 10upx;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
		image{
			margin: 7upx 0 0upx 0;
			width: 40upx;
			height: 40upx;
		}
		.dot{
			width: 30upx;
			height: 30upx;
			position: absolute;
			background-image: url('../../static/images/dot.png');
			background-repeat: no-repeat;
			top: -6upx;
			right: 18upx;
		}
	}
	.is-domain{
		// font-family:PingFang SC;
		position: fixed;
		right: 50upx;
		bottom: 80upx;
		width: 80upx;
		height: 80upx;
		border-radius: 25%;
		overflow: hidden;
		box-sizing: border-box;
		font-size: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #2EE3A5;
		background-image: url('../../static/images/bianji.png');
		background-size: 100% 100%;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
		image{
			width: 100%;
			height: 80rpx;
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
	.tipsa{
		margin: 0 auto;
		margin-top: 280upx;
		margin-bottom: 480upx;
		image{
			width: 100%;
			height:auto;
		}
		view{
			width: 750upx;
			margin-top: 50upx;
			text-align: center;
			font-size: 30upx;
			font-family:PingFang SC;
			font-weight: bold;
			width: 100%;
		}
	}
	.tipss{
		margin: 0 auto;
		margin-top: 280upx;
		text-align: center;
		image{
			width: 100%;
			height:auto;
		}
		view{
			width: 750upx;
			margin-top: 50upx;
			text-align: center;
			font-size: 30upx;
			font-family:PingFang SC;
			font-weight: bold;
			width: 100%;
		}
	}
</style>
