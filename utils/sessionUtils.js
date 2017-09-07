// /**
//  * 结果枚举
//  */

//  var HAVE_NO_USER = 1;
//  var HAVE_NO_PROJECT = 2;
//  var NO_SIGN = 3;


/**
 * 检查session登录
 * @return 1 登录状态正常
 * @return -1 未登录或者丢失用户
 * @return -2 丢失用户ID
 */
exports.checkUsefulSession = function (session) {
    if (session.sign && session.user != null) {
        if (session.user.id == -1) {
            return -2 ;
        } else {
            return 1;
        }
    } else {
        return -1;
    }
}