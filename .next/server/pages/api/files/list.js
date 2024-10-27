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
exports.id = "pages/api/files/list";
exports.ids = ["pages/api/files/list"];
exports.modules = {

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "(api)/./pages/api/files/list.ts":
/*!*********************************!*\
  !*** ./pages/api/files/list.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _utils_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/database */ \"(api)/./utils/database.ts\");\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const { db } = await (0,_utils_database__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n            const videoCollection = db.collection(\"video_files\");\n            const dbVideoFiles = await videoCollection.find({}).toArray();\n            const videoFiles = dbVideoFiles.map((file)=>({\n                    id: file._id.toString(),\n                    name: file.name,\n                    size: file.size,\n                    uploadedAt: file.uploadDate\n                }));\n            res.status(200).json(videoFiles);\n        } catch (error) {\n            console.error(\"Error fetching video files:\", error);\n            res.status(500).json({\n                error: \"Internal Server Error\"\n            });\n        }\n    } else {\n        res.status(405).json({\n            error: \"Method not allowed\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZmlsZXMvbGlzdC50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUM0RDtBQUk3QyxlQUFlQyxRQUFRQyxHQUFtQixFQUFFQyxHQUFvQjtJQUM3RSxJQUFJRCxJQUFJRSxNQUFNLEtBQUssT0FBTztRQUN4QixJQUFJO1lBQ0YsTUFBTSxFQUFFQyxFQUFFLEVBQUUsR0FBRyxNQUFNTCxrRUFBaUJBO1lBQ3RDLE1BQU1NLGtCQUFrQkQsR0FBR0UsVUFBVSxDQUFDO1lBQ3RDLE1BQU1DLGVBQWUsTUFBTUYsZ0JBQWdCRyxJQUFJLENBQUMsQ0FBQyxHQUFHQyxPQUFPO1lBRTNELE1BQU1DLGFBQWFILGFBQWFJLEdBQUcsQ0FBQ0MsQ0FBQUEsT0FBUztvQkFDM0NDLElBQUlELEtBQUtFLEdBQUcsQ0FBQ0MsUUFBUTtvQkFDckJDLE1BQU1KLEtBQUtJLElBQUk7b0JBQ2ZDLE1BQU1MLEtBQUtLLElBQUk7b0JBQ2ZDLFlBQVlOLEtBQUtPLFVBQVU7Z0JBQzdCO1lBRUFqQixJQUFJa0IsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQ1g7UUFDdkIsRUFBRSxPQUFPWSxPQUFPO1lBQ2RDLFFBQVFELEtBQUssQ0FBQywrQkFBK0JBO1lBQzdDcEIsSUFBSWtCLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBd0I7UUFDeEQ7SUFDRixPQUFPO1FBQ0xwQixJQUFJa0IsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXFCO0lBQ3JEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWRlby1hbmFseXNpcy1zeXN0ZW0vLi9wYWdlcy9hcGkvZmlsZXMvbGlzdC50cz84OWU0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcbmltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZGF0YWJhc2UnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XG4gIGlmIChyZXEubWV0aG9kID09PSAnR0VUJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRiIH0gPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpO1xuICAgICAgY29uc3QgdmlkZW9Db2xsZWN0aW9uID0gZGIuY29sbGVjdGlvbigndmlkZW9fZmlsZXMnKTtcbiAgICAgIGNvbnN0IGRiVmlkZW9GaWxlcyA9IGF3YWl0IHZpZGVvQ29sbGVjdGlvbi5maW5kKHt9KS50b0FycmF5KCk7XG5cbiAgICAgIGNvbnN0IHZpZGVvRmlsZXMgPSBkYlZpZGVvRmlsZXMubWFwKGZpbGUgPT4gKHtcbiAgICAgICAgaWQ6IGZpbGUuX2lkLnRvU3RyaW5nKCksXG4gICAgICAgIG5hbWU6IGZpbGUubmFtZSxcbiAgICAgICAgc2l6ZTogZmlsZS5zaXplLFxuICAgICAgICB1cGxvYWRlZEF0OiBmaWxlLnVwbG9hZERhdGUsXG4gICAgICB9KSk7XG5cbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHZpZGVvRmlsZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyB2aWRlbyBmaWxlczonLCBlcnJvcik7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLnN0YXR1cyg0MDUpLmpzb24oeyBlcnJvcjogJ01ldGhvZCBub3QgYWxsb3dlZCcgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJjb25uZWN0VG9EYXRhYmFzZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJkYiIsInZpZGVvQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJkYlZpZGVvRmlsZXMiLCJmaW5kIiwidG9BcnJheSIsInZpZGVvRmlsZXMiLCJtYXAiLCJmaWxlIiwiaWQiLCJfaWQiLCJ0b1N0cmluZyIsIm5hbWUiLCJzaXplIiwidXBsb2FkZWRBdCIsInVwbG9hZERhdGUiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/files/list.ts\n");

/***/ }),

