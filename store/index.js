import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		city: '', // 城市
		auth: null, // 用户信息
		phone: '' ,//绑定微信的手机号
		openData: null,//openId and session_key
		userId: '',//用户Id
		oIdVal: '',
		isDetails: false, //是否进入到详情页
		detailData: {
			id: '',
			title: ''
		},
		//已开通列表进入开通领域的当前项
		itemDomain:{}
	},
	mutations: {
		setCity(state, val) {
			state.city = val;
		},
		setPhone(state, val) {
			state.phone = val;
		},
		setOpenData(state, val) {
			state.openData = val;
		},
		setAuth(state, val) {
			state.auth = val;
		},
		setUserId(state, val) {
			state.auth = val;
		},
		setOidVal(state, val) {
			state.oIdVal = val;
		},
		setIsDetails(state, val) {
			state.isDetails = val;
		},
		setDetailData(state, val) {
			state.detailData = val;
		},
		setItemDomain(state, val) {
			state.itemDomain = val;
		},
		emptyAuth (state) {
			state.auth = null;
		}
	}
})

export default store
