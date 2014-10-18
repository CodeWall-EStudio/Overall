var path = require('path');

// debug 模式, 会输出一些调试用的 log
exports.DEBUG = true;

// ==== 服务器相关的配置 ====================================================
// 服务器运行的端口
exports.PORT = 8199;

// 数据库
exports.DB_URI = 'mongodb://xzone_user:HeMHFxTAMPAjlRVH@127.0.0.1:27017/overall';


// ==== 应用自身相关的配置 ====================================================

// 应用运行的域名
exports.APP_DOMAIN = 'http://localhost:8199';

// cookie 的加密key
exports.COOKIE_SECRET= 'HeMHFxTAMPAjlRVH_secret';

// cookie 的有效时间
exports.COOKIE_TIME = 24 * 60 * 60 * 1000; // 24 小时

exports.STATIC_FILE_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 静态文件的过期时间 7 天

// 允许新媒体跨域上传和下载资源的 host
exports.XHR2_ALLOW_ORIGIN = [  ];


// CAS 的登录接口
exports.CAS_BASE_URL = 'http://dand.71xiaoxue.com:80/sso.web';

// 获取用户详细资料的CGI
exports.CAS_USER_INFO_CGI = 'http://mapp.71xiaoxue.com/components/getUserInfo.htm';

// 获取用户组织列表单cgi
exports.CAS_ORG_TREE_CGI = 'http://mapp.71xiaoxue.com/components/getOrgTree.htm';
