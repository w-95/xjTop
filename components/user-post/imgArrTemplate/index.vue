<template>
	<view class="">
		<view class="box">
			<view v-if="imgArr.length > 0" :class="imgArr.length == 1 ? 'img-box' : imgArr.length == 2 ? 'img-box-two' : 'img-box-three'">
				<view class="item" v-for='(i,idx) in imgArr' :key='idx'>
					<image :src="i.src" mode="aspectFill" alt='i.alt'></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {}
		},
		props:{
			imgArr: {
				type: Array,
				default: () => []
			}
			
		},
		watch: {},
	}
</script>

<style lang="scss" scoped>
	.box{
			font-family:PingFang SC;
			width: 100%;
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
				white-space: normal !important;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
	}
</style>
