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
exports.id = "pages/api/files/upload";
exports.ids = ["pages/api/files/upload"];
exports.modules = {

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "formidable":
/*!*****************************!*\
  !*** external "formidable" ***!
  \*****************************/
/***/ ((module) => {

module.exports = import("formidable");;

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

/***/ "(api)/./pages/api/files/upload.ts":
/*!***********************************!*\
  !*** ./pages/api/files/upload.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! formidable */ \"formidable\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utils_database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/database */ \"(api)/./utils/database.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([formidable__WEBPACK_IMPORTED_MODULE_0__]);\nformidable__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nconst config = {\n    api: {\n        bodyParser: false\n    }\n};\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        const uploadDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"public\", \"uploads\");\n        console.log(\"Upload directory:\", uploadDir);\n        if (!fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(uploadDir)) {\n            console.log(\"Creating upload directory\");\n            fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(uploadDir, {\n                recursive: true\n            });\n        }\n        const form = (0,formidable__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            uploadDir: uploadDir,\n            keepExtensions: true,\n            maxFileSize: 200 * 1024 * 1024\n        });\n        form.parse(req, async (err, fields, files)=>{\n            if (err) {\n                console.error(\"Error parsing form:\", err);\n                return res.status(500).json({\n                    error: \"Error uploading file\",\n                    details: err.message\n                });\n            }\n            console.log(\"Parsed files:\", JSON.stringify(files, null, 2));\n            const file = Array.isArray(files.file) ? files.file[0] : files.file;\n            if (!file) {\n                console.error(\"No file uploaded\");\n                return res.status(400).json({\n                    error: \"No file uploaded\"\n                });\n            }\n            const oldPath = file.filepath;\n            const newPath = path__WEBPACK_IMPORTED_MODULE_2___default().join(uploadDir, file.originalFilename || \"uploaded_file\");\n            console.log(\"Old path:\", oldPath);\n            console.log(\"New path:\", newPath);\n            try {\n                fs__WEBPACK_IMPORTED_MODULE_1___default().renameSync(oldPath, newPath);\n                console.log(\"File successfully renamed and moved\");\n                // Save file info to MongoDB\n                const { db } = await (0,_utils_database__WEBPACK_IMPORTED_MODULE_3__.connectToDatabase)();\n                const collection = db.collection(\"video_files\");\n                await collection.insertOne({\n                    name: path__WEBPACK_IMPORTED_MODULE_2___default().basename(newPath),\n                    size: file.size,\n                    uploadDate: new Date(),\n                    path: newPath\n                });\n                res.status(200).json({\n                    message: \"File uploaded successfully\",\n                    filename: path__WEBPACK_IMPORTED_MODULE_2___default().basename(newPath)\n                });\n            } catch (error) {\n                console.error(\"Error saving file or database entry:\", error);\n                return res.status(500).json({\n                    error: \"Error saving file or database entry\",\n                    details: error.message\n                });\n            }\n        });\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bmFseXNpcy1zeXN0ZW0vLi9wYWdlcy9hcGkvZmlsZXMvdXBsb2FkLnRzPzYxNzEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnO1xuaW1wb3J0IGZvcm1pZGFibGUgZnJvbSAnZm9ybWlkYWJsZSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjb25uZWN0VG9EYXRhYmFzZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2RhdGFiYXNlJztcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgYXBpOiB7XG4gICAgYm9keVBhcnNlcjogZmFsc2UsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XG4gIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICBjb25zdCB1cGxvYWREaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycsICd1cGxvYWRzJyk7XG4gICAgY29uc29sZS5sb2coJ1VwbG9hZCBkaXJlY3Rvcnk6JywgdXBsb2FkRGlyKTtcblxuICAgIGlmICghZnMuZXhpc3RzU3luYyh1cGxvYWREaXIpKSB7XG4gICAgICBjb25zb2xlLmxvZygnQ3JlYXRpbmcgdXBsb2FkIGRpcmVjdG9yeScpO1xuICAgICAgZnMubWtkaXJTeW5jKHVwbG9hZERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZm9ybSA9IGZvcm1pZGFibGUoe1xuICAgICAgdXBsb2FkRGlyOiB1cGxvYWREaXIsXG4gICAgICBrZWVwRXh0ZW5zaW9uczogdHJ1ZSxcbiAgICAgIG1heEZpbGVTaXplOiAyMDAgKiAxMDI0ICogMTAyNCwgLy8gMjAwTUJcbiAgICB9KTtcblxuICAgIGZvcm0ucGFyc2UocmVxLCBhc3luYyAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBhcnNpbmcgZm9ybTonLCBlcnIpO1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0Vycm9yIHVwbG9hZGluZyBmaWxlJywgZGV0YWlsczogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdQYXJzZWQgZmlsZXM6JywgSlNPTi5zdHJpbmdpZnkoZmlsZXMsIG51bGwsIDIpKTtcblxuICAgICAgY29uc3QgZmlsZSA9IEFycmF5LmlzQXJyYXkoZmlsZXMuZmlsZSkgPyBmaWxlcy5maWxlWzBdIDogZmlsZXMuZmlsZTtcbiAgICAgIGlmICghZmlsZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdObyBmaWxlIHVwbG9hZGVkJyk7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiAnTm8gZmlsZSB1cGxvYWRlZCcgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9sZFBhdGggPSBmaWxlLmZpbGVwYXRoO1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGguam9pbih1cGxvYWREaXIsIGZpbGUub3JpZ2luYWxGaWxlbmFtZSB8fCAndXBsb2FkZWRfZmlsZScpO1xuXG4gICAgICBjb25zb2xlLmxvZygnT2xkIHBhdGg6Jywgb2xkUGF0aCk7XG4gICAgICBjb25zb2xlLmxvZygnTmV3IHBhdGg6JywgbmV3UGF0aCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZzLnJlbmFtZVN5bmMob2xkUGF0aCwgbmV3UGF0aCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGaWxlIHN1Y2Nlc3NmdWxseSByZW5hbWVkIGFuZCBtb3ZlZCcpO1xuXG4gICAgICAgIC8vIFNhdmUgZmlsZSBpbmZvIHRvIE1vbmdvREJcbiAgICAgICAgY29uc3QgeyBkYiB9ID0gYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKTtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGRiLmNvbGxlY3Rpb24oJ3ZpZGVvX2ZpbGVzJyk7XG4gICAgICAgIGF3YWl0IGNvbGxlY3Rpb24uaW5zZXJ0T25lKHtcbiAgICAgICAgICBuYW1lOiBwYXRoLmJhc2VuYW1lKG5ld1BhdGgpLFxuICAgICAgICAgIHNpemU6IGZpbGUuc2l6ZSxcbiAgICAgICAgICB1cGxvYWREYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIHBhdGg6IG5ld1BhdGhcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZXNzYWdlOiAnRmlsZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZShuZXdQYXRoKSB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2F2aW5nIGZpbGUgb3IgZGF0YWJhc2UgZW50cnk6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0Vycm9yIHNhdmluZyBmaWxlIG9yIGRhdGFiYXNlIGVudHJ5JywgZGV0YWlsczogZXJyb3IubWVzc2FnZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnUE9TVCddKTtcbiAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiZm9ybWlkYWJsZSIsImZzIiwicGF0aCIsImNvbm5lY3RUb0RhdGFiYXNlIiwiY29uZmlnIiwiYXBpIiwiYm9keVBhcnNlciIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJ1cGxvYWREaXIiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImNvbnNvbGUiLCJsb2ciLCJleGlzdHNTeW5jIiwibWtkaXJTeW5jIiwicmVjdXJzaXZlIiwiZm9ybSIsImtlZXBFeHRlbnNpb25zIiwibWF4RmlsZVNpemUiLCJwYXJzZSIsImVyciIsImZpZWxkcyIsImZpbGVzIiwiZXJyb3IiLCJzdGF0dXMiLCJqc29uIiwiZGV0YWlscyIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZmlsZSIsIkFycmF5IiwiaXNBcnJheSIsIm9sZFBhdGgiLCJmaWxlcGF0aCIsIm5ld1BhdGgiLCJvcmlnaW5hbEZpbGVuYW1lIiwicmVuYW1lU3luYyIsImRiIiwiY29sbGVjdGlvbiIsImluc2VydE9uZSIsIm5hbWUiLCJiYXNlbmFtZSIsInNpemUiLCJ1cGxvYWREYXRlIiwiRGF0ZSIsImZpbGVuYW1lIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/files/upload.ts\n");

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
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/files/upload.ts"));
module.exports = __webpack_exports__;

})();