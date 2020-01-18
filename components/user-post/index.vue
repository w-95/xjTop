<template>
	<view class="">
		<view class="box" v-for="(item,index) in dataList"  @click='goComment(item)' :key='index'>
			<!-- title部分 -->
			<view class="title">
				<view class="title-logo" v-if="item.articleStick && item.articleStick!==0">
					置顶
				</view>
				<view class="title-content">{{item.articleTitle}}</view>
				<!-- 标签部分 -->
				<view class="label">
					<view class="item" v-for="(i,idx) in item.articleTagObjs" :key='idx'>
						{{i.tagTitle}}
					</view>
				</view>
			</view>
			<view class='img-list' v-if='item.offered'>
				<image src='../../static/images/bgc.jpeg'></image>
				<image src='../../static/images/bgc.jpeg'></image>
				<image src='../../static/images/bgc.jpeg'></image>
			</view>
			<view class="content" v-else>
				<view v-html="item.articleContent.textContent.replace(/(\r\n|\n|\r|↵)/gm, '<br/>')" class="text-content"></view>
				<!-- <view v-if="item.articleContent.imgArr.length > 0" class='img-box' >
					<view class="item" v-for='(i,idx) in item.articleContent.imgArr' :key='idx'>
						<image :src="i.src" mode="aspectFill" alt='i.alt'></image>
					</view>
				</view> -->
				<img-arr v-if='item.articleContent.imgArr.length > 0' :imgArr = 'item.articleContent.imgArr'></img-arr>
			</view>
			<!-- user部分 -->
			<view class="user">
				<view class="left">
					<view class="logo">
						<image :src="item.articleAuthor.userAvatarURL" mode=""></image>
					</view>
					<text class="user-name">{{item.articleAuthor.userName}}</text>
					<text>{{item.articleUpdateTimeStr}}</text>
				</view>
				<view class="right">
					<text>{{item.articleCommentCount}}回帖</text>
					<text class='view-count'>{{item.articleViewCount}}浏览</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import imgArr from './imgArrTemplate/index.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				dataList: [],
			}
		},
		props:{
			deailDataList: {
				type: Array,
				default: () => []
			}
			
		},
		watch: {
			'deailDataList': function(newVal){
				this.setDeailData(newVal)
			}
		},
		
		components: {
			imgArr
		},
		created(){
		},
		onLoad() {
			
		},
		onReady() {},
		computed: {
		},
		mounted(){
			uni.showToast({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.setDeailData()
			uni.hideToast()
			this.$nextTick(()=>{
				console.log('组件渲染完成')
			})
		},
		onShow() {
			
		},
		methods: {
			aa(val){
				return val.replace(/(\r\n|\n|\r|↵)/gm, '<br/>')
			},
			goComment (item) {
				console.log(item)
				uni.navigateTo({
					url: '../postingDetail/index?id='+item.oId+'&title='+item.articleTitle
				})
			},
			setDeailData(){
				if(this.deailDataList){
					for(let i = 0;i < this.deailDataList.length;i++){
						let arr = [];
						let obj = {
							isImg: false,
							imgArr: [],
							textContent: ''
						}
						arr = this.deailDataList[i].articleContent.split('!')
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
								obj.textContent = obj.textContent+arr[j].replace(/<b/ig, "<b class='pho'")
							}
						}
						this.deailDataList[i].articleContent = obj
					}
					this.dataList = this.deailDataList
					console.log('------------------------------')
					console.log(this.dataList)
				} 
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 100%;
		padding: 30upx 60upx 30upx 60upx;
		box-sizing: border-box;
		border-bottom:20rpx solid rgba(247,247,247,1);

		.title{
			width: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			// padding: 0 20upx;
			.title-logo{
				font-size: 24upx;
				background-color: #FFF2F3;
				color:#F94059;
				border-radius: 10upx;
				width: 80upx;
				text-align: center;
				height: 50upx;
				line-height: 50upx;
				font-family:PingFang SC;
				margin-right: 20upx;
			}
			.title-content{
				width: 75%;
				font-family:PingFang SC;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			text{
				font-weight: bold;
				font-family:PingFang SC;
				font-size: 28upx;
				
			}
			.label{
				width: 30%;
				display: flex;
				box-sizing:border-box;
				justify-content:flex-end;
				// padding: 0 20upx;
				margin-top: 18upx;
				.item{
					font-family:PingFang SC;
					box-sizing: border-box;
					border: 1px solid #F0F0F0;
					border-radius: 10upx;
					text-align: center;
					background-color: #F7F7F7;
					padding: 10upx 20upx;
					height: 40upx;
					display: flex;
					justify-content: right;
					align-items: center;
					font-size: 18upx;
					margin-left: 25upx;
					color: #888888;
					font-family:PingFang SC;
					font-weight:400;
				}
			}
		}
		.title-tab{
			width: 100%;
			box-sizing: border-box;
			display: flex;
			padding: 0 0 0 40upx;
			align-items: center;
			text{
				font-weight: bold;
				font-family:PingFang SC;
				font-size: 28upx;
				
			}
		}
		
		.content{
			font-family:PingFang SC;
			width: 100%;
			max-height: 500upx;
			overflow: hidden;
			font-size: 24upx;
			font-weight: 600;
			font-family:PingFang SC;
			color: #666666;
			line-height: 45upx;
			margin-top: 15upx;
			box-sizing: border-box;
			.img-box{
				width: 100%;
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
				padding: 20upx;
				.item{
					width: 100%;
					height: 350upx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.img-box-two{
				width: 100%;
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
				padding: 20upx;
				.item{
					width: 50%;
					height: 250upx;
					box-sizing: border-box;
					padding: 0 5upx 5upx 0;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.img-box-three{
				width: 100%;
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
				padding: 20upx;
				.item{
					width: 33.3%;
					box-sizing: border-box;
					height: 150upx;
					padding: 0 5upx 5upx 0;
					text-align: left;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.text-content{
				width: 100%;
				box-sizing: border-box;
				padding: 0upx 20upx;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				word-wrap: break-word;
				font-family:PingFang SC;
				text-overflow:ellipsis;
				white-space: nowrap;
				font-weight: normal;
				white-space: normal !important;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				/deep/ rich-text {
				     display: block;
				     letter-spacing: 1rpx;
					 /deep/ .pho{
						color: red;
						// font-size: 38upx;
					}
					.pho{
					  	// font-size: 28upx;
						font-weight: bold;
					}
				}
			}
		}
		.img-list{
			width: 100%;
			margin-top: 15upx;
			display: flex;
			box-sizing: border-box;
			justify-content: space-between;
			image{
				width: 30%;
				height: 100upx;
			}
		}
		.user{
			width: 100%;
			display: flex;
			font-family:PingFang SC;
			font-size: 24upx;
			justify-content: space-between;
			margin-top: 15upx;
			box-sizing: border-box;
			align-items: center;
			padding: 0 20upx 0 0;
			.left{
				display: flex;
				align-items: center;
				color:#999999;
				.logo{
					width: 30upx;
					display: flex;
					align-items: center;
					height: 30upx;
					border-radius: 50%;
					margin-right: 10upx;
					overflow: hidden;
					image{
						width: 30upx;
						height: 30upx;
					}
				}
				text{
					font-family:PingFang SC;
					font-size: 20upx;
				}
				.user-name{
					color: #6999D1;
					font-family:PingFang SC;
					margin-right: 15upx;
					font-weight: bold;
					font-size: 24upx;
				}
			}
			.right{
				color: #999999;
				display: flex;
				align-items:center;
				text{
					font-size: 20upx;
					font-family:PingFang SC;
				}
				.view-count{
					margin-left: 10upx
				}
			}
		}
	}
	rich-text {
	      width: 670rpx;
	      display: block;
	      font-size: 28rpx;
	      color: #353535;
	      letter-spacing: 1rpx;
		  .pho{
			  font-size: 38upx;
		  }
	}
</style>
