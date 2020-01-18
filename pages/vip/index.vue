<template>
	<view class="box">
		<view class="item" v-for="(item,index) in domainData" :key='index' @click='goPosting(item)'>
			<view class="item-logo" v-if="!item.isExpired">
				<image :src="item.domainIconPath" mode="widthFix"></image>
			</view>
			<view class="item-no-logo" v-else>
				<image :src="item.domainIconPath" mode="widthFix"></image>
				<text>(请开通权限)</text>
			</view>
			<text>{{item.domainTitle}}</text>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/http.js';
	import d1 from '../../common/data/d1.js'
	export default {
		data() {
			return {
				domainData: [],
				userId: ''
			}
		},
		onLoad(e){
			wx.showToast({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			uni.setNavigationBarTitle({
			    title: '选择领域' 
			})
			this.userId = e.id
			// this.getParams('15311339974')
			if(e.id && e.id != ''){
				this.getParams(e.id)
			}
		},
		methods: {
			goPosting(item) {
				console.log(item)
				if(item.isExpired) {
					uni.navigateTo({
						url: '../noVip/index?uid='+item.userId+'&oid='+item.oId
					})
				}else {
					uni.navigateTo({
						url: '../posting/index?type='+ item.domainTitle
					})
				}
			},
			getParams(userid){
				let imgData = d1.vipImgData
				http.getUserList({userId: userid}).then(data => {
					for(let i = 0; i< data.data.length;i++){
						if(data.data[i].isExpired){
							for(let j =0; j<imgData.length;j++){
								if(data.data[i].domainTitle == imgData[j].title){
									data.data[i].domainIconPath =  imgData[j].icon
								}
							}
						}
					}
					//.reverse()
					this.domainData = data.data
					for(let i of this.domainData){
						console.log(i.domainTitle,'iconPath is == ',i.domainIconPath)
					}
					uni.hideToast()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 600upx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin: 0 auto;
		margin-top: 50upx;
		.item{
			width: 50%;
			text-align: center;
			font-size: 24upx;
			margin-bottom: 50upx;
			
			.item-logo{
				width: 150upx;
				height: 150upx;
				background-color: #EEEEEE;
				border-radius: 10upx;
				margin: 0 auto;
				padding: 20upx 0;
				image{
					width: 100upx;
					height: auto;
					margin-top: 33upx;
				}
			}
			.item-no-logo{
				width: 150upx;
				height: 150upx;
				background-color: #EEEEEE;
				border-radius: 10upx;
				margin: 0 auto;
				font-size: 20upx;
				padding: 20upx 0;
				color: #999999;
				image{
					width: 100upx;
					height: auto;
					margin-top: 5upx;
				}
				
			}
			text{
				display: inline-block;
				margin-top: 20upx;
			}
		}
	}
</style>
