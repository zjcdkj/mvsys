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
exports.id = "pages/api/transcriptions";
exports.ids = ["pages/api/transcriptions"];
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

/***/ "(api)/./pages/api/transcriptions.ts":
/*!*************************************!*\
  !*** ./pages/api/transcriptions.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const transcriptionsDir = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), \"download\", \"mp3\");\n            const files = fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(transcriptionsDir);\n            const transcriptions = files.filter((file)=>file.endsWith(\".txt\") && !file.endsWith(\"_cleaned.txt\")).map((file)=>{\n                const id = path__WEBPACK_IMPORTED_MODULE_1___default().basename(file, \".txt\");\n                const audioName = `${id}.mp3`;\n                const transcription = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(path__WEBPACK_IMPORTED_MODULE_1___default().join(transcriptionsDir, file), \"utf-8\");\n                let cleanedTranscription = \"\";\n                const cleanedFilePath = path__WEBPACK_IMPORTED_MODULE_1___default().join(transcriptionsDir, `${id}_cleaned.txt`);\n                if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(cleanedFilePath)) {\n                    cleanedTranscription = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(cleanedFilePath, \"utf-8\");\n                }\n                return {\n                    id,\n                    audioName,\n                    transcription,\n                    cleanedTranscription\n                };\n            });\n            res.status(200).json(transcriptions);\n        } catch (error) {\n            console.error(\"Error fetching transcriptions:\", error);\n            res.status(500).json({\n                error: \"Failed to fetch transcriptions\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdHJhbnNjcmlwdGlvbnMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDb0I7QUFDSTtBQUVULGVBQWVFLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CO0lBQzdFLElBQUlELElBQUlFLE1BQU0sS0FBSyxPQUFPO1FBQ3hCLElBQUk7WUFDRixNQUFNQyxvQkFBb0JMLGdEQUFTLENBQUNPLFFBQVFDLEdBQUcsSUFBSSxZQUFZO1lBQy9ELE1BQU1DLFFBQVFWLHFEQUFjLENBQUNNO1lBRTdCLE1BQU1NLGlCQUFpQkYsTUFDcEJHLE1BQU0sQ0FBQ0MsQ0FBQUEsT0FBUUEsS0FBS0MsUUFBUSxDQUFDLFdBQVcsQ0FBQ0QsS0FBS0MsUUFBUSxDQUFDLGlCQUN2REMsR0FBRyxDQUFDRixDQUFBQTtnQkFDSCxNQUFNRyxLQUFLaEIsb0RBQWEsQ0FBQ2EsTUFBTTtnQkFDL0IsTUFBTUssWUFBWSxDQUFDLEVBQUVGLEdBQUcsSUFBSSxDQUFDO2dCQUM3QixNQUFNRyxnQkFBZ0JwQixzREFBZSxDQUFDQyxnREFBUyxDQUFDSyxtQkFBbUJRLE9BQU87Z0JBRTFFLElBQUlRLHVCQUF1QjtnQkFDM0IsTUFBTUMsa0JBQWtCdEIsZ0RBQVMsQ0FBQ0ssbUJBQW1CLENBQUMsRUFBRVcsR0FBRyxZQUFZLENBQUM7Z0JBQ3hFLElBQUlqQixvREFBYSxDQUFDdUIsa0JBQWtCO29CQUNsQ0QsdUJBQXVCdEIsc0RBQWUsQ0FBQ3VCLGlCQUFpQjtnQkFDMUQ7Z0JBRUEsT0FBTztvQkFDTE47b0JBQ0FFO29CQUNBQztvQkFDQUU7Z0JBQ0Y7WUFDRjtZQUVGbEIsSUFBSXFCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUNkO1FBQ3ZCLEVBQUUsT0FBT2UsT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsa0NBQWtDQTtZQUNoRHZCLElBQUlxQixNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQWlDO1FBQ2pFO0lBQ0YsT0FBTztRQUNMdkIsSUFBSXlCLFNBQVMsQ0FBQyxTQUFTO1lBQUM7U0FBTTtRQUM5QnpCLElBQUlxQixNQUFNLENBQUMsS0FBS0ssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFM0IsSUFBSUUsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN4RDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmlkZW8tYW5hbHlzaXMtc3lzdGVtLy4vcGFnZXMvYXBpL3RyYW5zY3JpcHRpb25zLnRzPzc5Y2YiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XG4gIGlmIChyZXEubWV0aG9kID09PSAnR0VUJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0cmFuc2NyaXB0aW9uc0RpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnZG93bmxvYWQnLCAnbXAzJyk7XG4gICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHRyYW5zY3JpcHRpb25zRGlyKTtcbiAgICAgIFxuICAgICAgY29uc3QgdHJhbnNjcmlwdGlvbnMgPSBmaWxlc1xuICAgICAgICAuZmlsdGVyKGZpbGUgPT4gZmlsZS5lbmRzV2l0aCgnLnR4dCcpICYmICFmaWxlLmVuZHNXaXRoKCdfY2xlYW5lZC50eHQnKSlcbiAgICAgICAgLm1hcChmaWxlID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IHBhdGguYmFzZW5hbWUoZmlsZSwgJy50eHQnKTtcbiAgICAgICAgICBjb25zdCBhdWRpb05hbWUgPSBgJHtpZH0ubXAzYDtcbiAgICAgICAgICBjb25zdCB0cmFuc2NyaXB0aW9uID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbih0cmFuc2NyaXB0aW9uc0RpciwgZmlsZSksICd1dGYtOCcpO1xuICAgICAgICAgIFxuICAgICAgICAgIGxldCBjbGVhbmVkVHJhbnNjcmlwdGlvbiA9ICcnO1xuICAgICAgICAgIGNvbnN0IGNsZWFuZWRGaWxlUGF0aCA9IHBhdGguam9pbih0cmFuc2NyaXB0aW9uc0RpciwgYCR7aWR9X2NsZWFuZWQudHh0YCk7XG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2xlYW5lZEZpbGVQYXRoKSkge1xuICAgICAgICAgICAgY2xlYW5lZFRyYW5zY3JpcHRpb24gPSBmcy5yZWFkRmlsZVN5bmMoY2xlYW5lZEZpbGVQYXRoLCAndXRmLTgnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgYXVkaW9OYW1lLFxuICAgICAgICAgICAgdHJhbnNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsZWFuZWRUcmFuc2NyaXB0aW9uLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih0cmFuc2NyaXB0aW9ucyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHRyYW5zY3JpcHRpb25zOicsIGVycm9yKTtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gZmV0Y2ggdHJhbnNjcmlwdGlvbnMnIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xuICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE1ldGhvZCAke3JlcS5tZXRob2R9IE5vdCBBbGxvd2VkYCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwidHJhbnNjcmlwdGlvbnNEaXIiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImZpbGVzIiwicmVhZGRpclN5bmMiLCJ0cmFuc2NyaXB0aW9ucyIsImZpbHRlciIsImZpbGUiLCJlbmRzV2l0aCIsIm1hcCIsImlkIiwiYmFzZW5hbWUiLCJhdWRpb05hbWUiLCJ0cmFuc2NyaXB0aW9uIiwicmVhZEZpbGVTeW5jIiwiY2xlYW5lZFRyYW5zY3JpcHRpb24iLCJjbGVhbmVkRmlsZVBhdGgiLCJleGlzdHNTeW5jIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwiY29uc29sZSIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/transcriptions.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/transcriptions.ts"));
module.exports = __webpack_exports__;

})();