var config = require('./config.js')
 
// 获取领域分类
var getDomain = function(e){
	return config.getRequest("domains",e);
}
//根据领域获取帖子列表
var getDomainList = function (e){
	return config.getRequest("domains",e);
}
//搜索关键字
var searchKeyWord = function (e){
	return config.getRequest("article/search",e);
}
//获取帖子详情
var getListDetail = function (e){
	return config.getRequest("article",e);
}
//获取帖子评论
var getComments = function (e){
	return config.getRequest("article/comments",e);
}
//发布评论
var releaseComment = function (e){
	return config.postRequest("comment",e);
}
//用户登录
var userLogin = function (e){
	return config.postRequest("login",e);
}
//点赞
var fabulous = function(e){
	return config.postRequest("vote/up/comment",e)
}
//发帖
var sengComment = function(e){
	return config.postRequest("article/add",e)
}
//举报
var report = function(e){
	return config.postRequest("report",e)
}
//获取用户的帖子列表
var getUserArticles = function (e){
	return config.getRequest("user/articles",e);
}
//获取用户回帖列表
var getUserComments = function (e){
	return config.getRequest("user/comments",e);
}
//获取七牛token
var getUploadToken = function (e){
	return config.getRequest("upload/token",e);
}
//获取openid
var getWxchatOpenid = function (e){
	return config.getRequest("wxchat/openid",e);
}
//获取微信手机号
var getWxchatPhone = function (e){
	return config.postRequest("wxchat/phone",e);
}
//获取官方帖子信息
var getOffice = function (e){
	return config.getRequest("article/office",e);
}
//获取首页最新帖子
var getIndexComment = function (e){
	return config.getRequest("article/latest",e);
}
//获取用户领域列表
var getUserList = function (e){
	return config.postRequest("user/domains",e);
}
//用户选择默认领域
var getDefaulelist = function (e){
	return config.getRequest("user/add/domain",e);
}
//获取用户某个领域权限
var getUserDiction = function (e){
	return config.getRequest("user/domain/permission",e);
}
//获取申请列表，管理员
var getApplyDomains = function (e){
	return config.getRequest("user/apply/domains",e);
}
//开通和更新某个领域,管理员
var getUpdateDomains = function (e){
	return config.getRequest("user/update/domains",e);
}
//删除某个用户的领域权限
var DetailDomain = function (e){
	return config.getRequest("user/delete/domain",e);
}
//获取用户申请的权限列表，包含开通和申请
var getOwnDomain = function (e){
	return config.getRequest("user/own/domain",e);
}
//提交申请
var getAddDomain = function (e){
	return config.getRequest("user/add/domain",e);
}
//关注,取消关注
var follow = function(e){
	return config.getRequest("follow",e)
}
//获取关注人列表
var getFollowList = function(e){
	return config.getRequest("list/follow",e)
}
//获取用户列表
var getRootUserList = function(e){
	return config.getRequest("users",e)
}
//获取管理员发送用户列表
var getRootMessageList = function(e){
	return config.getRequest('admin/messages',e)
}
var getRootUserMessage = function(e){
	return config.getRequest('user/messages',e)
}
var rootSendMessage = function(e){
	return config.postRequest('add/message',e)
}
//检查关注状态
var checkFollow = function(e){
	return config.getRequest('check/follow',e)
}
//会员查询
var searchUser = function(e){
	return config.getRequest('search/user',e)
}
module.exports = {
    getDomain,
	getDomainList,
	searchKeyWord,
	getListDetail,
	getComments,
	releaseComment,
	fabulous,
	sengComment,
	report,
	getUserArticles,
	getUserComments,
	getUploadToken,
	getWxchatOpenid,
	getWxchatPhone,
	userLogin,
	getOffice,
	getIndexComment,
	getUserList,
	getUserDiction,
	getDefaulelist,
	getApplyDomains,
	getUpdateDomains,
	DetailDomain,
	getOwnDomain,
	getAddDomain,
	follow,
	getFollowList,
	getRootUserList,
	getRootMessageList,
	getRootUserMessage,
	rootSendMessage,
	checkFollow,
	searchUser
}