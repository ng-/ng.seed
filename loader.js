'use strict'
// ng.seed > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
// ng.seed loads an ng app based on the directory structure



var fs  = require('fs'),
log     = require('ng/logger'),
pkg     = require('../../package.json'),
modules = {},
depth   = 1,
types   =
{
	transform:		[],
	interceptor:	[],
	config:			[],
	run:				[],
	node_modules:	[],
	view:				[],
	animate:			[],
	constant:		[],
	controller:		[],
	directive:		[],
	factory:			[],
	filter:			[],
	provider:		[],
	service:			[],
	value:			[]
}

module.exports = load

//Resursive
function load(dir)
{
	fs.readdir(dir, function(err, files)
	{
		depth--

		var split  = dir.split('/')
		var parent = split.pop()
		var module = split.pop()

		//Keep track of our new module and its requires
		if ('node_modules' == module)
		{
			modules[parent] = []
		}

		for (var i in files)
		{
			//Stop if ng.seed or some system file
			if ('ng.seed' == files[i] || '.' == files[i][0])
			{
				continue
			}

			//If directory is a dependent, add it to the requires of its parent
			if ('node_modules' == parent)
			{
				depth++; load(dir+'/'+files[i]);

				modules[module].push(files[i])

				continue
			}

			//Recurse if directory is a special folder
			if (types[files[i]])
			{
				depth++; load(dir+'/'+files[i]);

				continue
			}

			//require() js files
			if ( '.js' == files[i].slice(-3))
			{
				var name = files[i].slice(0, -3)

				var data = require(dir+'/'+files[i])

				types[parent].unshift({module:module, name:name, data:data})
			}

			//readFileSync html files
			if ('.html' == files[i].slice(-5))
			{
				var name = files[i].slice(0, -5).replace(/:/g, '/').replace(/\$/g, ':')

				var data = fs.readFileSync(dir+'/'+files[i], 'utf8')  //Is there a way to make this async

				types[parent].push({module:module, name:name, data:JSON.stringify(data)})
			}
		}

		! depth && require('./register')(modules, types)
	})
}

//fs.watch(dir, {persistent:false}, function(event, file)
//{
//	//.DS_Store is inadvertantly triggering
//	if ('.' == file[0]) return
//
//	//When reloading, we want the new file not the cached one
//	delete require.cache[dir]
//
//	// to prevent CPU-splsions if saving too fast
//	clearTimeout(time)
//
//	//time = setTimeout(function() { load(dir) }, 500)
//})