# ng.seed: create a modular [ng app](https://github.com/ng-/ng)
ng.seed aims to make it dead simple to create a modular application using the [ng framework](https://github.com/ng-/ng)

#####ng is right for you if:
- You want to use npm as a package manager to create, organize, & share ng modules
- You want access to an ecosystem of npm packages (anything with an “ng.” prefix)
- You want a modular application with a matching directory structure
- You want to have simple environmental settings & run on all your server's cores

## getting started
1. *At the command prompt, install [node](http://nodejs.org/api/) if you haven't yet. Install [manually](https://gist.github.com/isaacs/579814) or using:*

		. <(curl https://raw.github.com/ng-/ng.seed/master/node.sh)

	This will install and use the latest stable version of node. Specify a version with `nave use <version>`

2. *Goto the directory where you want your application, and install ng.seed*

		npm install ng.seed     												#if git is not installed
		npm install ng-/ng.seed													#if git is installed

3. *Upon successful installation, you will be prompted to name your application*

		What would you like to name your application? myProject

	Answering `myProject` would create the following
	- `myProject/package.json` this is your config file
	- `myProject/node_modules/ng.seed` this loads your modules
	- `myProject/node_modules/ng.seed/node_modules/ng` the ng framework

4. *Start your application*

		node myProject <environment>

	`<environment>` is available inside your application as `process.env.NODE_ENV` and `process.argv[3]`

	In the browser, `http://localhost:1080` should now display **"Welcome to ng.seed!"**

5. *Continue application in background as a daemon*

		ctrl-c

	Input and output will now be redirected from the terminal to the log files specified in `package.json`

6. *Quit or restart your application*

		node myProject stop|restart

7. *Install modules as dependencies*

		npm install myProject --save <dependency>

	All ng.seed dependencies should begin with an `ng.` prefix

8. *Build your application using this guide & then share it with others!*

		npm publish myProject

## how it works
ng.seed uses your directory structure to organize and load your ng application. The easiest way to learn ng.seed is to explore one of the existing projects built with it listed at the end of this readme.

Starting in `myProject`, ng.seed recursively searches for folders named `node_modules`. Each of these folders becomes an ng module. If a module has a `node_modules` folder, then those dependencies are loaded and their names are automatically entered into the parent module's "requires" array.

Each module can contain any number of files and folders, however, folders named after an ng service (e.g., `animate`, `config`, `constant`, `controller`, `directive`, `factory`, `filter`, `provider`, `run`, `service`, `value`, `stack`, `parse`) will have their files registered into your ng application as that type.

ng.seed will use the filename without the extension as the name it registers with ng. For example, `myProject/node_modules/module1/factory/example.js` would register myProject as `ng.module('myProject', ['module1'])`, module1 as `ng.module('module1', [])`, and - finally - example.js as `ng.module('module1').factory('example', <module.exports>)`.

## define services
You define services much like you would in node.js or angular.  To elaborate on the example above, `myProject/factory/example.js` could look like this
```javascript
module.exports = function(dependency1, dependency2)
{
	// I am initialization code that runs only once
	// the first time that this factory is injected

	return {
		// I am the object that is available to service that injected me
	}
}
```

As with ng, the default is identical client & server behavior.  To exert more fine-grained control over
```javascript
exports.client = function(dependency1, dependency2)
{
	return //injecting "example" on client is completely different than on the server
}

exports.server = function(dependency3, dependency4)
{
	return //injecting "example" on server is completely different than on the client
}
```

## dependencies
ng.seed has three type of dependencies:
1. angular modules - precompiled modules such as ngRoute, ngCookies, uiBootstrap
2. ng.seed modules - npm packages starting with `ng.` that will compile into angular modules
3. npm packages    - regular npm packages that are `require()` in ng.seed modules

(1) To load regular angular modules set them in the `requires` property in your `package.json`. Although angular's core module `ng` is the only external module required - to get you started quickly - ng.seed loads both the bleeding-edge of `ng` from `http://code.angularjs.org/snapshot/angular.js` and `ngRoute` from `http://code.angularjs.org/snapshot/angular-route.js`. See the **config** section of this readme for an example of how to edit your `package.json` to stay on a particular version. Add or remove ngRoute, ngAnimate, ngCookies, ngSanitize, ngTouch and any other *precompiled* angular modules (i.e., not ng) - such as angular-ui's bootstrap or angular's firebase bindings - to this option.

(2) Use ng.seed modules by simply adding them to your application's `node_modules` folder and - if you plan to publish your application - add them as a dependencies to your `package.json`.  Easily do both at the same time with the command `npm install ng.thirdParty --save <dependency>`.  All ng.seed modules **must** have a name starting with `ng.` or the module will not load. ng.seed enforces this restriction in order to differentiate ng.seed modules from other npm dependencies. If you end up publishing your module, this `ng.` namespace will also help your module be discovered by other developers browsing npm's registry or github.

(3) Any npm package that does not start with `ng.` will not be loaded by ng.seed.  This allows ng.seed modules to `require()` any package within the npm registry as a dependency.  To ensure compatibility, regular npm packages will always be run on the server rather than the client.

## ng global
Just like `angular` is to angular, `ng` is ng.seed's one & only global variable. `ng` has exactly the same [api as angular](http://docs.angularjs.org/api/ng/function) with your favorite helper methods such as `ng.toJson`, `ng.fromJson`, `ng.isDefined`, etc. In addition, ng.seed has one extra property: `ng.config`.  To learn more about `ng.config`, please see the **config** section of this readme.

## config
All config options are contained in your project's `package.json`. which is a version of your application's package.json file modified based on the `<environment>` set when ng.seed is loaded. The config options are available globally as `ng.config`.  If your `package.json` property does not have a property named `<environment>` then the whole property is loaded because ng.seed assumes that the option is constant accross all environments. If `<environment>` property does exist then that property is used for the option.  If `<environment>` property exists and its value is another property, then ng.seed assumes you are referencing that property and loads that one as the option. For example:

```javascript
//Give the following package.json
{
	"option1": {
		"iam":"happy"
		"ur": "sad"
	},

	"option2": {
		"local":"happy"
		"live": "sad"
	},

	"option3": {
		"local":"happy"
		"test":"live"
		"live": "sad"
	},


node myProject local -> ng.config =
{
	option1:
	{
		iam:"happy"
		ur: "sad"
	},

	option2: "happy"

	option3:"happy",
}

node myProject live -> ng.config =
{
	option1:
	{
		iam:"happy"
		ur: "sad"
	},

	option2: "sad"

	option3:"sad",
}

node myProject test -> ng.config =
{
	option1:
	{
		iam:"happy"
		ur: "sad"
	},

	//this option is most likely an error as ng.seed does not know
	//which value to load when given the environment "test"
	option2: {
		"local":"happy"
		"live": "sad"
	},

	//this one references the live environment
	option3:"sad",
}
```

For another example, let's see how to use google's cdn for testing & production. In `package.json` change:

#### from
```javascript
"requires": {
	"ng":"http://code.angularjs.org/snapshot/angular.js",
	"ngRoute":"http://code.angularjs.org/snapshot/angular-route.js"
},


#### to
```javascript
"requires": {
		"local": {
			"ng": 	  "../ng.cdn/1.2.6.js",
			"ngRoute": "../ng.cdn/1.2.0-route.js"
		},
		"test": {
			"ng": 	  "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js",
			"ngRoute": "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-route.min.js"
		},
		"live":"test"
   },

#### also the same
```javascript
"requires": {
		"local": {
			"ng": 	  "../ng.cdn/1.2.6.js",
			"ngRoute": "../ng.cdn/1.2.0-route.js"
		},
		"test": "live"
		"live": {
			"ng": 	  "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js",
			"ngRoute": "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-route.min.js"
		}
   },
```
Other common configuration options include changing the path and/or prefix of your log files, or changing your application's default protocol/port from `http port 1080`.

## run as root
Don’t run node/ng.seed as root because of it could open potential security vulnerabilities. When not root, the only thing you won’t be able to do is listen on ports less than 1024.  Instead, listen on a port > 1024 (e.g., the default is `1080` for `http`) and use ip-table to forward ports 80 & 443 to the ports on which your server is actually listening.

##views
In order to work, views require ngRoute to be loaded in `package.json`. ng.seed provide a shortcut to defining routes by parsing the filenames in the `view` folder.  By placing an `.html` file in the `view` folder, ng.seed will know to add that file to $routeProvider as a template.  The route given for that template will be the view's filename - with `$` replaced with `:` since `:` character is not allowed to be used in the filename of many Operating Systems. For example, `myProject/view` may contain a file named `i/am/$a/$route?/that/will/$be*/registered.html` which ng.seed will add as
```javascript
ng.module('myProject').config(function($routeProvider)
{
	$routeProvider.when('i/am/:a/:route?/that/will/:be*/registered', {template:<html>})
})
```
Since view's have no way of registering a controller with $routeProvider directly, you will need to specify the controller within the view using angular's ngController directive.

## changelog
#### 0.0.0-rc2
- Environment based config added
- Require "ng." prefix for ng.seed modules
- Port api enables passing options to createServer
- Added automatic daemon functionality
- Added log file config to package.json
- Refactored code into separate files

#### 0.0.0-rc1
- Initial commit

## todos
- Feel free to email adam.kircher@gmail.com with suggestions!
- Duplication detection before overwrite?
- Use fs.watch to do automatic reloads
- Use the cluster module to run multi-thread (w/o redundant stdin/stdout?)

## related projects
- [ng](https://github.com/ng-/ng): angular reimagined
- [ng.data](https://github.com/ng-/ng.data): simple getter/setter for data persistence
- ng.cql: realtime cassandra database syncing
- [ng.auth](https://github.com/ng-/ng.auth): example authentication using ng interceptors
- [ng.crud](https://github.com/ng-/ng.crud): example demonstrating a simple crud application using ng.seed
- [ng.style](https://github.com/ng-/ng.style): beautiful html using twitter bootstrap
