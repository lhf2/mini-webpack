
     (function (modules) {
          function require(id) {

            const [fn,mapping] = modules[id];

            function localRequire(name){
              // name -> id
              return require(mapping[name])
            }

            const module = { exports: {} };
            fn(localRequire, module, module.exports);
            return module.exports;
          }


        require(0);
     })({
	
		0 : [ 
		   function (require, module, exports){
			"use strict";

var _test = require("./test.md");

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('main.js'); // ********

console.log(_test2.default);
		   },
	           {"./test.md":1}
		   ],
	
		1 : [ 
		   function (require, module, exports){
			"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "<h1 id=\"test\">Test</h1>\n<h2 id=\"this-is-a-markdown-file\">this is a markdown file</h2>\n<ul>\n<li>li1</li>\n<li>li2\nthis is test file</li>\n</ul>\n";
		   },
	           {}
		   ],
	
	}
     );