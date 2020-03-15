<template>
	<view class="page index-page">
		<view class="box">
			<icon type="search" size="15" color='#CCCCCC' class="left"></icon>
			<input class="uni-input" confirm-type='search' placeholder="搜索" @input ="changeInput" v-model="iptVal" :focus ='true'/>
			<icon type="clear" size="15" color='#CCCCCC' class="right" @click='clearVal'></icon>
		</view>
		<Post :deailDataList ='listArr' v-if="listArr.length>0" :show='true'></Post>
	</view>
</template>

<script>
	import http from '../../utils/http.js'
	import Post from '../../components/post/index.vue'
	export default {
		data() {
			return {
				iptVal: '',
				listArr: []
			}
		},
		components: {
			Post
		},
		
		onLoad() {
			uni.setNavigationBarTitle({
			    title: '搜索' 
			})
		},
		onReady() {},
		computed: {
			
		},
		onShow() {},
		methods: {
			changeInput(event){
				uni.showToast({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				})
				http.searchKeyWord({keyword: event.detail.value}).then(data =>{
					this.listArr = data
					uni.hideToast()
				})
			},
			clearVal(){
				this.iptVal = ''
			},
			goDetail(item){
				uni.navigateTo({
					url: '../postingDetail/index?id='+item.oId
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		.box{
			width: 690upx;
			display: flex;
			align-items: center;
			padding: 10upx;
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
			.left{
				position: absolute;
				color: #999999;
				left: 55upx;
			}
			.right{
				position: absolute;
				color: #999999;
				right: 55upx;
			}
		}
		
	}
</style>
