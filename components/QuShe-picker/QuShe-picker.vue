<template>
		<view :style="{'z-index': zIndex}" @touchmove.prevent.stop="voidFc()" @tap.prevent.stop="voidFc()">
			<view 
			class="mask" 
			:class="showPicker?'show':'hide'" 
			:style="{'z-index': Number(zIndex) + 1}"
			 @touchmove.prevent.stop="voidFc()" 
			 @tap.prevent.stop="hide()"></view>
			<view 
			class="flex_column" 
			:class="[mode||'middle', showPicker?'show':'hide']" 
			:style="'z-index:' + (Number(zIndex) + 2) + ';'" 
			@touchmove.prevent.stop="voidFc()" 
			@tap.prevent.stop="voidFc()">
				<view class="flex_column" :class="(mode||'middle') + '_view'" :style="{'height': heightSize}">
					<block v-if="mode==='bottom'">
						<view class="flex_row_between_c width100 padding20rpx" :style="{'font-size': titleSize, 'background-color': bgColor_title||'#f8f8f8'}">
							<view class="flex_row_none_c width250rpx " :style="{'color': buttonSet.cancleColor||'#ADADAD'}" @tap="hide()">
								{{buttonSet.cancleName||'取消'}}
							</view>
							<view class="flex_row_c_c width250rpx" :style="{'color': titleColor||'#999'}">
								{{title||''}}
							</view>
							<view class="flex_row_e_c width250rpx" :style="{'color': buttonSet.confirmColor||'#3399FF'}" @tap="confirm()">
								{{buttonSet.confirmName||'确定'}}
							</view>
						</view>
					</block>
					<block v-else-if="mode==='middle'">
						<view class="flex_row_c_c width100 padding20rpx" :style="{'font-size': titleSize, 'background-color': bgColor_title||'#f8f8f8', 'color': titleColor||'#999'}" v-if="title">
							{{title||''}}
						</view>
					</block>
					<picker-view :indicator-style="'height:' + wH*(lineHeight||.09) + 'px;' + indicator_style" class="width100 height100 backgroundColor_white" :style="{'font-size': contentSize, 'color': contentColor||'black'}" :value="value" @change="bindChange($event)">
						<block v-if="type==='date'">
							<picker-view-column v-if="setObj.dateMode>=1">
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view>
							</picker-view-column>
							<picker-view-column v-if="setObj.dateMode>=2">
								<!-- #ifndef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 12" :key="picker_index">{{picker_item+1}}月</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 12" :key="picker_index">{{picker_item}}月</view>
								<!-- #endif -->
							</picker-view-column>
							<picker-view-column v-if="setObj.dateMode>=3">
								<!-- #ifndef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item+1}}日</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view>
								<!-- #endif -->
							</picker-view-column>
							<picker-view-column v-if="setObj.dateMode>=4">
								<!-- #ifndef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 24" :key="picker_index">{{picker_item}}时</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 24" :key="picker_index">{{picker_item-1}}时</view>
								<!-- #endif -->
							</picker-view-column>
							<picker-view-column v-if="setObj.dateMode>=5">
								<!-- #ifndef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 60" :key="picker_index">{{picker_item}}分</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 60" :key="picker_index">{{picker_item-1}}分</view>
								<!-- #endif -->
							</picker-view-column>
							<picker-view-column v-if="setObj.dateMode>=6">
								<!-- #ifndef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 60" :key="picker_index">{{picker_item}}秒</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="flex_row_c_c" v-for="(picker_item,picker_index) in 60" :key="picker_index">{{picker_item-1}}秒</view>
								<!-- #endif -->
							</picker-view-column>
						</block>
					</picker-view>
					<block v-if="mode==='top'">
						<view class="flex_row_between_c width100 padding20rpx" :style="{'font-size': titleSize, 'background-color': bgColor_title||'#f8f8f8'}">
							<view class="flex_row_none_c width250rpx " :style="{'color': buttonSet.cancleColor||'#ADADAD'}" @tap="hide()">
								{{buttonSet.cancleName||'取消'}}
							</view>
							<view class="flex_row_c_c width250rpx" :style="{'color': titleColor||'#999'}">
								{{title||''}}
							</view>
							<view class="flex_row_e_c width250rpx" :style="{'color': buttonSet.confirmColor||'#3399FF'}" @tap="confirm()">
								{{buttonSet.confirmName||'确定'}}
							</view>
						</view>
					</block>
				</view>
				<view class="flex_row" style="margin-top: 20px;" v-if="mode==='middle'">
					<view class="flex_row_c_c width50">
						<button :type="buttonSet.cancelType||'default'" @tap="hide()" :style="classObj.btnSize + (buttonSet.cancelStyle||'')">{{buttonSet.cancelName||'取消'}}</button>
					</view>
					<view class="flex_row_c_c width50">
						<button :type="buttonSet.confirmType||'primary'" @tap="confirm()" :style="classObj.btnSize + (buttonSet.confirmStyle||'')">{{buttonSet.confirmName||'确定'}}</button>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	import _app from './app.js';

	var provinceData = {};
	var cityData = {};
	var areaData = {};
	var streetData = {};
	const Sys = uni.getSystemInfoSync();
	const wH = Sys.screenHeight;
	const wW = Sys.screenWidth;
	export default {
		name: 'QS-picker',
		props: {
			pickerId: {
				type: String,
				default: '未定义Id'
			},
			/* show: { //控制是否弹出
				type: Boolean,
				default: false
			}, */
			type: { //类型
				type: String,
				default: 'date'
			},
			height: { //picker高度
				type: Number,
				default: 0
			},
			lineHeight: {
				type: Number,
				default: .09
			},
			indicator_style: { //picker单行样式
				type: String,
				default: ''
			},
			fontscale: { //picker内文字大小
				type: Number,
				default: .02
			},
			width: { //picker宽度
				type: Number,
				default: .8
			},
			buttonSet: { //按钮设置
				type: Object,
				default () {
					return {};
				}
			},
			dataSet: { //各类型携带的数据
				type: Object,
				default () {
					return {};
				}
			},
			showReset: { //每次显示是否重置value
				type: Boolean,
				default: false
			},
			title: { //title标题
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'bottom'
			},
			zIndex: {
				type: [Number, String],
				default: 9999
			},
			bgColor_title: {
				type: String,
				default: '#F8F8F8'
			},
			autoHide: {
				type: Boolean,
				default: true
			},
			titleColor: {
				type: String,
				default: '#999'
			},
			contentColor: {
				type: String,
				default: 'black'
			}
		},
		data() {
			return {
				showPicker: false,
				setObj: {},
				//date
				years: [],
				days: 0,
				value: [],
				//city、provincialStreet
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				//provincialStreet
				streetDataList: [],
				defaultValue: [],
				wH,
				classObj: {
					btnSize: 'font-size: ' + (wH * (this.fontscale + .005)) + 'px;',
				}
			};
		},
		computed: {
			heightSize() {
				if(this.mode==='middle') {
					return wH*(this.height||.3) + 'px';
				}else{
					return wH*(this.height||.45) + 'px';
				}
			},
			titleSize() {
				return (wH * (this.fontscale + .002)) + 'px';
			},
			contentSize() {
				return (wH * this.fontscale) + 'px';
			}
		},
		watch: {
			dataSet() {
				this.init();
			},
			showPicker(n, o) {
				if (n && this.showReset) {
					let defaultValue = this.defaultValue;
					switch (this.type) {
						case 'date':
							let data = _app.countDays(this.years[defaultValue[0]], defaultValue);
							this.days = data.days;
							this.value = data.val;
							break;
						default:
							break;
					}
					this.value = [...defaultValue];
				}
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				let value = [];
				let setObj = {};
				//date
				let years = [];
				let days = 0;
				// city、provincialStreet
				let provinceDataList;
				let cityDataList;
				let areaDataList;
				//provincialStreet
				let streetDataList;
				
				switch (this.type) {
					case 'date': //date
						setObj = _app.creatDateObj(this.dataSet);
						console.log('setObj: ' + JSON.stringify(setObj));
						let defaultDate = setObj.defaultValue;
						years = _app.countYears(setObj.startYear || (new Date().getFullYear() - 5), setObj.endYear || (new Date().getFullYear() +
							5));
						let endYear = years[years.length - 1];
						let defaultYear = defaultDate.getFullYear(),
							defaultMonth = defaultDate.getMonth(),
							defaultDay = defaultDate.getDate(),
							defaultHour = defaultDate.getHours(),
							defaultMinute = defaultDate.getMinutes(),
							defaultSecond = defaultDate.getSeconds();
						let compareY = defaultYear > endYear;
						let year = compareY ? endYear : defaultYear;
						let month = compareY ? 11 : defaultMonth;
						defaultDate[1] = month;
						days = _app.countDays(year, defaultDate).days;
						let dm = setObj.dateMode;
						if (dm >= 1) {
							if (compareY)
								value.push(years.length - 1);
							else
								for (let i = 0; i < years.length; i++) {
									if (year == years[i]) {
										value.push(i);
									}
								}
						}
						if (dm >= 2) value.push(compareY ? 11 : month);
						if (dm >= 3) value.push(compareY ? days : defaultDay - 1);
						if (dm >= 4) value.push(defaultHour);
						if (dm >= 5) value.push(defaultMinute);
						if (dm >= 6) value.push(defaultSecond);
							//date
						this.years = years;
						this.days = days;
						this.setObj = setObj;
						console.log('-----------------------------')
						console.log(setObj)
						break;
					default:
						break;
				}
				let defaultValue = [...value];
				this.value = value;
				this.defaultValue = defaultValue;
			},
			bindChange({
				detail: {
					value
				}
			}) {
				// console.log(JSON.stringify(e))
				let changevalue;
				switch (this.type) {
					case 'date':
						let data = _app.countDays(this.years[value[0]], value);
						this.days = data.days;
						this.value = data.val;
						break;
					default:
						this.value = value;
						break;
				}
			},
			confirm() {
				let type = this.type;
				let value = this.value;
				let obj = {
					type,
					value,
					pickerId: this.pickerId
				}
				let setObj = this.setObj;
				let data;
				switch (type) {
					case 'date':
						data = '';
						let dateFormatArray = setObj.dateFormatArray;
						console.log('dateFormatArray：' + JSON.stringify(dateFormatArray));
						for (let i = 1; i <= this.setObj.dateMode; i++) {
							if (i <= 6) {
								let j = i - 1;
								let f = i - 2;
								switch (i) {
									case 1:
										data += this.years[value[j]];
										break;
									case 2:
										data += dateFormatArray[f] + (value[j] + 1);
										break;
									case 3:
										data += dateFormatArray[f] + (value[j] + 1);
										break;
									default:
										data += dateFormatArray[f] + value[j];
										break;
								}
							}
						}
						break;
					default:
						break;
				}
				obj.data = data;
				this.$emit('confirm', obj);
				console.log(this.autoHide)
				if(this.autoHide)
					this.hide();
			},
			_getprovincialStreetLabel() {
				let pcikerLabel =
					this.provinceDataList[this.value[0]].label +
					'-' +
					this.cityDataList[this.value[1]].label +
					'-' +
					this.areaDataList[this.value[2]].label +

					(this.streetDataList[this.value[3]] ? '-' + this.streetDataList[this.value[3]] : '');
				return pcikerLabel;
			},
			_getLabel() {
				let pcikerLabel =
					this.provinceDataList[this.value[0]].label +
					'-' +
					this.cityDataList[this.value[1]].label +
					'-' +
					this.areaDataList[this.value[2]].label;
				return pcikerLabel;
			},
			_getCityCode() {
				return this.areaDataList[this.value[2]].value;
			},
			show() {
				this.showPicker = true;
				this.$emit('showQSPicker', {
					pickerId: this.pickerId,
					type: this.type
				});
			},
			hide() {
				this.showPicker = false;
				this.$emit('hideQSPicker', {
					pickerId: this.pickerId,
					type: this.type
				});
			},
			voidFc() {}
		}
	}
