<template>
	<view class="box">
		<view class="service-and-specil">
			<view class="title-box">
				<view v-for="(t, i) in areaTitleList" :key="t.id" :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'"
					@click="handleColumnTap(t)">
					<text>{{t.label}}</text>
				</view>
			</view>
		</view>
		<view class="service-and-specil">
			<!-- <input class="uni-input" confirm-type='search' placeholder="请输入用户昵称"/> -->
			<view class="service-column-wrapper animated fadeInLeft" v-if="activeTitleItem == 1">
				<view class="tipss" v-if='arrData.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多申请列表!</view>
				</view>
				<ListBox :listBox='arrData' type='apply' v-else></ListBox>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 2">
				<view class="tipss" v-if='arrData.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多开通列表!</view>
				</view>
				<ListBox :listBox='arrData' type='alreadyOpened' v-else></ListBox>
			</view>
		</view>
	</view>
	
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import Post from '../../components/user-post/index.vue'
	import ServerList from '../../common/data/d1.js';
	import http from '../../utils/http.js'
	import time from '../../utils/validate.js'
	import ListBox from './listItem/index.vue'
	export default {
		data() {
			return {
				activeTitleItem: 1,
				areaTitleList: [{
					id: 1,
					num: 4,
					label: '申请列表'
				},{
					id: 2,
					num: 20,
					label: '已开通列表'
				}],
				DomainType: 1,
				arrData:[],
			}
		},
		components: {
			Post,comment,ListBox
		},
		onLoad(e) {
			if(e.type){
				this.activeTitleItem = e.type
				this.DomainType = 0
			}
			this.init(this.DomainType)
		},
		created(){
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			uni.setNavigationBarTitle({
			    title: '领域查询' 
			})
		},
		onReady() {},
		computed: {},
		onShow() {
			this.init(this.DomainType)
		},
		methods: {
			init(type){
				let that = this,arr=[];
				http.getApplyDomains({type:type}).then(data => {
					if(type == 1) {
						arr = data.sort(function(a,b){return a.userCreateTime-b.userCreateTime})
					}else {
						arr = data.sort(function(a,b){return a.userCreateTime-b.userCreateTime})
					}
					if(data.length > 0){
						for(let i of arr){
							i.userCreateTime = time.formatTime(i.userCreateTime,"Y-M-D h:m:s").substring(5);
							if(i.userEndTime){
								i.userEndTime = time.formatTime(i.userEndTime,"Y-M-D h:m:s").substring(5);
							}
						}
					}
					that.arrData = arr || []
					uni.hideLoading()
				})
			},
			// 下拉刷新
			onPullDownRefresh() {
				
			},
			// 上拉加载
			onReachBottom: function() {
				
			},
			handleColumnTap(item){
				uni.showLoading({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				});
				this.activeTitleItem = item.id
				if(item.id == 1){ 
					this.DomainType = 1
				}else {
					this.DomainType = 0
				}
				this.init(this.DomainType)
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		box-sizing: border-box;
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
		
		.service-and-specil {
			background-color: white;
			width: 90%;
			margin: 0 auto;
			margin-top: 0upx;
			box-sizing: border-box;
			// padding: 0 20upx;
			.uni-input{
				width: 100%;
				margin: 0 auto;
				height: 72upx;
				box-sizing: border-box;
				font-size: 24upx;
				padding: 0 40upx;
				margin-top: 40upx;
				border:1px solid rgba(238,238,238,1);
				border-radius:12upx;
				font-family:PingFang SC;
				color:rgba(153,153,153,1);
				// background:rgba(246,246,246,1);
			}
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
						font-size: 36upx;
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
					// margin-left: 60upx;
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
</style>

