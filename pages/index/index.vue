<template>
	<view class="page index-page" v-if='show'>
		<view class="box">
			<icon type="search" size="15" color='#999999'></icon>
			<input class="uni-input" confirm-type='search' placeholder="搜索" @input ="changeInput" @click='getFocus' :focus="false" disabled=true/>
			<button type="primary" @click='goMember' class='juris-diction-btn' v-if="auth!=null && auth.userRole == 'adminRole'">权限</button>
			<!-- <button type="primary" @click='goMember' class='juris-diction-btn'>权限</button> -->
		</view>
		<view class="title" v-if="doMainData.length > 0">
			<view></view>
			领域分类
		</view>
		<view class="banner"  v-if="doMainData.length > 0">
			<view class="item" v-for="(item,index) in doMainData" :key='index' @click="detail(item)">
				<view>
					<image :src="item.domainIconPath" mode="widthFix"></image>
				</view>
				<text>{{item.domainTitle}}</text>
			</view>
		</view>
		<view class="title" v-if="officeArr.length>0">
			<view></view>
			官方信息
		</view>
		<Post :deailDataList ='officeArr' v-if="officeArr.length>0" :show=false></Post>
		
		<view class="title" v-if="newCommenArr.length > 0">
			<!-- <view></view> -->
			<!-- 最新帖子 -->
		</view>
		<!-- <Post :deailDataList ='newCommenArr' v-if="newCommenArr.length>0" :show = true></Post> -->
		
		<view class="tips" v-if="doMainData.length == 0 && officeArr.length == 0 && newCommenArr.length == 0 && showNullTips && !isInitLoading">
			<image src="../../static/images/no_data.png" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>暂无更多数据！</view>
		</view>
		<text class="loading-text" v-if='showLoadType && (doMainData.length > 0 || officeArr.length > 0 || newCommenArr.length > 0)'>
			{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
		<view class="my-data" @click="goMyDetail">
			<image src="../../static/images/login.png" mode=""></image>
			<view>我的</view>
		</view>
		<view class="is-domain" @click="choiceField">
			<!-- <image src="../../static/images/bianji.png" mode=""></image> -->
		</view>
	</view>
</template>

<script>
	import Post from '../../components/post/index.vue'
	import http from '../../utils/http.js';
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				doMainData : [],
				list: [],
				show: false,
				page: 1,
				size: 10,
				//官方信息数组
				officeArr: [],
				//最新的帖子
				newCommenArr: [],
				//底部记载状态区分
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				//底部加载状态的内容
				contentText: {
				    contentdown:'加载更多中...', //0
				    contentrefresh: '正在加载...', //1
				    contentnomore: '没有更多数据了' //else
				},
				clickNum: 0,
				start: '',
				//是否显示底部加载状态
				showLoadType: true,
				//是否显示暂无数据
				showNullTips: false,
				isInitLoading: true
			}
		},
		components: {
			Post
		},
		// 下拉刷新 refresh
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			uni.showNavigationBarLoading();
			this.resetParams()
			this.init('refresh')
		},
		// 上拉加载
		onReachBottom: function() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			let that = this
			that.loadingType = 2
			if (that.loadingType != 0) {//loadingType!=0;直接返回
				uni.hideLoading()
				return false;
			}
			that.loadingType = 1;
			uni.showNavigationBarLoading();//显示加载动画
			that.page++
			that.getIndexParams('load')
		},
		onReady() {},
		computed: {
			...mapState(['province', 'auth']),
		},
		onShareAppMessage(res) {
		    return {
				title: '鞋匠帮',
				path: '/pages/index/index'
		    }
		 },
		created(){
			this.init('init')
			
		},
		onShow() {
			let that = this
			uni.onNetworkStatusChange(function (res) {
			    if(!res.isConnected) {
					uni.hideLoading()
					uni.showToast({
						title: '当前无网络连接',
						icon: 'none'
					})
					that.showNullTips = true
				}
			});
		},
		methods: {
			init(type){
				let that = this
				uni.setNavigationBarTitle({
				    title: '首页' 
				})
				uni.showLoading({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				});
				that.show = true
				that.getDomain()
				that.getListName(type)
			},
			goMember(){
				let that = this
				that.clickNum+=1;
				if(that.clickNum == 1){
					uni.navigateTo({
						url: '../memberSearch/index'
					})
				}
				setTimeout(function () { that.clickNum = 0 }, 3000);
			},
			resetParams(){
				this.page = 1;
				this.size = 10;
				this.loadingType = 0
			},
			getFocus(){
				uni.navigateTo({
					url: '../search/index'
				})
			},
			/**最新帖子
			 * @param {type} String
			 * init 初始化加载   load上拉加载   refresh下拉刷新
			 */
			getIndexParams(type){
				let params = {
					pageNum: this.page,
					pageSize: this.size
				},that = this;
				http.getIndexComment(params).then(data =>{
					that.isInitLoading = false
					if(type == 'refresh'){
						that.newCommenArr = data.articles
						uni.hideNavigationBarLoading();//关闭动画
						uni.stopPullDownRefresh();//得到数据后停止下拉刷新
						uni.hideLoading()
						if(data.articles.length <= 0){
							this.showNullTips = true
						}else if(data.articles.length > 0 && data.articles.length < 10) {
							that.loadingType = 2
						}
						uni.showToast({
							title: '已经是最新了',
							mask: true,
							icon: 'success',
							duration: 1500
						})
						return false
					}else if(type == 'load') {
						if(data.articles.length <= 0) {
							that.loadingType = 2;
							uni.hideNavigationBarLoading();//关闭加载动画
							uni.hideLoading()
							return false
						}else {
							let arr = that.newCommenArr.concat(data.articles)
							that.$nextTick(() => {
								that.newCommenArr = arr
							})
							if(data.articles.length > 0 && data.articles.length < 10) {
								that.loadingType = 2
							}else {
								that.loadingType = 0;//将loadingType归0重置
							}
							uni.hideNavigationBarLoading()
							uni.hideLoading()
							
						}
					}else {
						uni.hideLoading()
						if(data.articles.length <= 0){
							this.showNullTips = true
							this.loadingType = 2
						}else if(data.articles.length > 0 && data.articles.length < 10) {
							this.loadingType = 2
						}
						that.newCommenArr = data.articles
					}
					
				})
			},
			//首页title
			getListName(type){
				http.getOffice().then(data =>{
					for(let i =0;i<data.length;i++){
						data[i].show = false
					}
					this.officeArr = data
					this.isInitLoading = false
				})
				this.getIndexParams(type)
			},
			//领域详情
			detail(e){
				uni.navigateTo({
					url: '../fieldTab/index?domainTitke='+e.domainTitle
				})
			},
			//我的页面
			goMyDetail(){
				let that = this
				if(that.auth != null && that.auth.userId){
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
			//获取领域列表
			getDomain(){
				let that = this
				http.getUserList({userId: ''}).then(data => {
					if(data.code == 0){
						that.doMainData = data.data
						that.isInitLoading = false
					}
					
				})
			},
			//选择领域
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
		}
	}
</script>

<style lang="scss" scoped>
	.index-page {
		width: 750upx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		.box{
			width: 684upx;
			display: flex;
			margin-top: 30upx;
			align-items: center;
			font-family:PingFang SC;
			padding: 10upx;
			.juris-diction-btn{
				font-size:24upx;
				font-family:PingFang SC;
				margin-left: 20upx;
				width: 140upx;
				height: 72upx;
				line-height: 72upx;
				border: none;
				background-color: #2EE3A5;
			}
			.juris-diction-btn::after{ border: none;} 
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
				font-family:PingFang SC;
				left: 55upx;
			}
		}
		.title{
			width: 100%;
			font-size: 32upx;
			font-family:PingFang SC;
			font-weight: bold;
			padding: 30upx 0 30upx 30upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			view{
				width: 10upx;
				height: 30upx;
				background-color: #42E1A4;
				margin-right: 20upx;
			}
		}
		.tips{
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
				font-size: 40upx;
				font-family:PingFang SC;
				font-weight: bold;
				width: 100%;
			}
		}
		.loading-text{
				height: 80upx;
				line-height: 80upx;
				font-size: 30upx;
				display: flex;
				font-family:PingFang SC;
				flex-direction: row;
				justify-content: space-around;
			}
		.banner{
			width: 660upx;
			padding: 20upx 40upx;
			display: flex;
			font-family:PingFang SC;
			flex-wrap: wrap;
			font-size: 24upx;
			border-bottom: 1px solid #EEEEEE;
			.item{
				width: 25%;
				margin-bottom: 30upx;
				font-family:PingFang SC;
				text-align: center;
				view{
					width: 70%;
					padding: 20upx;
					font-family:PingFang SC;
					box-sizing: border-box;
					background-color: #EEEEEE;
					height: 100upx;	
					margin: 0 auto;
					border-radius: 10upx;
					overflow: hidden;
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 95upx;
						height: auto;
					}
				}
				text{
					color: #666666;
					font-family:PingFang SC;
					display: inline-block;
					padding: 10upx 0;
				}
			}
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
	}
</style>
