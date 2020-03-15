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
	@import "@/styles/field-tab.scss";
</style>
