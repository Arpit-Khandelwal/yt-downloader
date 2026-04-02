/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFmpeg: function() { return /* binding */ FFmpeg; }\n/* harmony export */ });\n/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./const.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js\");\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js\");\n\n\n\n/**\n * Provides APIs to interact with ffmpeg web worker.\n *\n * @example\n * ```ts\n * const ffmpeg = new FFmpeg();\n * ```\n */\nclass FFmpeg {\n    #worker = null;\n    /**\n     * #resolves and #rejects tracks Promise resolves and rejects to\n     * be called when we receive message from web worker.\n     */\n    #resolves = {};\n    #rejects = {};\n    #logEventCallbacks = [];\n    #progressEventCallbacks = [];\n    loaded = false;\n    /**\n     * register worker message event handlers.\n     */\n    #registerHandlers = () => {\n        if (this.#worker) {\n            this.#worker.onmessage = ({ data: { id, type, data }, }) => {\n                switch (type) {\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOAD:\n                        this.loaded = true;\n                        this.#resolves[id](data);\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.MOUNT:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.UNMOUNT:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.EXEC:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.FFPROBE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.WRITE_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.READ_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.RENAME:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.CREATE_DIR:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LIST_DIR:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_DIR:\n                        this.#resolves[id](data);\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOG:\n                        this.#logEventCallbacks.forEach((f) => f(data));\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.PROGRESS:\n                        this.#progressEventCallbacks.forEach((f) => f(data));\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.ERROR:\n                        this.#rejects[id](data);\n                        break;\n                }\n                delete this.#resolves[id];\n                delete this.#rejects[id];\n            };\n        }\n    };\n    /**\n     * Generic function to send messages to web worker.\n     */\n    #send = ({ type, data }, trans = [], signal) => {\n        if (!this.#worker) {\n            return Promise.reject(_errors_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_NOT_LOADED);\n        }\n        return new Promise((resolve, reject) => {\n            const id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getMessageID)();\n            this.#worker && this.#worker.postMessage({ id, type, data }, trans);\n            this.#resolves[id] = resolve;\n            this.#rejects[id] = reject;\n            signal?.addEventListener(\"abort\", () => {\n                reject(new DOMException(`Message # ${id} was aborted`, \"AbortError\"));\n            }, { once: true });\n        });\n    };\n    on(event, callback) {\n        if (event === \"log\") {\n            this.#logEventCallbacks.push(callback);\n        }\n        else if (event === \"progress\") {\n            this.#progressEventCallbacks.push(callback);\n        }\n    }\n    off(event, callback) {\n        if (event === \"log\") {\n            this.#logEventCallbacks = this.#logEventCallbacks.filter((f) => f !== callback);\n        }\n        else if (event === \"progress\") {\n            this.#progressEventCallbacks = this.#progressEventCallbacks.filter((f) => f !== callback);\n        }\n    }\n    /**\n     * Loads ffmpeg-core inside web worker. It is required to call this method first\n     * as it initializes WebAssembly and other essential variables.\n     *\n     * @category FFmpeg\n     * @returns `true` if ffmpeg core is loaded for the first time.\n     */\n    load = ({ classWorkerURL, ...config } = {}, { signal } = {}) => {\n        if (!this.#worker) {\n            this.#worker = classWorkerURL ?\n                new Worker(new URL(classWorkerURL, \"file:///Users/arpitk/Downloads/Coding/yt-downloader/node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js\"), {\n                    type: \"module\",\n                }) :\n                // We need to duplicated the code here to enable webpack\n                // to bundle worekr.js here.\n                new Worker(__webpack_require__.tu(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(\"_app-pages-browser_node_modules_pnpm_ffmpeg_ffmpeg_0_12_15_node_modules_ffmpeg_ffmpeg_dist_es-319993\"), __webpack_require__.b)), {\n                    type: undefined,\n                });\n            this.#registerHandlers();\n        }\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOAD,\n            data: config,\n        }, undefined, signal);\n    };\n    /**\n     * Execute ffmpeg command.\n     *\n     * @remarks\n     * To avoid common I/O issues, [\"-nostdin\", \"-y\"] are prepended to the args\n     * by default.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", ...);\n     * // ffmpeg -i video.avi video.mp4\n     * await ffmpeg.exec([\"-i\", \"video.avi\", \"video.mp4\"]);\n     * const data = ffmpeg.readFile(\"video.mp4\");\n     * ```\n     *\n     * @returns `0` if no error, `!= 0` if timeout (1) or error.\n     * @category FFmpeg\n     */\n    exec = (\n    /** ffmpeg command line args */\n    args, \n    /**\n     * milliseconds to wait before stopping the command execution.\n     *\n     * @defaultValue -1\n     */\n    timeout = -1, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.EXEC,\n        data: { args, timeout },\n    }, undefined, signal);\n    /**\n     * Execute ffprobe command.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", ...);\n     * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt\n     * await ffmpeg.ffprobe([\"-v\", \"error\", \"-show_entries\", \"format=duration\", \"-of\", \"default=noprint_wrappers=1:nokey=1\", \"video.avi\", \"-o\", \"output.txt\"]);\n     * const data = ffmpeg.readFile(\"output.txt\");\n     * ```\n     *\n     * @returns `0` if no error, `!= 0` if timeout (1) or error.\n     * @category FFmpeg\n     */\n    ffprobe = (\n    /** ffprobe command line args */\n    args, \n    /**\n     * milliseconds to wait before stopping the command execution.\n     *\n     * @defaultValue -1\n     */\n    timeout = -1, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.FFPROBE,\n        data: { args, timeout },\n    }, undefined, signal);\n    /**\n     * Terminate all ongoing API calls and terminate web worker.\n     * `FFmpeg.load()` must be called again before calling any other APIs.\n     *\n     * @category FFmpeg\n     */\n    terminate = () => {\n        const ids = Object.keys(this.#rejects);\n        // rejects all incomplete Promises.\n        for (const id of ids) {\n            this.#rejects[id](_errors_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_TERMINATED);\n            delete this.#rejects[id];\n            delete this.#resolves[id];\n        }\n        if (this.#worker) {\n            this.#worker.terminate();\n            this.#worker = null;\n            this.loaded = false;\n        }\n    };\n    /**\n     * Write data to ffmpeg.wasm.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", await fetchFile(\"../video.avi\"));\n     * await ffmpeg.writeFile(\"text.txt\", \"hello world\");\n     * ```\n     *\n     * @category File System\n     */\n    writeFile = (path, data, { signal } = {}) => {\n        const trans = [];\n        if (data instanceof Uint8Array) {\n            trans.push(data.buffer);\n        }\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.WRITE_FILE,\n            data: { path, data },\n        }, trans, signal);\n    };\n    mount = (fsType, options, mountPoint) => {\n        const trans = [];\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.MOUNT,\n            data: { fsType, options, mountPoint },\n        }, trans);\n    };\n    unmount = (mountPoint) => {\n        const trans = [];\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.UNMOUNT,\n            data: { mountPoint },\n        }, trans);\n    };\n    /**\n     * Read data from ffmpeg.wasm.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * const data = await ffmpeg.readFile(\"video.mp4\");\n     * ```\n     *\n     * @category File System\n     */\n    readFile = (path, \n    /**\n     * File content encoding, supports two encodings:\n     * - utf8: read file as text file, return data in string type.\n     * - binary: read file as binary file, return data in Uint8Array type.\n     *\n     * @defaultValue binary\n     */\n    encoding = \"binary\", { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.READ_FILE,\n        data: { path, encoding },\n    }, undefined, signal);\n    /**\n     * Delete a file.\n     *\n     * @category File System\n     */\n    deleteFile = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_FILE,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * Rename a file or directory.\n     *\n     * @category File System\n     */\n    rename = (oldPath, newPath, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.RENAME,\n        data: { oldPath, newPath },\n    }, undefined, signal);\n    /**\n     * Create a directory.\n     *\n     * @category File System\n     */\n    createDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.CREATE_DIR,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * List directory contents.\n     *\n     * @category File System\n     */\n    listDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LIST_DIR,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * Delete an empty directory.\n     *\n     * @category File System\n     */\n    deleteDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_DIR,\n        data: { path },\n    }, undefined, signal);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9jbGFzc2VzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMkM7QUFDRDtBQUN1QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUSxnQkFBZ0IsR0FBRztBQUNuRTtBQUNBLHlCQUF5QixvREFBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsb0RBQWE7QUFDdEMseUJBQXlCLG9EQUFhO0FBQ3RDLHlCQUF5QixvREFBYTtBQUN0Qyx5QkFBeUIsb0RBQWE7QUFDdEMseUJBQXlCLG9EQUFhO0FBQ3RDLHlCQUF5QixvREFBYTtBQUN0Qyx5QkFBeUIsb0RBQWE7QUFDdEMseUJBQXlCLG9EQUFhO0FBQ3RDLHlCQUF5QixvREFBYTtBQUN0Qyx5QkFBeUIsb0RBQWE7QUFDdEMseUJBQXlCLG9EQUFhO0FBQ3RDO0FBQ0E7QUFDQSx5QkFBeUIsb0RBQWE7QUFDdEM7QUFDQTtBQUNBLHlCQUF5QixvREFBYTtBQUN0QztBQUNBO0FBQ0EseUJBQXlCLG9EQUFhO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQSxrQ0FBa0Msd0RBQWdCO0FBQ2xEO0FBQ0E7QUFDQSx1QkFBdUIsdURBQVk7QUFDbkMsdURBQXVELGdCQUFnQjtBQUN2RTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsSUFBSTtBQUN6RCxhQUFhLElBQUksWUFBWTtBQUM3QixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyw0QkFBNEIsSUFBSSxJQUFJLFNBQVMsSUFBSTtBQUMvRDtBQUNBO0FBQ0EsbURBQW1ELCtJQUFlO0FBQ2xFO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSwyQkFBMkIsK0JBQVEsZ01BQThCLENBQUM7QUFDbEUsMEJBQTBCLFNBQVE7QUFDbEMsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixvREFBYTtBQUMvQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVMsSUFBSTtBQUNqQyxjQUFjLG9EQUFhO0FBQzNCLGdCQUFnQixlQUFlO0FBQy9CLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUyxJQUFJO0FBQ2pDLGNBQWMsb0RBQWE7QUFDM0IsZ0JBQWdCLGVBQWU7QUFDL0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdEQUFnQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixTQUFTLElBQUk7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixvREFBYTtBQUMvQixvQkFBb0IsWUFBWTtBQUNoQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isb0RBQWE7QUFDL0Isb0JBQW9CLDZCQUE2QjtBQUNqRCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isb0RBQWE7QUFDL0Isb0JBQW9CLFlBQVk7QUFDaEMsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixTQUFTLElBQUk7QUFDeEMsY0FBYyxvREFBYTtBQUMzQixnQkFBZ0IsZ0JBQWdCO0FBQ2hDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFNBQVMsSUFBSTtBQUN2QyxjQUFjLG9EQUFhO0FBQzNCLGdCQUFnQixNQUFNO0FBQ3RCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLFNBQVMsSUFBSTtBQUMvQyxjQUFjLG9EQUFhO0FBQzNCLGdCQUFnQixrQkFBa0I7QUFDbEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsU0FBUyxJQUFJO0FBQ3RDLGNBQWMsb0RBQWE7QUFDM0IsZ0JBQWdCLE1BQU07QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsU0FBUyxJQUFJO0FBQ3BDLGNBQWMsb0RBQWE7QUFDM0IsZ0JBQWdCLE1BQU07QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsU0FBUyxJQUFJO0FBQ3RDLGNBQWMsb0RBQWE7QUFDM0IsZ0JBQWdCLE1BQU07QUFDdEIsS0FBSztBQUNMIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9jbGFzc2VzLmpzPzI3YzgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRkZNZXNzYWdlVHlwZSB9IGZyb20gXCIuL2NvbnN0LmpzXCI7XG5pbXBvcnQgeyBnZXRNZXNzYWdlSUQgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuaW1wb3J0IHsgRVJST1JfVEVSTUlOQVRFRCwgRVJST1JfTk9UX0xPQURFRCB9IGZyb20gXCIuL2Vycm9ycy5qc1wiO1xuLyoqXG4gKiBQcm92aWRlcyBBUElzIHRvIGludGVyYWN0IHdpdGggZmZtcGVnIHdlYiB3b3JrZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBjb25zdCBmZm1wZWcgPSBuZXcgRkZtcGVnKCk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEZGbXBlZyB7XG4gICAgI3dvcmtlciA9IG51bGw7XG4gICAgLyoqXG4gICAgICogI3Jlc29sdmVzIGFuZCAjcmVqZWN0cyB0cmFja3MgUHJvbWlzZSByZXNvbHZlcyBhbmQgcmVqZWN0cyB0b1xuICAgICAqIGJlIGNhbGxlZCB3aGVuIHdlIHJlY2VpdmUgbWVzc2FnZSBmcm9tIHdlYiB3b3JrZXIuXG4gICAgICovXG4gICAgI3Jlc29sdmVzID0ge307XG4gICAgI3JlamVjdHMgPSB7fTtcbiAgICAjbG9nRXZlbnRDYWxsYmFja3MgPSBbXTtcbiAgICAjcHJvZ3Jlc3NFdmVudENhbGxiYWNrcyA9IFtdO1xuICAgIGxvYWRlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIHdvcmtlciBtZXNzYWdlIGV2ZW50IGhhbmRsZXJzLlxuICAgICAqL1xuICAgICNyZWdpc3RlckhhbmRsZXJzID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy4jd29ya2VyKSB7XG4gICAgICAgICAgICB0aGlzLiN3b3JrZXIub25tZXNzYWdlID0gKHsgZGF0YTogeyBpZCwgdHlwZSwgZGF0YSB9LCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5MT0FEOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jcmVzb2x2ZXNbaWRdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5NT1VOVDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLlVOTU9VTlQ6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5FWEVDOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuRkZQUk9CRTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLldSSVRFX0ZJTEU6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5SRUFEX0ZJTEU6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5ERUxFVEVfRklMRTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLlJFTkFNRTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkNSRUFURV9ESVI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5MSVNUX0RJUjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkRFTEVURV9ESVI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyZXNvbHZlc1tpZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkxPRzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2xvZ0V2ZW50Q2FsbGJhY2tzLmZvckVhY2goKGYpID0+IGYoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5QUk9HUkVTUzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3Byb2dyZXNzRXZlbnRDYWxsYmFja3MuZm9yRWFjaCgoZikgPT4gZihkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkVSUk9SOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jcmVqZWN0c1tpZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuI3Jlc29sdmVzW2lkXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy4jcmVqZWN0c1tpZF07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZW5lcmljIGZ1bmN0aW9uIHRvIHNlbmQgbWVzc2FnZXMgdG8gd2ViIHdvcmtlci5cbiAgICAgKi9cbiAgICAjc2VuZCA9ICh7IHR5cGUsIGRhdGEgfSwgdHJhbnMgPSBbXSwgc2lnbmFsKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy4jd29ya2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoRVJST1JfTk9UX0xPQURFRCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZ2V0TWVzc2FnZUlEKCk7XG4gICAgICAgICAgICB0aGlzLiN3b3JrZXIgJiYgdGhpcy4jd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQsIHR5cGUsIGRhdGEgfSwgdHJhbnMpO1xuICAgICAgICAgICAgdGhpcy4jcmVzb2x2ZXNbaWRdID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHRoaXMuI3JlamVjdHNbaWRdID0gcmVqZWN0O1xuICAgICAgICAgICAgc2lnbmFsPy5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKGBNZXNzYWdlICMgJHtpZH0gd2FzIGFib3J0ZWRgLCBcIkFib3J0RXJyb3JcIikpO1xuICAgICAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoZXZlbnQgPT09IFwibG9nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuI2xvZ0V2ZW50Q2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50ID09PSBcInByb2dyZXNzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuI3Byb2dyZXNzRXZlbnRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb2ZmKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoZXZlbnQgPT09IFwibG9nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuI2xvZ0V2ZW50Q2FsbGJhY2tzID0gdGhpcy4jbG9nRXZlbnRDYWxsYmFja3MuZmlsdGVyKChmKSA9PiBmICE9PSBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQgPT09IFwicHJvZ3Jlc3NcIikge1xuICAgICAgICAgICAgdGhpcy4jcHJvZ3Jlc3NFdmVudENhbGxiYWNrcyA9IHRoaXMuI3Byb2dyZXNzRXZlbnRDYWxsYmFja3MuZmlsdGVyKChmKSA9PiBmICE9PSBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTG9hZHMgZmZtcGVnLWNvcmUgaW5zaWRlIHdlYiB3b3JrZXIuIEl0IGlzIHJlcXVpcmVkIHRvIGNhbGwgdGhpcyBtZXRob2QgZmlyc3RcbiAgICAgKiBhcyBpdCBpbml0aWFsaXplcyBXZWJBc3NlbWJseSBhbmQgb3RoZXIgZXNzZW50aWFsIHZhcmlhYmxlcy5cbiAgICAgKlxuICAgICAqIEBjYXRlZ29yeSBGRm1wZWdcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgZmZtcGVnIGNvcmUgaXMgbG9hZGVkIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgICAgKi9cbiAgICBsb2FkID0gKHsgY2xhc3NXb3JrZXJVUkwsIC4uLmNvbmZpZyB9ID0ge30sIHsgc2lnbmFsIH0gPSB7fSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuI3dvcmtlcikge1xuICAgICAgICAgICAgdGhpcy4jd29ya2VyID0gY2xhc3NXb3JrZXJVUkwgP1xuICAgICAgICAgICAgICAgIG5ldyBXb3JrZXIobmV3IFVSTChjbGFzc1dvcmtlclVSTCwgaW1wb3J0Lm1ldGEudXJsKSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1vZHVsZVwiLFxuICAgICAgICAgICAgICAgIH0pIDpcbiAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGR1cGxpY2F0ZWQgdGhlIGNvZGUgaGVyZSB0byBlbmFibGUgd2VicGFja1xuICAgICAgICAgICAgICAgIC8vIHRvIGJ1bmRsZSB3b3Jla3IuanMgaGVyZS5cbiAgICAgICAgICAgICAgICBuZXcgV29ya2VyKG5ldyBVUkwoXCIuL3dvcmtlci5qc1wiLCBpbXBvcnQubWV0YS51cmwpLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibW9kdWxlXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLiNyZWdpc3RlckhhbmRsZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuI3NlbmQoe1xuICAgICAgICAgICAgdHlwZTogRkZNZXNzYWdlVHlwZS5MT0FELFxuICAgICAgICAgICAgZGF0YTogY29uZmlnLFxuICAgICAgICB9LCB1bmRlZmluZWQsIHNpZ25hbCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGZmbXBlZyBjb21tYW5kLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUbyBhdm9pZCBjb21tb24gSS9PIGlzc3VlcywgW1wiLW5vc3RkaW5cIiwgXCIteVwiXSBhcmUgcHJlcGVuZGVkIHRvIHRoZSBhcmdzXG4gICAgICogYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHNcbiAgICAgKiBjb25zdCBmZm1wZWcgPSBuZXcgRkZtcGVnKCk7XG4gICAgICogYXdhaXQgZmZtcGVnLmxvYWQoKTtcbiAgICAgKiBhd2FpdCBmZm1wZWcud3JpdGVGaWxlKFwidmlkZW8uYXZpXCIsIC4uLik7XG4gICAgICogLy8gZmZtcGVnIC1pIHZpZGVvLmF2aSB2aWRlby5tcDRcbiAgICAgKiBhd2FpdCBmZm1wZWcuZXhlYyhbXCItaVwiLCBcInZpZGVvLmF2aVwiLCBcInZpZGVvLm1wNFwiXSk7XG4gICAgICogY29uc3QgZGF0YSA9IGZmbXBlZy5yZWFkRmlsZShcInZpZGVvLm1wNFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGAwYCBpZiBubyBlcnJvciwgYCE9IDBgIGlmIHRpbWVvdXQgKDEpIG9yIGVycm9yLlxuICAgICAqIEBjYXRlZ29yeSBGRm1wZWdcbiAgICAgKi9cbiAgICBleGVjID0gKFxuICAgIC8qKiBmZm1wZWcgY29tbWFuZCBsaW5lIGFyZ3MgKi9cbiAgICBhcmdzLCBcbiAgICAvKipcbiAgICAgKiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgc3RvcHBpbmcgdGhlIGNvbW1hbmQgZXhlY3V0aW9uLlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSAtMVxuICAgICAqL1xuICAgIHRpbWVvdXQgPSAtMSwgeyBzaWduYWwgfSA9IHt9KSA9PiB0aGlzLiNzZW5kKHtcbiAgICAgICAgdHlwZTogRkZNZXNzYWdlVHlwZS5FWEVDLFxuICAgICAgICBkYXRhOiB7IGFyZ3MsIHRpbWVvdXQgfSxcbiAgICB9LCB1bmRlZmluZWQsIHNpZ25hbCk7XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBmZnByb2JlIGNvbW1hbmQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHRzXG4gICAgICogY29uc3QgZmZtcGVnID0gbmV3IEZGbXBlZygpO1xuICAgICAqIGF3YWl0IGZmbXBlZy5sb2FkKCk7XG4gICAgICogYXdhaXQgZmZtcGVnLndyaXRlRmlsZShcInZpZGVvLmF2aVwiLCAuLi4pO1xuICAgICAqIC8vIEdldHRpbmcgZHVyYXRpb24gb2YgYSB2aWRlbyBpbiBzZWNvbmRzOiBmZnByb2JlIC12IGVycm9yIC1zaG93X2VudHJpZXMgZm9ybWF0PWR1cmF0aW9uIC1vZiBkZWZhdWx0PW5vcHJpbnRfd3JhcHBlcnM9MTpub2tleT0xIHZpZGVvLmF2aSAtbyBvdXRwdXQudHh0XG4gICAgICogYXdhaXQgZmZtcGVnLmZmcHJvYmUoW1wiLXZcIiwgXCJlcnJvclwiLCBcIi1zaG93X2VudHJpZXNcIiwgXCJmb3JtYXQ9ZHVyYXRpb25cIiwgXCItb2ZcIiwgXCJkZWZhdWx0PW5vcHJpbnRfd3JhcHBlcnM9MTpub2tleT0xXCIsIFwidmlkZW8uYXZpXCIsIFwiLW9cIiwgXCJvdXRwdXQudHh0XCJdKTtcbiAgICAgKiBjb25zdCBkYXRhID0gZmZtcGVnLnJlYWRGaWxlKFwib3V0cHV0LnR4dFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGAwYCBpZiBubyBlcnJvciwgYCE9IDBgIGlmIHRpbWVvdXQgKDEpIG9yIGVycm9yLlxuICAgICAqIEBjYXRlZ29yeSBGRm1wZWdcbiAgICAgKi9cbiAgICBmZnByb2JlID0gKFxuICAgIC8qKiBmZnByb2JlIGNvbW1hbmQgbGluZSBhcmdzICovXG4gICAgYXJncywgXG4gICAgLyoqXG4gICAgICogbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIHN0b3BwaW5nIHRoZSBjb21tYW5kIGV4ZWN1dGlvbi5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgLTFcbiAgICAgKi9cbiAgICB0aW1lb3V0ID0gLTEsIHsgc2lnbmFsIH0gPSB7fSkgPT4gdGhpcy4jc2VuZCh7XG4gICAgICAgIHR5cGU6IEZGTWVzc2FnZVR5cGUuRkZQUk9CRSxcbiAgICAgICAgZGF0YTogeyBhcmdzLCB0aW1lb3V0IH0sXG4gICAgfSwgdW5kZWZpbmVkLCBzaWduYWwpO1xuICAgIC8qKlxuICAgICAqIFRlcm1pbmF0ZSBhbGwgb25nb2luZyBBUEkgY2FsbHMgYW5kIHRlcm1pbmF0ZSB3ZWIgd29ya2VyLlxuICAgICAqIGBGRm1wZWcubG9hZCgpYCBtdXN0IGJlIGNhbGxlZCBhZ2FpbiBiZWZvcmUgY2FsbGluZyBhbnkgb3RoZXIgQVBJcy5cbiAgICAgKlxuICAgICAqIEBjYXRlZ29yeSBGRm1wZWdcbiAgICAgKi9cbiAgICB0ZXJtaW5hdGUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlkcyA9IE9iamVjdC5rZXlzKHRoaXMuI3JlamVjdHMpO1xuICAgICAgICAvLyByZWplY3RzIGFsbCBpbmNvbXBsZXRlIFByb21pc2VzLlxuICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcykge1xuICAgICAgICAgICAgdGhpcy4jcmVqZWN0c1tpZF0oRVJST1JfVEVSTUlOQVRFRCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy4jcmVqZWN0c1tpZF07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy4jcmVzb2x2ZXNbaWRdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLiN3b3JrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3dvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgICAgIHRoaXMuI3dvcmtlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBXcml0ZSBkYXRhIHRvIGZmbXBlZy53YXNtLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0c1xuICAgICAqIGNvbnN0IGZmbXBlZyA9IG5ldyBGRm1wZWcoKTtcbiAgICAgKiBhd2FpdCBmZm1wZWcubG9hZCgpO1xuICAgICAqIGF3YWl0IGZmbXBlZy53cml0ZUZpbGUoXCJ2aWRlby5hdmlcIiwgYXdhaXQgZmV0Y2hGaWxlKFwiLi4vdmlkZW8uYXZpXCIpKTtcbiAgICAgKiBhd2FpdCBmZm1wZWcud3JpdGVGaWxlKFwidGV4dC50eHRcIiwgXCJoZWxsbyB3b3JsZFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBjYXRlZ29yeSBGaWxlIFN5c3RlbVxuICAgICAqL1xuICAgIHdyaXRlRmlsZSA9IChwYXRoLCBkYXRhLCB7IHNpZ25hbCB9ID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgdHJhbnMgPSBbXTtcbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICB0cmFucy5wdXNoKGRhdGEuYnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy4jc2VuZCh7XG4gICAgICAgICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLldSSVRFX0ZJTEUsXG4gICAgICAgICAgICBkYXRhOiB7IHBhdGgsIGRhdGEgfSxcbiAgICAgICAgfSwgdHJhbnMsIHNpZ25hbCk7XG4gICAgfTtcbiAgICBtb3VudCA9IChmc1R5cGUsIG9wdGlvbnMsIG1vdW50UG9pbnQpID0+IHtcbiAgICAgICAgY29uc3QgdHJhbnMgPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NlbmQoe1xuICAgICAgICAgICAgdHlwZTogRkZNZXNzYWdlVHlwZS5NT1VOVCxcbiAgICAgICAgICAgIGRhdGE6IHsgZnNUeXBlLCBvcHRpb25zLCBtb3VudFBvaW50IH0sXG4gICAgICAgIH0sIHRyYW5zKTtcbiAgICB9O1xuICAgIHVubW91bnQgPSAobW91bnRQb2ludCkgPT4ge1xuICAgICAgICBjb25zdCB0cmFucyA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VuZCh7XG4gICAgICAgICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLlVOTU9VTlQsXG4gICAgICAgICAgICBkYXRhOiB7IG1vdW50UG9pbnQgfSxcbiAgICAgICAgfSwgdHJhbnMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVhZCBkYXRhIGZyb20gZmZtcGVnLndhc20uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHRzXG4gICAgICogY29uc3QgZmZtcGVnID0gbmV3IEZGbXBlZygpO1xuICAgICAqIGF3YWl0IGZmbXBlZy5sb2FkKCk7XG4gICAgICogY29uc3QgZGF0YSA9IGF3YWl0IGZmbXBlZy5yZWFkRmlsZShcInZpZGVvLm1wNFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBjYXRlZ29yeSBGaWxlIFN5c3RlbVxuICAgICAqL1xuICAgIHJlYWRGaWxlID0gKHBhdGgsIFxuICAgIC8qKlxuICAgICAqIEZpbGUgY29udGVudCBlbmNvZGluZywgc3VwcG9ydHMgdHdvIGVuY29kaW5nczpcbiAgICAgKiAtIHV0Zjg6IHJlYWQgZmlsZSBhcyB0ZXh0IGZpbGUsIHJldHVybiBkYXRhIGluIHN0cmluZyB0eXBlLlxuICAgICAqIC0gYmluYXJ5OiByZWFkIGZpbGUgYXMgYmluYXJ5IGZpbGUsIHJldHVybiBkYXRhIGluIFVpbnQ4QXJyYXkgdHlwZS5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYmluYXJ5XG4gICAgICovXG4gICAgZW5jb2RpbmcgPSBcImJpbmFyeVwiLCB7IHNpZ25hbCB9ID0ge30pID0+IHRoaXMuI3NlbmQoe1xuICAgICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLlJFQURfRklMRSxcbiAgICAgICAgZGF0YTogeyBwYXRoLCBlbmNvZGluZyB9LFxuICAgIH0sIHVuZGVmaW5lZCwgc2lnbmFsKTtcbiAgICAvKipcbiAgICAgKiBEZWxldGUgYSBmaWxlLlxuICAgICAqXG4gICAgICogQGNhdGVnb3J5IEZpbGUgU3lzdGVtXG4gICAgICovXG4gICAgZGVsZXRlRmlsZSA9IChwYXRoLCB7IHNpZ25hbCB9ID0ge30pID0+IHRoaXMuI3NlbmQoe1xuICAgICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLkRFTEVURV9GSUxFLFxuICAgICAgICBkYXRhOiB7IHBhdGggfSxcbiAgICB9LCB1bmRlZmluZWQsIHNpZ25hbCk7XG4gICAgLyoqXG4gICAgICogUmVuYW1lIGEgZmlsZSBvciBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBAY2F0ZWdvcnkgRmlsZSBTeXN0ZW1cbiAgICAgKi9cbiAgICByZW5hbWUgPSAob2xkUGF0aCwgbmV3UGF0aCwgeyBzaWduYWwgfSA9IHt9KSA9PiB0aGlzLiNzZW5kKHtcbiAgICAgICAgdHlwZTogRkZNZXNzYWdlVHlwZS5SRU5BTUUsXG4gICAgICAgIGRhdGE6IHsgb2xkUGF0aCwgbmV3UGF0aCB9LFxuICAgIH0sIHVuZGVmaW5lZCwgc2lnbmFsKTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBAY2F0ZWdvcnkgRmlsZSBTeXN0ZW1cbiAgICAgKi9cbiAgICBjcmVhdGVEaXIgPSAocGF0aCwgeyBzaWduYWwgfSA9IHt9KSA9PiB0aGlzLiNzZW5kKHtcbiAgICAgICAgdHlwZTogRkZNZXNzYWdlVHlwZS5DUkVBVEVfRElSLFxuICAgICAgICBkYXRhOiB7IHBhdGggfSxcbiAgICB9LCB1bmRlZmluZWQsIHNpZ25hbCk7XG4gICAgLyoqXG4gICAgICogTGlzdCBkaXJlY3RvcnkgY29udGVudHMuXG4gICAgICpcbiAgICAgKiBAY2F0ZWdvcnkgRmlsZSBTeXN0ZW1cbiAgICAgKi9cbiAgICBsaXN0RGlyID0gKHBhdGgsIHsgc2lnbmFsIH0gPSB7fSkgPT4gdGhpcy4jc2VuZCh7XG4gICAgICAgIHR5cGU6IEZGTWVzc2FnZVR5cGUuTElTVF9ESVIsXG4gICAgICAgIGRhdGE6IHsgcGF0aCB9LFxuICAgIH0sIHVuZGVmaW5lZCwgc2lnbmFsKTtcbiAgICAvKipcbiAgICAgKiBEZWxldGUgYW4gZW1wdHkgZGlyZWN0b3J5LlxuICAgICAqXG4gICAgICogQGNhdGVnb3J5IEZpbGUgU3lzdGVtXG4gICAgICovXG4gICAgZGVsZXRlRGlyID0gKHBhdGgsIHsgc2lnbmFsIH0gPSB7fSkgPT4gdGhpcy4jc2VuZCh7XG4gICAgICAgIHR5cGU6IEZGTWVzc2FnZVR5cGUuREVMRVRFX0RJUixcbiAgICAgICAgZGF0YTogeyBwYXRoIH0sXG4gICAgfSwgdW5kZWZpbmVkLCBzaWduYWwpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CORE_URL: function() { return /* binding */ CORE_URL; },\n/* harmony export */   CORE_VERSION: function() { return /* binding */ CORE_VERSION; },\n/* harmony export */   FFMessageType: function() { return /* binding */ FFMessageType; },\n/* harmony export */   MIME_TYPE_JAVASCRIPT: function() { return /* binding */ MIME_TYPE_JAVASCRIPT; },\n/* harmony export */   MIME_TYPE_WASM: function() { return /* binding */ MIME_TYPE_WASM; }\n/* harmony export */ });\nconst MIME_TYPE_JAVASCRIPT = \"text/javascript\";\nconst MIME_TYPE_WASM = \"application/wasm\";\nconst CORE_VERSION = \"0.12.9\";\nconst CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/ffmpeg-core.js`;\nvar FFMessageType;\n(function (FFMessageType) {\n    FFMessageType[\"LOAD\"] = \"LOAD\";\n    FFMessageType[\"EXEC\"] = \"EXEC\";\n    FFMessageType[\"FFPROBE\"] = \"FFPROBE\";\n    FFMessageType[\"WRITE_FILE\"] = \"WRITE_FILE\";\n    FFMessageType[\"READ_FILE\"] = \"READ_FILE\";\n    FFMessageType[\"DELETE_FILE\"] = \"DELETE_FILE\";\n    FFMessageType[\"RENAME\"] = \"RENAME\";\n    FFMessageType[\"CREATE_DIR\"] = \"CREATE_DIR\";\n    FFMessageType[\"LIST_DIR\"] = \"LIST_DIR\";\n    FFMessageType[\"DELETE_DIR\"] = \"DELETE_DIR\";\n    FFMessageType[\"ERROR\"] = \"ERROR\";\n    FFMessageType[\"DOWNLOAD\"] = \"DOWNLOAD\";\n    FFMessageType[\"PROGRESS\"] = \"PROGRESS\";\n    FFMessageType[\"LOG\"] = \"LOG\";\n    FFMessageType[\"MOUNT\"] = \"MOUNT\";\n    FFMessageType[\"UNMOUNT\"] = \"UNMOUNT\";\n})(FFMessageType || (FFMessageType = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9jb25zdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFPO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxhQUFhO0FBQ2hFO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9jb25zdC5qcz82Zjc0Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBNSU1FX1RZUEVfSkFWQVNDUklQVCA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG5leHBvcnQgY29uc3QgTUlNRV9UWVBFX1dBU00gPSBcImFwcGxpY2F0aW9uL3dhc21cIjtcbmV4cG9ydCBjb25zdCBDT1JFX1ZFUlNJT04gPSBcIjAuMTIuOVwiO1xuZXhwb3J0IGNvbnN0IENPUkVfVVJMID0gYGh0dHBzOi8vdW5wa2cuY29tL0BmZm1wZWcvY29yZUAke0NPUkVfVkVSU0lPTn0vZGlzdC91bWQvZmZtcGVnLWNvcmUuanNgO1xuZXhwb3J0IHZhciBGRk1lc3NhZ2VUeXBlO1xuKGZ1bmN0aW9uIChGRk1lc3NhZ2VUeXBlKSB7XG4gICAgRkZNZXNzYWdlVHlwZVtcIkxPQURcIl0gPSBcIkxPQURcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiRVhFQ1wiXSA9IFwiRVhFQ1wiO1xuICAgIEZGTWVzc2FnZVR5cGVbXCJGRlBST0JFXCJdID0gXCJGRlBST0JFXCI7XG4gICAgRkZNZXNzYWdlVHlwZVtcIldSSVRFX0ZJTEVcIl0gPSBcIldSSVRFX0ZJTEVcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiUkVBRF9GSUxFXCJdID0gXCJSRUFEX0ZJTEVcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiREVMRVRFX0ZJTEVcIl0gPSBcIkRFTEVURV9GSUxFXCI7XG4gICAgRkZNZXNzYWdlVHlwZVtcIlJFTkFNRVwiXSA9IFwiUkVOQU1FXCI7XG4gICAgRkZNZXNzYWdlVHlwZVtcIkNSRUFURV9ESVJcIl0gPSBcIkNSRUFURV9ESVJcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiTElTVF9ESVJcIl0gPSBcIkxJU1RfRElSXCI7XG4gICAgRkZNZXNzYWdlVHlwZVtcIkRFTEVURV9ESVJcIl0gPSBcIkRFTEVURV9ESVJcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiRVJST1JcIl0gPSBcIkVSUk9SXCI7XG4gICAgRkZNZXNzYWdlVHlwZVtcIkRPV05MT0FEXCJdID0gXCJET1dOTE9BRFwiO1xuICAgIEZGTWVzc2FnZVR5cGVbXCJQUk9HUkVTU1wiXSA9IFwiUFJPR1JFU1NcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiTE9HXCJdID0gXCJMT0dcIjtcbiAgICBGRk1lc3NhZ2VUeXBlW1wiTU9VTlRcIl0gPSBcIk1PVU5UXCI7XG4gICAgRkZNZXNzYWdlVHlwZVtcIlVOTU9VTlRcIl0gPSBcIlVOTU9VTlRcIjtcbn0pKEZGTWVzc2FnZVR5cGUgfHwgKEZGTWVzc2FnZVR5cGUgPSB7fSkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_IMPORT_FAILURE: function() { return /* binding */ ERROR_IMPORT_FAILURE; },\n/* harmony export */   ERROR_NOT_LOADED: function() { return /* binding */ ERROR_NOT_LOADED; },\n/* harmony export */   ERROR_TERMINATED: function() { return /* binding */ ERROR_TERMINATED; },\n/* harmony export */   ERROR_UNKNOWN_MESSAGE_TYPE: function() { return /* binding */ ERROR_UNKNOWN_MESSAGE_TYPE; }\n/* harmony export */ });\nconst ERROR_UNKNOWN_MESSAGE_TYPE = new Error(\"unknown message type\");\nconst ERROR_NOT_LOADED = new Error(\"ffmpeg is not loaded, call `await ffmpeg.load()` first\");\nconst ERROR_TERMINATED = new Error(\"called FFmpeg.terminate()\");\nconst ERROR_IMPORT_FAILURE = new Error(\"failed to import ffmpeg-core.js\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9lcnJvcnMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFPO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9lcnJvcnMuanM/NTJlOCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgRVJST1JfVU5LTk9XTl9NRVNTQUdFX1RZUEUgPSBuZXcgRXJyb3IoXCJ1bmtub3duIG1lc3NhZ2UgdHlwZVwiKTtcbmV4cG9ydCBjb25zdCBFUlJPUl9OT1RfTE9BREVEID0gbmV3IEVycm9yKFwiZmZtcGVnIGlzIG5vdCBsb2FkZWQsIGNhbGwgYGF3YWl0IGZmbXBlZy5sb2FkKClgIGZpcnN0XCIpO1xuZXhwb3J0IGNvbnN0IEVSUk9SX1RFUk1JTkFURUQgPSBuZXcgRXJyb3IoXCJjYWxsZWQgRkZtcGVnLnRlcm1pbmF0ZSgpXCIpO1xuZXhwb3J0IGNvbnN0IEVSUk9SX0lNUE9SVF9GQUlMVVJFID0gbmV3IEVycm9yKFwiZmFpbGVkIHRvIGltcG9ydCBmZm1wZWctY29yZS5qc1wiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/index.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/index.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFFSType: function() { return /* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_1__.FFFSType; },\n/* harmony export */   FFmpeg: function() { return /* reexport safe */ _classes_js__WEBPACK_IMPORTED_MODULE_0__.FFmpeg; }\n/* harmony export */ });\n/* harmony import */ var _classes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js\");\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/types.js\");\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTZCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzLy5wbnBtL0BmZm1wZWcrZmZtcGVnQDAuMTIuMTUvbm9kZV9tb2R1bGVzL0BmZm1wZWcvZmZtcGVnL2Rpc3QvZXNtL2luZGV4LmpzP2Y1OTkiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSBcIi4vY2xhc3Nlcy5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXMuanNcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/index.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/types.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/types.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFFSType: function() { return /* binding */ FFFSType; }\n/* harmony export */ });\nvar FFFSType;\n(function (FFFSType) {\n    FFFSType[\"MEMFS\"] = \"MEMFS\";\n    FFFSType[\"NODEFS\"] = \"NODEFS\";\n    FFFSType[\"NODERAWFS\"] = \"NODERAWFS\";\n    FFFSType[\"IDBFS\"] = \"IDBFS\";\n    FFFSType[\"WORKERFS\"] = \"WORKERFS\";\n    FFFSType[\"PROXYFS\"] = \"PROXYFS\";\n})(FFFSType || (FFFSType = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS90eXBlcy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsNEJBQTRCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS90eXBlcy5qcz9hMjU2Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB2YXIgRkZGU1R5cGU7XG4oZnVuY3Rpb24gKEZGRlNUeXBlKSB7XG4gICAgRkZGU1R5cGVbXCJNRU1GU1wiXSA9IFwiTUVNRlNcIjtcbiAgICBGRkZTVHlwZVtcIk5PREVGU1wiXSA9IFwiTk9ERUZTXCI7XG4gICAgRkZGU1R5cGVbXCJOT0RFUkFXRlNcIl0gPSBcIk5PREVSQVdGU1wiO1xuICAgIEZGRlNUeXBlW1wiSURCRlNcIl0gPSBcIklEQkZTXCI7XG4gICAgRkZGU1R5cGVbXCJXT1JLRVJGU1wiXSA9IFwiV09SS0VSRlNcIjtcbiAgICBGRkZTVHlwZVtcIlBST1hZRlNcIl0gPSBcIlBST1hZRlNcIjtcbn0pKEZGRlNUeXBlIHx8IChGRkZTVHlwZSA9IHt9KSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/types.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getMessageID: function() { return /* binding */ getMessageID; }\n/* harmony export */ });\n/**\n * Generate an unique message ID.\n */\nconst getMessageID = (() => {\n    let messageID = 0;\n    return () => messageID++;\n})();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK2ZmbXBlZ0AwLjEyLjE1L25vZGVfbW9kdWxlcy9AZmZtcGVnL2ZmbXBlZy9kaXN0L2VzbS91dGlscy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvLnBucG0vQGZmbXBlZytmZm1wZWdAMC4xMi4xNS9ub2RlX21vZHVsZXMvQGZmbXBlZy9mZm1wZWcvZGlzdC9lc20vdXRpbHMuanM/YjBlNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdlbmVyYXRlIGFuIHVuaXF1ZSBtZXNzYWdlIElELlxuICovXG5leHBvcnQgY29uc3QgZ2V0TWVzc2FnZUlEID0gKCgpID0+IHtcbiAgICBsZXQgbWVzc2FnZUlEID0gMDtcbiAgICByZXR1cm4gKCkgPT4gbWVzc2FnZUlEKys7XG59KSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./app/workers/ffmpeg.worker.ts":
/*!**************************************!*\
  !*** ./app/workers/ffmpeg.worker.ts ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ffmpeg/ffmpeg */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/index.js\");\n/* harmony import */ var _ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ffmpeg/util */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js\");\n/// <reference lib=\"webworker\" />\n\n\nlet ffmpeg = null;\nlet loadedMode = null;\nlet isRunning = false;\nconst emit = (type, payload)=>{\n    self.postMessage({\n        type,\n        ...payload !== null && payload !== void 0 ? payload : {}\n    });\n};\nconst createFfmpegInstance = ()=>{\n    const instance = new _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_0__.FFmpeg();\n    instance.on(\"progress\", (param)=>{\n        let { progress } = param;\n        emit(\"progress\", {\n            ratio: progress\n        });\n    });\n    instance.on(\"log\", (param)=>{\n        let { message } = param;\n        emit(\"log\", {\n            message\n        });\n    });\n    return instance;\n};\nconst loadFfmpeg = async (preferMultiThread)=>{\n    if (!ffmpeg) {\n        ffmpeg = createFfmpegInstance();\n    }\n    if (loadedMode) {\n        return;\n    }\n    emit(\"phase\", {\n        phase: \"loading_core\"\n    });\n    const singleThreadBase = \"https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd\";\n    const multiThreadBase = \"https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd\";\n    if (preferMultiThread) {\n        try {\n            await ffmpeg.load({\n                coreURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(\"\".concat(multiThreadBase, \"/ffmpeg-core.js\"), \"text/javascript\"),\n                wasmURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(\"\".concat(multiThreadBase, \"/ffmpeg-core.wasm\"), \"application/wasm\"),\n                workerURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(\"\".concat(multiThreadBase, \"/ffmpeg-core.worker.js\"), \"text/javascript\")\n            });\n            loadedMode = \"multi\";\n            emit(\"phase\", {\n                phase: \"core_ready_multi\"\n            });\n            return;\n        } catch (e) {\n            // Fall back to single-thread core when mt prerequisites are not satisfied.\n            ffmpeg.terminate();\n            ffmpeg = createFfmpegInstance();\n            loadedMode = null;\n            emit(\"phase\", {\n                phase: \"core_mt_failed_fallback_single\"\n            });\n        }\n    }\n    await ffmpeg.load({\n        coreURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(\"\".concat(singleThreadBase, \"/ffmpeg-core.js\"), \"text/javascript\"),\n        wasmURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(\"\".concat(singleThreadBase, \"/ffmpeg-core.wasm\"), \"application/wasm\")\n    });\n    loadedMode = \"single\";\n    emit(\"phase\", {\n        phase: \"core_ready_single\"\n    });\n};\nconst fetchBinary = async (url, label)=>{\n    emit(\"phase\", {\n        phase: \"fetching_inputs\",\n        label\n    });\n    const response = await fetch(url);\n    if (!response.ok) {\n        throw new Error(\"Failed to fetch \".concat(label, \": \").concat(response.status));\n    }\n    const buffer = await response.arrayBuffer();\n    return new Uint8Array(buffer);\n};\nconst toTransferableBuffer = (bytes)=>{\n    return bytes.slice().buffer;\n};\nconst runMerge = async (message)=>{\n    const { audioUrl, videoUrl, audioExtension, videoExtension, outputFileName, multiThread } = message.payload;\n    await loadFfmpeg(multiThread);\n    if (!ffmpeg) {\n        throw new Error(\"FFmpeg failed to initialize.\");\n    }\n    const audioFileName = \"input-audio.\".concat(audioExtension);\n    const videoFileName = \"input-video.\".concat(videoExtension);\n    const [audioData, videoData] = await Promise.all([\n        fetchBinary(audioUrl, \"audio\"),\n        fetchBinary(videoUrl, \"video\")\n    ]);\n    await ffmpeg.writeFile(audioFileName, audioData);\n    await ffmpeg.writeFile(videoFileName, videoData);\n    emit(\"phase\", {\n        phase: \"muxing\"\n    });\n    await ffmpeg.exec([\n        \"-i\",\n        videoFileName,\n        \"-i\",\n        audioFileName,\n        \"-c:v\",\n        \"copy\",\n        \"-c:a\",\n        \"aac\",\n        outputFileName\n    ]);\n    const outputData = await ffmpeg.readFile(outputFileName);\n    const transferable = toTransferableBuffer(outputData);\n    self.postMessage({\n        type: \"complete\",\n        fileName: outputFileName,\n        mimeType: \"video/\".concat(videoExtension),\n        buffer: transferable\n    }, [\n        transferable\n    ]);\n    try {\n        await ffmpeg.deleteFile(audioFileName);\n        await ffmpeg.deleteFile(videoFileName);\n        await ffmpeg.deleteFile(outputFileName);\n    } catch (e) {\n    // Ignore cleanup failures in worker FS.\n    }\n};\nconst cancelWork = ()=>{\n    if (ffmpeg) {\n        try {\n            ffmpeg.terminate();\n        } catch (e) {\n        // Ignore terminate errors and recreate instance on next start.\n        }\n    }\n    ffmpeg = null;\n    loadedMode = null;\n    isRunning = false;\n    emit(\"cancelled\");\n};\nself.onmessage = async (event)=>{\n    const message = event.data;\n    if (message.type === \"cancel\") {\n        cancelWork();\n        return;\n    }\n    if (isRunning) {\n        emit(\"error\", {\n            message: \"A merge job is already running.\"\n        });\n        return;\n    }\n    isRunning = true;\n    try {\n        await runMerge(message);\n    } catch (error) {\n        emit(\"error\", {\n            message: error instanceof Error ? error.message : \"Unknown ffmpeg worker error\"\n        });\n    } finally{\n        isRunning = false;\n    }\n};\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC93b3JrZXJzL2ZmbXBlZy53b3JrZXIudHMiLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBRU87QUFDQztBQW9CekMsSUFBSUUsU0FBd0I7QUFDNUIsSUFBSUMsYUFBd0M7QUFDNUMsSUFBSUMsWUFBWTtBQUVoQixNQUFNQyxPQUFPLENBQUNDLE1BQWNDO0lBQzFCQyxLQUFLQyxXQUFXLENBQUM7UUFBRUg7UUFBTSxHQUFJQyxvQkFBQUEscUJBQUFBLFVBQVcsQ0FBQyxDQUFDO0lBQUU7QUFDOUM7QUFFQSxNQUFNRyx1QkFBdUI7SUFDM0IsTUFBTUMsV0FBVyxJQUFJWCxrREFBTUE7SUFFM0JXLFNBQVNDLEVBQUUsQ0FBQyxZQUFZO1lBQUMsRUFBRUMsUUFBUSxFQUFzQztRQUN2RVIsS0FBSyxZQUFZO1lBQ2ZTLE9BQU9EO1FBQ1Q7SUFDRjtJQUVBRixTQUFTQyxFQUFFLENBQUMsT0FBTztZQUFDLEVBQUVHLE9BQU8sRUFBdUI7UUFDbERWLEtBQUssT0FBTztZQUFFVTtRQUFRO0lBQ3hCO0lBRUEsT0FBT0o7QUFDVDtBQUVBLE1BQU1LLGFBQWEsT0FBT0M7SUFDeEIsSUFBSSxDQUFDZixRQUFRO1FBQ1hBLFNBQVNRO0lBQ1g7SUFFQSxJQUFJUCxZQUFZO1FBQ2Q7SUFDRjtJQUVBRSxLQUFLLFNBQVM7UUFDWmEsT0FBTztJQUNUO0lBRUEsTUFBTUMsbUJBQW1CO0lBQ3pCLE1BQU1DLGtCQUFrQjtJQUV4QixJQUFJSCxtQkFBbUI7UUFDckIsSUFBSTtZQUNGLE1BQU1mLE9BQU9tQixJQUFJLENBQUM7Z0JBQ2hCQyxTQUFTLE1BQU1yQix1REFBU0EsQ0FBQyxHQUFtQixPQUFoQm1CLGlCQUFnQixvQkFBa0I7Z0JBQzlERyxTQUFTLE1BQU10Qix1REFBU0EsQ0FBQyxHQUFtQixPQUFoQm1CLGlCQUFnQixzQkFBb0I7Z0JBQ2hFSSxXQUFXLE1BQU12Qix1REFBU0EsQ0FBQyxHQUFtQixPQUFoQm1CLGlCQUFnQiwyQkFBeUI7WUFDekU7WUFDQWpCLGFBQWE7WUFDYkUsS0FBSyxTQUFTO2dCQUFFYSxPQUFPO1lBQW1CO1lBQzFDO1FBQ0YsRUFBRSxVQUFNO1lBQ04sMkVBQTJFO1lBQzNFaEIsT0FBT3VCLFNBQVM7WUFDaEJ2QixTQUFTUTtZQUNUUCxhQUFhO1lBQ2JFLEtBQUssU0FBUztnQkFBRWEsT0FBTztZQUFpQztRQUMxRDtJQUNGO0lBRUEsTUFBTWhCLE9BQU9tQixJQUFJLENBQUM7UUFDaEJDLFNBQVMsTUFBTXJCLHVEQUFTQSxDQUFDLEdBQW9CLE9BQWpCa0Isa0JBQWlCLG9CQUFrQjtRQUMvREksU0FBUyxNQUFNdEIsdURBQVNBLENBQUMsR0FBb0IsT0FBakJrQixrQkFBaUIsc0JBQW9CO0lBQ25FO0lBRUFoQixhQUFhO0lBQ2JFLEtBQUssU0FBUztRQUFFYSxPQUFPO0lBQW9CO0FBQzdDO0FBRUEsTUFBTVEsY0FBYyxPQUFPQyxLQUFhQztJQUN0Q3ZCLEtBQUssU0FBUztRQUNaYSxPQUFPO1FBQ1BVO0lBQ0Y7SUFFQSxNQUFNQyxXQUFXLE1BQU1DLE1BQU1IO0lBRTdCLElBQUksQ0FBQ0UsU0FBU0UsRUFBRSxFQUFFO1FBQ2hCLE1BQU0sSUFBSUMsTUFBTSxtQkFBNkJILE9BQVZELE9BQU0sTUFBb0IsT0FBaEJDLFNBQVNJLE1BQU07SUFDOUQ7SUFFQSxNQUFNQyxTQUFTLE1BQU1MLFNBQVNNLFdBQVc7SUFDekMsT0FBTyxJQUFJQyxXQUFXRjtBQUN4QjtBQUVBLE1BQU1HLHVCQUF1QixDQUFDQztJQUM1QixPQUFPQSxNQUFNQyxLQUFLLEdBQUdMLE1BQU07QUFDN0I7QUFFQSxNQUFNTSxXQUFXLE9BQU96QjtJQUN0QixNQUFNLEVBQ0owQixRQUFRLEVBQ1JDLFFBQVEsRUFDUkMsY0FBYyxFQUNkQyxjQUFjLEVBQ2RDLGNBQWMsRUFDZEMsV0FBVyxFQUNaLEdBQUcvQixRQUFRUixPQUFPO0lBRW5CLE1BQU1TLFdBQVc4QjtJQUVqQixJQUFJLENBQUM1QyxRQUFRO1FBQ1gsTUFBTSxJQUFJOEIsTUFBTTtJQUNsQjtJQUVBLE1BQU1lLGdCQUFnQixlQUE4QixPQUFmSjtJQUNyQyxNQUFNSyxnQkFBZ0IsZUFBOEIsT0FBZko7SUFFckMsTUFBTSxDQUFDSyxXQUFXQyxVQUFVLEdBQUcsTUFBTUMsUUFBUUMsR0FBRyxDQUFDO1FBQy9DMUIsWUFBWWUsVUFBVTtRQUN0QmYsWUFBWWdCLFVBQVU7S0FDdkI7SUFFRCxNQUFNeEMsT0FBT21ELFNBQVMsQ0FBQ04sZUFBZUU7SUFDdEMsTUFBTS9DLE9BQU9tRCxTQUFTLENBQUNMLGVBQWVFO0lBRXRDN0MsS0FBSyxTQUFTO1FBQUVhLE9BQU87SUFBUztJQUVoQyxNQUFNaEIsT0FBT29ELElBQUksQ0FBQztRQUNoQjtRQUNBTjtRQUNBO1FBQ0FEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQUY7S0FDRDtJQUVELE1BQU1VLGFBQWMsTUFBTXJELE9BQU9zRCxRQUFRLENBQUNYO0lBQzFDLE1BQU1ZLGVBQWVwQixxQkFBcUJrQjtJQUUxQy9DLEtBQUtDLFdBQVcsQ0FDZDtRQUNFSCxNQUFNO1FBQ05vRCxVQUFVYjtRQUNWYyxVQUFVLFNBQXdCLE9BQWZmO1FBQ25CVixRQUFRdUI7SUFDVixHQUNBO1FBQUNBO0tBQWE7SUFHaEIsSUFBSTtRQUNGLE1BQU12RCxPQUFPMEQsVUFBVSxDQUFDYjtRQUN4QixNQUFNN0MsT0FBTzBELFVBQVUsQ0FBQ1o7UUFDeEIsTUFBTTlDLE9BQU8wRCxVQUFVLENBQUNmO0lBQzFCLEVBQUUsVUFBTTtJQUNOLHdDQUF3QztJQUMxQztBQUNGO0FBRUEsTUFBTWdCLGFBQWE7SUFDakIsSUFBSTNELFFBQVE7UUFDVixJQUFJO1lBQ0ZBLE9BQU91QixTQUFTO1FBQ2xCLEVBQUUsVUFBTTtRQUNOLCtEQUErRDtRQUNqRTtJQUNGO0lBRUF2QixTQUFTO0lBQ1RDLGFBQWE7SUFDYkMsWUFBWTtJQUNaQyxLQUFLO0FBQ1A7QUFFQUcsS0FBS3NELFNBQVMsR0FBRyxPQUFPQztJQUN0QixNQUFNaEQsVUFBVWdELE1BQU1DLElBQUk7SUFFMUIsSUFBSWpELFFBQVFULElBQUksS0FBSyxVQUFVO1FBQzdCdUQ7UUFDQTtJQUNGO0lBRUEsSUFBSXpELFdBQVc7UUFDYkMsS0FBSyxTQUFTO1lBQ1pVLFNBQVM7UUFDWDtRQUNBO0lBQ0Y7SUFFQVgsWUFBWTtJQUVaLElBQUk7UUFDRixNQUFNb0MsU0FBU3pCO0lBQ2pCLEVBQUUsT0FBT2tELE9BQU87UUFDZDVELEtBQUssU0FBUztZQUNaVSxTQUFTa0QsaUJBQWlCakMsUUFBUWlDLE1BQU1sRCxPQUFPLEdBQUc7UUFDcEQ7SUFDRixTQUFVO1FBQ1JYLFlBQVk7SUFDZDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2FwcC93b3JrZXJzL2ZmbXBlZy53b3JrZXIudHM/YzMyMiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuXG5pbXBvcnQgeyBGRm1wZWcgfSBmcm9tIFwiQGZmbXBlZy9mZm1wZWdcIjtcbmltcG9ydCB7IHRvQmxvYlVSTCB9IGZyb20gXCJAZmZtcGVnL3V0aWxcIjtcblxudHlwZSBXb3JrZXJTdGFydE1lc3NhZ2UgPSB7XG4gIHR5cGU6IFwic3RhcnRcIjtcbiAgcGF5bG9hZDoge1xuICAgIGF1ZGlvVXJsOiBzdHJpbmc7XG4gICAgdmlkZW9Vcmw6IHN0cmluZztcbiAgICBhdWRpb0V4dGVuc2lvbjogc3RyaW5nO1xuICAgIHZpZGVvRXh0ZW5zaW9uOiBzdHJpbmc7XG4gICAgb3V0cHV0RmlsZU5hbWU6IHN0cmluZztcbiAgICBtdWx0aVRocmVhZDogYm9vbGVhbjtcbiAgfTtcbn07XG5cbnR5cGUgV29ya2VyQ2FuY2VsTWVzc2FnZSA9IHtcbiAgdHlwZTogXCJjYW5jZWxcIjtcbn07XG5cbnR5cGUgV29ya2VySW5jb21pbmdNZXNzYWdlID0gV29ya2VyU3RhcnRNZXNzYWdlIHwgV29ya2VyQ2FuY2VsTWVzc2FnZTtcblxubGV0IGZmbXBlZzogRkZtcGVnIHwgbnVsbCA9IG51bGw7XG5sZXQgbG9hZGVkTW9kZTogXCJzaW5nbGVcIiB8IFwibXVsdGlcIiB8IG51bGwgPSBudWxsO1xubGV0IGlzUnVubmluZyA9IGZhbHNlO1xuXG5jb25zdCBlbWl0ID0gKHR5cGU6IHN0cmluZywgcGF5bG9hZD86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gIHNlbGYucG9zdE1lc3NhZ2UoeyB0eXBlLCAuLi4ocGF5bG9hZCA/PyB7fSkgfSk7XG59O1xuXG5jb25zdCBjcmVhdGVGZm1wZWdJbnN0YW5jZSA9ICgpOiBGRm1wZWcgPT4ge1xuICBjb25zdCBpbnN0YW5jZSA9IG5ldyBGRm1wZWcoKTtcblxuICBpbnN0YW5jZS5vbihcInByb2dyZXNzXCIsICh7IHByb2dyZXNzIH06IHsgcHJvZ3Jlc3M6IG51bWJlcjsgdGltZTogbnVtYmVyIH0pID0+IHtcbiAgICBlbWl0KFwicHJvZ3Jlc3NcIiwge1xuICAgICAgcmF0aW86IHByb2dyZXNzLFxuICAgIH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5vbihcImxvZ1wiLCAoeyBtZXNzYWdlIH06IHsgbWVzc2FnZTogc3RyaW5nIH0pID0+IHtcbiAgICBlbWl0KFwibG9nXCIsIHsgbWVzc2FnZSB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuY29uc3QgbG9hZEZmbXBlZyA9IGFzeW5jIChwcmVmZXJNdWx0aVRocmVhZDogYm9vbGVhbik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBpZiAoIWZmbXBlZykge1xuICAgIGZmbXBlZyA9IGNyZWF0ZUZmbXBlZ0luc3RhbmNlKCk7XG4gIH1cblxuICBpZiAobG9hZGVkTW9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGVtaXQoXCJwaGFzZVwiLCB7XG4gICAgcGhhc2U6IFwibG9hZGluZ19jb3JlXCIsXG4gIH0pO1xuXG4gIGNvbnN0IHNpbmdsZVRocmVhZEJhc2UgPSBcImh0dHBzOi8vdW5wa2cuY29tL0BmZm1wZWcvY29yZUAwLjEyLjYvZGlzdC91bWRcIjtcbiAgY29uc3QgbXVsdGlUaHJlYWRCYXNlID0gXCJodHRwczovL3VucGtnLmNvbS9AZmZtcGVnL2NvcmUtbXRAMC4xMi42L2Rpc3QvdW1kXCI7XG5cbiAgaWYgKHByZWZlck11bHRpVGhyZWFkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZmbXBlZy5sb2FkKHtcbiAgICAgICAgY29yZVVSTDogYXdhaXQgdG9CbG9iVVJMKGAke211bHRpVGhyZWFkQmFzZX0vZmZtcGVnLWNvcmUuanNgLCBcInRleHQvamF2YXNjcmlwdFwiKSxcbiAgICAgICAgd2FzbVVSTDogYXdhaXQgdG9CbG9iVVJMKGAke211bHRpVGhyZWFkQmFzZX0vZmZtcGVnLWNvcmUud2FzbWAsIFwiYXBwbGljYXRpb24vd2FzbVwiKSxcbiAgICAgICAgd29ya2VyVVJMOiBhd2FpdCB0b0Jsb2JVUkwoYCR7bXVsdGlUaHJlYWRCYXNlfS9mZm1wZWctY29yZS53b3JrZXIuanNgLCBcInRleHQvamF2YXNjcmlwdFwiKSxcbiAgICAgIH0pO1xuICAgICAgbG9hZGVkTW9kZSA9IFwibXVsdGlcIjtcbiAgICAgIGVtaXQoXCJwaGFzZVwiLCB7IHBoYXNlOiBcImNvcmVfcmVhZHlfbXVsdGlcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIEZhbGwgYmFjayB0byBzaW5nbGUtdGhyZWFkIGNvcmUgd2hlbiBtdCBwcmVyZXF1aXNpdGVzIGFyZSBub3Qgc2F0aXNmaWVkLlxuICAgICAgZmZtcGVnLnRlcm1pbmF0ZSgpO1xuICAgICAgZmZtcGVnID0gY3JlYXRlRmZtcGVnSW5zdGFuY2UoKTtcbiAgICAgIGxvYWRlZE1vZGUgPSBudWxsO1xuICAgICAgZW1pdChcInBoYXNlXCIsIHsgcGhhc2U6IFwiY29yZV9tdF9mYWlsZWRfZmFsbGJhY2tfc2luZ2xlXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgYXdhaXQgZmZtcGVnLmxvYWQoe1xuICAgIGNvcmVVUkw6IGF3YWl0IHRvQmxvYlVSTChgJHtzaW5nbGVUaHJlYWRCYXNlfS9mZm1wZWctY29yZS5qc2AsIFwidGV4dC9qYXZhc2NyaXB0XCIpLFxuICAgIHdhc21VUkw6IGF3YWl0IHRvQmxvYlVSTChgJHtzaW5nbGVUaHJlYWRCYXNlfS9mZm1wZWctY29yZS53YXNtYCwgXCJhcHBsaWNhdGlvbi93YXNtXCIpLFxuICB9KTtcblxuICBsb2FkZWRNb2RlID0gXCJzaW5nbGVcIjtcbiAgZW1pdChcInBoYXNlXCIsIHsgcGhhc2U6IFwiY29yZV9yZWFkeV9zaW5nbGVcIiB9KTtcbn07XG5cbmNvbnN0IGZldGNoQmluYXJ5ID0gYXN5bmMgKHVybDogc3RyaW5nLCBsYWJlbDogc3RyaW5nKTogUHJvbWlzZTxVaW50OEFycmF5PiA9PiB7XG4gIGVtaXQoXCJwaGFzZVwiLCB7XG4gICAgcGhhc2U6IFwiZmV0Y2hpbmdfaW5wdXRzXCIsXG4gICAgbGFiZWwsXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmV0Y2ggJHtsYWJlbH06ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICB9XG5cbiAgY29uc3QgYnVmZmVyID0gYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG59O1xuXG5jb25zdCB0b1RyYW5zZmVyYWJsZUJ1ZmZlciA9IChieXRlczogVWludDhBcnJheSk6IEFycmF5QnVmZmVyID0+IHtcbiAgcmV0dXJuIGJ5dGVzLnNsaWNlKCkuYnVmZmVyIGFzIEFycmF5QnVmZmVyO1xufTtcblxuY29uc3QgcnVuTWVyZ2UgPSBhc3luYyAobWVzc2FnZTogV29ya2VyU3RhcnRNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IHtcbiAgICBhdWRpb1VybCxcbiAgICB2aWRlb1VybCxcbiAgICBhdWRpb0V4dGVuc2lvbixcbiAgICB2aWRlb0V4dGVuc2lvbixcbiAgICBvdXRwdXRGaWxlTmFtZSxcbiAgICBtdWx0aVRocmVhZCxcbiAgfSA9IG1lc3NhZ2UucGF5bG9hZDtcblxuICBhd2FpdCBsb2FkRmZtcGVnKG11bHRpVGhyZWFkKTtcblxuICBpZiAoIWZmbXBlZykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkZGbXBlZyBmYWlsZWQgdG8gaW5pdGlhbGl6ZS5cIik7XG4gIH1cblxuICBjb25zdCBhdWRpb0ZpbGVOYW1lID0gYGlucHV0LWF1ZGlvLiR7YXVkaW9FeHRlbnNpb259YDtcbiAgY29uc3QgdmlkZW9GaWxlTmFtZSA9IGBpbnB1dC12aWRlby4ke3ZpZGVvRXh0ZW5zaW9ufWA7XG5cbiAgY29uc3QgW2F1ZGlvRGF0YSwgdmlkZW9EYXRhXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICBmZXRjaEJpbmFyeShhdWRpb1VybCwgXCJhdWRpb1wiKSxcbiAgICBmZXRjaEJpbmFyeSh2aWRlb1VybCwgXCJ2aWRlb1wiKSxcbiAgXSk7XG5cbiAgYXdhaXQgZmZtcGVnLndyaXRlRmlsZShhdWRpb0ZpbGVOYW1lLCBhdWRpb0RhdGEpO1xuICBhd2FpdCBmZm1wZWcud3JpdGVGaWxlKHZpZGVvRmlsZU5hbWUsIHZpZGVvRGF0YSk7XG5cbiAgZW1pdChcInBoYXNlXCIsIHsgcGhhc2U6IFwibXV4aW5nXCIgfSk7XG5cbiAgYXdhaXQgZmZtcGVnLmV4ZWMoW1xuICAgIFwiLWlcIixcbiAgICB2aWRlb0ZpbGVOYW1lLFxuICAgIFwiLWlcIixcbiAgICBhdWRpb0ZpbGVOYW1lLFxuICAgIFwiLWM6dlwiLFxuICAgIFwiY29weVwiLFxuICAgIFwiLWM6YVwiLFxuICAgIFwiYWFjXCIsXG4gICAgb3V0cHV0RmlsZU5hbWUsXG4gIF0pO1xuXG4gIGNvbnN0IG91dHB1dERhdGEgPSAoYXdhaXQgZmZtcGVnLnJlYWRGaWxlKG91dHB1dEZpbGVOYW1lKSkgYXMgVWludDhBcnJheTtcbiAgY29uc3QgdHJhbnNmZXJhYmxlID0gdG9UcmFuc2ZlcmFibGVCdWZmZXIob3V0cHV0RGF0YSk7XG5cbiAgc2VsZi5wb3N0TWVzc2FnZShcbiAgICB7XG4gICAgICB0eXBlOiBcImNvbXBsZXRlXCIsXG4gICAgICBmaWxlTmFtZTogb3V0cHV0RmlsZU5hbWUsXG4gICAgICBtaW1lVHlwZTogYHZpZGVvLyR7dmlkZW9FeHRlbnNpb259YCxcbiAgICAgIGJ1ZmZlcjogdHJhbnNmZXJhYmxlLFxuICAgIH0sXG4gICAgW3RyYW5zZmVyYWJsZV1cbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGZmbXBlZy5kZWxldGVGaWxlKGF1ZGlvRmlsZU5hbWUpO1xuICAgIGF3YWl0IGZmbXBlZy5kZWxldGVGaWxlKHZpZGVvRmlsZU5hbWUpO1xuICAgIGF3YWl0IGZmbXBlZy5kZWxldGVGaWxlKG91dHB1dEZpbGVOYW1lKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gSWdub3JlIGNsZWFudXAgZmFpbHVyZXMgaW4gd29ya2VyIEZTLlxuICB9XG59O1xuXG5jb25zdCBjYW5jZWxXb3JrID0gKCk6IHZvaWQgPT4ge1xuICBpZiAoZmZtcGVnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGZmbXBlZy50ZXJtaW5hdGUoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIElnbm9yZSB0ZXJtaW5hdGUgZXJyb3JzIGFuZCByZWNyZWF0ZSBpbnN0YW5jZSBvbiBuZXh0IHN0YXJ0LlxuICAgIH1cbiAgfVxuXG4gIGZmbXBlZyA9IG51bGw7XG4gIGxvYWRlZE1vZGUgPSBudWxsO1xuICBpc1J1bm5pbmcgPSBmYWxzZTtcbiAgZW1pdChcImNhbmNlbGxlZFwiKTtcbn07XG5cbnNlbGYub25tZXNzYWdlID0gYXN5bmMgKGV2ZW50OiBNZXNzYWdlRXZlbnQ8V29ya2VySW5jb21pbmdNZXNzYWdlPikgPT4ge1xuICBjb25zdCBtZXNzYWdlID0gZXZlbnQuZGF0YTtcblxuICBpZiAobWVzc2FnZS50eXBlID09PSBcImNhbmNlbFwiKSB7XG4gICAgY2FuY2VsV29yaygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc1J1bm5pbmcpIHtcbiAgICBlbWl0KFwiZXJyb3JcIiwge1xuICAgICAgbWVzc2FnZTogXCJBIG1lcmdlIGpvYiBpcyBhbHJlYWR5IHJ1bm5pbmcuXCIsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaXNSdW5uaW5nID0gdHJ1ZTtcblxuICB0cnkge1xuICAgIGF3YWl0IHJ1bk1lcmdlKG1lc3NhZ2UpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVtaXQoXCJlcnJvclwiLCB7XG4gICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiVW5rbm93biBmZm1wZWcgd29ya2VyIGVycm9yXCIsXG4gICAgfSk7XG4gIH0gZmluYWxseSB7XG4gICAgaXNSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydCB7fTtcbiJdLCJuYW1lcyI6WyJGRm1wZWciLCJ0b0Jsb2JVUkwiLCJmZm1wZWciLCJsb2FkZWRNb2RlIiwiaXNSdW5uaW5nIiwiZW1pdCIsInR5cGUiLCJwYXlsb2FkIiwic2VsZiIsInBvc3RNZXNzYWdlIiwiY3JlYXRlRmZtcGVnSW5zdGFuY2UiLCJpbnN0YW5jZSIsIm9uIiwicHJvZ3Jlc3MiLCJyYXRpbyIsIm1lc3NhZ2UiLCJsb2FkRmZtcGVnIiwicHJlZmVyTXVsdGlUaHJlYWQiLCJwaGFzZSIsInNpbmdsZVRocmVhZEJhc2UiLCJtdWx0aVRocmVhZEJhc2UiLCJsb2FkIiwiY29yZVVSTCIsIndhc21VUkwiLCJ3b3JrZXJVUkwiLCJ0ZXJtaW5hdGUiLCJmZXRjaEJpbmFyeSIsInVybCIsImxhYmVsIiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwiRXJyb3IiLCJzdGF0dXMiLCJidWZmZXIiLCJhcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJ0b1RyYW5zZmVyYWJsZUJ1ZmZlciIsImJ5dGVzIiwic2xpY2UiLCJydW5NZXJnZSIsImF1ZGlvVXJsIiwidmlkZW9VcmwiLCJhdWRpb0V4dGVuc2lvbiIsInZpZGVvRXh0ZW5zaW9uIiwib3V0cHV0RmlsZU5hbWUiLCJtdWx0aVRocmVhZCIsImF1ZGlvRmlsZU5hbWUiLCJ2aWRlb0ZpbGVOYW1lIiwiYXVkaW9EYXRhIiwidmlkZW9EYXRhIiwiUHJvbWlzZSIsImFsbCIsIndyaXRlRmlsZSIsImV4ZWMiLCJvdXRwdXREYXRhIiwicmVhZEZpbGUiLCJ0cmFuc2ZlcmFibGUiLCJmaWxlTmFtZSIsIm1pbWVUeXBlIiwiZGVsZXRlRmlsZSIsImNhbmNlbFdvcmsiLCJvbm1lc3NhZ2UiLCJldmVudCIsImRhdGEiLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/workers/ffmpeg.worker.ts\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/const.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/const.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   HeaderContentLength: function() { return /* binding */ HeaderContentLength; }\n/* harmony export */ });\nconst HeaderContentLength = \"Content-Length\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK3V0aWxAMC4xMi4yL25vZGVfbW9kdWxlcy9AZmZtcGVnL3V0aWwvZGlzdC9lc20vY29uc3QuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK3V0aWxAMC4xMi4yL25vZGVfbW9kdWxlcy9AZmZtcGVnL3V0aWwvZGlzdC9lc20vY29uc3QuanM/N2I2ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgSGVhZGVyQ29udGVudExlbmd0aCA9IFwiQ29udGVudC1MZW5ndGhcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/const.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_INCOMPLETED_DOWNLOAD: function() { return /* binding */ ERROR_INCOMPLETED_DOWNLOAD; },\n/* harmony export */   ERROR_RESPONSE_BODY_READER: function() { return /* binding */ ERROR_RESPONSE_BODY_READER; }\n/* harmony export */ });\nconst ERROR_RESPONSE_BODY_READER = new Error(\"failed to get response body reader\");\nconst ERROR_INCOMPLETED_DOWNLOAD = new Error(\"failed to complete download\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK3V0aWxAMC4xMi4yL25vZGVfbW9kdWxlcy9AZmZtcGVnL3V0aWwvZGlzdC9lc20vZXJyb3JzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQU87QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvLnBucG0vQGZmbXBlZyt1dGlsQDAuMTIuMi9ub2RlX21vZHVsZXMvQGZmbXBlZy91dGlsL2Rpc3QvZXNtL2Vycm9ycy5qcz9mNDYwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBFUlJPUl9SRVNQT05TRV9CT0RZX1JFQURFUiA9IG5ldyBFcnJvcihcImZhaWxlZCB0byBnZXQgcmVzcG9uc2UgYm9keSByZWFkZXJcIik7XG5leHBvcnQgY29uc3QgRVJST1JfSU5DT01QTEVURURfRE9XTkxPQUQgPSBuZXcgRXJyb3IoXCJmYWlsZWQgdG8gY29tcGxldGUgZG93bmxvYWRcIik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   downloadWithProgress: function() { return /* binding */ downloadWithProgress; },\n/* harmony export */   fetchFile: function() { return /* binding */ fetchFile; },\n/* harmony export */   importScript: function() { return /* binding */ importScript; },\n/* harmony export */   toBlobURL: function() { return /* binding */ toBlobURL; }\n/* harmony export */ });\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js\");\n/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./const.js */ \"(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/const.js\");\n\n\nconst readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {\n    const fileReader = new FileReader();\n    fileReader.onload = () => {\n        const { result } = fileReader;\n        if (result instanceof ArrayBuffer) {\n            resolve(new Uint8Array(result));\n        }\n        else {\n            resolve(new Uint8Array());\n        }\n    };\n    fileReader.onerror = (event) => {\n        reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));\n    };\n    fileReader.readAsArrayBuffer(blob);\n});\n/**\n * An util function to fetch data from url string, base64, URL, File or Blob format.\n *\n * Examples:\n * ```ts\n * // URL\n * await fetchFile(\"http://localhost:3000/video.mp4\");\n * // base64\n * await fetchFile(\"data:<type>;base64,wL2dvYWwgbW9yZ...\");\n * // URL\n * await fetchFile(new URL(\"video.mp4\", import.meta.url));\n * // File\n * fileInput.addEventListener('change', (e) => {\n *   await fetchFile(e.target.files[0]);\n * });\n * // Blob\n * const blob = new Blob(...);\n * await fetchFile(blob);\n * ```\n */\nconst fetchFile = async (file) => {\n    let data;\n    if (typeof file === \"string\") {\n        /* From base64 format */\n        if (/data:_data\\/([a-zA-Z]*);base64,([^\"]*)/.test(file)) {\n            data = atob(file.split(\",\")[1])\n                .split(\"\")\n                .map((c) => c.charCodeAt(0));\n            /* From remote server/URL */\n        }\n        else {\n            data = await (await fetch(file)).arrayBuffer();\n        }\n    }\n    else if (file instanceof URL) {\n        data = await (await fetch(file)).arrayBuffer();\n    }\n    else if (file instanceof File || file instanceof Blob) {\n        data = await readFromBlobOrFile(file);\n    }\n    else {\n        return new Uint8Array();\n    }\n    return new Uint8Array(data);\n};\n/**\n * importScript dynamically import a script, useful when you\n * want to use different versions of ffmpeg.wasm based on environment.\n *\n * Example:\n *\n * ```ts\n * await importScript(\"http://localhost:3000/ffmpeg.js\");\n * ```\n */\nconst importScript = async (url) => new Promise((resolve) => {\n    const script = document.createElement(\"script\");\n    const eventHandler = () => {\n        script.removeEventListener(\"load\", eventHandler);\n        resolve();\n    };\n    script.src = url;\n    script.type = \"text/javascript\";\n    script.addEventListener(\"load\", eventHandler);\n    document.getElementsByTagName(\"head\")[0].appendChild(script);\n});\n/**\n * Download content of a URL with progress.\n *\n * Progress only works when Content-Length is provided by the server.\n *\n */\nconst downloadWithProgress = async (url, cb) => {\n    const resp = await fetch(url);\n    let buf;\n    try {\n        // Set total to -1 to indicate that there is not Content-Type Header.\n        const total = parseInt(resp.headers.get(_const_js__WEBPACK_IMPORTED_MODULE_1__.HeaderContentLength) || \"-1\");\n        const reader = resp.body?.getReader();\n        if (!reader)\n            throw _errors_js__WEBPACK_IMPORTED_MODULE_0__.ERROR_RESPONSE_BODY_READER;\n        const chunks = [];\n        let received = 0;\n        for (;;) {\n            const { done, value } = await reader.read();\n            const delta = value ? value.length : 0;\n            if (done) {\n                if (total != -1 && total !== received)\n                    throw _errors_js__WEBPACK_IMPORTED_MODULE_0__.ERROR_INCOMPLETED_DOWNLOAD;\n                cb && cb({ url, total, received, delta, done });\n                break;\n            }\n            chunks.push(value);\n            received += delta;\n            cb && cb({ url, total, received, delta, done });\n        }\n        const data = new Uint8Array(received);\n        let position = 0;\n        for (const chunk of chunks) {\n            data.set(chunk, position);\n            position += chunk.length;\n        }\n        buf = data.buffer;\n    }\n    catch (e) {\n        console.log(`failed to send download progress event: `, e);\n        // Fetch arrayBuffer directly when it is not possible to get progress.\n        buf = await resp.arrayBuffer();\n        cb &&\n            cb({\n                url,\n                total: buf.byteLength,\n                received: buf.byteLength,\n                delta: 0,\n                done: true,\n            });\n    }\n    return buf;\n};\n/**\n * toBlobURL fetches data from an URL and return a blob URL.\n *\n * Example:\n *\n * ```ts\n * await toBlobURL(\"http://localhost:3000/ffmpeg.js\", \"text/javascript\");\n * ```\n */\nconst toBlobURL = async (url, mimeType, progress = false, cb) => {\n    const buf = progress\n        ? await downloadWithProgress(url, cb)\n        : await (await fetch(url)).arrayBuffer();\n    const blob = new Blob([buf], { type: mimeType });\n    return URL.createObjectURL(blob);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmZtcGVnK3V0aWxAMC4xMi4yL25vZGVfbW9kdWxlcy9AZmZtcGVnL3V0aWwvZGlzdC9lc20vaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQXNGO0FBQ3JDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsaUNBQWlDO0FBQ3RGO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELDBEQUFtQjtBQUNuRTtBQUNBO0FBQ0Esa0JBQWtCLGtFQUEwQjtBQUM1QztBQUNBO0FBQ0EsZUFBZTtBQUNmLG9CQUFvQixjQUFjO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixrRUFBMEI7QUFDcEQsMkJBQTJCLG1DQUFtQztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtQ0FBbUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQ7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvLnBucG0vQGZmbXBlZyt1dGlsQDAuMTIuMi9ub2RlX21vZHVsZXMvQGZmbXBlZy91dGlsL2Rpc3QvZXNtL2luZGV4LmpzPzcwZDgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVJST1JfUkVTUE9OU0VfQk9EWV9SRUFERVIsIEVSUk9SX0lOQ09NUExFVEVEX0RPV05MT0FELCB9IGZyb20gXCIuL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHsgSGVhZGVyQ29udGVudExlbmd0aCB9IGZyb20gXCIuL2NvbnN0LmpzXCI7XG5jb25zdCByZWFkRnJvbUJsb2JPckZpbGUgPSAoYmxvYikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIGZpbGVSZWFkZXIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB7IHJlc3VsdCB9ID0gZmlsZVJlYWRlcjtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgICByZXNvbHZlKG5ldyBVaW50OEFycmF5KHJlc3VsdCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShuZXcgVWludDhBcnJheSgpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZmlsZVJlYWRlci5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlamVjdChFcnJvcihgRmlsZSBjb3VsZCBub3QgYmUgcmVhZCEgQ29kZT0ke2V2ZW50Py50YXJnZXQ/LmVycm9yPy5jb2RlIHx8IC0xfWApKTtcbiAgICB9O1xuICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XG59KTtcbi8qKlxuICogQW4gdXRpbCBmdW5jdGlvbiB0byBmZXRjaCBkYXRhIGZyb20gdXJsIHN0cmluZywgYmFzZTY0LCBVUkwsIEZpbGUgb3IgQmxvYiBmb3JtYXQuXG4gKlxuICogRXhhbXBsZXM6XG4gKiBgYGB0c1xuICogLy8gVVJMXG4gKiBhd2FpdCBmZXRjaEZpbGUoXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvdmlkZW8ubXA0XCIpO1xuICogLy8gYmFzZTY0XG4gKiBhd2FpdCBmZXRjaEZpbGUoXCJkYXRhOjx0eXBlPjtiYXNlNjQsd0wyZHZZV3dnYlc5eVouLi5cIik7XG4gKiAvLyBVUkxcbiAqIGF3YWl0IGZldGNoRmlsZShuZXcgVVJMKFwidmlkZW8ubXA0XCIsIGltcG9ydC5tZXRhLnVybCkpO1xuICogLy8gRmlsZVxuICogZmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gKiAgIGF3YWl0IGZldGNoRmlsZShlLnRhcmdldC5maWxlc1swXSk7XG4gKiB9KTtcbiAqIC8vIEJsb2JcbiAqIGNvbnN0IGJsb2IgPSBuZXcgQmxvYiguLi4pO1xuICogYXdhaXQgZmV0Y2hGaWxlKGJsb2IpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBmZXRjaEZpbGUgPSBhc3luYyAoZmlsZSkgPT4ge1xuICAgIGxldCBkYXRhO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAvKiBGcm9tIGJhc2U2NCBmb3JtYXQgKi9cbiAgICAgICAgaWYgKC9kYXRhOl9kYXRhXFwvKFthLXpBLVpdKik7YmFzZTY0LChbXlwiXSopLy50ZXN0KGZpbGUpKSB7XG4gICAgICAgICAgICBkYXRhID0gYXRvYihmaWxlLnNwbGl0KFwiLFwiKVsxXSlcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCJcIilcbiAgICAgICAgICAgICAgICAubWFwKChjKSA9PiBjLmNoYXJDb2RlQXQoMCkpO1xuICAgICAgICAgICAgLyogRnJvbSByZW1vdGUgc2VydmVyL1VSTCAqL1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IGF3YWl0IChhd2FpdCBmZXRjaChmaWxlKSkuYXJyYXlCdWZmZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChmaWxlIGluc3RhbmNlb2YgVVJMKSB7XG4gICAgICAgIGRhdGEgPSBhd2FpdCAoYXdhaXQgZmV0Y2goZmlsZSkpLmFycmF5QnVmZmVyKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBGaWxlIHx8IGZpbGUgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgIGRhdGEgPSBhd2FpdCByZWFkRnJvbUJsb2JPckZpbGUoZmlsZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGRhdGEpO1xufTtcbi8qKlxuICogaW1wb3J0U2NyaXB0IGR5bmFtaWNhbGx5IGltcG9ydCBhIHNjcmlwdCwgdXNlZnVsIHdoZW4geW91XG4gKiB3YW50IHRvIHVzZSBkaWZmZXJlbnQgdmVyc2lvbnMgb2YgZmZtcGVnLndhc20gYmFzZWQgb24gZW52aXJvbm1lbnQuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogYXdhaXQgaW1wb3J0U2NyaXB0KFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2ZmbXBlZy5qc1wiKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgaW1wb3J0U2NyaXB0ID0gYXN5bmMgKHVybCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICB9O1xuICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgc2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBldmVudEhhbmRsZXIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xufSk7XG4vKipcbiAqIERvd25sb2FkIGNvbnRlbnQgb2YgYSBVUkwgd2l0aCBwcm9ncmVzcy5cbiAqXG4gKiBQcm9ncmVzcyBvbmx5IHdvcmtzIHdoZW4gQ29udGVudC1MZW5ndGggaXMgcHJvdmlkZWQgYnkgdGhlIHNlcnZlci5cbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBkb3dubG9hZFdpdGhQcm9ncmVzcyA9IGFzeW5jICh1cmwsIGNiKSA9PiB7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgbGV0IGJ1ZjtcbiAgICB0cnkge1xuICAgICAgICAvLyBTZXQgdG90YWwgdG8gLTEgdG8gaW5kaWNhdGUgdGhhdCB0aGVyZSBpcyBub3QgQ29udGVudC1UeXBlIEhlYWRlci5cbiAgICAgICAgY29uc3QgdG90YWwgPSBwYXJzZUludChyZXNwLmhlYWRlcnMuZ2V0KEhlYWRlckNvbnRlbnRMZW5ndGgpIHx8IFwiLTFcIik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IHJlc3AuYm9keT8uZ2V0UmVhZGVyKCk7XG4gICAgICAgIGlmICghcmVhZGVyKVxuICAgICAgICAgICAgdGhyb3cgRVJST1JfUkVTUE9OU0VfQk9EWV9SRUFERVI7XG4gICAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xuICAgICAgICBsZXQgcmVjZWl2ZWQgPSAwO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCByZWFkZXIucmVhZCgpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSB2YWx1ZSA/IHZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIGlmICh0b3RhbCAhPSAtMSAmJiB0b3RhbCAhPT0gcmVjZWl2ZWQpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVSUk9SX0lOQ09NUExFVEVEX0RPV05MT0FEO1xuICAgICAgICAgICAgICAgIGNiICYmIGNiKHsgdXJsLCB0b3RhbCwgcmVjZWl2ZWQsIGRlbHRhLCBkb25lIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2h1bmtzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgcmVjZWl2ZWQgKz0gZGVsdGE7XG4gICAgICAgICAgICBjYiAmJiBjYih7IHVybCwgdG90YWwsIHJlY2VpdmVkLCBkZWx0YSwgZG9uZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkocmVjZWl2ZWQpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGNodW5rIG9mIGNodW5rcykge1xuICAgICAgICAgICAgZGF0YS5zZXQoY2h1bmssIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHBvc2l0aW9uICs9IGNodW5rLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBidWYgPSBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGZhaWxlZCB0byBzZW5kIGRvd25sb2FkIHByb2dyZXNzIGV2ZW50OiBgLCBlKTtcbiAgICAgICAgLy8gRmV0Y2ggYXJyYXlCdWZmZXIgZGlyZWN0bHkgd2hlbiBpdCBpcyBub3QgcG9zc2libGUgdG8gZ2V0IHByb2dyZXNzLlxuICAgICAgICBidWYgPSBhd2FpdCByZXNwLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIGNiICYmXG4gICAgICAgICAgICBjYih7XG4gICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgIHRvdGFsOiBidWYuYnl0ZUxlbmd0aCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogYnVmLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgICAgICAgZGVsdGE6IDAsXG4gICAgICAgICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xufTtcbi8qKlxuICogdG9CbG9iVVJMIGZldGNoZXMgZGF0YSBmcm9tIGFuIFVSTCBhbmQgcmV0dXJuIGEgYmxvYiBVUkwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogYXdhaXQgdG9CbG9iVVJMKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2ZmbXBlZy5qc1wiLCBcInRleHQvamF2YXNjcmlwdFwiKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgdG9CbG9iVVJMID0gYXN5bmMgKHVybCwgbWltZVR5cGUsIHByb2dyZXNzID0gZmFsc2UsIGNiKSA9PiB7XG4gICAgY29uc3QgYnVmID0gcHJvZ3Jlc3NcbiAgICAgICAgPyBhd2FpdCBkb3dubG9hZFdpdGhQcm9ncmVzcyh1cmwsIGNiKVxuICAgICAgICA6IGF3YWl0IChhd2FpdCBmZXRjaCh1cmwpKS5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYnVmXSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/chunks/" + chunkId + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/webpack/" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	!function() {
