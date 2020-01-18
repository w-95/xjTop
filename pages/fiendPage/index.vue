<template>
	<view class='box'>
		<view class="tips">
			<image src="../../static/images/empty.jpg" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>喔喔！！数据跑掉了</view>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/http.js'
	export default {
		data() {
			return {}
		},
		onLoad(e){
			
		},
		methods: {
			
		}
	}
</script>

<style scoped lang='scss'>
	.box{
		width: 750upx;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F6F6F6;
		.tips{
			image{
				width: 100%;
			}
			view{
				width: 750upx;
				margin-top: 50upx;
				text-align: center;
				font-size: 40upx;
				font-family:PingFang SC;
				font-weight: bold;
				width: 100%;
			}
		}
		
	}
</style>
