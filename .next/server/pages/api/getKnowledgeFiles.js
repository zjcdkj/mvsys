"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/getKnowledgeFiles";
exports.ids = ["pages/api/getKnowledgeFiles"];
exports.modules = {

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(api)/./pages/api/getKnowledgeFiles.ts":
/*!****************************************!*\
  !*** ./pages/api/getKnowledgeFiles.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const knowledgeDir = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), \"public\", \"knowledge\");\n            const files = fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(knowledgeDir);\n            const fileInfo = files.map((file)=>{\n                const filePath = path__WEBPACK_IMPORTED_MODULE_1___default().join(knowledgeDir, file);\n                const stats = fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(filePath);\n                const content = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(filePath, \"utf-8\");\n                return {\n                    name: file,\n                    size: stats.size,\n                    wordCount: content.split(/\\s+/).length,\n                    createdAt: stats.birthtime.toISOString()\n                };\n            });\n            res.status(200).json(fileInfo);\n        } catch (error) {\n            console.error(\"Error getting knowledge files:\", error);\n            res.status(500).json({\n                error: \"Error getting knowledge files\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ2V0S25vd2xlZGdlRmlsZXMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDb0I7QUFDSTtBQUVULGVBQWVFLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CO0lBQzdFLElBQUlELElBQUlFLE1BQU0sS0FBSyxPQUFPO1FBQ3hCLElBQUk7WUFDRixNQUFNQyxlQUFlTCxnREFBUyxDQUFDTyxRQUFRQyxHQUFHLElBQUksVUFBVTtZQUN4RCxNQUFNQyxRQUFRVixxREFBYyxDQUFDTTtZQUU3QixNQUFNTSxXQUFXRixNQUFNRyxHQUFHLENBQUNDLENBQUFBO2dCQUN6QixNQUFNQyxXQUFXZCxnREFBUyxDQUFDSyxjQUFjUTtnQkFDekMsTUFBTUUsUUFBUWhCLGtEQUFXLENBQUNlO2dCQUMxQixNQUFNRyxVQUFVbEIsc0RBQWUsQ0FBQ2UsVUFBVTtnQkFDMUMsT0FBTztvQkFDTEssTUFBTU47b0JBQ05PLE1BQU1MLE1BQU1LLElBQUk7b0JBQ2hCQyxXQUFXSixRQUFRSyxLQUFLLENBQUMsT0FBT0MsTUFBTTtvQkFDdENDLFdBQVdULE1BQU1VLFNBQVMsQ0FBQ0MsV0FBVztnQkFDeEM7WUFDRjtZQUVBdkIsSUFBSXdCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUNqQjtRQUN2QixFQUFFLE9BQU9rQixPQUFPO1lBQ2RDLFFBQVFELEtBQUssQ0FBQyxrQ0FBa0NBO1lBQ2hEMUIsSUFBSXdCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBZ0M7UUFDaEU7SUFDRixPQUFPO1FBQ0wxQixJQUFJNEIsU0FBUyxDQUFDLFNBQVM7WUFBQztTQUFNO1FBQzlCNUIsSUFBSXdCLE1BQU0sQ0FBQyxLQUFLSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU5QixJQUFJRSxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWRlby1hbmFseXNpcy1zeXN0ZW0vLi9wYWdlcy9hcGkvZ2V0S25vd2xlZGdlRmlsZXMudHM/ZWJhNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xyXG4gIGlmIChyZXEubWV0aG9kID09PSAnR0VUJykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qga25vd2xlZGdlRGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnLCAna25vd2xlZGdlJyk7XHJcbiAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoa25vd2xlZGdlRGlyKTtcclxuXHJcbiAgICAgIGNvbnN0IGZpbGVJbmZvID0gZmlsZXMubWFwKGZpbGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGtub3dsZWRnZURpciwgZmlsZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6IGZpbGUsXHJcbiAgICAgICAgICBzaXplOiBzdGF0cy5zaXplLFxyXG4gICAgICAgICAgd29yZENvdW50OiBjb250ZW50LnNwbGl0KC9cXHMrLykubGVuZ3RoLFxyXG4gICAgICAgICAgY3JlYXRlZEF0OiBzdGF0cy5iaXJ0aHRpbWUudG9JU09TdHJpbmcoKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oZmlsZUluZm8pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBrbm93bGVkZ2UgZmlsZXM6JywgZXJyb3IpO1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiAnRXJyb3IgZ2V0dGluZyBrbm93bGVkZ2UgZmlsZXMnIH0pO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xyXG4gICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbImZzIiwicGF0aCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJrbm93bGVkZ2VEaXIiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImZpbGVzIiwicmVhZGRpclN5bmMiLCJmaWxlSW5mbyIsIm1hcCIsImZpbGUiLCJmaWxlUGF0aCIsInN0YXRzIiwic3RhdFN5bmMiLCJjb250ZW50IiwicmVhZEZpbGVTeW5jIiwibmFtZSIsInNpemUiLCJ3b3JkQ291bnQiLCJzcGxpdCIsImxlbmd0aCIsImNyZWF0ZWRBdCIsImJpcnRodGltZSIsInRvSVNPU3RyaW5nIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwiY29uc29sZSIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/getKnowledgeFiles.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/getKnowledgeFiles.ts"));
module.exports = __webpack_exports__;

})();