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
				if(this.activeName == ''){
					uni.showToast({
						title: '请选择发帖领域!',
						icon: 'none',
						duration: 1500
					})
					return false
				}
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
				console.log(this)
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
	@import "@/styles/choice-field.scss";
</style>