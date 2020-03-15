<template>
	<view class="phone-main" :style="{height: winHeight + 'px'}">
		<view class="phone-main-search">
			<input class="phone-main-input" type="text" placeholder="请输入城市名或拼音查询"/>
		</view>
		<view class='city' v-if="defCity != ''">
			<text>{{defCity}}</text>
			<text class='gps'>GPS定位</text>
		</view>
		<view class="phoneDirectory">
			<phone-list 
			:phones="phones" 
			:letter="letter"
			:scrollAnimationOFF="scrollAnimationOFF" 
			@change="handlePhoneListIndex"
			@reset="handleReset"
			@handleClick="handleClick"
			>
			</phone-list>
			
			<phone-alphabet 
			:phones="phones"
			:phoneListIndex="phoneListIndex"
			@change="handleDatasetKey" 
			@scrollAnimationOFF="handleScrollAnimationOFF"
			@reset="handleReset"
			>
			</phone-alphabet>
		</view>
	</view>
</template>

<script>
	import phoneList from './phone-list.vue'
	import phoneAlphabet from './phone-alphabet.vue'
	export default {
		name:"phone-directory",
		components:{
			phoneList,
			phoneAlphabet
		},
		props:{
			phones:Object,
			default:false,
			defCity:{
				type: String,
				default: ''
			}
		},
		data () {
			return {
				winHeight:0,
				letter : 'A',
				scrollAnimationOFF:true,
				phoneListIndex:'A',
				reset:true,
			}
		},
		computed:{
			phonesEscape () {
				return escape(JSON.stringify(this.phones))
			}
		},
		mounted () {
			let windowHeight = uni.getSystemInfoSync().windowHeight
			
			// #ifndef APP-PLUS
			this.winHeight = windowHeight
			//#endif
			
			//#ifdef APP-PLUS
			this.winHeight = windowHeight - 56
			//#endif
			
 			if(!this.phones){
				uni.showToast({
					title: '没有数据',
					icon:"none",
					mask: false,
					duration: 1500
				})
			}
		},
		methods:{
			//
			goSearch(){
				
			},
			handleClick (e) {
				this.$emit('paramClick',e)
			},
			handleDatasetKey (val) {
				this.letter = val
			},
			handleScrollAnimationOFF (val) {
				this.scrollAnimationOFF = val
			},
			handlePhoneListIndex(val){
				if(this.reset){
					this.phoneListIndex = val
				}
			},
			handleReset (val){
				if(val){
					this.letter = ''
				}
				this.reset = val
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.phone-main{
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.phoneDirectory{
	display: flex;
	flex-direction: row;
}
.phone-main-search{
	background-color: #EEEEEE;
	padding: 10upx 20upx;
	border-bottom: 1px solid #e5e5e5;
}

.phone-main-input{
	font-size:28upx;
	border: 1px solid #e5e5e5;
	border-radius: 20px;
	background-color: #fff;
	padding: 10upx 20upx 10upx 20upx;
}
.city{
	font-size: 28upx;
	background-color: #fff;
	box-sizing: border-box;
	padding: 20upx 20upx;
}
.gps{
	color: #999999;
	margin-left: 20upx;
}
</style>
