<template>
	<view class='search-box'>
		<view class="box">
			<icon type="search" size="15" color='#999999'></icon>
			<input class="uni-input" confirm-type='search' placeholder="请输入用户昵称"  v-model='commentVal' :focus="showPopupBottom" @blur="loseFocus(1)" @input ="changeInput"/>
			<button type="primary" @click='search' class='juris-diction-btn'>搜索</button>
		</view>
		<view class="tipss" v-if='userList.length <= 0'>
			<image src="../../static/images/no-comment.png" mode="" mode="widthFix" ></image>
			<view>暂无更多用户列表!</view>
		</view>
		<ListBox :listBox='userList' class='box-list' type='userList' v-else></ListBox>
	</view>
</template>

<script>
	import time from '../../utils/validate.js'
	import http from '../../utils/http.js'
	import listBox from '../memberSearch/listItem/index.vue'
	export default {
		data() {
			return {
				userList: [],
				showPopupBottom: true,
				commentVal: ''
			}
		},
		components: {
			listBox,
		},
		
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			uni.setNavigationBarTitle({
			    title: '会员查询' 
			})
			uni.hideLoading()
		},
		onReady() {},
		computed: {
			
		},
		onShow() {},
		methods: {
			changeInput(event){
				this.init(event.detail.value)
			},
			getFocus(){
				
			},
			search(){
				
			},
			//失去焦点
			loseFocus(type){
				this.showPopupBottom = false
			},
			init(val){
				uni.showLoading({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				});
				let params = {
					name: val
				},arr=[],that=this;
				http.searchUser(params).then(res =>{
					for(let i of res){
						i.userUpdateTime= time.formatTime(i.userUpdateTime,"Y-M-D h:m:s")
					}
					that.userList= res;
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.search-box{
		width: 750upx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
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
			width: 684upx;
			display: flex;
			margin-top: 30upx;
			align-items: center;
			font-family:PingFang SC;
			padding: 10upx;
			.juris-diction-btn{
				font-size:24upx;
				font-family:PingFang SC;
				margin-left: 20upx;
				width: 190upx;
				height: 72upx;
				line-height: 72upx;
				border: none;
				background-color: #2EE3A5;
			}
			.juris-diction-btn::after{ border: none;} 
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
			icon{
				position: absolute;
				color: #999999;
				font-family:PingFang SC;
				left: 55upx;
			}
		}
		.box-list{
			width: 100%
		}
	}
</style>
