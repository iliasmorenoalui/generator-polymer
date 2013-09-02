/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);
  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

  // XXX default and banner to be implemented
  this.argument('attributes', {
    type: Array,
    defaults: [],
    banner: 'field[:type] field[:type]'
  });


  // parse back the attributes provided, build an array of attr
  this.attrs = this.attributes.map(function (attr) {
    var parts = attr.split(':');
    return {
      name: parts[0],
      type: parts[1] || 'string'
    };
  });

}

util.inherits(Generator, scriptBase);


Generator.prototype.askFor = function askFor() {

var cb = this.async();
var prompts = [
  {
    type: 'confirm',
    name: 'includeConstructor',
    message: 'Would you like to include constructor=””?',
    default: false
  },{
    type: 'input',
    name: 'otherElementSelection',
    message: 'Which other elements would you like to include? (e.g "button carousel")',
    default: ""
  }];


  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeConstructor = props.includeConstructor;
    this.otherElementSelection = props.otherElementSelection;

    cb();
  }.bind(this));
};


Generator.prototype.createElementFiles = function createElementFiles() {
  var destFile = path.join('app/elements',this.name + '.html');
  this.template('polymer-element' + '.html', destFile);

  this.addImportToFile({
    fileName:  'index.html',
    importUrl: 'elements/' + this.name + '.html',
    tagName: this.name + '-element'
  });
};

Generator.prototype.addImports = function addImports(){
  var elName = this.name;
  // TODO: simplify the logic here. Too much I/O
  if(this.otherElementSelection){
    var imports = this.otherElementSelection.split(' '); 
    imports.forEach(function(importItem){
      this.addImportToFile({
        fileName:   'elements/' + elName + '.html',
        importUrl:  importItem + '.html',
        tagName:    importItem + '-element',
        needleHead: '<polymer-element',
        needleBody:  '</template>'
      });

    }.bind(this));
  }
}
