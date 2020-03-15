<template>
	<view class="box">
		<titleData :isShowFans='true' :isShowFollow='true' :authData='detailAuthData' :isAuth='false'></titleData>
		<view class="service-and-specil">
			<view class="title-box">
				<view v-for="(t, i) in areaTitleList" :key="t.id" :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'"
					@click="handleColumnTap(t)">
					<text>{{t.label}}</text>
					<view class='dot' v-if='t.id == 4'></view>
				</view>
			</view>
		</view>
		<view v-if='(postArr.length == 0 && activeTitleItem == 1) || (repliesArr.length == 0 && activeTitleItem == 2)' class='tips-box'>{{activeTitleItem == 1 ? '暂无帖子内容':'暂无回帖内容'}}</view>
		<view class="service-and-specil-a" :class="[activeTitleItem == 4 ? 'reset-height' : '']" v-else>
			<view class="service-column-wrapper animated fadeInLeft" v-if="activeTitleItem == 1">
				<Post :deailDataList='postArr' :show=true v-if="activeTitleItem == 1"></Post>
			</view>
			<view class="service-column-wrapper animated fadeInLeft" v-if="activeTitleItem == 2">
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
			<text class="loading-text" v-if='showLoadType && activeTitleItem != 4'>
				{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
			</text>
		</view>
	</view>
	
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import Post from '../../components/user-post/index.vue'
	import titleData from '../../components/my-data/index.vue'
	import http from '../../utils/http.js'
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
				areaTitleList: [{
					id: 1,
					num: 4,
					label: '帖子'
				},{
					id: 2,
					num: 20,
					label: '回帖'
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
			Post,comment,titleData
		},
		onLoad(e) {
			let that = this
			console.log(this.detailAuthData)
			this.userId = this.detailAuthData.articleAuthorId
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
			...mapState(['province', 'auth','detailAuthData']),
		},
		onShow() {},
		methods: {
			...mapMutations(['setAuth']),
			commentItem(){
				
			},
			goFollow(){
				uni.navigateTo({
					url: '../followTab/index'
				})
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
				http.getUserArticles(params).then(data => {
					if(data.length > 0 && data.length< 10){
						this.loadingType = 2
					}
					this.postArr = data
					uni.hideToast()
					this.activeTitleItem = id
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
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/my-data.scss";
</style>
