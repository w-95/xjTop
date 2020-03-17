<template>
	<view class="page index-page" v-if='show'>
		<view class="box">
			<icon type="search" size="15" color='#999999'></icon>
			<input class="uni-input" confirm-type='search' placeholder="搜索" @input ="changeInput" @click='getFocus' :focus="false" disabled=true/>
			<!-- <button type="primary" @click='goMember' class='juris-diction-btn' v-if="auth!=null && auth.userRole == 'adminRole'">管理员</button> -->
			<button type="primary" @click='goMember' class='juris-diction-btn'>管理员</button>
		</view>
		<view class="title" v-if="doMainData.length > 0">
			<view></view>
			领域分类
		</view>
		<view class="banner"  v-if="doMainData.length > 0">
			<view class="item" v-for="(item,index) in doMainData" :key='index' @click="detail(item)">
				<view class='child'>
					<image :src="item.domainIconPath" mode="widthFix"></image>
				</view>
				<text>{{item.domainTitle}}</text>
				<view class='dot' v-if='item.isNews'></view>
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
			<view class='dot' v-show='showSystemDot'></view>
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
				isInitLoading: true,
				//进入领域的时间戳
				itemFieldTime: {
					shoesFactory: {      //高端鞋厂
						time: '',
						title: '高端鞋厂'
					},
					shoesMaterial: {     //鞋材企业
						time: '',
						title: '鞋材企业'
					},
					shoesMachine: {      //鞋机企业
						time: '',
						title: '鞋机企业'
					},
					machining: {         //外协加工
						time: '',
						title: '外协加工'
					},
					foreignTrade: {      //外贸公司
						time: '',
						title: '外贸公司'
					},
					wholesale: {         //国内批发
						time: '',
						title: '国内批发'
					},
					onlineRetailers: {   //电商
						time: '',
						title: '电商'
					},
					stock: {             //库存买卖
						time: '',
						title: '库存买卖'
					},
					personnel: {  //技术人才
						time: '',
						title: '技术人才'
					}      
				},
				showSystemDot: false
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
			// that.getIndexParams('load')
		},
		onReady() {},
		computed: {
			...mapState(['province', 'auth']),
			systemDot() {
				let that = this;
				if(this.auth != null && this.auth.userId){
					let params = {
						userId: this.auth.userId
					}
					http.getRootUserMessage(params).then(res => {
						that.searchSystemNews(res[res.length-1].sendTime)
					})
				}
			}
		},
		onShareAppMessage(res) {
		    return {
				title: '鞋匠帮',
				path: '/pages/index/index'
		    }
		 },
		created(){
			// this.init('init')
		},
		onShow() {
			let that = this
			that.init('init')
			that.newSystemDot()
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
				that.searchDomainNews()
				that.getListName(type)
			},
			newSystemDot() {
				let that = this;
				if(this.auth != null && this.auth.userId){
					let params = {
						userId: this.auth.userId
					}
					http.getRootUserMessage(params).then(res => {
						that.searchSystemNews(res[res.length-1].sendTime)
					})
				}
			},
			//查询是否有新的系统消息
			searchSystemNews(time){
				let that = this;
				uni.getStorage({
					key: "systemNews",
					success(e){
						if(e.data < time){
							that.showSystemDot = true
						}else {
							that.showSystemDot = false
						}
					},
					fail(){
						that.getDomain()	
					}
				})
			},
			//查询领域是否有新帖子
			searchDomainNews(){
				let that = this;
				uni.getStorage({
					key: "domainNews",
					success(e){
						that.itemFieldTime= e.data
						that.getDomain(e.data)
					},
					fail(){
						that.getDomain()	
					}
				})
			},
			//存储每次进入领域的时间戳
			isNews(val){
				let that = this;
				switch(val.domainType) {
				    case '高端鞋厂':
						that.itemFieldTime.shoesFactory.time = val.time
				        break;
				    case '鞋材企业':
				        that.itemFieldTime.shoesMaterial.time = val.time
				        break;
					case '鞋机企业':
						that.itemFieldTime.shoesMachine.time = val.time
					    break;
					case '外协加工':
					    that.itemFieldTime.machining.time = val.time
					    break;
					case '外贸公司':
						that.itemFieldTime.foreignTrade.time = val.time
				        break;
				    case '国内批发':
				        that.itemFieldTime.wholesale.time = val.time
				        break;
					case '电商':
						that.itemFieldTime.onlineRetailers.time = val.time
					    break;
					case '库存买卖':
					    that.itemFieldTime.stock.time = val.time
					    break;
					case '技术人才':
						that.itemFieldTime.personnel.time = val.time
					    break;
				    default:
				}
				uni.setStorage({
					key: "domainNews",
					data: that.itemFieldTime
				})
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
						// that.newCommenArr = data.articles
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
				// this.getIndexParams(type)
			},
			//领域详情
			detail(e){
				this.isNews({
					domainType: e.domainTitle,
					time: new Date().getTime()
				})
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
								url: '../myData/index?id='+that.auth.userId+'&showSystemDot='+that.showSystemDot
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
					if(data.data.length > 0){
						return true
					}
					return false
				})
				
			},
			//获取领域列表
			getDomain(val){
				let that = this
				http.getUserList({userId: ''}).then(data => {
					if(data.code == 0){
						that.doMainData = data.data
						that.isInitLoading = false
						if(!val){
							for(let i of data.data){
								i.isNews = true
							}
						}else {
							for(let i in val){
								for(let j of data.data){
									if(val[i].title == j.domainTitle && val[i].time == ''){
										j.isNews = true
									}
									if(val[i].title == j.domainTitle && val[i].time!= '' && j.latestTime > val[i].time){
										j.isNews = true
									}
								}
							}
						}
						uni.hideLoading()
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
	@import "@/styles/index.scss";
</style>
