<template>
	<view class='box-item'>
		<view v-for='(item,index) in listBox' :key='index' class='list-box' @click='goOpenArea(item)'>
			<view class='logo-icon'>
				<image :src="item.user.userAvatarURL" mode="widthFix"></image>
			</view>
			<view class='content-item'>
				<view class='title'>
					<text>{{item.user.userName}}</text>
					<view>申请：{{item.userCreateTime}}</view>
					<view>开通：{{item.userEndTime}}</view>
				</view>
				<view class='title-bom'>
					<text>{{item.domainURI}}</text>
				</view>
			</view>
			<view class='right-item' v-if="type == 'apply'">
				去开通
				<image src="../../../static/images/right.png" mode="widthFix"></image>
			</view>
			<view class='right-tong' v-if="type == 'alreadyOpened'">
				<image src="../../../static/images/tong.png" mode="widthFix"></image>
				<!-- <image src="../../../static/images/no-tong.png" mode="widthFix"></image> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				
			}
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
		created(){
			
		},
		onReady() {},
		computed: {
			...mapState(['itemDomain']),
		},
		onShow() {},
		methods: {
			...mapMutations(['setItemDomain']),
			goOpenArea(item){
				this.setItemDomain(item)
				uni.navigateTo({
					url: '../openArea/index'
				})
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
			padding: 20upx;
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
				width: 60%;
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
						margin-top: 20upx;
					}
				}
				.title-bom{
					font-family:PingFang SC;
					font-size: 24upx;
					min-width: 80upx;
					text-align: center;
				}
			}
			.right-item{
				width: 100upx;
				font-family:PingFang SC;
				font-size: 24upx;
				color: #1296db;
				display: flex;
				align-items:center;
				image{
					width: 30upx;
					height: auto;
				}
			}
			.right-tong{
				image{
					width: 50upx;
				}
			}
		}
	}
</style>
