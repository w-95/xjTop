<template>
	<view :class="userMessageList.length > 0 ? 'page' : 'pages'">
		<view class='message-tips'>
			<view>尊敬的管理员:</view>
			<view>您正在联系用户【{{userName}}】;如对方回复会使用客服进行沟通</view>
		</view>
		<view class='add-height'></view>
		<view class='conversation' v-for="(item,index) in userMessageList" :key='index'>
			<view class='alt-content'>{{item.message}}</view>
			<view class='alturl'>
				<image :src="item.user.userAvatarURL"></image>
			</view>
		</view>
		<view class='height'></view>
		<view class='bottom' :style="{bottom: bottom+ 'px'}">
			<!-- -->
			<textarea class="uni-input" :style="{'height': mheight + 'rpx'}" :adjust-position='false' :show-confirm-bar="false" :fixed='true'  @keyboardheightchange="getKeyHeight" :placeholder = placeholderVal v-model='messageVal' @blur="loseFocus(1)" :focus='showPopupBottom' @linechange='rotChange'></textarea>
			<button type="primary" @click='sendMessage()'>发送</button>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/http.js';
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				userMessageList: [],
				bottom: 0,
				locBtm: 0,
				mbtn: 0,
				mheight: 50,
				placeholderVal: '请输入内容',
				messageVal: '',
				showPopupBottom: true,
				userId: '',
				userName: ''
			}
		},
		created(){
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			uni.setNavigationBarTitle({
			    title: '联系用户' 
			})
			
		},
		onLoad(e){
			console.log(e)
			if(e.id && e.name){
				this.userId = e.id;
				this.userName = e.name;
			}
			this.init()
		},
		computed: {
			...mapState(['province', 'auth']),
		},
		methods: {
			init(){
				let params = {
					userId: this.userId
				},that = this;
				http.getRootUserMessage(params).then(res => {
					that.userMessageList = res
					uni.hideLoading()
				})
			},
			//输入框行数发生变化
			rotChange(event){
				if(event.detail.lineCount >=2){
					this.mheight = 75
				}else if (event.detail.lineCount == 1) {
					this.mheight = 40
				}
			},
			//获取键盘高度
			getKeyHeight(event){
				this.contentType = event.target.dataset.type
				if(event.detail.height == 0) {
					this.bottom = 0
				}
				this.bottom = event.detail.height,
				this.locBtm = this.bottom
			},
			//失去焦点
			loseFocus(type){
				this.bottom = 0
				this.showPopupBottom = false
				this.fixActiveIndex = null
				if(this.start == 'reply' && this.commentVal.length == 0){
					this.placeholderVal = '回帖'
					this.start = 'comment'
				}
			},
			sendMessage(){
				let params = {
					"userId":this.userId,
					"adminId":this.auth.userId,
					"message":this.messageVal
				}
				http.rootSendMessage(params).then(res =>{
					this.init()
					this.messageVal = ''
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.pages{
		position: absolute;
		top:0;
		left:0;
		bottom:0;
		width: 100%;
		box-sizing: border-box;
		background-color:#f6f6f6;
	}
	.page,.pages{
		width: 100%;
		box-sizing: border-box;
		background-color:#f6f6f6;
		.add-height{
			height: 110upx;
			margin-top: 20upx;
			margin-bottom: 50upx;
		}
		.message-tips{
			width: 90%;
			position: fixed;
			margin: 0 auto;
			background-color: #2EE3A5;
			color: white;
			padding: 20upx;
			font-size:28upx;
			font-family:PingFang SC;
			top: 20upx;
			left: 19upx;
			height: 110upx;
		}
		.conversation{
			width: 100%;
			padding: 40rpx 40rpx 40rpx 150rpx;
			display: flex;
			box-sizing: border-box;
			background-color:#f6f6f6;
			.alturl{
				position:absolute;
				right: 20upx;
				width: 65upx;
				height: 65upx;
				border-radius: 50%;
				overflow: hidden;
				margin-left: 30upx;
				image{
					width: 65upx;
					height: 65upx;
				}
			}
			.alt-content{
				width: 75%;
				background-color:white;
				padding: 15upx 30upx 15upx 15upx;
				border-radius: 8upx;
				font-size: 27upx;
				word-break: break-all;
			}
		}
	}
	.height{
		width: 100%;
		height: 110upx;
	}
	.bottom{
		font-family:PingFang SC;
		position: fixed;
		box-sizing: border-box;
		width: 750upx;
		bottom: 0;
		background-color: white;
		display: flex;
		align-items:center;
		justify-content: center;
		border-top: 1px solid #CCCCCC;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
		padding: 20upx 0;
		.uni-input{
			width: 450upx;
			background-color: #EEEEEE;
			font-size: 24upx;
			border-radius: 10upx;
			line-height: 40upx;
			padding: 20upx 20upx 10upx 20upx;
			margin-left: 50upx;
		}
		button{
			font-size: 24upx;
			height: 60upx;
			width: 130upx;
		}
	}
</style>
