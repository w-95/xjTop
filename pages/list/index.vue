<template>
	<view class='box'>
		<view  v-for="(item,index) in list" class='item' :key='index' @click='isShow(item,index)'>
			<view>{{item.title}}</view>
			<icon type="success_no_circle" size='18' color='blue' v-show='item.isShow'></icon>
		</view>
		<view class='text-box'>
			<textarea class='text' placeholder="请说举报理由" v-model='reportVal'></textarea>
		</view>
		<view class='but-box' @click='sendReport'>
			<buttom>提交</buttom>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/http.js'
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				reportVal: '',
				list: [
					{
						title: '垃圾广告',
						isShow: false
					},
					{
						title: '低俗色情',
						isShow: false
					},
					{
						title: '违法违规',
						isShow: false
					},
					{
						title: '涉嫌侵权',
						isShow: false
					}
				],
				reportType: null,
				params: {
					"userId": "",
					"reportDataId": "",
					"reportDataType": "",
					"reportType": "",
					"reportMemo": ""
				}
			}
		},
		computed: {
			...mapState(['province', 'auth']),
		},
		onLoad(e){
			uni.showToast({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			
			uni.setNavigationBarTitle({
			    title: '举报' 
			})
			this.params.reportDataType = e.reportDataType
			this.params.reportDataId = e.Id
			uni.hideToast()
		},
		methods: {
			//举报item点击事件
			isShow(item,index){
				this.list[index].isShow = !item.isShow
				this.reportType = index+1
			},
			//提交举报
			sendReport(){
				let that = this
				if(that.auth != null && that.auth.userId){
					that.params.userId = that.auth.userId
					that.params.reportType = that.reportType
					that.params.reportMemo = that.reportVal
					http.report(that.params).then(data =>{
						if(data.code == 0){
							uni.showToast({
								title: '举报成功',
								icon: 'success',
								duration: 1500
							})
						}
					})
				}else {
					uni.showToast({
						title: '请先登录!',
						icon: 'none',
						duration: 1500
					})
				}
			}
		}
	}
</script>

<style scoped lang='scss'>
	.box{
		box-sizing: border-box;
		border-top: 1px solid #EEEEEE;
		.item{
			width: 700upx;
			border-bottom: 1px solid #EEEEEE;
			text-align: center;
			font-size: 28upx;
			display: flex;
			float: right;
			align-items: center;
			view{
				width: 600upx;
				padding: 20upx;
			}
			icon{
				float: right;
			}
		}
		.item:nth-of-type(4) {
			border: none;
		}
		.text-box{
			float: left;
			border-top: 1px solid #EEEEEE;
			width: 750upx;
			padding: 80upx 30upx;
			box-sizing: border-box;
			.text{
				box-sizing: border-box;
				float: left;
				height: 150upx;
				border-radius: 10upx;
				font-size: 32upx;
				padding: 20upx 20upx;
				border: 1px solid #EEEEEE
			}
		}
		.but-box{
			display: flex;
			width: 750upx;
			justify-content: center;
			float: left;
			buttom{
				box-sizing: border-box;
				float: left;
				
				width: 700upx;
				border-radius: 10upx;
				background: #007BFB;
				text-align: center;
				font-size: 28upx;
				color: white;
				padding: 28upx;
			}
		}
		
	}
</style>
