<template>
	<view>
		<web-view :src="path"></web-view>
	</view>
</template>

<script>
		import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
			}
		},
		onLoad(option) {
		},
		computed: {
			...mapState({
				path: state => state.path
			})
		},
	}
</script>

<style>
</style>
