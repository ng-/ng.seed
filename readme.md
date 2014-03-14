# ng.seed: create a modular [ng app](https://github.com/ng-/ng)
ng.seed aims to make it dead simple to create a modular application using the [ng framework](https://github.com/ng-/ng)

#####ng is right for you if:
- You want to use npm as a package manager to create, organize, & share ng modules
- You want access to an ecosystem of npm packages (anything with an “ng.” prefix)
- You want a modular application with a matching directory structure
- You want to have simple environmental settings & run on all your server's cores

## getting started
1. *At the command prompt, install [node](http://nodejs.org/api/) if you haven't yet. Install [manually](https://gist.github.com/isaacs/579814) or using:*

		source /dev/stdin <<< "$(curl https://raw.github.com/ng-/ng.seed/master/node.sh)"

	This will install and use the latest stable version of node, to specify a version edit `~/.bashrc`

2. *Goto the directory where you want your application, and install ng.seed*

		npm install ng.seed

3. *Upon successful installation, you will be prompted to name your application*

		What would you like to name your application? myProject

	Answering `myProject` would create the following
	- `myProject/package.json` this is your config file
	- `myProject/node_modules/ng.seed` this loads your modules
	- `myProject/node_modules/ng.seed/node_modules/ng` the ng framework

4. *Start your application*

		node node_modules/myProject <environment>

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
There are two type of dependencies: regular angular modules and ng modules.  To load regular angular modules use the `requires` property in your `package.json` as described in the **config** section of this readme. To use a third-party ng module simply add that module to your application's `node_modules` folder and - if you plan to publish your application - add it as a dependency to your `package.json`.  Easily do both at the same time with the command `npm install myProject --save <dependency>`. If you publish your own project as a dependency, please use the "ng." prefix.  Preserving this namespace is helpful for other developers to discover your project.

## config
All config options are contained in your project's `package.json`. Although core angular is the only external module required - to get you started quickly - ng.seed loads both the bleeding-edge of angular from `http://code.angularjs.org/snapshot/angular.js` and angular route from `http://code.angularjs.org/snapshot/angular-route.js`.

Edit your `package.json` if you wish to stay on a particular version. Using google's cdn is highly recommended for production. For example
```javascript
	"requires": {
		"ng": 	  "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js",
		"ngRoute": "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-route.min.js"
	}
```
Add or remove ngRoute, ngAnimate, ngCookies, ngSanitize, ngTouch and any other *precompiled* angular modules (i.e., not ng) - such as angular-ui's bootstrap or angular's firebase bindings - to this option. Other configuration options include changing the path and/or prefix of your log files, or changing your application's default protocol/port from  `http port 1080`.

## run as root
Don’t install or run nave/node/npm as root because of security vulnerabilities. When not root, the only thing you won’t be able to do is listen on ports less than 1024.  Instead, listen on a port > 1024 (e.g., the default is `1080` for `http` and `1443` for `https`) and use ip-table to forward ports 80 & 443 to the ones your server is actually listening to

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
- Added automatic daemon functionality
- Added log file config to package.json
- Refactored code into separate files

#### 0.0.0-rc1
- Initial commit

## todos
- Environment based Config
- Documentation: explain Global ng Var
- Duplication detection before overwrite
- Use fs.watch to do automatic reloads
- Use the cluster module to run multi-thread

## related projects
- [ng](https://github.com/ng-/ng): angular reimagined
- [ng.data](https://github.com/ng-/ng.data): simple getter/setter for data persistence
- ng.cql: realtime cassandra database syncing
- [ng.auth](https://github.com/ng-/ng.auth): example authentication using ng interceptors
- [ng.crud](https://github.com/ng-/ng.crud): example demonstrating a simple crud application using ng.seed
- [ng.style](https://github.com/ng-/ng.style): beautiful html using twitter bootstrap
