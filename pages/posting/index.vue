<template>
    <view class='box'>
       <textarea class='text' placeholder="请输入标题" data-type='title' @keyboardheightchange="getKeyHeight" v-model='titleVal' @blur="loseFocus(1)" @focus='getFocus(1)'></textarea>
	   <textarea class='content' placeholder="请输入正文" data-type='title'  @keyboardheightchange="getKeyHeight" v-model='contentValue'  @blur="loseFocus(2)"  @focus='getFocus(2)'></textarea>
	   <imgBox :imgArr='imgArr' @nextDom="nextDom" @clearImg="clearImg"></imgBox>
	   <view class='position' @click='goCity'>
			<image src='../../static/image/postion.png'></image>
	   		{{currProvince}}
	   </view>
	   <view class='bottom' :style="{bottom: bottom + 'px'}">
		   <view class='img-btn'>
			   <view @click='upLoad'>
				   <image src='../../static/images/img.png'></image>
				   <!-- <image src='../../static/images/title.png' @click='setTitle'></image> -->
			   </view>
			    <button type="primary" @click='sendComment' class='comment-btn'>发帖</button>
		   </view>
	   </view>
    </view>
</template>

<script>
	let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
	import http from '../../utils/http.js'
	import imgBox from './imgBox/index.vue'
	var showdown  = require('showdown'),converter = new showdown.Converter();
	import {mapState,mapMutations} from 'vuex';
	import d1 from '../../common/data/d1.js'
    export default {
        name:"phones",
        components:{
			imgBox
		},
        data() {
            return {
				qqMapSdk: null,
				currProvince: '获取中',
				bottom: 0,
				//记录键盘高度
				locBtm: 0,
				titleVal: '',
				imgStr: '',
				contentType: '',
				tempFilePaths: [],
				qiniToken: '',
				imgArr: [],
				postContent: '',
				articleTags: '',
				contentValue: '',
				unLoadImgArr: [],
				setContentFont: false,
				//点击记数
				clickNum: 0
            }
        },
		//监听页面滚动
		onPageScroll(e){
			this.bottom = 0
		},
		computed: {
			...mapState(['province', 'auth']),
		},
        methods : {
			nextDom(){
				uni.hideLoading()
			},
			//失去焦点
			loseFocus(type){
				this.bottom = 0
			},
			//获得焦点
			getFocus(type){
				this.bottom = this.locBtm
			},
			//获取七牛token
			getQiNiuToken(){
				http.getUploadToken({bucketName: d1.bucketName}).then(data => {
					this.qiniToken = data
				})
			},
			//腾讯sdk获取位置
			getPostion(){
				this.qqMapSdk = new QQMapWX({
					key: d1.QQSDK
				});
				this.qqMapSdk.reverseGeocoder({
					success: res => {
						this.currProvince = res.result.address_component.province
						uni.setStorage({
							key: "city",
							data: this.currProvince
						})
						uni.hideToast()
					},
					fail: (e) => {
						this.currProvince = '北京市'
					},
					complete: e => {}
				})
			},
			//敏感词过滤
			contentFilter(value,callback){
				uni.request({
					url: "https://www.cachito.top/api/slip/check",
					data: {content: value},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: function (res) {
						if(res.data.code == 1){
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
							return false
						}
						callback()
					},
					error: function(err){
						uni.showToast({
							title: err.code,
							icon: 'none'
						})
						return false
					},
				})
			},
			//发布帖子
			sendComment(){
				let that = this;
				if(that.clickNum >= 1){
					return false
				}else if(that.titleVal == ''){
					uni.showToast({
						title: '请输入帖子标题',
						icon: 'none'
					})
				}else {
					that.clickNum+=1
					if(this.imgArr.length > 0){
						for(let i of this.imgArr){
							this.imgStr+='![111]('+i+')'
						}
					}
					if(that.auth != null && that.auth.userId){
						let params = {
							"articleTitle":that.titleVal,
							"articleContent":that.setContentFont?that.titleVal+"<b>"+that.contentValue+'</b>'+that.imgStr : that.titleVal+that.contentValue+that.imgStr,
							"articleTags": that.articleTags,
							"userId": that.auth.userId,
							"articleImg1URL": that.imgArr[0] || '',
							"articleCity": that.currProvince
						}
						that.contentFilter(params.articleContent,function(){
							http.sengComment(params).then(data =>{
								if(data.code == 0 && data.data){
									// uni.reLaunch({
										// url: '../index/index'
									// })
									uni.navigateTo({
									   url:"../fieldTab/index?domainTitke="+that.articleTags
									})
									uni.showToast({
										title: '上传成功',
										icon: 'none'
									})
								}else {
									that.imgStr = ''
								}	
							})
						})
					}
					setTimeout(function () { that.clickNum = 0 }, 3000);
				}
			},
			onStatusChange(){
				
			},
			//删除上传的图片
			clearImg(index){
				this.imgArr.splice(index,1)
			},
			//设置键盘高度
			getKeyHeight(event) {
				this.contentType = event.target.dataset.type
				if(event.detail.height == 0) {
					this.bottom = 0
				}
				// if(this.bottom == 0 && event.detail.height != 0) {
					// this.bottom = event.detail.height+50,
					this.bottom = event.detail.height,
					this.locBtm = this.bottom
				// }
			},
			//城市选择跳转
			goCity(){
				let that = this
				uni.setStorage({
					key: "imgArr",
					data: that.imgArr
				})
				uni.setStorage({
					key: "commentTitle",
					data: that.titleVal
				})
				uni.setStorage({
					key: "commentContent",
					data: that.contentValue
				})
				uni.redirectTo({
					url: '../city/index?type='+this.articleTags
				})
			},
			getImgArr(){
				let that = this
				uni.getStorage({
					key: "imgArr",
					success(res){
						that.imgArr = res.data
						uni.removeStorage({
						    key: 'imgArr',
						    success: function (res) { }
						});
					}
				})
			},
			getcommentTitle(){
				let that = this
				uni.getStorage({
					key: "commentTitle",
					success(res){
						that.titleVal = res.data
						uni.removeStorage({
						    key: 'commentTitle',
						    success: function (res) { }
						});
					}
				})
			},
			getcommentContent(){
				let that = this
				uni.getStorage({
					key: "commentContent",
					success(res){
						that.contentValue = res.data
						uni.removeStorage({
						    key: 'commentContent',
						    success: function (res) { }
						});
					}
				})
			},
			//图片配置
			upLoad() {
				let that = this;
				uni.chooseImage({
					count: 3, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定 是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: (res) => {
						uni.showLoading({
							title: '图片上传中...',
							mask: true,
							icon: 'loading'
						})
						that.tempFilePaths = res.tempFilePaths;
						if(that.tempFilePaths.length > 1){
							for(let i of that.tempFilePaths) {
								that.uploadQiniu(i)
							}
						}else if(that.tempFilePaths.length == 1) {
							that.uploadQiniu(that.tempFilePaths[0]);
							
						}
					}
				})
			},
			//上传图片到七牛
			uploadQiniu(fileUrl){
				let that = this;
				uni.uploadFile({
					url: 'https://upload-z2.qiniup.com',
					name: 'file',
					filePath: fileUrl,
					header: {
					    "Content-Type": "multipart/form-data"
					},
					formData: {
					    token: that.qiniToken,
					},
					success: resData =>{//
						that.unLoadImgArr.push(d1.QiNiuImgDomainName+JSON.parse(resData.data).key)
						if(that.unLoadImgArr.length == that.tempFilePaths.length){
							that.imgArr = that.unLoadImgArr
						}
					},
					fail: res => {}
				})
			}
        },
		onLoad(e){
			if(e.city){
				this.currProvince = e.city
			}else {
				this.getPostion()
			}
			uni.showToast({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.articleTags = e.type
			uni.setNavigationBarTitle({
			    title: '发帖('+e.type || ''+')' 
			})
			this.getQiNiuToken()
			this.getImgArr()
			this.getcommentTitle()
			this.getcommentContent()
		}
		
		
    }
</script>

<style scoped lang='scss'>
	@import "@/styles/posting.scss";
	
</style>