/***/ "(api)/./utils/database.ts":
/*!***************************!*\
  !*** ./utils/database.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectToDatabase: () => (/* binding */ connectToDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error(\"Please define the MONGODB_URI environment variable inside .env.local\");\n}\nlet cached = global;\nif (!cached.mongo) {\n    cached.mongo = {\n        conn: null,\n        promise: null\n    };\n}\nasync function connectToDatabase() {\n    if (cached.mongo.conn) {\n        return cached.mongo.conn;\n    }\n    if (!cached.mongo.promise) {\n        const opts = {\n            useNewUrlParser: true,\n            useUnifiedTopology: true\n        };\n        cached.mongo.promise = mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(MONGODB_URI, opts).then((client)=>{\n            console.log(\"New database connection established\");\n            return {\n                client,\n                db: client.db()\n            };\n        }).catch((error)=>{\n            console.error(\"Failed to connect to database:\", error);\n            throw error;\n        });\n    }\n    try {\n        cached.mongo.conn = await cached.mongo.promise;\n    } catch (e) {\n        cached.mongo.promise = null;\n        throw e;\n    }\n    return cached.mongo.conn;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi91dGlscy9kYXRhYmFzZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBc0M7QUFFdEMsTUFBTUMsY0FBY0MsUUFBUUMsR0FBRyxDQUFDRixXQUFXO0FBRTNDLElBQUksQ0FBQ0EsYUFBYTtJQUNoQixNQUFNLElBQUlHLE1BQU07QUFDbEI7QUFFQSxJQUFJQyxTQUFTQztBQUViLElBQUksQ0FBQ0QsT0FBT0UsS0FBSyxFQUFFO0lBQ2pCRixPQUFPRSxLQUFLLEdBQUc7UUFBRUMsTUFBTTtRQUFNQyxTQUFTO0lBQUs7QUFDN0M7QUFFTyxlQUFlQztJQUNwQixJQUFJTCxPQUFPRSxLQUFLLENBQUNDLElBQUksRUFBRTtRQUNyQixPQUFPSCxPQUFPRSxLQUFLLENBQUNDLElBQUk7SUFDMUI7SUFFQSxJQUFJLENBQUNILE9BQU9FLEtBQUssQ0FBQ0UsT0FBTyxFQUFFO1FBQ3pCLE1BQU1FLE9BQU87WUFDWEMsaUJBQWlCO1lBQ2pCQyxvQkFBb0I7UUFDdEI7UUFFQVIsT0FBT0UsS0FBSyxDQUFDRSxPQUFPLEdBQUdULGdEQUFXQSxDQUFDYyxPQUFPLENBQUNiLGFBQWNVLE1BQU1JLElBQUksQ0FBQyxDQUFDQztZQUNuRUMsUUFBUUMsR0FBRyxDQUFDO1lBQ1osT0FBTztnQkFDTEY7Z0JBQ0FHLElBQUlILE9BQU9HLEVBQUU7WUFDZjtRQUNGLEdBQUdDLEtBQUssQ0FBQyxDQUFDQztZQUNSSixRQUFRSSxLQUFLLENBQUMsa0NBQWtDQTtZQUNoRCxNQUFNQTtRQUNSO0lBQ0Y7SUFFQSxJQUFJO1FBQ0ZoQixPQUFPRSxLQUFLLENBQUNDLElBQUksR0FBRyxNQUFNSCxPQUFPRSxLQUFLLENBQUNFLE9BQU87SUFDaEQsRUFBRSxPQUFPYSxHQUFHO1FBQ1ZqQixPQUFPRSxLQUFLLENBQUNFLE9BQU8sR0FBRztRQUN2QixNQUFNYTtJQUNSO0lBRUEsT0FBT2pCLE9BQU9FLEtBQUssQ0FBQ0MsSUFBSTtBQUMxQiIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpZGVvLWFuYWx5c2lzLXN5c3RlbS8uL3V0aWxzL2RhdGFiYXNlLnRzPzZhZjkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9uZ29DbGllbnQgfSBmcm9tICdtb25nb2RiJztcblxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSTtcblxuaWYgKCFNT05HT0RCX1VSSSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBkZWZpbmUgdGhlIE1PTkdPREJfVVJJIGVudmlyb25tZW50IHZhcmlhYmxlIGluc2lkZSAuZW52LmxvY2FsJyk7XG59XG5cbmxldCBjYWNoZWQgPSBnbG9iYWwgYXMgYW55O1xuXG5pZiAoIWNhY2hlZC5tb25nbykge1xuICBjYWNoZWQubW9uZ28gPSB7IGNvbm46IG51bGwsIHByb21pc2U6IG51bGwgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbm5lY3RUb0RhdGFiYXNlKCkge1xuICBpZiAoY2FjaGVkLm1vbmdvLmNvbm4pIHtcbiAgICByZXR1cm4gY2FjaGVkLm1vbmdvLmNvbm47XG4gIH1cblxuICBpZiAoIWNhY2hlZC5tb25nby5wcm9taXNlKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcbiAgICAgIHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSxcbiAgICB9O1xuXG4gICAgY2FjaGVkLm1vbmdvLnByb21pc2UgPSBNb25nb0NsaWVudC5jb25uZWN0KE1PTkdPREJfVVJJISwgb3B0cykudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnTmV3IGRhdGFiYXNlIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNsaWVudCxcbiAgICAgICAgZGI6IGNsaWVudC5kYigpLFxuICAgICAgfTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjb25uZWN0IHRvIGRhdGFiYXNlOicsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjYWNoZWQubW9uZ28uY29ubiA9IGF3YWl0IGNhY2hlZC5tb25nby5wcm9taXNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkLm1vbmdvLnByb21pc2UgPSBudWxsO1xuICAgIHRocm93IGU7XG4gIH1cblxuICByZXR1cm4gY2FjaGVkLm1vbmdvLmNvbm47XG59XG4iXSwibmFtZXMiOlsiTW9uZ29DbGllbnQiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsIm1vbmdvIiwiY29ubiIsInByb21pc2UiLCJjb25uZWN0VG9EYXRhYmFzZSIsIm9wdHMiLCJ1c2VOZXdVcmxQYXJzZXIiLCJ1c2VVbmlmaWVkVG9wb2xvZ3kiLCJjb25uZWN0IiwidGhlbiIsImNsaWVudCIsImNvbnNvbGUiLCJsb2ciLCJkYiIsImNhdGNoIiwiZXJyb3IiLCJlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./utils/database.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/files/list.ts"));
module.exports = __webpack_exports__;

})();