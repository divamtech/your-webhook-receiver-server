'use strict';

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

//node version < 15
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }

    // If a string
    return this.split(str).join(newStr);
  };
}

const fs = require('fs');
try {
  if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
    var data = fs.readFileSync('.env.example');
    fs.writeFileSync('.env', data);
  }
} catch (err) {
  console.error(err);
}

const { Ignitor } = require('@adonisjs/ignitor');

new Ignitor(require('@adonisjs/fold')).appRoot(__dirname).fireHttpServer().catch(console.error);
