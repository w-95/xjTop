<template>
	<view class="box">
		<view class='add-bor'>
			<view class='top'>
				<view class='logo-img'>
					<image :src="userData.user.userAvatarURL"></image>
				</view>
				<view class='logo-title'>
					<text>{{userData.user.userName}}</text>
					<view>123456789</view>
				</view>
				
			</view>
			<view class='nav'>
				<view class='nav-title'>已有领域</view>
				<view class='area-box' v-if='arrData.length> 0'>
					<view v-for='(item,index) in arrData' :key='index' class='item' @click='detailType(item,index)'>
						<view>
							<image :src="item.domain.domainIconPath" mode="widthFix"></image>
						</view>
						<text>{{item.domainURI}}</text>
					</view>
				</view>
				<view class='area-none' v-else>暂未开通领域</view>
			</view>
		</view>
		<view class='active'>
			<view class='active-title'>申请开通领域</view>
			<view class='area'>
				<view class='area-type'>
					<image :src="userData.domain.domainIconPath"></image>
					<view>{{userData.domainURI}}</view>
				</view>
				<view class='time' @click="changeShow('QS_Picekr_date')">{{defaultTimeTips}}</view>
				<QSpicker title="请选择日期时间" 
						  mode="bottom" 
						  type="date" 
						  ref="QS_Picekr_date" 
						  pickerId="date_1" 
						  :dataSet="dateSet" 
						  :autoHide="false" 
						  contentColor="#3C3C3C" 
						  :lineHeight=".05" 
						  @hideQSPicker="hideQSPicker($event)" 
						  @showQSPicker="showQSPicker($event)" 
						  @confirm="confirmTime($event)">
				</QSpicker>
				<modal v-model="show" :text='toastTips' @cancel='cancel' @confirm='confirm' @event='event'></modal>
				<button class='open' @click='openDomain'>确定开通</button>
				<button open-type='contact' class='kefu' session-from='weapp'>
					<image src='../../static/images/tips.png'></image>
					联系客服
				</button> 
			</view>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/http.js';
	import QSpicker from '@/components/QuShe-picker/QuShe-picker.vue';
	import Modal from '@/components/x-modal/x-modal.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				dateSet: {
					dateMode: 3,
					dateFormatArray: ['-', '-', ' ', ':', ':']
				},
				toastTips: '',
				show: false,
				arrData: [],
				detailindex: null,
				userData: {},
				defaultTimeTips: '请选择时间',
				clearItem: {}
			}
		},
		components: {QSpicker,Modal},//
		onReady() {},
		computed: {
			...mapState(['itemDomain']),
		},
		created(){
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			});
			uni.setNavigationBarTitle({
			    title: '开通领域' 
			})
			this.init()
			this.initTime()
		},
		onShow() {},
		methods: {
			//补0
			twoDigits(val) {
				if (val < 10) return "0" + val;
					return val;
			},
			//获取当前时间
			getDate(){
				var timezone = 8;
				var offset_GMT = new Date().getTimezoneOffset();
				var nowDate = new Date().getTime();
				var today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
				var date = today.getFullYear() + "-" + this.twoDigits(today.getMonth() + 1) + "-" + this.twoDigits(today.getDate());
				var time = this.twoDigits(today.getHours()) + ":" + this.twoDigits(today.getMinutes()) + ":" + this.twoDigits(today.getSeconds());
				return date + '  ' + time
			},
			//初始化当前时间往后一个月
			initTime(){
				var translateDate = "", dateString = "", monthString = "", dayString = "";
				translateDate = this.getDate().replace("-", "/").replace("-", "/"); ;
				var newDate = new Date(translateDate);
				newDate = newDate.valueOf();
				newDate = newDate + 30 * 24 * 60 * 60 * 1000; //备注 如果是往前计算日期则为减号 否则为加号
				newDate = new Date(newDate);
				//如果月份长度少于2，则前加 0 补位
				if ((newDate.getMonth() + 1).toString().length == 1) {
				monthString = 0 + "" + (newDate.getMonth() + 1).toString();
				} else {
				monthString = (newDate.getMonth() + 1).toString();
				}
				//如果天数长度少于2，则前加 0 补位
				if (newDate.getDate().toString().length == 1) {
				dayString = 0 + "" + newDate.getDate().toString();
				} else {
				dayString = newDate.getDate().toString();
				}
				dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
				this.defaultTimeTips = '到期日期：'+dateString
				this.defaultTime = dateString
			},
			//点击领域的item
			detailType(item,index){
				console.log(item)
				this.clearItem = item
				this.show = !this.show
				this.toastTips = "确定要关闭'"+item.domain.domainTitle+"'领域的权限吗"
				this.detailindex = index
			},
			changeShow(name) {
				this.$refs[name].show();
			},
			showQSPicker(res) {},
			hideQSPicker(res) {},
			confirmTime(res) {
				let arr = res.data.split("-")
				this.$refs['QS_Picekr_date'].hide();
				this.defaultTime = res.data
				this.defaultTimeTips = '到期日期：'+arr[0]+'年'+ (arr[1]< 10 ? '0'+arr[1] : arr[1])+'月'+(arr[2]< 10 ? '0'+arr[2] : arr[2])+'日'
			},
			//取消弹框
			cancel(e){},
			//确认弹框
			confirm(e){
				this.arrData.splice(this.detailindex,1)
				this.detailDomain()
			},
			//点击确认取消的回调
			event(e){},
			detailDomain(){
				let that = this
				http.DetailDomain({oid: that.clearItem.oId}).then(res =>{
					uni.showToast({
						title: '删除领域成功!',
						icon: 'none'
					})
				})
			},
			init(){
				let that = this
				console.log(that.itemDomain,"－－+++++++++")
				if(JSON.stringify(that.itemDomain) != '{}') {
					that.userData = that.itemDomain
					that.getDomainsList(that.itemDomain.userId)
				}
			},
			getDomainsList(id){
				let that = this
				http.getOwnDomain({userId: id,type:0}).then(data => {
					that.arrData = data
					uni.hideLoading()
				})
			},
			openDomain(){
				if(this.defaultTimeTips == '请选择时间'){
					uni.showToast({
						title: '请选择开通时间',
						icon: 'none'
					})
				}else {
					this.updataDomain()
				}
			},
			updataDomain(){
				let that = this
				let params = {
					oid: that.userData.oId,
					endTime: new Date(that.defaultTime).getTime()
				}
				http.getUpdateDomains(params).then(res => {
					uni.showToast({
						title: '开通领域成功',
						icon: 'none',
						duration: 3000
					})
					uni.navigateTo({
						url: '../memberSearch/index?type=2'
					})
					// this.init()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/open-area.scss";
</style>
