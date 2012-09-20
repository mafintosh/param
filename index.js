var fs = require('fs');
var path = require('path');

var file = function() {
	var index = process.argv.indexOf('--config');
	if (index > -1) return require(fs.realpathSync(process.argv[index+1]));
	var type = process.APP_ENV || process.NODE_ENV || 'development';
	var base = process.cwd();

	while (true) {
		var file = [
			path.join(base,type+'.json'),
			path.join(base,'config',type+'.json'),
			path.join(base,type+'.js'),
			path.join(base,'config',type+'.js')
		].filter(fs.existsSync || path.existsSync)[0];

		if (file) return require(file);
		if (base === path.join(base,'..')) return {};
		base = path.join(base,'..');
	}
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
	obj[last] = value;
};
process.argv.filter(function(arg) {
	return arg[0] === '-';
}).forEach(function(key) {
	var value = process.argv[process.argv.indexOf(key)+1];
	set(key.replace(/^\-+/g,''), parse(!value || value[0] === '-' || value));
});

module.exports = get;