<template>
	<view class='box'>
		<comment :deailData = 'deailDataObj' v-if='showComment' @commentItem='commentItem' :type='commentEntry' @showActive = 'showActive' :fixActiveIndex='fixActiveIndex'></comment>
		<!-- 无评论 -->
		<view class="tipss" v-if="deailDataObj.length == 0 && loadingType == 2">
			<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>暂无更多评论!</view>
		</view>
		<text class="loading-text" v-if='showLoadType && deailDataObj.length != 0'>
			{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
		<view class='height'></view>
		<view class='bottom' :style="{bottom: bottom+ 'px'}">
			<!-- -->
			<textarea class="uni-input" :style="{'height': mheight + 'rpx'}" :adjust-position='false' :show-confirm-bar="false" :fixed='true'  @keyboardheightchange="getKeyHeight" :placeholder = placeholderVal v-model='commentVal' @blur="loseFocus(1)" :focus='showPopupBottom' @linechange='rotChange'></textarea>
			<button type="primary" @click='sendComment()'>评论</button>
		</view>
	</view>
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import http from '../../utils/http.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				//区分组件入口
				commentEntry: 'comment',
				deailDataObj: [],
				articleId: '',
				page: 1,
				size: 10,
				commentVal: '',
				showComment: false,
				showIpt: false,
				itemData: {},
				placeholderVal: '回帖',
				start: 'comment' ,//评论 //reply回复
				//获得焦点的状态
				showPopupBottom: true,
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
				//被评论的信息
				commentAuthorName: '',
				//是否显示暂无评论提示
				showCommentTips: false,
				fixActiveIndex: null,
				bottom: 0,
				locBtm: 0,
				mbtn: 0,
				mheight: 50
			}
		},
		components:{comment},
		onPageScroll(e){
			this.showPopupBottom = false
			this.bottom = 25
			if(this.start == 'reply' && this.commentVal.length == 0){
				this.placeholderVal = '回帖'
				this.start = 'comment'
			}
		},
		created(){
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
		},
		computed: {
			...mapState(['province', 'auth']),
		},
		onLoad(e){
			//获取评论列表的id
			this.articleId = e.id
			uni.setNavigationBarTitle({
			    title: e.title 
			})
			this.init('init')
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
			that.init('load')
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
		methods: {
			//失去焦点
			loseFocus(type){
				this.bottom = 0
				this.showPopupBottom = false
				this.fixActiveIndex = null
				if(this.start == 'reply' && this.commentVal.length == 0){
					this.placeholderVal = '回帖'
					this.start = 'comment'
				}
			},
			//输入框行数发生变化
			rotChange(event){
				if(event.detail.lineCount >=2){
					this.mheight = 75
				}else if (event.detail.lineCount == 1) {
					this.mheight = 40
				}
			},
			showActive(index){
				this.fixActiveIndex = index
			},
			resetParams(){
				this.page = 1;
				this.size = 10;
				this.loadingType = 0
			},
			init(type){
				let params = {
					articleId: this.articleId,
					pageNum: this.page,
					pageSize: this.size
				},that = this;
				http.getComments(params).then(data =>{
					if(type == 'init') { //初始化
						that.deailDataObj = data
						if(data.length == 0){
							that.loadingType = 2
							that.showComment = false
						}else if(that.deailDataObj.length<=7){
							that.showLoadType = false
						}
						that.showComment = true
						uni.hideLoading()
					}else if(type == 'refresh'){ //下啦刷新
						that.deailDataObj = data
						that.showComment = true
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
							that.loadingType = 2
							uni.hideNavigationBarLoading();
							uni.hideLoading()
							return false
						}else {
							that.showComment = true
							that.deailDataObj = that.deailDataObj.concat(data)
							that.loadingType = 0;//将loadingType归0重置
							uni.hideNavigationBarLoading()
							uni.hideLoading()
						}
						
					}
				})
			},
			//获取键盘高度
			getKeyHeight(event){
				this.contentType = event.target.dataset.type
				if(event.detail.height == 0) {
					this.bottom = 0
				}
				this.bottom = event.detail.height,
				this.locBtm = this.bottom
			},
			//发布评论
			sendComment(){
				if(this.commentVal != ''){
					let that = this
					let params = {
						"articleId": that.articleId, //文章id
						"commentContent": that.commentVal, //
						"commentOriginalCommentId": '', //评论id
						"userId": '1575618228865'
					}
					if(that.auth != null && that.auth.userId){
						params.userId = that.auth.userId
						if(that.start == 'reply'){
							params.commentOriginalCommentId = that.itemData.oId
							params.commentContent = '回复:@'+ that.commentAuthorName+ that.commentVal
						}
						http.releaseComment(params).then(data =>{
							uni.showToast({
								title: '添加评论成功',
								mask: true,
								icon: 'success',
								duration: 1500
							})
							that.commentVal = ''
							that.showComment = false
							that.init('init')
						})
					}else {
						uni.showToast({
							title: '请先登录!',
							icon: 'none',
							duration: 1500
						})
					}
				}else {
					uni.showToast({
						title: '请输入内容!',
						icon: 'none',
						duration: 1500
					})
				}
			},
			commentItem(item){
				this.itemData = item
				this.showPopupBottom = true
				this.start = 'reply'
				this.placeholderVal = '回复：@' + item.commentAuthorName
				this.commentAuthorName =  item.commentAuthorName
			}
		}
	}
</script>

<style scoped lang='scss'>
	@import "@/styles/comment.scss";
</style>
