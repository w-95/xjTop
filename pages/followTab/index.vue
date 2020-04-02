<template>
	<view class="box">
		<view class="service-and-specil" style='border-bottom: 1px solid #eeeeee'>
			<view class="title-box">
				<view v-for="(t, i) in areaTitleList" :key="t.id" :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'"
					@click="handleColumnTap(t)">
					<text>{{t.label}}</text>
				</view>
			</view>
		</view>
		<view class="service-and-specil">
			<!-- <input class="uni-input" confirm-type='search' placeholder="请输入用户昵称"/> -->
			<view class="service-column-wrapper animated fadeInLeft" v-if="activeTitleItem == 0">
				<view class="tipss" v-if='followList.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多关注列表!</view>
				</view>
				<ListBox :listBox='followList' type='' v-else></ListBox>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 1">
				<view class="tipss" v-if='fansList.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多粉丝列表!</view>
				</view>
				<ListBox :listBox='fansList' type='' v-else></ListBox>
			</view>
		</view>
	</view>
	
</template>

<script>
	import comment from '../../components/comment/index.vue';
	import Post from '../../components/user-post/index.vue';
	import ServerList from '../../common/data/d1.js';
	import http from '../../utils/http.js';
	import time from '../../utils/validate.js';
	import ListBox from './fansList/index.vue'
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				userId: '',
				activeTitleItem: 0,
				areaTitleList: [{
					id: 0,
					num: 4,
					label: '关注'
				},{
					id: 1,
					num: 20,
					label: '粉丝'
				}],
				DomainType: 0,
				followList:[],
				fansList: []
			}
		},
		components: {
			Post,comment,ListBox
		},
		onLoad(e) {
			if(e.id){
				this.userId = e.id
			}
			uni.setNavigationBarTitle({
			    title: e.name
			})
			this.init(0)
		},
		created(){
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			
			
		},
		onReady() {},
		computed: {
			...mapState(['auth']),
		},
		onShow() {},
		methods: {
			init(type){
				let that = this;
				uni.hideLoading();
				this.getFollowList(0)
			},
			getFollowList(type){
				let params = {
					userId: this.userId,
					type: this.DomainType
				}
				let obj = {}
				http.getFollowList(params).then(res =>{
					uni.hideLoading();
					if(this.DomainType == 0){
						this.followList = res
						//设置cur默认类型为数组，并且初始值为空的数组
					}else{
						this.fansList = res //设置cur默认类型为数组，并且初始值为空的数组
					}
				})
			},
			handleColumnTap(item){
				uni.showLoading({
					title: '加载中...',
					mask: true,
					icon: 'loading'
				});
				this.activeTitleItem = item.id
				this.DomainType = item.id
				this.getFollowList()
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/follow-tab.scss";
</style>

