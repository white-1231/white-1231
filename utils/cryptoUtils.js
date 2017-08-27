var crypto = require('crypto');

/**
 * md5 加密
 */
exports.md5 = function (content) {
	var md5 = crypto.createHash('md5');
	md5.update(content);
	return md5.digest('hex');	
}

/**
 * 转Base64
 */
exports.toBase64 = function(content){
	return new Buffer(content).toString('base64');
}

/**
 * 回转Base64
 */
exports.fromBase64 = function(content){
	return new Buffer(content, 'base64').toString();
}