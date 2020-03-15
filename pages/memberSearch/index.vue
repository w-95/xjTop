<template>
	<view class="box">
		<view class="service-and-specil">
			<view class="title-box">
				<view v-for="(t, i) in areaTitleList" :key="t.id" :class="activeTitleItem == t.id ? 'title-item active' : 'title-item'"
					@click="handleColumnTap(t)">
					<text>{{t.label}}</text>
				</view>
			</view>
		</view>
		<view class="service-and-specil">
			<!-- <input class="uni-input" confirm-type='search' placeholder="请输入用户昵称"/> -->
			<view class="service-column-wrapper animated fadeInLeft" v-if="activeTitleItem == 1">
				<view class="tipss" v-if='arrData.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多申请列表!</view>
				</view>
				<ListBox :listBox='arrData' type='apply' v-else></ListBox>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 2">
				<view class="tipss" v-if='arrData.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多开通列表!</view>
				</view>
				<ListBox :listBox='arrData' type='alreadyOpened' v-else></ListBox>
			</view>
			<view class="service-column-wrapper animated fadeInRight" v-if="activeTitleItem == 3">
				<view class="user-list">
					<icon type="search" size="15" color='#999999'></icon>
					<input class="uni-input" confirm-type='search' placeholder="请输入用户昵称" @click='getFocus' :focus="false" disabled=true/>
					<text class='user-text' @click='goUserList'>用户列表</text>
					<image src="../../static/images/right.png" mode="widthFix" class='right-item'></image>
				</view>
				<view class="tipss" v-if='messageList.length <= 0'>
					<image src="../../static/images/no-comment.png" mode="" alt='i.alt' mode="widthFix" ></image>
					<view>暂无更多开通列表!</view>
				</view>
				<ListBox :listBox='messageList' type='message' v-else></ListBox>
				
			</view>
		</view>
	</view>
	
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import Post from '../../components/user-post/index.vue'
	import ServerList from '../../common/data/d1.js';
	import http from '../../utils/http.js'
	import time from '../../utils/validate.js'
	import ListBox from './listItem/index.vue'
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				activeTitleItem: 1,
				areaTitleList: [{
					id: 1,
					num: 4,
					label: '申请列表'
				},{
					id: 2,
					num: 20,
					label: '已开通列表'
				},{
					id: 3,
					num: 20,
					label: '联系用户'
				}],
				DomainType: 1,
				arrData:[],
				userList: [],
				messageList: [],
				page: 1,
				size: 10
			}
		},
		components: {
			Post,comment,ListBox
		},
		onLoad(e) {
			if(e.type){
				this.activeTitleItem = e.type
				this.DomainType = 0
			}
			this.init(this.DomainType)
		},
		created(){
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			uni.setNavigationBarTitle({
			    title: '领域查询' 
			})
		},
		onReady() {},
		computed: {
			...mapState(['province', 'auth']),
		},
		onShow() {
			this.init(this.DomainType)
		},
		methods: {
			init(type){
				let that = this,arr=[];
				http.getApplyDomains({type:type}).then(data => {
					if(type == 1) {
						arr = data.sort(function(a,b){return a.userCreateTime-b.userCreateTime})
					}else {
						arr = data.sort(function(a,b){return a.userCreateTime-b.userCreateTime})
					}
					if(data.length > 0){
						for(let i of arr){
							i.userCreateTime = time.formatTime(i.userCreateTime,"Y-M-D h:m:s").substring(5);
							if(i.userEndTime){
								i.userEndTime = time.formatTime(i.userEndTime,"Y-M-D h:m:s").substring(5);
							}
						}
					}
					that.arrData = arr || []
					uni.hideLoading()
				})
			},
			getUserList(callBack){
				let params = {
					adminId: this.auth.userId
				},that = this,arr = [];
				http.getRootMessageList(params).then(res => {
					uni.hideLoading()
					arr = res.sort(function(a,b){return a.sendTime-b.sendTime})
					for(let i of arr){
						i.sendTime= time.formatTime(i.sendTime,"Y-M-D")
					}
					that.messageList= arr
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
				if(item.id == 1){ 
					this.DomainType = 1
					this.init(this.DomainType)
				}else if(item.id == 2) {
					this.DomainType = 0
					this.init(this.DomainType)
				}else if(item.id == 3){
					this.getUserList()
				}
			},
			goUserList(){
				uni.navigateTo({
					url: '../userList/index'
				})
			},
			getFocus(){
				uni.navigateTo({
					url: '../searchUser/index'
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/member-search.scss";
</style>

