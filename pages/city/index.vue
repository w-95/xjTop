<template>
    <view>
        <phone-directory :phones="phones" @paramClick="paramClick" :defCity='city'></phone-directory>
    </view>
</template>

<script>
    import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	import data from '../../common/data/d1.js'
    export default {
        name:"phones",
        components:{
            phoneDirectory
        },
        data() {
            return {
                //示例数据
                phones: {},
				city: '',
				type: ''
            }
        },
        methods : {
            paramClick (e) {
                uni.navigateTo({
                	url: '../posting/index?city='+e.name+'&type='+this.type
                })
            }
        },
		onLoad(e){
			let that = this
			that.type = e.type
			uni.showLoading({
				title: '加载中...',
				mask: true,
				icon: 'loading'
			})
			this.phones = data.phones 
			uni.setNavigationBarTitle({
			    title: '选择城市' 
			})
			uni.getStorage({
				key: "city",
				success(res){
					that.city = res.data
					uni.hideLoading()
				},
				fail(err){
					console.log(err)
					uni.hideLoading()
				}
			})
		}
		
		
    }
</script>

<style>

</style>