</script>

<style scoped>
	/* middle */
	.middle{
		position: fixed;
		left: 50%;
		top: 50%;
		opacity: 0;
		pointer-events: none;
		perspective: 2500upx;
		transition: all .3s ease-in-out;
	}
	
	.middle.show{
		transition-delay: .3s;
		transform: translate(-50%, -50%);
		pointer-events: auto;
		opacity: 1;
	}
	
	.middle.hide{
		transform: translate(-50%, -50%);
		opacity: 0;
		pointer-events: none;
	}
	
	.middle_view{
		background-color: #FFF;
		border-radius: 15upx;
		overflow: hidden;
		width: 80vw;
	}
	
	/* bottom */
	.bottom{
		position: fixed;
		left: 0;
		bottom: 0;
		pointer-events: none;
		perspective: 2500upx;
		transition: all .3s ease-in-out;
		transform: translateY(100%);
	}
	
	.bottom.show{
		transform: translateY(0);
		pointer-events: auto;
	}
	
	.bottom.hide{
		transform: translateY(100%);
		pointer-events: none;
	}
	
	.bottom_view{
		width: 100vw;
		background-color: white;
	}
	
	/* top */
	.top{
		position: fixed;
		left: 0;
		top: 0;
		pointer-events: none;
		perspective: 2500upx;
		transition: all .3s ease-in-out;
		transform: translateY(-100%);
	}
	
	.top.show{
		transform: translateY(0);
		pointer-events: auto;
	}
	
	.top.hide{
		transform: translateY(-100%);
		pointer-events: none;
	}
	
	.top_view{
		width: 100vw;
		background-color: white;
	}
	
	/* mask */
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		opacity: 0;
		background-color: rgba(0,0,0,.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
	}
	.mask.show{
		opacity: 1;
		pointer-events: auto;
	}
	.mask.hide{
		opacity: 0;
		transition: all .3s ease-in-out .3s;
		pointer-events: none;
	}
	
	.flex_column_c_c {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.text_align_center {
		text-align: center;
	}
	
	/* flex */
	.flex_1 {
		flex: 1;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}

	.flex_row_e_none {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.flex_column_c_c {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.flex_row_none_c {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.flex_row_e_c {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.flex_row_between_c {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	/* width height */
	.width50 {
		width: 50%;
	}
	.width100 {
		width: 100%;
	}
	.width250rpx{
		width: 250rpx;
	}
	.height100 {
		height: 100%;
	}
	
	/* padding */
	.padding20rpx{
		padding: 20rpx;
	}
	
	view, block, botton, text, picker, picker-view picker-view-column {
		box-sizing: border-box;
	}
	
	.backgroundColor_white{
		background-color: white;
	}
</style>