/******/ 		__webpack_require__.hmrF = function() { return "static/webpack/" + __webpack_require__.h() + ".c4231f644fe66190.hot-update.json"; };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	!function() {
/******/ 		__webpack_require__.h = function() { return "5adcdd4eb7d205a8"; }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; },
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	!function() {
/******/ 		__webpack_require__.tu = function(url) { return __webpack_require__.tt().createScriptURL(url); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	!function() {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	!function() {
/******/ 		var createStylesheet = function(chunkId, fullhref, resolve, reject) {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = function(event) {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = function(href, fullhref) {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = function(chunkId) {
/******/ 			return new Promise(function(resolve, reject) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = function(options) {
/******/ 			return { dispose: function() {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: function() {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = function(chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach(function(chunkId) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise(function(resolve, reject) {
/******/ 					var tag = createStylesheet(chunkId, fullhref, function() {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	!function() {
/******/ 		__webpack_require__.b = self.location + "/../../../";
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = __webpack_require__.hmrS_importScripts = __webpack_require__.hmrS_importScripts || {
/******/ 			"_app-pages-browser_app_workers_ffmpeg_worker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		// no chunk loading
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var success = false;
/******/ 			self["webpackHotUpdate_N_E"] = function(_, moreModules, runtime) {
/******/ 				for(var moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						currentUpdate[moduleId] = moreModules[moduleId];
/******/ 						if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 					}
/******/ 				}
/******/ 				if(runtime) currentUpdateRuntime.push(runtime);
/******/ 				success = true;
/******/ 			};
/******/ 			// start update chunk loading
/******/ 			importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.hu(chunkId)));
/******/ 			if(!success) throw new Error("Loading update chunk failed for unknown reason");
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.importScriptsHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.importScripts = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.importScripts = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.importScriptsHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then(function(response) {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("(app-pages-browser)/./app/workers/ffmpeg.worker.ts");
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;