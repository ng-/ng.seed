# ng.seed: create a modular [ng app](https://github.com/ng-/ng)
ng.seed aims to make it dead simple to create a modular application using the [ng framework](https://github.com/ng-/ng)

###ng is right for you if:
- You want to use npm as a package manager to create, organize, & share ng modules
- You want access to an ecosystem of npm packages (anything with an “ng.” prefix)
- You want a modular application with a matching directory structure
- You want to have simple environmental settings & run on all your server's cores

## getting started
ng.seed assumes that you have node installed.  If you don't, then [go here](https://gist.github.com/isaacs/579814) or do the following:

ON INSTALL:
```shell
# download nave, a node version management tool
wget http://github.com/isaacs/nave/raw/master/nave.sh

# give yourself permission to run the script
sudo chmod 755 /usr/local/bin/nave

# Point command line’s “nave” to run the script
sudo ln -s $PWD/nave.sh /usr/local/bin/nave
```
ON LOGIN:
```shell
# start virtual environment that defines node & npm
nave use stable

# do whatever you want with node & npm, for example:
npm install ng.myProject

node node_modules/ng.myProject

# exit the virtual environment
exit
```
####Note about running as root:
Don’t install or run nave/node/npm as root because of security vulnerabilities. When not root, the only thing you won’t be able to do is listen on ports less than 1024.  Listen on a port > 1024 and use ip-table to forward ports 80 & 443 to the ones your server is actually listening to

## how it works
ng.seed uses your directory structure to organize and load your ng application. Each folder in node_modules becomes an ng module. If the module contains additional modules in its node_modules folder, then those modules are also loaded and their names are automatically entered into the module's "requires" array.

Files contained within subdirectories named 'animate', 'config', 'constant', 'controller', 'directive', 'factory', 'filter', 'provider', 'run', 'service', 'value', 'stack', 'parse' of the modules will be loaded into  angular automatically as that type. Other folders within a module will be ignored.

The name provided to ng will be the name of the file. For example, myapp/node_modules/module1/factory/example.js will be registered as ng.module(‘module1’, []).factory(‘example’, `<code>`)

You define modules much like you would in node.js or angular.  For example in myapp/node_modules/module1/factory/example.js
```javascript
module.exports = function(dependency1, dependency2)
{
	//I am initialization code that runs only once, the first time that this factory is injected

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

To use a third-party ng library simply add it to your package.json as a dependency or have npm do it for you by using `npm install --save <package-name>`

## environment

Start your project with node `<app>` `<env>` where `<app>` is the name that you are prompted to choose during installation and `<env>` is local, test, or live.  If `<env>` is omitted it will default to local.

## config

By default, ng.seed loads the bleeding-edge of angular on `http port 1337`.  Edit your projects package.json if you wish to stay on a particular version (highly recommended for production) or change the default protocol/port.

## sharing

Please publish the ng.seed modules that you wish to share using the `ng.` prefix. Creating an “ng” namespace within npm will prove to be a helpful convention for ng.seed developers

## todos
- Documentation: explain Global ng Var
- Duplication detection before overwrite
- Use fs.watch to do automatic reloads
- Use the cluster module to run multi-thread
- Figure out where to put and how to format env specific config options
