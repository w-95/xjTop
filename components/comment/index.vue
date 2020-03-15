/**
 * deailData Array 需要遍历的评论数组
 * fixActiveIndex 隐藏评论举报toast
 * showActive 通知组件评论举报toast是否为显示状态
 */
<template>
	<view class='box'>
		<view v-for="(item,index) in deailData" :key='index'>
			<view :class="item.commentOriginalCommentId != '' ? 'right' : 'left'">
				<view class='left-box'>
					
					<view class="icon">
						<image :src="item.commentAuthorThumbnailURL != ''? item.commentAuthorThumbnailURL : '../../static/images/gongren.png'"></image>
					</view>
					<text class="title">{{item.commentAuthorName}} · {{item.timeAgo}}</text>
				</view>
				<view class='content'>
					<view v-html='item.commentContent'></view>
					<image src="../../static/images/shenglue.png" @click='toask(item,index)' v-if="type == 'comment' && item.commentOriginalCommentId == ''"></image>
				</view>
				<view class='toast' v-if="activeIndex == index">
					<view @click='comment(item)'>
						<image src="../../static/image/comment.png"></image>
						评论
					</view>
					<view @click='report(item)'>
						<image src="../../static/image/comment.png"></image>
						举报
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import http from '../../utils/http.js';
	export default {
		data() {
			return {
				deailDataObj: [],
				fabulousShow: false,
				// showKey: false,
				commentId: '',
				activeIndex: null
			}
		},
		props: {
			deailData: {
				type: Array,
				default: () => []
			},
			fixActiveIndex: {
				type: null,
				default: null
			},
			type: {
				type: String,
				default: 'detail'
			}
		},
		watch: {
			'fixActiveIndex': function(newVal){
				this.activeIndex = newVal
			}
		},
		created(){},
		onLoad(){},
		methods: {
			toask(item,index){
				if(this.activeIndex == index){
					this.activeIndex = null
				}else {
					this.activeIndex = index
					this.$emit('showActive',index)
				}
			},
			fabulous(item){
				let params = {
					"userId": item.commenter.oId,
					"commentId": item.commentOnArticleId
				}
				http.fabulous(params).then(data => {
					uni.showToast({
						title: '点赞成功',
						mask: true,
						icon: 'success',
						duration: 1500
					})
				})
			},
			comment(item){
				this.$emit('commentItem',item)
			},
			report(item){
				uni.navigateTo({
					url: '../list/index?reportDataType=1&Id='+item.commentAuthorId
				})
			}
		}
	}
</script>

<style scoped lang='scss'>
	.box{
		box-sizing: border-box;
		.left{
			padding: 40upx 20upx;
			.left-box{
				margin-left: 10upx;
				display: flex;
				align-items: center;
				color: #656565;
				font-size: 24upx;
				box-sizing: border-box;
				padding: 10upx 10upx;
				.icon{
					width: 30upx;
					height: 30upx;
					border: 1px solid white;
					border-radius: 50%;
					margin-right: 15upx;
					overflow: hidden;
					background-size: 100% 100%;
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
				padding: 10upx 10upx;
				word-wrap:break-word; 
				word-break:break-all;
				overflow: hidden;
				margin-left: 60upx;
				justify-content: space-between;
				image{
					transform:rotate(90deg);
					width: 60upx;
					height: 60upx;
				}
			}
		}
		.right{
			background-color: #EEEEEE;
			box-sizing: border-box;
			border-radius: 10upx;
			margin-top: 40upx;
			margin-left: 60upx;
			padding: 40upx 40upx;
			margin-right: 40upx;
			.left-box{
				margin-left: 10upx;
				display: flex;
				align-items: center;
				color: #656565;
				font-size: 24upx;
				box-sizing: border-box;
				padding: 10upx 10upx;
				.icon{
					width: 30upx;
					height: 30upx;
					border: 1px solid white;
					border-radius: 50%;
					margin-right: 15upx;
					overflow: hidden;
					background-image: url('../../static/images/gongren.png');
					background-size: 100% 100%;
				}
			}
			.content{
				display: flex;
				align-items: center;
				font-size: 28upx;
				box-sizing: border-box;
				word-wrap:break-word; 
				word-break:break-all;
				overflow: hidden;
				padding: 10upx 20upx 10upx 65upx;
				justify-content: space-between;
				image{
					transform:rotate(90deg);
					width: 60upx;
					height: 60upx;
					
				}
			}
		}
		.bottom{
			position: fixed;
			bottom: 0upx;
			box-sizing: border-box;
			width: 750upx;
			display: flex;
			justify-content: center;
			border-top: 1px solid #CCCCCC;
			box-shadow: 0 1px 3px rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
			padding: 20upx 0;
			.uni-input{
				width: 650upx;
				background-color: #EEEEEE;
				font-size: 24upx;
				border-radius: 10upx;
				padding: 0 20upx;
			}
		}
	}
</style>
