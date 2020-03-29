<template>
	<view class='box-item'>
		<view v-for='(item,index) in listBox' :key='index' class='list-box' @click='goOpenArea(item)'>
			<view class='logo-icon'>
				<image :src="item.followedUser.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='content-item'>
				<view class='title'>
					<text>{{item.followedUser.userName}}</text>
				</view>
			</view>
			<image src="../../../static/images/right.png" mode="widthFix" class='right-item'></image>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {}
		},
		props:{
			listBox: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: 'apply'
			}
		},
		components: {},
		onLoad(e) {},
		created(){},
		onReady() {},
		computed: {},
		onShow() {},
		methods: {
			// uni.navigateTo({
			// 	url: '../addFollow/index'
			// })
			goOpenArea(item){
				console.log(item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-item{
		width: 100%;
		box-sizing: border-box;
		.list-box{
			// width: 100%;
			box-sizing: border-box;
			padding: 20upx 20upx;
			display: flex;
			align-items: center;
			justify-content:space-between;
			border-bottom: 1px solid rgba(238,238,238,1);
			.logo-icon{
				width: 100upx;
				height: 100upx;
				border-radius: 8upx;
				overflow: hidden;
				image{
					width: 100upx;
					height: auto;
				}
			}
			.content-item{
				width: 70%;
				box-sizing: border-box;
				padding: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title{
					font-family:PingFang SC;
					font-size: 24upx;
					view{
						font-family:PingFang SC;
						font-size: 20upx;
						color: #C3C3C3;
						display: flex;
						justify-content: space-between;
						margin-top: 10upx;
					}
					.end{
						margin-top: 3upx;
					}
				}
				.title-bom{
					font-family:PingFang SC;
					font-size: 24upx;
					min-width: 130upx;
					text-align: center;
				}
			}
			.right-item{
				width: 30upx;
				height: auto;
			}
		}
	}
</style>
