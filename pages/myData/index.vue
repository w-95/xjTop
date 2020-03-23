<template>
	<view class="box">
		<titleData :isShowFans='true' :isShowFollow='false' :authData='auth' :isAuth='true' :type="my"></titleData>
		<view class="service-and-specil">
			<view class="title-box">
				<view v-for="(t, i) in areaTitleList" :key="t.id" :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'"
					@click="handleColumnTap(t)">
					<text>{{t.label}}</text>
					<view class='dot' v-if="t.id == 4 && showSystemDot == 'true'"></view>
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
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 3">
				<view class='list-box'>
					<ListBox :listBox='arrData' type='alreadyOpened' v-if="activeTitleItem == 3"></ListBox>
				</view>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 4" :class="[rootMessageList.length > 0 ? 'none' : 'add']">
				<view class='conversation'v-for='(item,index) in rootMessageList' :key='index'>
					<view class='alturl'>
						<image src="http://xjm.cachito.top/FgEr6yw6JES3169ovJ2ZjpxQoete"></image>
					</view>
					<view class='alt-content'>{{item.message}}</view>
				</view>
				
				<view class='phine-server'>
					<button open-type='contact' class='kefu' session-from='weapp'>
						<image src='../../static/images/tips.png'></image>
						联系客服
					</button> 
				</view>
				<view class='add-height'></view>
				
			</view>
			<text class="loading-text" v-if='showLoadType && activeTitleItem != 4'>
				{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
			</text>
		</view>
	</view>
	
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import d1 from '../../common/data/d1.js'
	import Post from '../../components/user-post/index.vue'
	import titleData from '../../components/my-data/index.vue'
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
					label: '领域申请'
				},{
					id: 4,
					num: 20,
					label: '系统消息'
				}],
				show: false,
				page: 1,
				size: 10,
				repliesArr: null,
				postArr: null,
				vipTitle: '',
				showSystemDot: 'false',
				start: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
				    contentdown:'加载更多中...', //0
				    contentrefresh: '正在加载...', //1
				    contentnomore: '没有更多数据了' //else
				},
				showLoadType: true,
				rootMessageList:[],
				my: 'my'
			}
		},
		components: {
			Post,comment,ListBox,titleData
		},
		onLoad(e) {
			console.log(e)
			let that = this
			if(e.typeid){
				that.activeTitleItem = e.typeid;
			}
			if(e.showSystemDot){
				that.showSystemDot = e.showSystemDot
			}
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
			//获取系统消息
			systemMessage(id){
				this.showSystemDot = 'false'
				uni.setStorage({
					key: "systemNews",
					data: new Date().getTime()
				})
				this.activeTitleItem = id;
				let params = {
					userId: this.auth.userId
				},that = this;
				http.getRootUserMessage(params).then(res => {
					that.rootMessageList = res
					uni.hideLoading()
				})
			},
			// 下拉刷新
			onPullDownRefresh() {
				if(this.activeTitleItem != 4){
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
				}
			},
			// 上拉加载
			onReachBottom: function() {
				if(this.activeTitleItem != 4){
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
				if(that.auth!= null && that.auth.userId){
					http.getOwnDomain({userId:that.auth.userId,type:1}).then(res => {
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
				}else {
					uni.navigateTo({
						url: '../login/index'
					})
				}
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
				}else if(item.id == 4){
					this.systemMessage(item.id)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/my-data.scss";
</style>
