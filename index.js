var fs = require('fs');
var path = require('path');
var resolve = require('resolve');

var opts = {
	basedir:process.cwd(),
	extensions: ['.js', '.json'],
	moduleDirectory:'config'
};

var index = process.argv.indexOf('--config');
var env = process.env.NODE_ENV || 'development';
var filename = index === -1 ? resolve.sync(env, opts) : fs.realpathSync(process.argv[index+1]);
var file = require(filename);

var parse = function(value) {
	return typeof value === 'string' && Number(value).toString() === value ? Number(value) : value;
};

var get = function(keys) {
	return !keys ? file : keys.split('.').reduce(function(value, key) {
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

var inline = function(str) {
	var replace = function(_, name) {
		if (name[0] === '$') return process.env[name.slice(1)];
		if (name[0] === '.') return fs.readFileSync(path.join(path.dirname(filename), name));
		return typeof get(name) === 'string' ? inline(get(name)) : get(name);
	};

	return /^\{([^\}]+)\}$/.test(str) ? replace('', str.slice(1,-1)) : str.replace(/\{([^\}]+)\}/g, replace);
};

var normalize = function(obj) {
	Object.keys(obj).forEach(function(key) {
		if (typeof obj[key] === 'string') obj[key] = inline(obj[key]);
		if (typeof obj[key] === 'object' && obj[key]) normalize(obj[key]);
	});
};
normalize(file);

module.exports = function(key, value) {
	return value ? set(key, value) : get(key);
};