<template>
	<view class='search-box'>
		<view class="box">
			<icon type="search" size="15" color='#999999'></icon>
			<input class="uni-input" confirm-type='search' placeholder="搜索" @input ="changeInput" @click='getFocus' :focus="false" disabled=true/>
			<!-- <button type="primary" @click='goMember' class='juris-diction-btn' v-if="auth!=null && auth.userRole == 'adminRole'">管理员</button> -->
			<button type="primary" @click='goSearch' class='juris-diction-btn'>搜索</button>
		</view>
		<view class="tipss" v-if='userList.length <= 0'>
			<image src="../../static/images/no-comment.png" mode="" mode="widthFix" ></image>
			<view>暂无更多用户列表!</view>
		</view>
		<ListBox :listBox='userList' class='box-list' type='userList' v-else></ListBox>
		<text class="loading-text" v-if='showLoadType && list.length > 0'>
			{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
	</view>
</template>

<script>
	import time from '../../utils/validate.js'
	import http from '../../utils/http.js'
	import listBox from '../memberSearch/listItem/index.vue'
	export default {
		data() {
			return {
				page: 1,
				size: 10,
				userList: [],
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
			listBox,
		},
		
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			uni.setNavigationBarTitle({
			    title: '用户列表' 
			})
			this.init('init')
		},
		onReady() {},
		computed: {
			
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.page = 1
			this.size = 10
			uni.showNavigationBarLoading();
			this.init('refresh');
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
		onShow() {},
		methods: {
			changeInput(){
				
			},
			getFocus(){
				
			},
			goSearch(){
				
			},
			init(item){
				let params = {
					pageNum: this.page,
					pageSize: this.size
				},arr=[],that=this;
				http.getRootUserList(params).then(res =>{
					arr = res.sort(function(a,b){return b.userUpdateTime-a.userUpdateTime})
					for(let i of arr){
						i.userUpdateTime= time.formatTime(i.userUpdateTime,"Y-M-D h:m:s")
					}
					if(item == 'init') { //初始化
						that.userList= arr;
						if(arr.length == 0){
							that.loadingType = 2
						}
						uni.hideLoading()
					}else if(item == 'refresh'){ //下啦刷新
						that.userList= arr
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
						that.userList= that.userList.concat(arr)
						if(arr.length == 0){
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

<style lang='scss' scoped>
	.search-box{
		width: 750upx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		.tipss{
			margin: 0 auto;
			margin-top: 280upx;
			text-align: center;
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
				width: 190upx;
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
		.box-list{
			width: 100%
		}
	}
</style>
