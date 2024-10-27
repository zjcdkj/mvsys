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
exports.id = "pages/api/audio/delete/[id]";
exports.ids = ["pages/api/audio/delete/[id]"];
exports.modules = {

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

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

/***/ "(api)/./pages/api/audio/delete/[id].ts":
/*!****************************************!*\
  !*** ./pages/api/audio/delete/[id].ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _utils_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../utils/database */ \"(api)/./utils/database.ts\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nasync function handler(req, res) {\n    if (req.method === \"DELETE\") {\n        const { id } = req.query;\n        if (!id || typeof id !== \"string\") {\n            return res.status(400).json({\n                success: false,\n                error: \"Invalid audio file ID\"\n            });\n        }\n        try {\n            const { db } = await (0,_utils_database__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n            const collection = db.collection(\"audio_files\");\n            // Find the audio file in the database\n            const audioFile = await collection.findOne({\n                _id: new mongodb__WEBPACK_IMPORTED_MODULE_3__.ObjectId(id)\n            });\n            if (!audioFile) {\n                return res.status(404).json({\n                    success: false,\n                    error: \"Audio file not found in database\"\n                });\n            }\n            // Delete the file from the filesystem\n            const filePath = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"public\", \"audio\", audioFile.name);\n            if (fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(filePath)) {\n                fs__WEBPACK_IMPORTED_MODULE_1___default().unlinkSync(filePath);\n            }\n            // Remove the file entry from the database\n            await collection.deleteOne({\n                _id: new mongodb__WEBPACK_IMPORTED_MODULE_3__.ObjectId(id)\n            });\n            res.status(200).json({\n                success: true,\n                message: \"Audio file deleted successfully\"\n            });\n        } catch (error) {\n            console.error(\"Error deleting audio file:\", error);\n            res.status(500).json({\n                success: false,\n                error: \"Internal Server Error\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"DELETE\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXVkaW8vZGVsZXRlL1tpZF0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDK0Q7QUFDM0M7QUFDSTtBQUNXO0FBRXBCLGVBQWVJLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CO0lBQzdFLElBQUlELElBQUlFLE1BQU0sS0FBSyxVQUFVO1FBQzNCLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUdILElBQUlJLEtBQUs7UUFFeEIsSUFBSSxDQUFDRCxNQUFNLE9BQU9BLE9BQU8sVUFBVTtZQUNqQyxPQUFPRixJQUFJSSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFQyxTQUFTO2dCQUFPQyxPQUFPO1lBQXdCO1FBQy9FO1FBRUEsSUFBSTtZQUNGLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUcsTUFBTWQsa0VBQWlCQTtZQUN0QyxNQUFNZSxhQUFhRCxHQUFHQyxVQUFVLENBQUM7WUFFakMsc0NBQXNDO1lBQ3RDLE1BQU1DLFlBQVksTUFBTUQsV0FBV0UsT0FBTyxDQUFDO2dCQUFFQyxLQUFLLElBQUlmLDZDQUFRQSxDQUFDSztZQUFJO1lBRW5FLElBQUksQ0FBQ1EsV0FBVztnQkFDZCxPQUFPVixJQUFJSSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO29CQUFFQyxTQUFTO29CQUFPQyxPQUFPO2dCQUFtQztZQUMxRjtZQUVBLHNDQUFzQztZQUN0QyxNQUFNTSxXQUFXakIsZ0RBQVMsQ0FBQ21CLFFBQVFDLEdBQUcsSUFBSSxVQUFVLFNBQVNOLFVBQVVPLElBQUk7WUFDM0UsSUFBSXRCLG9EQUFhLENBQUNrQixXQUFXO2dCQUMzQmxCLG9EQUFhLENBQUNrQjtZQUNoQjtZQUVBLDBDQUEwQztZQUMxQyxNQUFNSixXQUFXVyxTQUFTLENBQUM7Z0JBQUVSLEtBQUssSUFBSWYsNkNBQVFBLENBQUNLO1lBQUk7WUFFbkRGLElBQUlJLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQUVDLFNBQVM7Z0JBQU1lLFNBQVM7WUFBa0M7UUFDbkYsRUFBRSxPQUFPZCxPQUFPO1lBQ2RlLFFBQVFmLEtBQUssQ0FBQyw4QkFBOEJBO1lBQzVDUCxJQUFJSSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFQyxTQUFTO2dCQUFPQyxPQUFPO1lBQXdCO1FBQ3hFO0lBQ0YsT0FBTztRQUNMUCxJQUFJdUIsU0FBUyxDQUFDLFNBQVM7WUFBQztTQUFTO1FBQ2pDdkIsSUFBSUksTUFBTSxDQUFDLEtBQUtvQixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUV6QixJQUFJRSxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWRlby1hbmFseXNpcy1zeXN0ZW0vLi9wYWdlcy9hcGkvYXVkaW8vZGVsZXRlL1tpZF0udHM/OGU3MCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCc7XHJcbmltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbHMvZGF0YWJhc2UnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgT2JqZWN0SWQgfSBmcm9tICdtb25nb2RiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0RFTEVURScpIHtcclxuICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcclxuXHJcbiAgICBpZiAoIWlkIHx8IHR5cGVvZiBpZCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBhdWRpbyBmaWxlIElEJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB7IGRiIH0gPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpO1xyXG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gZGIuY29sbGVjdGlvbignYXVkaW9fZmlsZXMnKTtcclxuXHJcbiAgICAgIC8vIEZpbmQgdGhlIGF1ZGlvIGZpbGUgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICAgIGNvbnN0IGF1ZGlvRmlsZSA9IGF3YWl0IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogbmV3IE9iamVjdElkKGlkKSB9KTtcclxuXHJcbiAgICAgIGlmICghYXVkaW9GaWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXVkaW8gZmlsZSBub3QgZm91bmQgaW4gZGF0YWJhc2UnIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEZWxldGUgdGhlIGZpbGUgZnJvbSB0aGUgZmlsZXN5c3RlbVxyXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJywgJ2F1ZGlvJywgYXVkaW9GaWxlLm5hbWUpO1xyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgICBmcy51bmxpbmtTeW5jKGZpbGVQYXRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRoZSBmaWxlIGVudHJ5IGZyb20gdGhlIGRhdGFiYXNlXHJcbiAgICAgIGF3YWl0IGNvbGxlY3Rpb24uZGVsZXRlT25lKHsgX2lkOiBuZXcgT2JqZWN0SWQoaWQpIH0pO1xyXG5cclxuICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnQXVkaW8gZmlsZSBkZWxldGVkIHN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBhdWRpbyBmaWxlOicsIGVycm9yKTtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0pO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnREVMRVRFJ10pO1xyXG4gICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbImNvbm5lY3RUb0RhdGFiYXNlIiwiZnMiLCJwYXRoIiwiT2JqZWN0SWQiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwiaWQiLCJxdWVyeSIsInN0YXR1cyIsImpzb24iLCJzdWNjZXNzIiwiZXJyb3IiLCJkYiIsImNvbGxlY3Rpb24iLCJhdWRpb0ZpbGUiLCJmaW5kT25lIiwiX2lkIiwiZmlsZVBhdGgiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsIm5hbWUiLCJleGlzdHNTeW5jIiwidW5saW5rU3luYyIsImRlbGV0ZU9uZSIsIm1lc3NhZ2UiLCJjb25zb2xlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/audio/delete/[id].ts\n");

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
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/audio/delete/[id].ts"));
module.exports = __webpack_exports__;

})();