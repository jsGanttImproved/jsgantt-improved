A fully featured gantt chart component built entirely in Javascript, CSS and AJAX. It is lightweight and there is no need of external libraries or additional images. 

[![Build Status](https://travis-ci.org/mariohmol/jsgantt-improved.svg?branch=master)](https://travis-ci.org/mariohmol/jsgantt-improved)

Start using with

`npm install jsgantt-improved`


Or 

include the files `jsgantt.js` and `jsgantt.css` that are inside `demo/` folder.


## Example

You can view a live example at 

https://mariohmol.github.io/jsgantt-improved/demo

## Features

  * Tasks & Collapsible Task Groups
  * Dependencies
  * Task Completion
  * Task Styling
  * Milestones
  * Resources
  * Dynamic Loading of Tasks
  * Dynamic change of format: Hour, Day, Week, Month, Quarter
  * Load Gantt from XML and JSON
    * From external files (including experimental support for MS Project XML files)
    * From JavaScript Strings
  * Support for Internationalization (all hard coded strings can be overridden)

## Documentation

See the [Documentation](./Documentation.md) wiki page or the included ``demo/index.html`` file for instructions on use.

Project based on https://code.google.com/p/jsgantt/.


## Want to Collaborate?

Clone this repo and run `npm run demo-full`, this will start a `localhost:8080` with a live  example. 
Do your change in `src` and restart this command to test.

For testing use `npm run test` with e2e tests.
