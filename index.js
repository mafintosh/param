var fs = require('fs');
var path = require('path');
var findModule = require('find-module');

var file = function() {
	var index = process.argv.indexOf('--config');
	var env = process.env.NODE_ENV || 'development';
	var filename = index === -1 ? findModule(env, {modules:'config'}) : fs.realpathSync(process.argv[index+1]);

	return require(filename);
}();
var parse = function(value) {
	return typeof value === 'string' && Number(value).toString() === value ? Number(value) : value;
};
var get = function(keys) {
	return !keys ? conf : keys.split('.').reduce(function(value, key) {
		return value && value[key];
	}, file);
};
var set = function(keys, value) {
	keys = keys.split('.');
	var last = keys.pop();
	var obj = keys.reduce(function(obj, key) {
		return obj[key] = obj[key] || {};
	}, file);
	return obj[last] = value;
};

process.argv.filter(function(arg) {
	return arg[0] === '-';
}).forEach(function(key) {
	var value = process.argv[process.argv.indexOf(key)+1];
	set(key.replace(/^\-+/g,''), parse(!value || value[0] === '-' || value));
});

module.exports = function(key, value) {
	return value ? set(key, value) : get(key);
};