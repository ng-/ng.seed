# ng.seed (warning! pre-alpha)
### create a modular ng application

Create a modular ng application using npm packages.  ng.seed enables you to organize and share modules written for the ng framework using npm packages.  Simply download an ng.seed module (any npm package with an “ng.” prefix) into your application’s node_modules folder as a dependency and it will be automatically be loaded when you start your application.

## how it works

ng.seed uses your directory structure to organize and load your ng application. Each folder in node_modules becomes an ng module.  Files contained within subdirectories named 'animate', 'config', 'constant', 'controller', 'directive', 'factory', 'filter', 'provider', 'run', 'service', 'value', 'stack', 'parse' of the modules will be loaded into  angular automatically as that type.

The name provided to ng will be the name of the file. For example, myapp/node_modules/module1/factory/example.js will be registered as ng.module(‘module1’, []).factory(‘example’, `<code>`)

ng.seed does search subdirectories recursively, so it is possible to further organize your code into nested folders.  In the case of nesting, the name registered is the CamelCase path.  For example, application/node_modules/module1/factory/nested/folder/example.js will be registered with the name “nestedFolderExample”.

## environment

Start your project with node `<app>` `<env>` where `<app>` is the name that you are prompted to choose during installation and `<env>` is local, test, or live.  If `<env>` is omitted it will default to local.

## config

By default, ng.seed loads the bleeding-edge of angular on http port 80.  Edit your projects package.json if you wish to stay on a particular version (highly recommended for production) or change the default protocol/port.

## sharing

Please publish your ng.seed modules using the “ng.” prefix.  If it’s not ng.seed compatible please don’t publish it using that prefix (e.g., use “ng-“ instead).  Creating an “ng” namespace within npm will prove to be a helpful convention for ng.seed developers

## todos
- Documentation: explain root directory and that other folders are fine (but will be ignored) (see how ng.auth uses ng.data)
- Documentation: explain Global ng Var
- Stacks/View loaded by module then alphabetically - is there a better way to specify the order
- CamelCase naming for nesting does not work yet
- Duplication detection before overwrite
- Use fs.watch to do automatic reloads
- Use the cluster module to run multi-thread
- Figure out where to put and how to format env specific config options
