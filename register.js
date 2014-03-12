'use strict'
// ng.seed > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
// ng.seed loads an ng app based on the directory structure

var log = require('ng/logger')
  , pkg = require('../../package.json')

//Now that recursive, asyncronous load is done, let's syncronously register the modules in ng
module.exports = function(modules, types)
{
	require('ng')(pkg.requires, function(ng)
	{
		//ng is now accessible everywhere!
		global.ng = ng

		//Register our modules
		for (var i in modules)
		{
			var module = ng.module(i, Object.keys(pkg.requires).concat(modules[i]))
		}

		for (var i in types)
		{
			//views are a concept unique to ng.seed and we have to handle them separately because
			//the order of the routes matters for which ones take precedence.  We explicily define
			//the behavior in the specificity function and make sure dependent modules, which are
			//loaded first don't get precedence in case of conflict
			if ('view' == i)
			{
				var when = ''

				types.view = types.view.sort(specificity).map(function(view)
				{
					when += "\n\n.when('/"+view.name+"',{template:"+view.data+"})"
				})

				module.config(Function('$routeProvider',  "$routeProvider"+when))

				continue
			}

			var singleArg = Object.keys(types).slice(0, 4)

			for (var j in types[i])
			{
				var file = types[i][j]

				var args = ~ singleArg.indexOf(i) ? [] : [file.name]

				var type = ng.module(file.module)[i]

				if ('function' == typeof file.data)
				{
					type.apply(null, args.concat(file.data))
				}

				if (file.data.client)
				{
					type.client.apply(null, args.concat(file.data.client))
				}

				if (file.data.server)
				{
					type.server.apply(null, args.concat(file.data.server))
				}
			}
		}

		module.config.server(function()
		{
			log.gray.bold(' in '+process.env.NODE_ENV+' environment')

			for (var i in pkg.ports)
			{
				log('listening for '+pkg.ports[i]+' on port '+i)

				require(pkg.ports[i]).createServer(ng).listen(i)
			}

			log('Use ctrl-c to run in background\n')
		})
	})

	//Load the routes of all the modules into the last (most senior) module of the recursion
	//otherwise dependent routes will get predenece over their parents when there is conflict
	//I believe the preferred behavior here is to make the parent get precedence no matter
	//what and only send to the dependent if there is no other option.  Let me know if I'm wrong.
	//For routes in the same module the most specific ones are loaded first '/arg/:arg?' > '/arg' > '/:arg' > '/:arg?'
	function specificity(a, b)
	{
		function module(type)
		{
			return Object.keys(modules).indexOf(type.module)
		}

		function length(type, split)
		{
			return type.name.split(split).length
		}

		return module(a)     - module(b)
			 || length(b,'/') - length(a,'/')
			 || length(a,':') - length(b,':')
			 || length(a,'?') - length(b,'?')
	}
}