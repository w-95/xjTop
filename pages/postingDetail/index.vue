<template>
	<view class="box">
		<view class='posting' v-if="showTemplate">
			<view class='title'>
				  <!--  -->
				<view class="title-logo" v-if="params.articleStick && params.articleStick!==0">
					置顶
				</view>
				<text :class="(params.articleStick && params.articleStick!==0) ? 'text' : 'text-a'">{{params.articleTitle}}</text>
				<!-- <view class="title-content"></view> -->
			</view>
			<view class='tips'>
				<view class='left' @click='goAddFollow'>
					<view class='logo'>
						<image :src="params.articleAuthor.userAvatarURL != ''? params.articleAuthor.userAvatarURL : '../../static/images/login.png'" mode=""></image>
					</view>
					
					<text class='name'> {{params.articleAuthor.userName}}&nbsp;</text>
				</view>
			</view>
			<view class='city-comment'>
				<view class='left'>
					<text class='position'>{{params.timeAgo}}&nbsp;·&nbsp;{{params.articleCity || '北京'}}</text>
					<view  class='item' v-for="(item,index) in params.articleTagObjs" :key='index'>{{item.tagTitle}}</view>
				</view>
				<view class='right'>
					<text>{{params.articleCommentCount}}回帖</text>
					<text class='view-count'>{{params.articleViewCount}}浏览</text>
				</view>
			</view>
			<view class='img'>
				<view v-if="params.articleContent.textContent" v-html="params.articleContent.textContent" class="text-content"></view>
				<view class="img-box" v-if='params.articleContent.imgArr.length>0'>
					<view class="item" v-for='(i,idx) in params.articleContent.imgArr' :key='idx' @click='ViewImage' :data-url="params.articleContent.imgArr[idx]" :data-imgArr="params.articleContent.imgArr" :data-index='idx'>
						<image :src="i.src" mode="" alt='i.alt' mode="widthFix" ></image>
					</view>
				</view>
			</view>
		</view>
		<view class='comment' v-if='deailDataObj.length>0'>
			<comment :deailData = 'deailDataObj' :type='detail'></comment>
		</view>
		<!-- 无数据 -->
		<!-- <view class="tipsa" v-if="JSON.stringify(params) == '{}'">
			<image src="../../static/images/no_data.png" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>暂无更多数据！</view>
		</view> -->
		<!-- 无评论 -->
		<view class="tipss" v-if="showTemplate && deailDataObj.length == 0 && showCommentTips">
			<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>暂无更多评论!</view>
		</view>
		
		<text class="loading-text" v-if="showLoadType && showTemplate && deailDataObj.length > 0">
			{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
		<!-- <view class='height'></view>  -->
		<view class='bottom'>
			<!-- <view>
				<image src='../../static/images/bulous.png'></image>
				<text>1</text>
			</view> -->
			<view @click='goComment'>
				<image src='../../static/images/comment-a.png'></image>
				<text>{{params.articleCommentCount}}</text>
			</view>
			<view @click='goList'>
				<image src='../../static/images/report.png'></image>
				<text>举报</text>
			</view>
		</view>
		<view class='btn'></view>
	</view>
</template>

<script>
	import PostingDetail from '../../common/data/d1.js';
	import comment from '../../components/comment/index.vue'
	import http from '../../utils/http.js';
	import time from '../../utils/validate.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				params: {},
				deailDataObj: [],
				oId: '',
				page: 1,
				size: 10,
				//底部记载状态区分
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				//底部加载状态的内容
				contentText: {
				    contentdown:'加载更多中...', //0
				    contentrefresh: '正在加载...', //1
				    contentnomore: '没有更多数据了' //else
				},
				//是否显示底部加载状态
				showLoadType: true,
				//是否显示暂无评论提示
				showCommentTips: false,
				//是否显示模板
				showTemplate: false,
				//评论也得标题
				setCommentTitle: '',
				photos: [],
			}
		},
		components: {comment},
		created(){},
		computed: {
			...mapState(['province','oIdVal','isDetails','auth']),
		},
		onLoad(e){
			this.setCommentTitle =e.title
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.oId = e.id
			uni.setNavigationBarTitle({
			    title: e.title
			})
			this.setOidVal(e.id)
			this.getDetail(e.id)
		},
		mounted(){},
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
			that.getCommentList('load')
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
			this.getCommentList('refresh')
		},
		onShow(){
			if(this.oIdVal != ''){
				this.oId =this.oIdVal
				this.getDetail(this.oId)
			}
		},
		methods: {
			...mapMutations(['setOidVal','setIsDetails','setDetailAuthData']),
			ViewImage(e) {
				let arr = []
				for(let i of e.currentTarget.dataset.imgarr){
					arr.push(i.src)
				}
				uni.previewImage({
					urls: arr,
					current: arr[e.currentTarget.dataset.index]
				});
			},
			goAddFollow(){
				if(this.params.articleAuthorId){
					this.params.articleAuthor.userUpdateTime = time.formatTime(this.params.articleAuthor.userUpdateTime,"Y-M-D h:m:s")
					this.setDetailAuthData(this.params)
					uni.navigateTo({
						url: '../addFollow/index'
					})
				}
			},
			resetParams(){
				this.page = 1;
				this.size = 10;
				this.loadingType = 0
			},
			//评论
			goComment(){
				let that = this;
				if(that.auth != null && that.auth.userId){
					let params = {
						userId: that.auth.userId,
						domainURI: that.params.articleTags
					}
					http.getUserDiction(params).then(data => {
						if(data.isExpired){
							uni.navigateTo({
								url: '../noVip/index'
							})
						}else {
							that.setOidVal(that.oId)
							uni.navigateTo({
								url: '../comment/index?id='+ that.oId+'&articleAuthorId='+that.params.articleAuthorId+'&title='+that.setCommentTitle
							})
						}
					})
				}else {
					that.setIsDetails(true)
					uni.showToast({
						title: '请先登录!',
						icon: 'none',
						duration: 1500
					})
					uni.navigateTo({
						url: '../login/index'
					})
				}
			},
			//举报
			goList() {
				let that = this;
				if(that.auth!= null && that.auth.userId){
					uni.navigateTo({
						url: '../list/index?reportDataType=0&Id='+that.params.articleAuthorId
					})
				}else {
					uni.showToast({
						title: '请先登录!',
						icon: 'none',
						duration: 1500
					})
					uni.navigateTo({
						url: '../login/index'
					})
				}
			},
			//获取详情
			getDetail(oId){
				let that = this;
				http.getListDetail({articleId: oId}).then(data =>{
					let obj = {
						isImg: false,
						imgArr: [],
						textContent: ''
					},arr = [];
					arr = data.articleContent.split('!')
					for(let j = 0;j< arr.length;j++){
						if(arr[j].indexOf('http') !== -1){
							let left = arr[j] .indexOf('[');
							let right = arr[j] .indexOf(']');
							let content = arr[j].substr(left + 1, right - left - 1)
							let left_src = arr[j] .indexOf('(');
							let right_src = arr[j] .indexOf(')');
							let src = arr[j].substr(left_src + 1, right_src - left_src - 1)
							obj.isImg = true
							obj.imgArr.push({
								src: src,
								alt: content
							})
						}else {
							obj.isImg = false
							obj.textContent = obj.textContent+arr[j].replace(/(\r\n|\n|\r|↵)/gm, '<br/>')
						}
					}
					data.articleContent = obj
					that.params = data
					that.showTemplate = true
					that.getCommentList('init')
				})
			},
			getCommentList(type){
				let params = {
					articleId: this.oId,
					pageNum: this.page,
					pageSize: this.size
				},that = this;
				http.getComments(params).then(data =>{
					// this.showComment = true
					// this.deailDataObj = data
					// uni.hideToast()
					if(type == 'init') { //初始化
						that.deailDataObj = data
						if(data.length == 0){
							that.showCommentTips = true
							that.loadingType = 2
						}else if(data.length > 0 && data.length < 10){
							that.loadingType = 2
						}
						//少于7条数据不显示加载更多字段
						// else if(that.deailDataObj.length < 10){
						// 	that.showLoadType = false
						// }
						uni.hideLoading()
					}else if(type == 'refresh'){ //下啦刷新
						that.deailDataObj = data
						if(data.length == 0){
							that.showCommentTips = true
						}else if(data.length > 0 && data.length < 10){
							that.loadingType = 2
						}
						uni.hideLoading()
						uni.showToast({
							title: '已经是最新了',
							mask: true,
							icon: 'success',
							duration: 1500
						})
						uni.stopPullDownRefresh();
						uni.hideNavigationBarLoading();
					}else if(type == 'load'){
						if(data.length == 0){
							that.showCommentTips = true
							that.loadingType = 2
							uni.hideNavigationBarLoading();
							uni.hideLoading()
							return false
						}else {
							that.deailDataObj = that.deailDataObj.concat(data)
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
	.box{
		width: 750upx;
		box-sizing: border-box;
		overflow: hidden;
		.title{
			width: 100%;
			display: flex;
			line-height: 50upx;
			box-sizing: border-box;
			padding: 20upx 20upx;
			.title-logo{
				font-family:PingFang SC;
				font-size: 24upx;
				background-color: #FFF2F3;
				color:#F94059;
				border-radius: 10upx;
				min-width: 80upx;
				text-align: center;
				height: 50upx;
				line-height: 50upx;
				margin-right: 20upx;
				position: absolute;
			}
			.title-content{
				width: 575upx;
				
				font-family:PingFang SC;
				font-weight: bold;
				font-size: 28upx;
				margin-left: 20upx;
			}
			.text{
				font-family:PingFang SC;
				font-weight: bold;
				font-size: 32upx;
				text-indent: 100upx;
			}
			.text-a{
				font-family:PingFang SC;
				font-weight: bold;
				font-size: 32upx;
				margin-left: 20upx;
			}
		}
		.city-comment{
			font-family:PingFang SC;
			display: flex;
			justify-content: space-between;
			font-size: 20upx;
			align-items: center;
			box-sizing: border-box;
			padding: 20upx 20upx;
			.left{
				width: 550upx;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 0 0 20upx;
				image{
					width: 30upx;
					height: 30upx;
					
				}
				.name{
					color: #6999D1;
					font-family:PingFang SC;
					font-weight: bold;
					font-size:24upx;
					margin-right: 20upx;
					max-width: 500upx;
				}
				.position{
					color: #999999;
					font-size:24upx;
					font-family:PingFang SC;
					margin-right: 20upx;
					min-width:200upx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.item{
					font-family:PingFang SC;
					box-sizing: border-box;
					padding:10upx;
					border: 1px solid #F0F0F0;
					border-radius: 10upx;
					text-align: center;
					display: flex;
					align-items: center;
					background-color: #F7F7F7;
					max-width: 150upx;
					height: 40upx;
					align-items: center;
					font-size: 20upx;
					color: #888888;
					font-family:PingFang SC;
					font-weight:400;
				}
			}
			.right{
				display: flex;
				padding: 0 20upx 0 0;
				justify-content: space-between;
				box-sizing: border-box;
				max-width: 200upx;
				font-family:PingFang SC;
				font-size: 20upx;
				color: #888888;
				font-family:PingFang SC;
				.view-count{
					margin-left: 10upx;
				}
			}
		}
		.tips{
			font-family:PingFang SC;
			display: flex;
			justify-content: space-between;
			font-size: 20upx;
			align-items: center;
			box-sizing: border-box;
			padding: 20upx 20upx;
			.left{
				width: 550upx;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 0 0 20upx;
				.logo{
					width: 30upx;
					height: 30upx;
					border-radius: 50%;
					margin-right: 10upx;
					overflow: hidden;
					display: flex;
					margin-right: 20upx;
					align-items:center;
					image{
						width: 30upx;
						height: 30upx;
					}
				}
				.name{
					color: #6999D1;
					font-family:PingFang SC;
					font-weight: bold;
					font-size:24upx;
					margin-right: 20upx;
					max-width: 500upx;
				}
				.position{
					color: #999999;
					font-size:24upx;
					font-family:PingFang SC;
					margin-right: 20upx;
					min-width:200upx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.item{
					font-family:PingFang SC;
					box-sizing: border-box;
					padding:10upx;
					border: 1px solid #F0F0F0;
					border-radius: 10upx;
					text-align: center;
					display: flex;
					align-items: center;
					background-color: #F7F7F7;
					max-width: 150upx;
					height: 40upx;
					align-items: center;
					font-size: 20upx;
					color: #888888;
					font-family:PingFang SC;
					font-weight:400;
				}
			}
			.right{
				display: flex;
				padding: 0 20upx 0 0;
				justify-content: space-between;
				box-sizing: border-box;
				max-width: 150upx;
				font-family:PingFang SC;
				font-size: 20upx;
				color: #888888;
				font-family:PingFang SC;
				.view-count{
					margin-left: 10upx;
				}
			}
		}
		.img{
			box-sizing: border-box;
			border-bottom: 1px solid #F0F0F0;
			font-size: 28upx;
			font-family:PingFang SC;
			.img-box{
				border-bottom:30rpx solid rgba(247,247,247,1);
				.item{
					width: 90%;
					margin: 0 auto;
					padding: 20upx 0;
					image{
						width: 100%;
						height: auto;
					}
				}
			}
			.text-content{
				font-family:PingFang SC;
				font-size: 28upx;
				padding: 20upx 40upx;
			}
			
		}
		.loading-text{
			height: 80upx;
			line-height: 80upx;
			font-family:PingFang SC;
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
				font-family:PingFang SC;
				font-size: 30upx;
				font-family:PingFang SC;
				font-weight: bold;
				width: 100%;
			}
		}
		.tipss{
			font-family:PingFang SC;
			text-align: center;
			padding: 153rpx 0;
			image{
				width: 40%;
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
		.height{
			width: 750upx;
			height: 100upx
		}
		.bottom{
			position: fixed;
			border-top: 2px solid #F0F0F0;
			background-color: #fff;
			width:750upx;
			padding: 20upx;
			box-sizing: border-box;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			view{
				font-size: 28upx;
				font-family:PingFang SC;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 50upx;
					height: 50upx;
					margin-right: 10upx;
				}
			}
			
		}
		.btn{
			width: 750upx;
			height: 100upx;
		}
	}
</style>
