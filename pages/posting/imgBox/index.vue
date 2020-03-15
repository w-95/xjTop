<template>
    <view class='box'>
	   <view class='img-box'>
			<view v-for='(item,index) in imgArr' :key='index'>
			   <image :src="item" mode="aspectFill"></image>
			   <icon type="clear" size="20" @click='clearImg(index)'/>
			</view>
	   </view>
    </view>
</template>

<script>
    export default {
        name:"phones",
        components:{},
		props: {
			imgArr: {
				type: Array,
				default: () => []
			}
		},
		watch: {
			'imgArr': function(newVal){
				let that = this
				that.$nextTick(()=>{
					that.$emit('nextDom','')
				})
			}
		},
        data() {
            return {}
        },
        methods : {
			clearImg(index){
				this.$emit('clearImg',index)
			}
        },
		onLoad(){}
    }
</script>

<style scoped lang='scss'>
	.box{
		box-sizing: border-box;
		.img-box{
			width: 750upx;
			box-sizing: border-box;
			padding:10upx 20upx;
			display: flex;
			flex-wrap: wrap;
			view{
				width: 150upx;
				height: 150upx;
				border-radius: 20upx;
				margin-right: 20upx;
				margin-top: 20upx;
				overflow: hidden;
				position: relative;
				icon{
					position: absolute;
					top: 20upx;
					right: 20upx;
				}
				image{
					width: 100%;
					height: 200upx;
				}
			}
		}
		
	}
	
</style>