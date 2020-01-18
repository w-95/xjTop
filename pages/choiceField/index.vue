<template>
    <view>
		<view class='box' v-if='fieldData.length > 0'>
		    <view class='title'>请选择您想发帖的领域</view>
			<view class='field-box'>
				<view v-for="(item, index) in fieldData" :key="index" @click='active(item,index)' :class="activeIndex == index ? 'active' : 'item'">
					<radio value="FRA" :checked="activeIndex == index" class='radio' color='#007BFB'/>
					<text class='text'>{{item.domainTitle}}</text>
					<view></view>
				</view>
			</view>
			<view class="defalt-text">默认发帖权限有效期为30天</view>
			<button type="primary" @click='goIndex'>确定</button>
		</view>
		<view class="tipss" v-else>
			<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
			<view>暂无更多领域列表!</view>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/http.js';
    export default {
        name:"phones",
        components:{},
        data() {
            return {
				activeIndex: null,
                fieldData: [],
				activeName: '',
				userId: ''
            }
        },
        methods : {
            active(item,index){
				this.activeName = item
				this.activeIndex = index
				
			},
			sendActive(oId){
				let params = {
					userId: this.userId,
					domainId: oId,
					type: 0
				}
				http.getDefaulelist(params).then(data => {
					uni.showToast({
						title: '设置默认领域成功!',
						icon: 'none',
						duration: 1500
					})
					uni.reLaunch({
						url: '../index/index'
					})
				})
			},
			goIndex(){
				this.sendActive(this.activeName.oId)
			},
			init(){
				let that = this
				http.getDomain().then(data => {
					uni.hideLoading()
					that.fieldData = data
				})
			}
        },
		onLoad(e){
			uni.setNavigationBarTitle({
			    title: '首页' 
			})
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			this.userId = e.id
			this.init()
		}
		
		
    }
</script>

<style lang="scss" scoped>
	.tipss{
		margin: 0 auto;
		margin-top: 280upx;
		text-align: center;
		image{
			width: 40%;
			height:auto;
		}
		view{
			width: 750upx;
			margin-top: 50upx;
			text-align: center;
			font-size: 30upx;
			font-family:PingFang SC;
			font-weight: bold;
			width: 100%;
		}
	}
	.box{
		width: 750upx;
		box-sizing: border-box;
		.title{
			width: 100%;
			height: 200upx;
			box-sizing: border-box;
			font-size: 32upx;
			display: flex;
			font-weight: bold;
			align-items: center;
			font-family:PingFang SC;
			justify-content: center;
		}
		.field-box{
			width: 100%;
			box-sizing: border-box;
			font-family:PingFang SC;
			font-size: 24upx;
			font-weight: normal;
			
			.item{
				box-sizing: border-box;
				width: 70%;
				margin: 0 auto;
				border: 1px solid #CFCFCF;
				border-radius:8upx;
				margin-bottom: 40upx;
				padding: 20upx 20upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.radio{
					transform:scale(0.6);
					color: #CFCFCF;
				}
				.text{
					
				}
				view{
					width: 60upx;
				}
			}
			.active{
				box-sizing: border-box;
				width: 70%;
				margin: 0 auto;
				border: 1px solid #007BFB;
				border-radius:8upx;
				margin-bottom: 40upx;
				padding: 20upx 20upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.radio{
					transform:scale(0.6);
				}
				.text{
					
				}
				view{
					width: 60upx;
				}
			}
		}
		.defalt-text{
			width: 750upx;
			padding: 20upx 20upx;
			box-sizing: border-box;
			text-align: center;
			font-size: 24upx;
			font-family:PingFang SC;
			color: #999999;
		}
		button{
			width: 80%;
			margin: 0 auto;
			margin-bottom: 40upx;
			font-size: 24upx;
			font-family:PingFang SC;
			padding: 10upx 0;
			background-color: #42E1A4
		}
	}
</style>