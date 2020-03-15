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
	@import "@/styles/list.scss";
</style>
