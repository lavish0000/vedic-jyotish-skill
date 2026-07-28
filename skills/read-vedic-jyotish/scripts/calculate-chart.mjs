#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@swisseph/browser/dist/swisseph.js
var swisseph_exports = {};
__export(swisseph_exports, {
  default: () => swisseph_default
});
var SwissEphModule, swisseph_default;
var init_swisseph = __esm({
  "node_modules/@swisseph/browser/dist/swisseph.js"() {
    SwissEphModule = (() => {
      var _scriptName = globalThis.document?.currentScript?.src;
      return async function(moduleArg = {}) {
        var Module = moduleArg;
        var ENVIRONMENT_IS_WEB = !!globalThis.window;
        var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
        var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
        var programArgs = [];
        var thisProgram = "./this.program";
        if (ENVIRONMENT_IS_WORKER) {
          _scriptName = self.location.href;
        }
        var scriptDirectory2 = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory2);
          }
          return scriptDirectory2 + path;
        }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          try {
            scriptDirectory2 = new URL(".", _scriptName).href;
          } catch {
          }
          {
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = async (url) => {
              var response = await fetch(url, { credentials: "same-origin" });
              if (response.ok) {
                return response.arrayBuffer();
              }
              throw new Error(response.status + " : " + response.url);
            };
          }
        } else {
        }
        var out = console.log.bind(console);
        var err = console.error.bind(console);
        var wasmBinary;
        var ABORT = false;
        class EmscriptenEH {
        }
        class EmscriptenSjLj extends EmscriptenEH {
        }
        var runtimeInitialized = false;
        function getMemoryBuffer() {
          return wasmMemory.buffer;
        }
        function updateMemoryViews() {
          if (HEAP8?.buffer?.resizable) return;
          var b = getMemoryBuffer();
          HEAP8 = new Int8Array(b);
          HEAP16 = new Int16Array(b);
          HEAPU8 = new Uint8Array(b);
          HEAPU16 = new Uint16Array(b);
          HEAP32 = new Int32Array(b);
          HEAPU32 = new Uint32Array(b);
          HEAPF32 = new Float32Array(b);
          HEAPF64 = new Float64Array(b);
          HEAP64 = new BigInt64Array(b);
          HEAPU64 = new BigUint64Array(b);
        }
        function preRun() {
          var preRun2 = Module["preRun"];
          if (preRun2) {
            if (typeof preRun2 == "function") preRun2 = [preRun2];
            onPreRuns.push(...preRun2);
          }
          callRuntimeCallbacks(onPreRuns);
        }
        function initRuntime() {
          runtimeInitialized = true;
          if (!Module["noFSInit"] && !FS.initialized) FS.init();
          TTY.init();
          wasmExports["l"]();
          FS.ignorePermissions = false;
        }
        function postRun() {
          var postRun2 = Module["postRun"];
          if (postRun2) {
            if (typeof postRun2 == "function") postRun2 = [postRun2];
            onPostRuns.push(...postRun2);
          }
          callRuntimeCallbacks(onPostRuns);
        }
        function abort(what) {
          Module["onAbort"]?.(what);
          what = `Aborted(${what})`;
          err(what);
          ABORT = true;
          what += ". Build with -sASSERTIONS for more info.";
          var e = new WebAssembly.RuntimeError(what);
          throw e;
        }
        var wasmBinaryFile;
        function findWasmBinary() {
          return locateFile("swisseph.wasm");
        }
        function getBinarySync(file) {
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        async function getWasmBinary(binaryFile) {
          if (!wasmBinary) {
            try {
              var response = await readAsync(binaryFile);
              return new Uint8Array(response);
            } catch {
            }
          }
          return getBinarySync(binaryFile);
        }
        async function instantiateArrayBuffer(binaryFile, imports) {
          try {
            var binary = await getWasmBinary(binaryFile);
            var instance = await WebAssembly.instantiate(binary, imports);
            return instance;
          } catch (reason) {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            abort(reason);
          }
        }
        async function instantiateAsync(binary, binaryFile, imports) {
          if (!binary) {
            try {
              var response = fetch(binaryFile, { credentials: "same-origin" });
              var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
              return instantiationResult;
            } catch (reason) {
              err(`wasm streaming compile failed: ${reason}`);
              err("falling back to ArrayBuffer instantiation");
            }
          }
          return instantiateArrayBuffer(binaryFile, imports);
        }
        function getWasmImports() {
          var imports = { a: wasmImports };
          return imports;
        }
        async function createWasm() {
          function receiveInstance(instance) {
            wasmExports = instance.exports;
            assignWasmExports(wasmExports);
            updateMemoryViews();
            return wasmExports;
          }
          function receiveInstantiationResult(result2) {
            return receiveInstance(result2["instance"]);
          }
          var info = getWasmImports();
          var instantiateWasm = Module["instantiateWasm"];
          if (instantiateWasm) {
            return new Promise((resolve2) => {
              instantiateWasm(info, (inst) => resolve2(receiveInstance(inst)));
            });
          }
          wasmBinaryFile ??= findWasmBinary();
          var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
          var exports2 = receiveInstantiationResult(result);
          return exports2;
        }
        class ExitStatus {
          name = "ExitStatus";
          constructor(status) {
            this.message = `Program terminated with exit(${status})`;
            this.status = status;
          }
        }
        var HEAP16;
        var HEAP32;
        var HEAP64;
        var HEAP8;
        var HEAPF32;
        var HEAPF64;
        var HEAPU16;
        var HEAPU32;
        var HEAPU64;
        var HEAPU8;
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module);
          }
        };
        var onPostRuns = [];
        var onPreRuns = [];
        function getValue(ptr, type = "i8") {
          if (type.endsWith("*")) type = "*";
          switch (type) {
            case "i1":
              return HEAP8[ptr];
            case "i8":
              return HEAP8[ptr];
            case "i16":
              return HEAP16[ptr >> 1];
            case "i32":
              return HEAP32[ptr >> 2];
            case "i64":
              return HEAP64[ptr >> 3];
            case "float":
              return HEAPF32[ptr >> 2];
            case "double":
              return HEAPF64[ptr >> 3];
            case "*":
              return HEAPU32[ptr >> 2];
            default:
              abort(`invalid type for getValue: ${type}`);
          }
        }
        var noExitRuntime = true;
        function setValue(ptr, value, type = "i8") {
          if (type.endsWith("*")) type = "*";
          switch (type) {
            case "i1":
              HEAP8[ptr] = value;
              break;
            case "i8":
              HEAP8[ptr] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              HEAP64[ptr >> 3] = BigInt(value);
              break;
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            case "*":
              HEAPU32[ptr >> 2] = value;
              break;
            default:
              abort(`invalid type for setValue: ${type}`);
          }
        }
        var stackRestore = (val) => __emscripten_stack_restore(val);
        var stackSave = () => _emscripten_stack_get_current();
        var syscallGetVarargI = () => {
          var ret = HEAP32[+SYSCALLS.varargs >> 2];
          SYSCALLS.varargs += 4;
          return ret;
        };
        var syscallGetVarargP = syscallGetVarargI;
        var PATH = { isAbs: (path) => path.charAt(0) === "/", splitPath: (filename) => {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        }, normalizeArray: (parts, allowAboveRoot) => {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1);
            } else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..");
            }
          }
          return parts;
        }, normalize: (path) => {
          var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = ".";
          }
          if (path && trailingSlash) {
            path += "/";
          }
          return (isAbsolute ? "/" : "") + path;
        }, dirname: (path) => {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) {
            return ".";
          }
          if (dir) {
            dir = dir.slice(0, -1);
          }
          return root + dir;
        }, basename: (path) => path && path.match(/([^\/]+|\/)\/*$/)[1], join: (...paths) => PATH.normalize(paths.join("/")), join2: (l, r) => PATH.normalize(l + "/" + r) };
        var initRandomFill = () => (view) => (crypto.getRandomValues(view), 0);
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = { resolve: (...args) => {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? args[i] : FS.cwd();
            if (typeof path != "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!path) {
              return "";
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = PATH.isAbs(path);
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        }, relative: (from, to) => {
          from = PATH_FS.resolve(from).slice(1);
          to = PATH_FS.resolve(to).slice(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "") break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "") break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..");
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        } };
        var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
        var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
          var maxIdx = idx + maxBytesToRead;
          if (ignoreNul) return maxIdx;
          while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
          return idx;
        };
        var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
          var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.codePointAt(i);
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
              i++;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        };
        var intArrayFromString = (stringy, dontAddNull, length) => {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        };
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (globalThis.window?.prompt) {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else {
            }
            if (!result) {
              return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = { ttys: [], init() {
        }, shutdown() {
        }, register(dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops };
          FS.registerDevice(dev, TTY.stream_ops);
        }, stream_ops: { open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        }, close(stream) {
          stream.tty.ops.fsync(stream.tty);
        }, fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        }, read(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === void 0 && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === void 0) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.atime = Date.now();
          }
          return bytesRead;
        }, write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.mtime = stream.node.ctime = Date.now();
          }
          return i;
        } }, default_tty_ops: { get_char(tty) {
          return FS_stdin_getChar();
        }, put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        }, fsync(tty) {
          if (tty.output?.length > 0) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        }, ioctl_tcgets(tty) {
          return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ioctl_tcsets(tty, optional_actions, data) {
          return 0;
        }, ioctl_tiocgwinsz(tty) {
          return [24, 80];
        } }, default_tty1_ops: { put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        }, fsync(tty) {
          if (tty.output?.length > 0) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        } } };
        var mmapAlloc = (size) => {
          abort();
        };
        var MEMFS = { ops_table: null, mount(mount) {
          return MEMFS.createNode(null, "/", 16895, 0);
        }, createNode(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63);
          }
          MEMFS.ops_table ||= { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } };
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.atime = node.mtime = node.ctime = Date.now();
          if (parent) {
            parent.contents[name] = node;
            parent.atime = parent.mtime = parent.ctime = node.atime;
          }
          return node;
        }, getFileDataAsTypedArray(node) {
          return node.contents.subarray(0, node.usedBytes);
        }, expandFileStorage(node, newCapacity) {
          var prevCapacity = node.contents.length;
          if (prevCapacity >= newCapacity) return;
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
          if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
          var oldContents = MEMFS.getFileDataAsTypedArray(node);
          node.contents = new Uint8Array(newCapacity);
          node.contents.set(oldContents);
        }, resizeFileStorage(node, newSize) {
          if (node.usedBytes == newSize) return;
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          node.usedBytes = newSize;
        }, node_ops: { getattr(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.atime);
          attr.mtime = new Date(node.mtime);
          attr.ctime = new Date(node.ctime);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        }, setattr(node, attr) {
          for (const key of ["mode", "atime", "mtime", "ctime"]) {
            if (attr[key] != null) {
              node[key] = attr[key];
            }
          }
          if (attr.size !== void 0) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        }, lookup(parent, name) {
          if (!MEMFS.doesNotExistError) {
            MEMFS.doesNotExistError = new FS.ErrnoError(44);
            MEMFS.doesNotExistError.stack = "<generic error, no stack>";
          }
          throw MEMFS.doesNotExistError;
        }, mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        }, rename(old_node, new_dir, new_name) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (new_node) {
            if (FS.isDir(old_node.mode)) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
            FS.hashRemoveNode(new_node);
          }
          delete old_node.parent.contents[old_node.name];
          new_dir.contents[new_name] = old_node;
          old_node.name = new_name;
          new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
        }, unlink(parent, name) {
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        }, rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        }, readdir(node) {
          return [".", "..", ...Object.keys(node.contents)];
        }, symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        }, readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        } }, stream_ops: { read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          buffer.set(contents.subarray(position, position + size), offset);
          return size;
        }, write(stream, buffer, offset, length, position, canOwn) {
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
          if (!length) return 0;
          var node = stream.node;
          node.mtime = node.ctime = Date.now();
          if (canOwn) {
            node.contents = buffer.subarray(offset, offset + length);
            node.usedBytes = length;
          } else if (node.usedBytes === 0 && position === 0) {
            node.contents = buffer.slice(offset, offset + length);
            node.usedBytes = length;
          } else {
            MEMFS.expandFileStorage(node, position + length);
            node.contents.set(buffer.subarray(offset, offset + length), position);
            node.usedBytes = Math.max(node.usedBytes, position + length);
          }
          return length;
        }, llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        }, mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            if (contents) {
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              HEAP8.set(contents, ptr);
            }
          }
          return { ptr, allocated };
        }, msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        } } };
        var FS_modeStringToFlags = (str) => {
          if (typeof str != "string") return str;
          var flagModes = { r: 0, "r+": 2, w: 512 | 64 | 1, "w+": 512 | 64 | 2, a: 1024 | 64 | 1, "a+": 1024 | 64 | 2 };
          var flags = flagModes[str];
          if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
          }
          return flags;
        };
        var FS_fileDataToTypedArray = (data) => {
          if (typeof data == "string") {
            data = intArrayFromString(data, true);
          }
          if (!data.subarray) {
            data = new Uint8Array(data);
          }
          return data;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        };
        var asyncLoad = async (url) => {
          var arrayBuffer = await readAsync(url);
          return new Uint8Array(arrayBuffer);
        };
        var FS_createDataFile = (...args) => FS.createDataFile(...args);
        var getUniqueRunDependency = (id) => id;
        var dependenciesPromise = null;
        var resolveRunDependencies = async () => dependenciesPromise;
        var runDependencies = 0;
        var dependenciesPromiseResolve = null;
        var removeRunDependency = (id) => {
          runDependencies--;
          Module["monitorRunDependencies"]?.(runDependencies);
          if (!runDependencies) {
            dependenciesPromiseResolve();
          }
        };
        var addRunDependency = (id) => {
          if (!runDependencies) {
            dependenciesPromise = new Promise((resolve2) => dependenciesPromiseResolve = resolve2);
          }
          runDependencies++;
          Module["monitorRunDependencies"]?.(runDependencies);
        };
        var preloadPlugins = [];
        var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
          if (typeof Browser != "undefined") Browser.init();
          for (var plugin of preloadPlugins) {
            if (plugin["canHandle"](fullname)) {
              return plugin["handle"](byteArray, fullname);
            }
          }
          return byteArray;
        };
        var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency(`cp ${fullname}`);
          addRunDependency(dep);
          try {
            var byteArray = url;
            if (typeof url == "string") {
              byteArray = await asyncLoad(url);
            }
            byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
            preFinish?.();
            if (!dontCreateFile) {
              FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
          } finally {
            removeRunDependency(dep);
          }
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
        };
        var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, filesystems: null, syncFSRequests: 0, ErrnoError: class {
          name = "ErrnoError";
          constructor(errno) {
            this.errno = errno;
          }
        }, FSStream: class {
          shared = {};
          get object() {
            return this.node;
          }
          set object(val) {
            this.node = val;
          }
          get isRead() {
            return (this.flags & 2097155) !== 1;
          }
          get isWrite() {
            return (this.flags & 2097155) !== 0;
          }
          get isAppend() {
            return this.flags & 1024;
          }
          get flags() {
            return this.shared.flags;
          }
          set flags(val) {
            this.shared.flags = val;
          }
          get position() {
            return this.shared.position;
          }
          set position(val) {
            this.shared.position = val;
          }
        }, FSNode: class {
          node_ops = {};
          stream_ops = {};
          readMode = 292 | 73;
          writeMode = 146;
          mounted = null;
          constructor(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.rdev = rdev;
            this.atime = this.mtime = this.ctime = Date.now();
          }
          get read() {
            return (this.mode & this.readMode) === this.readMode;
          }
          set read(val) {
            val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
          }
          get write() {
            return (this.mode & this.writeMode) === this.writeMode;
          }
          set write(val) {
            val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
          }
          get isFolder() {
            return FS.isDir(this.mode);
          }
          get isDevice() {
            return FS.isChrdev(this.mode);
          }
          addListener(cb, exclusive = false) {
            var entry = { cb, exclusive };
            var listeners = this.listeners ??= /* @__PURE__ */ new Set();
            listeners.add(entry);
            return { listeners, entry };
          }
          notifyListeners(flags) {
            if (!this.listeners) return;
            var excl;
            for (var entry of this.listeners) {
              if (entry.exclusive) (excl ||= []).push(entry);
              else entry.cb(flags);
            }
            if (excl) {
              var i = (this.exclTurn || 0) % excl.length;
              this.exclTurn = i + 1;
              excl[i].cb(flags);
            }
          }
        }, lookupPath(path, opts = {}) {
          if (!path) {
            throw new FS.ErrnoError(44);
          }
          opts.follow_mount ??= true;
          if (!PATH.isAbs(path)) {
            path = FS.cwd() + "/" + path;
          }
          linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
            var parts = path.split("/").filter((p) => !!p);
            var current = FS.root;
            var current_path = "/";
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              if (parts[i] === ".") {
                continue;
              }
              if (parts[i] === "..") {
                current_path = PATH.dirname(current_path);
                if (FS.isRoot(current)) {
                  path = current_path + "/" + parts.slice(i + 1).join("/");
                  nlinks--;
                  continue linkloop;
                } else {
                  current = current.parent;
                }
                continue;
              }
              current_path = PATH.join2(current_path, parts[i]);
              try {
                current = FS.lookupNode(current, parts[i]);
              } catch (e) {
                if (e?.errno === 44 && islast && opts.noent_okay) {
                  return { path: current_path };
                }
                throw e;
              }
              if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
                current = current.mounted.root;
              }
              if (FS.isLink(current.mode) && (!islast || opts.follow)) {
                if (!current.node_ops.readlink) {
                  throw new FS.ErrnoError(52);
                }
                var link = current.node_ops.readlink(current);
                if (!PATH.isAbs(link)) {
                  link = PATH.dirname(current_path) + "/" + link;
                }
                path = link + "/" + parts.slice(i + 1).join("/");
                continue linkloop;
              }
            }
            return { path: current_path, node: current };
          }
          throw new FS.ErrnoError(32);
        }, getPath(node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
            }
            path = path ? `${node.name}/${path}` : node.name;
            node = node.parent;
          }
        }, hashName(parentid, name) {
          var hash = 0;
          for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
          }
          return (parentid + hash >>> 0) % FS.nameTable.length;
        }, hashAddNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        }, hashRemoveNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        }, lookupNode(parent, name) {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          return FS.lookup(parent, name);
        }, createNode(parent, name, mode, rdev) {
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node;
        }, destroyNode(node) {
          FS.hashRemoveNode(node);
        }, isRoot(node) {
          return node === node.parent;
        }, isMountpoint(node) {
          return !!node.mounted;
        }, isFile(mode) {
          return (mode & 61440) === 32768;
        }, isDir(mode) {
          return (mode & 61440) === 16384;
        }, isLink(mode) {
          return (mode & 61440) === 40960;
        }, isChrdev(mode) {
          return (mode & 61440) === 8192;
        }, isBlkdev(mode) {
          return (mode & 61440) === 24576;
        }, isFIFO(mode) {
          return (mode & 61440) === 4096;
        }, isSocket(mode) {
          return (mode & 49152) === 49152;
        }, flagsToPermissionString(flag) {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) {
            perms += "w";
          }
          return perms;
        }, nodePermissions(node, perms) {
          if (FS.ignorePermissions) {
            return 0;
          }
          if (perms.includes("r") && !(node.mode & 292)) {
            return 2;
          }
          if (perms.includes("w") && !(node.mode & 146)) {
            return 2;
          }
          if (perms.includes("x") && !(node.mode & 73)) {
            return 2;
          }
          return 0;
        }, mayLookup(dir) {
          if (!FS.isDir(dir.mode)) return 54;
          var errCode = FS.nodePermissions(dir, "x");
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0;
        }, mayCreate(dir, name) {
          if (!FS.isDir(dir.mode)) {
            return 54;
          }
          try {
            var node = FS.lookupNode(dir, name);
            return 20;
          } catch (e) {
          }
          return FS.nodePermissions(dir, "wx");
        }, mayDelete(dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var errCode = FS.nodePermissions(dir, "wx");
          if (errCode) {
            return errCode;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10;
            }
          } else if (FS.isDir(node.mode)) {
            return 31;
          }
          return 0;
        }, mayOpen(node, flags) {
          if (!node) {
            return 44;
          }
          if (FS.isLink(node.mode)) {
            return 32;
          }
          var mode = FS.flagsToPermissionString(flags);
          if (FS.isDir(node.mode)) {
            if (mode !== "r" || flags & (512 | 64)) {
              return 31;
            }
          }
          return FS.nodePermissions(node, mode);
        }, checkOpExists(op, err2) {
          if (!op) {
            throw new FS.ErrnoError(err2);
          }
          return op;
        }, MAX_OPEN_FDS: 4096, nextfd() {
          for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(33);
        }, getStreamChecked(fd) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          return stream;
        }, getStream: (fd) => FS.streams[fd], createStream(stream, fd = -1) {
          stream = Object.assign(new FS.FSStream(), stream);
          if (fd == -1) {
            fd = FS.nextfd();
          }
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        }, closeStream(fd) {
          FS.streams[fd] = null;
        }, dupStream(origStream, fd = -1) {
          var stream = FS.createStream(origStream, fd);
          stream.stream_ops?.dup?.(stream);
          return stream;
        }, doSetAttr(stream, node, attr) {
          var setattr = stream?.stream_ops.setattr;
          var arg = setattr ? stream : node;
          setattr ??= node.node_ops.setattr;
          FS.checkOpExists(setattr, 63);
          try {
            setattr(arg, attr);
          } catch (e) {
            if (e instanceof RangeError) {
              throw new FS.ErrnoError(22);
            }
            throw e;
          }
        }, chrdev_stream_ops: { open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          stream.stream_ops.open?.(stream);
        }, llseek() {
          throw new FS.ErrnoError(70);
        } }, major: (dev) => dev >> 8, minor: (dev) => dev & 255, makedev: (ma, mi) => ma << 8 | mi, registerDevice(dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        }, getDevice: (dev) => FS.devices[dev], getMounts(mount) {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push(...m.mounts);
          }
          return mounts;
        }, syncfs(populate, callback) {
          if (typeof populate == "function") {
            callback = populate;
            populate = false;
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) {
            err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
          }
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;
          function doCallback(errCode) {
            FS.syncFSRequests--;
            return callback(errCode);
          }
          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode);
              }
              return;
            }
            if (++completed >= mounts.length) {
              doCallback(null);
            }
          }
          for (var mount of mounts) {
            if (mount.type.syncfs) {
              mount.type.syncfs(mount, populate, done);
            } else {
              done(null);
            }
          }
        }, mount(type, opts, mountpoint) {
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) {
            throw new FS.ErrnoError(10);
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
          }
          var mount = { type, opts, mountpoint, mounts: [] };
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) {
            FS.root = mountRoot;
          } else if (node) {
            node.mounted = mount;
            if (node.mount) {
              node.mount.mounts.push(mount);
            }
          }
          return mountRoot;
        }, unmount(mountpoint) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
          }
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          for (var [hash, current] of Object.entries(FS.nameTable)) {
            while (current) {
              var next = current.name_next;
              if (mounts.includes(current.mount)) {
                FS.destroyNode(current);
              }
              current = next;
            }
          }
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          node.mount.mounts.splice(idx, 1);
        }, lookup(parent, name) {
          return parent.node_ops.lookup(parent, name);
        }, mknod(path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name) {
            throw new FS.ErrnoError(28);
          }
          if (name === "." || name === "..") {
            throw new FS.ErrnoError(20);
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        }, statfs(path) {
          return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
        }, statfsStream(stream) {
          return FS.statfsNode(stream.node);
        }, statfsNode(node) {
          var rtn = { bsize: 4096, frsize: 4096, blocks: 1e6, bfree: 5e5, bavail: 5e5, files: FS.nextInode, ffree: FS.nextInode - 1, fsid: 42, flags: 2, namelen: 255 };
          if (node.node_ops.statfs) {
            Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
          }
          return rtn;
        }, create(path, mode = 438) {
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        }, mkdir(path, mode = 511) {
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        }, mkdirTree(path, mode) {
          var dirs = path.split("/");
          var d = "";
          for (var dir of dirs) {
            if (!dir) continue;
            if (d || PATH.isAbs(path)) d += "/";
            d += dir;
            try {
              FS.mkdir(d, mode);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
        }, mkdev(path, mode, dev) {
          if (typeof dev == "undefined") {
            dev = mode;
            mode = 438;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        }, symlink(oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
          }
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        }, link(oldpath, newpath, flags) {
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.link) {
            throw new FS.ErrnoError(34);
          }
          return parent.node_ops.link(parent, newname, oldpath, flags);
        }, rename(old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
          }
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28);
          }
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55);
          }
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (old_node === new_node) {
            return;
          }
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10);
          }
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
            old_node.parent = new_dir;
          } catch (e) {
            throw e;
          } finally {
            FS.hashAddNode(old_node);
          }
        }, rmdir(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
        }, readdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
          return readdir(node);
        }, unlink(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
        }, readlink(path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44);
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
          }
          return link.node_ops.readlink(link);
        }, stat(path, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
          return getattr(node);
        }, fstat(fd) {
          var stream = FS.getStreamChecked(fd);
          var node = stream.node;
          var getattr = stream.stream_ops.getattr;
          var arg = getattr ? stream : node;
          getattr ??= node.node_ops.getattr;
          FS.checkOpExists(getattr, 63);
          return getattr(arg);
        }, lstat(path) {
          return FS.stat(path, true);
        }, doChmod(stream, node, mode, dontFollow) {
          FS.doSetAttr(stream, node, { mode: mode & 4095 | node.mode & ~4095, ctime: Date.now(), dontFollow });
        }, chmod(path, mode, dontFollow) {
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          FS.doChmod(null, node, mode, dontFollow);
        }, lchmod(path, mode) {
          FS.chmod(path, mode, true);
        }, fchmod(fd, mode) {
          var stream = FS.getStreamChecked(fd);
          FS.doChmod(stream, stream.node, mode, false);
        }, doChown(stream, node, dontFollow) {
          FS.doSetAttr(stream, node, { timestamp: Date.now(), dontFollow });
        }, chown(path, uid, gid, dontFollow) {
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          FS.doChown(null, node, dontFollow);
        }, lchown(path, uid, gid) {
          FS.chown(path, uid, gid, true);
        }, fchown(fd, uid, gid) {
          var stream = FS.getStreamChecked(fd);
          FS.doChown(stream, stream.node, false);
        }, doTruncate(stream, node, len) {
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.nodePermissions(node, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          FS.doSetAttr(stream, node, { size: len, timestamp: Date.now() });
        }, truncate(path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(28);
          }
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          FS.doTruncate(null, node, len);
        }, ftruncate(fd, len) {
          var stream = FS.getStreamChecked(fd);
          if (len < 0 || (stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
          }
          FS.doTruncate(stream, stream.node, len);
        }, utime(path, atime, mtime, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          FS.doSetAttr(null, lookup.node, { atime, mtime, dontFollow });
        }, open(path, flags, mode = 438) {
          if (path === "") {
            throw new FS.ErrnoError(44);
          }
          flags = FS_modeStringToFlags(flags);
          if (flags & 64) {
            mode = mode & 4095 | 32768;
          } else {
            mode = 0;
          }
          var node;
          var isDirPath;
          if (typeof path == "object") {
            node = path;
          } else {
            isDirPath = path.endsWith("/");
            var lookup = FS.lookupPath(path, { follow: !(flags & 131072), noent_okay: true });
            node = lookup.node;
            path = lookup.path;
          }
          var created = false;
          if (flags & 64) {
            if (node) {
              if (flags & 128) {
                throw new FS.ErrnoError(20);
              }
            } else if (isDirPath) {
              throw new FS.ErrnoError(31);
            } else {
              node = FS.mknod(path, mode | 511, 0);
              created = true;
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (FS.isChrdev(node.mode)) {
            flags &= ~512;
          }
          if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          if (flags & 512 && !created) {
            FS.truncate(node, 0);
          }
          flags &= ~(128 | 512 | 131072);
          var stream = FS.createStream({ node, path: FS.getPath(node), flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false });
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (created) {
            FS.chmod(node, mode & 511);
          }
          return stream;
        }, close(stream) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (stream.getdents) stream.getdents = null;
          stream.node?.notifyListeners(32);
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        }, isClosed(stream) {
          return stream.fd === null;
        }, llseek(stream, offset, whence) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        }, read(stream, buffer, offset, length, position) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
          }
          var seeking = typeof position != "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        }, write(stream, buffer, offset, length, position, canOwn) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
          }
          if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2);
          }
          var seeking = typeof position != "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten;
        }, mmap(stream, length, position, prot, flags) {
          if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
          }
          if (!length) {
            throw new FS.ErrnoError(28);
          }
          return stream.stream_ops.mmap(stream, length, position, prot, flags);
        }, msync(stream, buffer, offset, length, mmapFlags) {
          if (!stream.stream_ops.msync) {
            return 0;
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
        }, ioctl(stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        }, readFile(path, opts = {}) {
          opts.flags = opts.flags ?? 0;
          opts.encoding = opts.encoding ?? "binary";
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            abort(`Invalid encoding type "${opts.encoding}"`);
          }
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") {
            buf = UTF8ArrayToString(buf);
          }
          FS.close(stream);
          return buf;
        }, writeFile(path, data, opts = {}) {
          opts.flags = opts.flags ?? 577;
          var stream = FS.open(path, opts.flags, opts.mode);
          data = FS_fileDataToTypedArray(data);
          FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
          FS.close(stream);
        }, cwd: () => FS.currentPath, chdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) {
            throw new FS.ErrnoError(44);
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
          }
          var errCode = FS.nodePermissions(lookup.node, "x");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          FS.currentPath = lookup.path;
        }, createDefaultDirectories() {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user");
        }, createDefaultDevices() {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (stream, buffer, offset, length, pos) => length, llseek: () => 0 });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var randomBuffer = new Uint8Array(1024), randomLeft = 0;
          var randomByte = () => {
            if (randomLeft === 0) {
              randomFill(randomBuffer);
              randomLeft = randomBuffer.byteLength;
            }
            return randomBuffer[--randomLeft];
          };
          FS.createDevice("/dev", "random", randomByte);
          FS.createDevice("/dev", "urandom", randomByte);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp");
        }, createSpecialDirectories() {
          FS.mkdir("/proc");
          var proc_self = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({ mount() {
            var node = FS.createNode(proc_self, "fd", 16895, 73);
            node.stream_ops = { llseek: MEMFS.stream_ops.llseek };
            node.node_ops = { lookup(parent, name) {
              var fd = +name;
              var stream = FS.getStreamChecked(fd);
              var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => stream.path }, id: fd + 1 };
              ret.parent = ret;
              return ret;
            }, readdir() {
              return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
            } };
            return node;
          } }, {}, "/proc/self/fd");
        }, createStandardStreams(input, output, error) {
          if (input) {
            FS.createDevice("/dev", "stdin", input);
          } else {
            FS.symlink("/dev/tty", "/dev/stdin");
          }
          if (output) {
            FS.createDevice("/dev", "stdout", null, output);
          } else {
            FS.symlink("/dev/tty", "/dev/stdout");
          }
          if (error) {
            FS.createDevice("/dev", "stderr", null, error);
          } else {
            FS.symlink("/dev/tty1", "/dev/stderr");
          }
          var stdin = FS.open("/dev/stdin", 0);
          var stdout = FS.open("/dev/stdout", 1);
          var stderr = FS.open("/dev/stderr", 1);
        }, staticInit() {
          FS.nameTable = new Array(4096);
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
          FS.filesystems = { MEMFS };
        }, init(input, output, error) {
          FS.initialized = true;
          input ??= Module["stdin"];
          output ??= Module["stdout"];
          error ??= Module["stderr"];
          FS.createStandardStreams(input, output, error);
        }, quit() {
          FS.initialized = false;
          for (var stream of FS.streams) {
            if (stream) {
              FS.close(stream);
            }
          }
        }, findObject(path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (!ret.exists) {
            return null;
          }
          return ret.object;
        }, analyzePath(path, dontResolveLastLink) {
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/";
          } catch (e) {
            ret.error = e.errno;
          }
          return ret;
        }, createPath(parent, path, canRead, canWrite) {
          parent = typeof parent == "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
            parent = current;
          }
          return current;
        }, createFile(parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(canRead, canWrite);
          return FS.create(path, mode);
        }, createDataFile(parent, name, data, canRead, canWrite, canOwn) {
          var path = name;
          if (parent) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent;
          }
          var mode = FS_getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            data = FS_fileDataToTypedArray(data);
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
        }, createDevice(parent, name, input, output) {
          var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(!!input, !!output);
          FS.createDevice.major ??= 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, { open(stream) {
            stream.seekable = false;
          }, close(stream) {
            if (output?.buffer?.length) {
              output(10);
            }
          }, read(stream, buffer, offset, length, pos) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === void 0 && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === void 0) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.atime = Date.now();
            }
            return bytesRead;
          }, write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.mtime = stream.node.ctime = Date.now();
            }
            return i;
          } });
          return FS.mkdev(path, mode, dev);
        }, forceLoadFile(obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (globalThis.XMLHttpRequest) {
            abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else {
            try {
              obj.contents = readBinary(obj.url);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          }
        }, createLazyFile(parent, name, url, canRead, canWrite) {
          class LazyUint8Array {
            lengthKnown = false;
            chunks = [];
            get(idx) {
              if (idx > this.length - 1 || idx < 0) {
                return void 0;
              }
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = idx / this.chunkSize | 0;
              return this.getter(chunkNum)[chunkOffset];
            }
            setDataGetter(getter) {
              this.getter = getter;
            }
            cacheLength() {
              var xhr = new XMLHttpRequest();
              xhr.open("HEAD", url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
              var chunkSize = 1024 * 1024;
              if (!hasByteServing) chunkSize = datalength;
              var doXHR = (from, to) => {
                if (from > to) abort(`invalid range (${from}, ${to}) or no bytes requested!`);
                if (to > datalength - 1) abort(`only ${datalength} bytes available! programmer error!`);
                var xhr2 = new XMLHttpRequest();
                xhr2.open("GET", url, false);
                if (datalength !== chunkSize) xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                xhr2.responseType = "arraybuffer";
                if (xhr2.overrideMimeType) {
                  xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                }
                xhr2.send(null);
                if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr2.status);
                if (xhr2.response !== void 0) {
                  return new Uint8Array(xhr2.response || []);
                }
                return intArrayFromString(xhr2.responseText ?? "", true);
              };
              var lazyArray2 = this;
              lazyArray2.setDataGetter((chunkNum) => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                  lazyArray2.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") abort("doXHR failed!");
                return lazyArray2.chunks[chunkNum];
              });
              if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
              }
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
            }
            get length() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._length;
            }
            get chunkSize() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._chunkSize;
            }
          }
          if (globalThis.XMLHttpRequest) {
            if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
            var lazyArray = new LazyUint8Array();
            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url };
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          Object.defineProperties(node, { usedBytes: { get: function() {
            return this.contents.length;
          } } });
          var stream_ops = {};
          for (const [key, fn] of Object.entries(node.stream_ops)) {
            stream_ops[key] = (...args) => {
              FS.forceLoadFile(node);
              return fn(...args);
            };
          }
          function writeChunks(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            } else {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents.get(position + i);
              }
            }
            return size;
          }
          stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            return writeChunks(stream, buffer, offset, length, position);
          };
          stream_ops.mmap = (stream, length, position, prot, flags) => {
            FS.forceLoadFile(node);
            var ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            writeChunks(stream, HEAP8, ptr, length, position);
            return { ptr, allocated: true };
          };
          node.stream_ops = stream_ops;
          return node;
        } };
        var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
        var SYSCALLS = { currentUmask: 18, calculateAt(dirfd, path, allowEmpty) {
          if (PATH.isAbs(path)) {
            return path;
          }
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = SYSCALLS.getStreamFromFD(dirfd);
            dir = dirstream.path;
          }
          if (path.length == 0) {
            if (!allowEmpty) {
              throw new FS.ErrnoError(44);
            }
            return dir;
          }
          return dir + "/" + path;
        }, writeStat(buf, stat) {
          HEAPU32[buf >> 2] = stat.dev;
          HEAPU32[buf + 4 >> 2] = stat.mode;
          HEAPU32[buf + 8 >> 2] = stat.nlink;
          HEAPU32[buf + 12 >> 2] = stat.uid;
          HEAPU32[buf + 16 >> 2] = stat.gid;
          HEAPU32[buf + 20 >> 2] = stat.rdev;
          HEAP64[buf + 24 >> 3] = BigInt(stat.size);
          HEAP32[buf + 32 >> 2] = 4096;
          HEAP32[buf + 36 >> 2] = stat.blocks;
          var atime = stat.atime.getTime();
          var mtime = stat.mtime.getTime();
          var ctime = stat.ctime.getTime();
          HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
          HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
          HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
          HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
          HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
          HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
          HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
          return 0;
        }, writeStatFs(buf, stats) {
          HEAPU32[buf + 4 >> 2] = stats.bsize;
          HEAPU32[buf + 60 >> 2] = stats.bsize;
          HEAP64[buf + 8 >> 3] = BigInt(stats.blocks);
          HEAP64[buf + 16 >> 3] = BigInt(stats.bfree);
          HEAP64[buf + 24 >> 3] = BigInt(stats.bavail);
          HEAP64[buf + 32 >> 3] = BigInt(stats.files);
          HEAP64[buf + 40 >> 3] = BigInt(stats.ffree);
          HEAPU32[buf + 48 >> 2] = stats.fsid;
          HEAPU32[buf + 64 >> 2] = stats.flags;
          HEAPU32[buf + 56 >> 2] = stats.namelen;
        }, doMsync(addr, stream, len, flags, offset) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (flags & 2) {
            return 0;
          }
          var buffer = HEAPU8.subarray(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags);
        }, getStreamFromFD(fd) {
          var stream = FS.getStreamChecked(fd);
          return stream;
        }, varargs: void 0, getStr(ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        } };
        function ___syscall_fcntl64(fd, cmd, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = syscallGetVarargI();
                if (arg < 0) {
                  return -28;
                }
                while (FS.streams[arg]) {
                  arg++;
                }
                var newStream;
                newStream = FS.dupStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = syscallGetVarargI();
                var mask = 289792;
                stream.flags = stream.flags & ~mask | arg & mask;
                return 0;
              }
              case 12: {
                var arg = syscallGetVarargP();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0;
              }
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21505: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = syscallGetVarargP();
                  HEAP32[argp >> 2] = termios.c_iflag || 0;
                  HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                  HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                  HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                  for (var i = 0; i < 32; i++) {
                    HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
                  }
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  var argp = syscallGetVarargP();
                  var c_iflag = HEAP32[argp >> 2];
                  var c_oflag = HEAP32[argp + 4 >> 2];
                  var c_cflag = HEAP32[argp + 8 >> 2];
                  var c_lflag = HEAP32[argp + 12 >> 2];
                  var c_cc = [];
                  for (var i = 0; i < 32; i++) {
                    c_cc.push(HEAP8[argp + i + 17]);
                  }
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
                }
                return 0;
              }
              case 21519: {
                if (!stream.tty) return -59;
                var argp = syscallGetVarargP();
                HEAP32[argp >> 2] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty) return -59;
                return -28;
              }
              case 21537:
              case 21531: {
                var argp = syscallGetVarargP();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  var argp = syscallGetVarargP();
                  HEAP16[argp >> 1] = winsize[0];
                  HEAP16[argp + 2 >> 1] = winsize[1];
                }
                return 0;
              }
              case 21524: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21515: {
                if (!stream.tty) return -59;
                return 0;
              }
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? syscallGetVarargI() : 0;
            if (flags & 64) {
              mode &= ~SYSCALLS.currentUmask;
            }
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        var getHeapMax = () => 2147483648;
        var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
        var growMemory = (size) => {
          var oldHeapSize = wasmMemory.buffer.byteLength;
          var pages = (size - oldHeapSize + 65535) / 65536 | 0;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
          }
        };
        var _emscripten_resize_heap = (requestedSize) => {
          var oldSize = HEAPU8.length;
          requestedSize >>>= 0;
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            return false;
          }
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          return false;
        };
        var ENV = {};
        var getExecutableName = () => thisProgram;
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
            var env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
            for (var x in ENV) {
              if (ENV[x] === void 0) delete env[x];
              else env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        var _environ_get = (__environ, environ_buf) => {
          var bufSize = 0;
          var envp = 0;
          for (var string of getEnvStrings()) {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + envp >> 2] = ptr;
            bufSize += stringToUTF8(string, ptr, Infinity) + 1;
            envp += 4;
          }
          return 0;
        };
        var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
          var strings = getEnvStrings();
          HEAPU32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          for (var string of strings) {
            bufSize += lengthBytesUTF8(string) + 1;
          }
          HEAPU32[penviron_buf_size >> 2] = bufSize;
          return 0;
        };
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            try {
              var curr = FS.read(stream, HEAP8, ptr, len, offset);
            } catch (e) {
              if (ret > 0 && e instanceof FS.ErrnoError && (e.errno == 6 || e.errno == 6)) {
                break;
              }
              throw e;
            }
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break;
            if (typeof offset != "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var INT53_MAX = 9007199254740992;
        var INT53_MIN = -9007199254740992;
        var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
        function _fd_seek(fd, offset, whence, newOffset) {
          offset = bigintToI53Checked(offset);
          try {
            if (isNaN(offset)) return 22;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            HEAP64[newOffset >> 3] = BigInt(stream.position);
            if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var doWritev = (stream, iov, iovcnt, offset) => {
          if (iovcnt == 1) {
            return FS.write(stream, HEAP8, HEAPU32[iov >> 2], HEAPU32[iov + 4 >> 2], offset);
          }
          var total = 0;
          for (var i = 0, p = iov; i < iovcnt; i++, p += 8) {
            total += HEAPU32[p + 4 >> 2];
          }
          var view = new Uint8Array(total);
          var voff = 0;
          for (var i = 0; i < iovcnt; i++, iov += 8) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            view.set(HEAPU8.subarray(ptr, ptr + len), voff);
            voff += len;
          }
          return FS.write(stream, view, 0, total, offset);
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var getCFunc = (ident) => {
          var func = Module["_" + ident];
          return func;
        };
        var writeArrayToMemory = (array, buffer) => {
          HEAP8.set(array, buffer);
        };
        var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
        var stringToUTF8OnStack = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var ccall = (ident, returnType, argTypes, args, opts) => {
          var toC = { string: (str) => {
            var ret2 = 0;
            if (str !== null && str !== void 0 && str !== 0) {
              ret2 = stringToUTF8OnStack(str);
            }
            return ret2;
          }, array: (arr) => {
            var ret2 = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret2);
            return ret2;
          } };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              return UTF8ToString(ret2);
            }
            if (returnType === "boolean") return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var ret = func(...cArgs);
          function onDone(ret2) {
            if (stack !== 0) stackRestore(stack);
            return convertReturnValue(ret2);
          }
          ret = onDone(ret);
          return ret;
        };
        var cwrap = (ident, returnType, argTypes, opts) => {
          var numericArgs = !argTypes || argTypes.every((type) => type === "number" || type === "boolean");
          var numericRet = returnType !== "string";
          if (numericRet && numericArgs && !opts) {
            return getCFunc(ident);
          }
          return (...args) => ccall(ident, returnType, argTypes, args, opts);
        };
        var stringToNewUTF8 = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = _malloc(size);
          if (ret) stringToUTF8(str, ret, size);
          return ret;
        };
        var allocateUTF8 = (...args) => stringToNewUTF8(...args);
        var FS_createPath = (...args) => FS.createPath(...args);
        var FS_unlink = (...args) => FS.unlink(...args);
        var FS_createLazyFile = (...args) => FS.createLazyFile(...args);
        var FS_createDevice = (...args) => FS.createDevice(...args);
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.preloadFile = FS_preloadFile;
        FS.staticInit();
        {
          if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
          if (Module["print"]) out = Module["print"];
          if (Module["printErr"]) err = Module["printErr"];
          if (Module["arguments"]) programArgs = Module["arguments"];
          if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
          var preInit = Module["preInit"];
          if (preInit) {
            if (typeof preInit == "function") Module["preInit"] = preInit = [preInit];
            while (preInit.length > 0) {
              preInit.shift()();
            }
          }
        }
        Module["addRunDependency"] = addRunDependency;
        Module["removeRunDependency"] = removeRunDependency;
        Module["ccall"] = ccall;
        Module["cwrap"] = cwrap;
        Module["setValue"] = setValue;
        Module["getValue"] = getValue;
        Module["UTF8ToString"] = UTF8ToString;
        Module["stringToUTF8"] = stringToUTF8;
        Module["lengthBytesUTF8"] = lengthBytesUTF8;
        Module["FS_preloadFile"] = FS_preloadFile;
        Module["FS_unlink"] = FS_unlink;
        Module["FS_createPath"] = FS_createPath;
        Module["FS_createDevice"] = FS_createDevice;
        Module["FS"] = FS;
        Module["FS_createDataFile"] = FS_createDataFile;
        Module["FS_createLazyFile"] = FS_createLazyFile;
        Module["allocateUTF8"] = allocateUTF8;
        var _free, _malloc, _swe_set_ephe_path_wrap, _swe_julday_wrap, _swe_revjul_wrap, _swe_calc_ut_wrap, _swe_get_planet_name_wrap, _swe_lun_eclipse_when_wrap, _swe_sol_eclipse_when_glob_wrap, _swe_houses_wrap, _swe_set_sid_mode_wrap, _swe_get_ayanamsa_ut_wrap, _swe_get_ayanamsa_ex_ut_wrap, _swe_close_wrap, _swe_version_wrap, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, memory, __indirect_function_table, wasmMemory;
        function assignWasmExports(wasmExports2) {
          _free = Module["_free"] = wasmExports2["m"];
          _malloc = Module["_malloc"] = wasmExports2["n"];
          _swe_set_ephe_path_wrap = Module["_swe_set_ephe_path_wrap"] = wasmExports2["o"];
          _swe_julday_wrap = Module["_swe_julday_wrap"] = wasmExports2["p"];
          _swe_revjul_wrap = Module["_swe_revjul_wrap"] = wasmExports2["q"];
          _swe_calc_ut_wrap = Module["_swe_calc_ut_wrap"] = wasmExports2["r"];
          _swe_get_planet_name_wrap = Module["_swe_get_planet_name_wrap"] = wasmExports2["s"];
          _swe_lun_eclipse_when_wrap = Module["_swe_lun_eclipse_when_wrap"] = wasmExports2["t"];
          _swe_sol_eclipse_when_glob_wrap = Module["_swe_sol_eclipse_when_glob_wrap"] = wasmExports2["u"];
          _swe_houses_wrap = Module["_swe_houses_wrap"] = wasmExports2["v"];
          _swe_set_sid_mode_wrap = Module["_swe_set_sid_mode_wrap"] = wasmExports2["w"];
          _swe_get_ayanamsa_ut_wrap = Module["_swe_get_ayanamsa_ut_wrap"] = wasmExports2["x"];
          _swe_get_ayanamsa_ex_ut_wrap = Module["_swe_get_ayanamsa_ex_ut_wrap"] = wasmExports2["y"];
          _swe_close_wrap = Module["_swe_close_wrap"] = wasmExports2["z"];
          _swe_version_wrap = Module["_swe_version_wrap"] = wasmExports2["A"];
          __emscripten_stack_restore = wasmExports2["B"];
          __emscripten_stack_alloc = wasmExports2["C"];
          _emscripten_stack_get_current = wasmExports2["D"];
          memory = wasmMemory = wasmExports2["k"];
          __indirect_function_table = wasmExports2["__indirect_function_table"];
        }
        var wasmImports = { c: ___syscall_fcntl64, i: ___syscall_ioctl, j: ___syscall_openat, d: _emscripten_resize_heap, f: _environ_get, g: _environ_sizes_get, a: _fd_close, h: _fd_read, e: _fd_seek, b: _fd_write };
        async function run() {
          preRun();
          if (runDependencies) {
            await resolveRunDependencies();
          }
          var setStatus = Module["setStatus"];
          if (setStatus) {
            setStatus("Running...");
            await new Promise((resolve2) => setTimeout(resolve2, 1));
            setTimeout(setStatus, 1, "");
          }
          if (ABORT) return;
          initRuntime();
          Module["onRuntimeInitialized"]?.();
          postRun();
        }
        var wasmExports;
        wasmExports = await createWasm();
        await run();
        ;
        return Module;
      };
    })();
    if (typeof exports === "object" && typeof module === "object") {
      module.exports = SwissEphModule;
      module.exports.default = SwissEphModule;
    } else if (typeof define === "function" && define["amd"]) define([], () => SwissEphModule);
    swisseph_default = SwissEphModule;
  }
});

// node_modules/@swisseph/browser/dist/swisseph-browser.js
var swisseph_browser_exports = {};
__export(swisseph_browser_exports, {
  Asteroid: () => Asteroid,
  AsteroidOffset: () => AsteroidOffset,
  CalculationFlag: () => CalculationFlag,
  CalculationFlags: () => CalculationFlags,
  CalendarType: () => CalendarType,
  CommonCalculationFlags: () => CommonCalculationFlags,
  CommonEclipseTypes: () => CommonEclipseTypes,
  DateTimeImpl: () => DateTimeImpl,
  EclipseType: () => EclipseType,
  EclipseTypeFlags: () => EclipseTypeFlags,
  FictitiousPlanet: () => FictitiousPlanet,
  HousePoint: () => HousePoint,
  HouseSystem: () => HouseSystem,
  LunarEclipseImpl: () => LunarEclipseImpl,
  LunarPoint: () => LunarPoint,
  NumberOfPlanets: () => NumberOfPlanets,
  Planet: () => Planet,
  PlanetaryMoonOffset: () => PlanetaryMoonOffset,
  RiseTransitFlag: () => RiseTransitFlag,
  SiderealMode: () => SiderealMode,
  SolarEclipseImpl: () => SolarEclipseImpl,
  SwissEphemeris: () => SwissEphemeris,
  default: () => swisseph_browser_default,
  normalizeEclipseTypes: () => normalizeEclipseTypes,
  normalizeFlags: () => normalizeFlags,
  swisseph: () => swisseph
});
function normalizeFlags(input) {
  if (typeof input === "number") {
    return input;
  }
  if (input instanceof CalculationFlags) {
    return input.toNumber();
  }
  if (Array.isArray(input)) {
    return CalculationFlags.from(...input).toNumber();
  }
  return input;
}
function normalizeEclipseTypes(input) {
  if (typeof input === "number") {
    return input;
  }
  if (input instanceof EclipseTypeFlags) {
    return input.toNumber();
  }
  if (Array.isArray(input)) {
    return EclipseTypeFlags.from(...input).toNumber();
  }
  return input;
}
var __defProp2, __name, CalendarType, Planet, LunarPoint, Asteroid, FictitiousPlanet, HouseSystem, HousePoint, CalculationFlag, CommonCalculationFlags, EclipseType, CommonEclipseTypes, SiderealMode, RiseTransitFlag, AsteroidOffset, PlanetaryMoonOffset, NumberOfPlanets, _a, LunarEclipseImpl, _a2, SolarEclipseImpl, _a3, DateTimeImpl, _a4, CalculationFlags, _a5, EclipseTypeFlags, _SwissEphemeris, SwissEphemeris, swisseph, swisseph_browser_default;
var init_swisseph_browser = __esm({
  "node_modules/@swisseph/browser/dist/swisseph-browser.js"() {
    __defProp2 = Object.defineProperty;
    __name = (target, value) => __defProp2(target, "name", { value, configurable: true });
    CalendarType = /* @__PURE__ */ ((CalendarType2) => {
      CalendarType2[CalendarType2["Julian"] = 0] = "Julian";
      CalendarType2[CalendarType2["Gregorian"] = 1] = "Gregorian";
      return CalendarType2;
    })(CalendarType || {});
    Planet = /* @__PURE__ */ ((Planet22) => {
      Planet22[Planet22["Sun"] = 0] = "Sun";
      Planet22[Planet22["Moon"] = 1] = "Moon";
      Planet22[Planet22["Mercury"] = 2] = "Mercury";
      Planet22[Planet22["Venus"] = 3] = "Venus";
      Planet22[Planet22["Mars"] = 4] = "Mars";
      Planet22[Planet22["Jupiter"] = 5] = "Jupiter";
      Planet22[Planet22["Saturn"] = 6] = "Saturn";
      Planet22[Planet22["Uranus"] = 7] = "Uranus";
      Planet22[Planet22["Neptune"] = 8] = "Neptune";
      Planet22[Planet22["Pluto"] = 9] = "Pluto";
      Planet22[Planet22["Earth"] = 14] = "Earth";
      Planet22[Planet22["EclipticNutation"] = -1] = "EclipticNutation";
      Planet22[Planet22["FixedStar"] = -10] = "FixedStar";
      return Planet22;
    })(Planet || {});
    LunarPoint = /* @__PURE__ */ ((LunarPoint2) => {
      LunarPoint2[LunarPoint2["MeanNode"] = 10] = "MeanNode";
      LunarPoint2[LunarPoint2["TrueNode"] = 11] = "TrueNode";
      LunarPoint2[LunarPoint2["MeanApogee"] = 12] = "MeanApogee";
      LunarPoint2[LunarPoint2["OsculatingApogee"] = 13] = "OsculatingApogee";
      LunarPoint2[LunarPoint2["InterpolatedApogee"] = 21] = "InterpolatedApogee";
      LunarPoint2[LunarPoint2["InterpolatedPerigee"] = 22] = "InterpolatedPerigee";
      return LunarPoint2;
    })(LunarPoint || {});
    Asteroid = /* @__PURE__ */ ((Asteroid2) => {
      Asteroid2[Asteroid2["Chiron"] = 15] = "Chiron";
      Asteroid2[Asteroid2["Pholus"] = 16] = "Pholus";
      Asteroid2[Asteroid2["Ceres"] = 17] = "Ceres";
      Asteroid2[Asteroid2["Pallas"] = 18] = "Pallas";
      Asteroid2[Asteroid2["Juno"] = 19] = "Juno";
      Asteroid2[Asteroid2["Vesta"] = 20] = "Vesta";
      return Asteroid2;
    })(Asteroid || {});
    FictitiousPlanet = /* @__PURE__ */ ((FictitiousPlanet2) => {
      FictitiousPlanet2[FictitiousPlanet2["Cupido"] = 40] = "Cupido";
      FictitiousPlanet2[FictitiousPlanet2["Hades"] = 41] = "Hades";
      FictitiousPlanet2[FictitiousPlanet2["Zeus"] = 42] = "Zeus";
      FictitiousPlanet2[FictitiousPlanet2["Kronos"] = 43] = "Kronos";
      FictitiousPlanet2[FictitiousPlanet2["Apollon"] = 44] = "Apollon";
      FictitiousPlanet2[FictitiousPlanet2["Admetos"] = 45] = "Admetos";
      FictitiousPlanet2[FictitiousPlanet2["Vulkanus"] = 46] = "Vulkanus";
      FictitiousPlanet2[FictitiousPlanet2["Poseidon"] = 47] = "Poseidon";
      FictitiousPlanet2[FictitiousPlanet2["Isis"] = 48] = "Isis";
      FictitiousPlanet2[FictitiousPlanet2["Nibiru"] = 49] = "Nibiru";
      FictitiousPlanet2[FictitiousPlanet2["Harrington"] = 50] = "Harrington";
      FictitiousPlanet2[FictitiousPlanet2["NeptuneLeverrier"] = 51] = "NeptuneLeverrier";
      FictitiousPlanet2[FictitiousPlanet2["NeptuneAdams"] = 52] = "NeptuneAdams";
      FictitiousPlanet2[FictitiousPlanet2["PlutoLowell"] = 53] = "PlutoLowell";
      FictitiousPlanet2[FictitiousPlanet2["PlutoPickering"] = 54] = "PlutoPickering";
      FictitiousPlanet2[FictitiousPlanet2["Vulcan"] = 55] = "Vulcan";
      FictitiousPlanet2[FictitiousPlanet2["WhiteMoon"] = 56] = "WhiteMoon";
      FictitiousPlanet2[FictitiousPlanet2["Proserpina"] = 57] = "Proserpina";
      FictitiousPlanet2[FictitiousPlanet2["Waldemath"] = 58] = "Waldemath";
      return FictitiousPlanet2;
    })(FictitiousPlanet || {});
    HouseSystem = /* @__PURE__ */ ((HouseSystem2) => {
      HouseSystem2["Placidus"] = "P";
      HouseSystem2["Koch"] = "K";
      HouseSystem2["Porphyrius"] = "O";
      HouseSystem2["Regiomontanus"] = "R";
      HouseSystem2["Campanus"] = "C";
      HouseSystem2["Equal"] = "A";
      HouseSystem2["VehlowEqual"] = "V";
      HouseSystem2["WholeSign"] = "W";
      HouseSystem2["Meridian"] = "X";
      HouseSystem2["Azimuthal"] = "H";
      HouseSystem2["PolichPage"] = "T";
      HouseSystem2["Alcabitus"] = "B";
      HouseSystem2["Morinus"] = "M";
      return HouseSystem2;
    })(HouseSystem || {});
    HousePoint = /* @__PURE__ */ ((HousePoint2) => {
      HousePoint2[HousePoint2["Ascendant"] = 0] = "Ascendant";
      HousePoint2[HousePoint2["MC"] = 1] = "MC";
      HousePoint2[HousePoint2["ARMC"] = 2] = "ARMC";
      HousePoint2[HousePoint2["Vertex"] = 3] = "Vertex";
      HousePoint2[HousePoint2["EquatorialAscendant"] = 4] = "EquatorialAscendant";
      HousePoint2[HousePoint2["CoAscendant1"] = 5] = "CoAscendant1";
      HousePoint2[HousePoint2["CoAscendant2"] = 6] = "CoAscendant2";
      HousePoint2[HousePoint2["PolarAscendant"] = 7] = "PolarAscendant";
      return HousePoint2;
    })(HousePoint || {});
    CalculationFlag = /* @__PURE__ */ ((CalculationFlag2) => {
      CalculationFlag2[CalculationFlag2["JPLEphemeris"] = 1] = "JPLEphemeris";
      CalculationFlag2[CalculationFlag2["SwissEphemeris"] = 2] = "SwissEphemeris";
      CalculationFlag2[CalculationFlag2["MoshierEphemeris"] = 4] = "MoshierEphemeris";
      CalculationFlag2[CalculationFlag2["Heliocentric"] = 8] = "Heliocentric";
      CalculationFlag2[CalculationFlag2["TruePositions"] = 16] = "TruePositions";
      CalculationFlag2[CalculationFlag2["J2000"] = 32] = "J2000";
      CalculationFlag2[CalculationFlag2["NoNutation"] = 64] = "NoNutation";
      CalculationFlag2[CalculationFlag2["Speed3"] = 128] = "Speed3";
      CalculationFlag2[CalculationFlag2["Speed"] = 256] = "Speed";
      CalculationFlag2[CalculationFlag2["NoGravitationalDeflection"] = 512] = "NoGravitationalDeflection";
      CalculationFlag2[CalculationFlag2["NoAberration"] = 1024] = "NoAberration";
      CalculationFlag2[CalculationFlag2["Equatorial"] = 2048] = "Equatorial";
      CalculationFlag2[CalculationFlag2["XYZ"] = 4096] = "XYZ";
      CalculationFlag2[CalculationFlag2["Radians"] = 8192] = "Radians";
      CalculationFlag2[CalculationFlag2["Barycentric"] = 16384] = "Barycentric";
      CalculationFlag2[CalculationFlag2["Topocentric"] = 32768] = "Topocentric";
      CalculationFlag2[CalculationFlag2["Sidereal"] = 65536] = "Sidereal";
      CalculationFlag2[CalculationFlag2["ICRS"] = 131072] = "ICRS";
      CalculationFlag2[CalculationFlag2["DpsidepsIAU1980"] = 262144] = "DpsidepsIAU1980";
      CalculationFlag2[CalculationFlag2["JPLHorizons"] = 524288] = "JPLHorizons";
      CalculationFlag2[CalculationFlag2["JPLHorizonsApprox"] = 1048576] = "JPLHorizonsApprox";
      return CalculationFlag2;
    })(CalculationFlag || {});
    CommonCalculationFlags = {
      /** Astrometric positions (no aberration or gravitational deflection) */
      Astrometric: 1024 | 512,
      /** Default flags for Swiss Ephemeris with speed */
      DefaultSwissEphemeris: 2 | 256,
      /** Default flags for Moshier with speed */
      DefaultMoshier: 4 | 256
      /* Speed */
    };
    EclipseType = /* @__PURE__ */ ((EclipseType2) => {
      EclipseType2[EclipseType2["Central"] = 1] = "Central";
      EclipseType2[EclipseType2["NonCentral"] = 2] = "NonCentral";
      EclipseType2[EclipseType2["Total"] = 4] = "Total";
      EclipseType2[EclipseType2["Annular"] = 8] = "Annular";
      EclipseType2[EclipseType2["Partial"] = 16] = "Partial";
      EclipseType2[EclipseType2["AnnularTotal"] = 32] = "AnnularTotal";
      EclipseType2[EclipseType2["Penumbral"] = 64] = "Penumbral";
      return EclipseType2;
    })(EclipseType || {});
    CommonEclipseTypes = {
      /** All types of solar eclipses */
      AllSolar: 1 | 2 | 4 | 8 | 16 | 32,
      /** All types of lunar eclipses */
      AllLunar: 4 | 16 | 64
      /* Penumbral */
    };
    SiderealMode = /* @__PURE__ */ ((SiderealMode2) => {
      SiderealMode2[SiderealMode2["FaganBradley"] = 0] = "FaganBradley";
      SiderealMode2[SiderealMode2["Lahiri"] = 1] = "Lahiri";
      SiderealMode2[SiderealMode2["DeLuce"] = 2] = "DeLuce";
      SiderealMode2[SiderealMode2["Raman"] = 3] = "Raman";
      SiderealMode2[SiderealMode2["Ushashashi"] = 4] = "Ushashashi";
      SiderealMode2[SiderealMode2["Krishnamurti"] = 5] = "Krishnamurti";
      SiderealMode2[SiderealMode2["DjwhalKhul"] = 6] = "DjwhalKhul";
      SiderealMode2[SiderealMode2["Yukteshwar"] = 7] = "Yukteshwar";
      SiderealMode2[SiderealMode2["JNBhasin"] = 8] = "JNBhasin";
      SiderealMode2[SiderealMode2["BabylKugler1"] = 9] = "BabylKugler1";
      SiderealMode2[SiderealMode2["BabylKugler2"] = 10] = "BabylKugler2";
      SiderealMode2[SiderealMode2["BabylKugler3"] = 11] = "BabylKugler3";
      SiderealMode2[SiderealMode2["BabylHuber"] = 12] = "BabylHuber";
      SiderealMode2[SiderealMode2["BabylEtPSC"] = 13] = "BabylEtPSC";
      SiderealMode2[SiderealMode2["Aldebaran15Tau"] = 14] = "Aldebaran15Tau";
      SiderealMode2[SiderealMode2["Hipparchos"] = 15] = "Hipparchos";
      SiderealMode2[SiderealMode2["Sassanian"] = 16] = "Sassanian";
      SiderealMode2[SiderealMode2["GalacticCenter0Sag"] = 17] = "GalacticCenter0Sag";
      SiderealMode2[SiderealMode2["J2000"] = 18] = "J2000";
      SiderealMode2[SiderealMode2["J1900"] = 19] = "J1900";
      SiderealMode2[SiderealMode2["B1950"] = 20] = "B1950";
      SiderealMode2[SiderealMode2["SuryaSiddhanta"] = 21] = "SuryaSiddhanta";
      SiderealMode2[SiderealMode2["SuryaSiddhantaMeanSun"] = 22] = "SuryaSiddhantaMeanSun";
      SiderealMode2[SiderealMode2["Aryabhata"] = 23] = "Aryabhata";
      SiderealMode2[SiderealMode2["AryabhataMeanSun"] = 24] = "AryabhataMeanSun";
      SiderealMode2[SiderealMode2["SSRevati"] = 25] = "SSRevati";
      SiderealMode2[SiderealMode2["SSCitra"] = 26] = "SSCitra";
      SiderealMode2[SiderealMode2["TrueCitra"] = 27] = "TrueCitra";
      SiderealMode2[SiderealMode2["TrueRevati"] = 28] = "TrueRevati";
      SiderealMode2[SiderealMode2["TruePushya"] = 29] = "TruePushya";
      SiderealMode2[SiderealMode2["GalacticCenterGilBrand"] = 30] = "GalacticCenterGilBrand";
      SiderealMode2[SiderealMode2["GalacticEquatorIAU1958"] = 31] = "GalacticEquatorIAU1958";
      SiderealMode2[SiderealMode2["GalacticEquator"] = 32] = "GalacticEquator";
      SiderealMode2[SiderealMode2["GalacticEquatorMidMula"] = 33] = "GalacticEquatorMidMula";
      SiderealMode2[SiderealMode2["Skydram"] = 34] = "Skydram";
      SiderealMode2[SiderealMode2["TrueMula"] = 35] = "TrueMula";
      SiderealMode2[SiderealMode2["DhruvaGalCenterMulaWilhelm"] = 36] = "DhruvaGalCenterMulaWilhelm";
      SiderealMode2[SiderealMode2["Aryabhata522"] = 37] = "Aryabhata522";
      SiderealMode2[SiderealMode2["BabylBritton"] = 38] = "BabylBritton";
      SiderealMode2[SiderealMode2["UserDefined"] = 255] = "UserDefined";
      return SiderealMode2;
    })(SiderealMode || {});
    RiseTransitFlag = /* @__PURE__ */ ((RiseTransitFlag2) => {
      RiseTransitFlag2[RiseTransitFlag2["Rise"] = 1] = "Rise";
      RiseTransitFlag2[RiseTransitFlag2["Set"] = 2] = "Set";
      RiseTransitFlag2[RiseTransitFlag2["UpperTransit"] = 4] = "UpperTransit";
      RiseTransitFlag2[RiseTransitFlag2["LowerTransit"] = 8] = "LowerTransit";
      return RiseTransitFlag2;
    })(RiseTransitFlag || {});
    AsteroidOffset = 1e4;
    PlanetaryMoonOffset = 9e3;
    NumberOfPlanets = 23;
    LunarEclipseImpl = (_a = class {
      constructor(type, maximum, partialBegin, partialEnd, totalBegin, totalEnd, penumbralBegin, penumbralEnd) {
        this.type = type;
        this.maximum = maximum;
        this.partialBegin = partialBegin;
        this.partialEnd = partialEnd;
        this.totalBegin = totalBegin;
        this.totalEnd = totalEnd;
        this.penumbralBegin = penumbralBegin;
        this.penumbralEnd = penumbralEnd;
      }
      isTotal() {
        return (this.type & 4) !== 0;
      }
      isPartial() {
        return (this.type & 16) !== 0;
      }
      isPenumbralOnly() {
        return (this.type & 64) !== 0 && (this.type & (4 | 16)) === 0;
      }
      getTotalityDuration() {
        if (!this.isTotal() || this.totalBegin === 0 || this.totalEnd === 0) {
          return 0;
        }
        const duration = (this.totalEnd - this.totalBegin) * 24;
        return duration > 0 ? duration : 0;
      }
      getPartialDuration() {
        if (this.partialBegin === 0 || this.partialEnd === 0) {
          return 0;
        }
        const duration = (this.partialEnd - this.partialBegin) * 24;
        return duration > 0 ? duration : 0;
      }
      getTotalDuration() {
        if (this.penumbralBegin === 0 || this.penumbralEnd === 0) {
          return 0;
        }
        const duration = (this.penumbralEnd - this.penumbralBegin) * 24;
        return duration > 0 ? duration : 0;
      }
    }, __name(_a, "LunarEclipseImpl"), _a);
    SolarEclipseImpl = (_a2 = class {
      constructor(type, maximum, partialBegin, partialEnd, centralBegin, centralEnd, centerLineBegin, centerLineEnd) {
        this.type = type;
        this.maximum = maximum;
        this.partialBegin = partialBegin;
        this.partialEnd = partialEnd;
        this.centralBegin = centralBegin;
        this.centralEnd = centralEnd;
        this.centerLineBegin = centerLineBegin;
        this.centerLineEnd = centerLineEnd;
      }
      isTotal() {
        return (this.type & 4) !== 0;
      }
      isAnnular() {
        return (this.type & 8) !== 0;
      }
      isHybrid() {
        return (this.type & 32) !== 0;
      }
      isPartial() {
        return (this.type & 16) !== 0;
      }
      isCentral() {
        return (this.type & 1) !== 0;
      }
      isNonCentral() {
        return (this.type & 2) !== 0;
      }
    }, __name(_a2, "SolarEclipseImpl"), _a2);
    DateTimeImpl = (_a3 = class {
      constructor(year, month, day, hour, calendarType = 1) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.calendarType = calendarType;
      }
      toISOString() {
        const hours = Math.floor(this.hour);
        const minutes = Math.floor((this.hour - hours) * 60);
        const seconds = Math.floor(((this.hour - hours) * 60 - minutes) * 60);
        const milliseconds = Math.floor((((this.hour - hours) * 60 - minutes) * 60 - seconds) * 1e3);
        const yearStr = Math.abs(this.year).toString().padStart(4, "0");
        const yearSign = this.year < 0 ? "-" : "";
        const monthStr = this.month.toString().padStart(2, "0");
        const dayStr = this.day.toString().padStart(2, "0");
        const hoursStr = hours.toString().padStart(2, "0");
        const minutesStr = minutes.toString().padStart(2, "0");
        const secondsStr = seconds.toString().padStart(2, "0");
        const msStr = milliseconds.toString().padStart(3, "0");
        return `${yearSign}${yearStr}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:${secondsStr}.${msStr}Z`;
      }
      toString() {
        const calType = this.calendarType === 1 ? "Gregorian" : "Julian";
        const yearStr = this.year < 0 ? `${Math.abs(this.year)} BCE` : this.year.toString();
        return `${yearStr}-${this.month.toString().padStart(2, "0")}-${this.day.toString().padStart(2, "0")} ${this.hour.toFixed(6)} hours (${calType})`;
      }
    }, __name(_a3, "DateTimeImpl"), _a3);
    CalculationFlags = (_a4 = class {
      constructor(initialFlags) {
        this.flags = 0;
        if (initialFlags !== void 0) {
          this.add(initialFlags);
        }
      }
      /**
       * Add one or more flags to the current set
       * @param flag - Single flag or array of flags to add
       * @returns this (for method chaining)
       */
      add(flag) {
        if (Array.isArray(flag)) {
          flag.forEach((f) => this.flags |= f);
        } else {
          this.flags |= flag;
        }
        return this;
      }
      /**
       * Remove one or more flags from the current set
       * @param flag - Single flag or array of flags to remove
       * @returns this (for method chaining)
       */
      remove(flag) {
        if (Array.isArray(flag)) {
          flag.forEach((f) => this.flags &= ~f);
        } else {
          this.flags &= ~flag;
        }
        return this;
      }
      /**
       * Check if a specific flag is set
       * @param flag - Flag to check
       * @returns true if the flag is set
       */
      has(flag) {
        return (this.flags & flag) === flag;
      }
      /**
       * Convert to raw number for passing to C library
       * @returns The numeric representation of all combined flags
       */
      toNumber() {
        return this.flags;
      }
      /**
       * Create a new CalculationFlags instance from one or more flags
       * @param flags - Flags to combine
       * @returns New CalculationFlags instance
       */
      static from(...flags) {
        return new _a4(flags);
      }
      /**
       * Common preset: Swiss Ephemeris with speed calculation
       */
      static get swissEphemerisWithSpeed() {
        return _a4.from(
          2,
          256
          /* Speed */
        );
      }
      /**
       * Common preset: Moshier ephemeris with speed calculation
       */
      static get moshierWithSpeed() {
        return _a4.from(
          4,
          256
          /* Speed */
        );
      }
      /**
       * Common preset: Astrometric positions (no aberration or light deflection)
       */
      static get astrometric() {
        return _a4.from(
          2,
          1024,
          512
          /* NoGravitationalDeflection */
        );
      }
      /**
       * Common preset: Heliocentric positions
       */
      static get heliocentric() {
        return _a4.from(
          2,
          8
          /* Heliocentric */
        );
      }
      /**
       * Common preset: Topocentric positions
       */
      static get topocentric() {
        return _a4.from(
          2,
          32768
          /* Topocentric */
        );
      }
      /**
       * Common preset: Equatorial coordinates (RA/Dec)
       */
      static get equatorial() {
        return _a4.from(
          2,
          2048,
          256
          /* Speed */
        );
      }
    }, __name(_a4, "_CalculationFlags"), _a4);
    EclipseTypeFlags = (_a5 = class {
      constructor(initialFlags) {
        this.flags = 0;
        if (initialFlags !== void 0) {
          this.add(initialFlags);
        }
      }
      /**
       * Add one or more eclipse types to the filter
       * @param flag - Single type or array of types to add
       * @returns this (for method chaining)
       */
      add(flag) {
        if (Array.isArray(flag)) {
          flag.forEach((f) => this.flags |= f);
        } else {
          this.flags |= flag;
        }
        return this;
      }
      /**
       * Check if a specific eclipse type is in the filter
       * @param flag - Eclipse type to check
       * @returns true if the type is included
       */
      has(flag) {
        return (this.flags & flag) === flag;
      }
      /**
       * Convert to raw number for passing to C library
       * @returns The numeric representation of all combined types
       */
      toNumber() {
        return this.flags;
      }
      /**
       * Create a new EclipseTypeFlags instance from one or more types
       * @param flags - Eclipse types to combine
       * @returns New EclipseTypeFlags instance
       */
      static from(...flags) {
        return new _a5(flags);
      }
      /**
       * Preset: All solar eclipse types
       */
      static get allSolar() {
        return new _a5([
          1,
          2,
          4,
          8,
          16,
          32
          /* AnnularTotal */
        ]);
      }
      /**
       * Preset: All lunar eclipse types
       */
      static get allLunar() {
        return new _a5([
          4,
          16,
          64
          /* Penumbral */
        ]);
      }
      /**
       * Preset: Only total eclipses
       */
      static get totalOnly() {
        return _a5.from(
          4
          /* Total */
        );
      }
      /**
       * Preset: Total and partial eclipses (no penumbral)
       */
      static get totalAndPartial() {
        return _a5.from(
          4,
          16
          /* Partial */
        );
      }
    }, __name(_a5, "_EclipseTypeFlags"), _a5);
    __name(normalizeFlags, "normalizeFlags");
    __name(normalizeEclipseTypes, "normalizeEclipseTypes");
    _SwissEphemeris = class _SwissEphemeris2 {
      constructor() {
        this.module = null;
        this.ready = false;
      }
      /**
       * Initialize the WebAssembly module
       *
       * This must be called before using any other methods.
       * The WASM file is automatically loaded from the same directory as the JS bundle.
       *
       * @param wasmPath - Optional custom path to swisseph.wasm file (for advanced use cases)
       *
       * @example
       * const swe = new SwissEphemeris();
       * await swe.init();
       * console.log(swe.version());
       */
      async init(wasmPath) {
        if (this.ready) return;
        const SwissEphModuleImport = await Promise.resolve().then(() => (init_swisseph(), swisseph_exports));
        let SwissEphModuleFactory;
        if (typeof SwissEphModuleImport.default === "function") {
          SwissEphModuleFactory = SwissEphModuleImport.default;
        } else if (typeof SwissEphModuleImport === "function") {
          SwissEphModuleFactory = SwissEphModuleImport;
        } else if (SwissEphModuleImport.default) {
          SwissEphModuleFactory = SwissEphModuleImport.default;
        } else {
          SwissEphModuleFactory = SwissEphModuleImport.SwissEphModule || SwissEphModuleImport;
        }
        if (typeof SwissEphModuleFactory !== "function") {
          throw new Error("Failed to load WASM module: SwissEphModule factory function not found");
        }
        let resolvedWasmPath = wasmPath;
        if (!resolvedWasmPath) {
          try {
            resolvedWasmPath = new URL("./swisseph.wasm", import.meta.url).href;
          } catch (e) {
            resolvedWasmPath = "swisseph.wasm";
          }
        }
        this.module = await SwissEphModuleFactory({
          locateFile: /* @__PURE__ */ __name((path, prefix) => {
            if (path === "swisseph.wasm") {
              return resolvedWasmPath;
            }
            return prefix ? prefix + path : path;
          }, "locateFile")
        });
        this._wrapFunctions();
        this.ready = true;
        console.log("Swiss Ephemeris WASM initialized:", this.version());
      }
      /**
       * Wrap C functions for easier calling
       */
      _wrapFunctions() {
        const m = this.module;
        this._julday = m.cwrap(
          "swe_julday_wrap",
          "number",
          ["number", "number", "number", "number", "number"]
        );
        this._getPlanetName = m.cwrap(
          "swe_get_planet_name_wrap",
          "string",
          ["number"]
        );
        this._setSiderealMode = m.cwrap(
          "swe_set_sid_mode_wrap",
          null,
          ["number", "number", "number"]
        );
        this._getAyanamsa = m.cwrap(
          "swe_get_ayanamsa_ut_wrap",
          "number",
          ["number"]
        );
        this._close = m.cwrap("swe_close_wrap", null, []);
        this._version = m.cwrap("swe_version_wrap", "string", []);
      }
      /**
       * Check if the module is ready for use
       * @throws Error if not initialized
       */
      _checkReady() {
        if (!this.ready) {
          throw new Error(
            "SwissEphemeris not initialized. Call await swe.init() first."
          );
        }
      }
      /**
       * Get Swiss Ephemeris version string
       */
      version() {
        this._checkReady();
        return this._version();
      }
      /**
       * Set ephemeris file path
       *
       * Note: This is typically not used in the browser version as we use
       * the built-in Moshier ephemeris.
       *
       * @param path - Path to ephemeris files
       */
      setEphemerisPath(path) {
        this._checkReady();
        const m = this.module;
        const pathPtr = m.allocateUTF8(path || "");
        m.ccall("swe_set_ephe_path_wrap", null, ["number"], [pathPtr]);
        m._free(pathPtr);
      }
      /**
       * Load standard Swiss Ephemeris data files from jsDelivr CDN
       *
       * Simple one-line method to download standard ephemeris files (~2MB).
       * After loading, you can use CalculationFlag.SwissEphemeris for maximum precision.
       *
       * @example
       * // Simple: Load all standard files
       * await swe.loadStandardEphemeris();
       *
       * // Then use Swiss Ephemeris for calculations
       * const sun = swe.calculatePosition(jd, Planet.Sun, CalculationFlag.SwissEphemeris);
       */
      async loadStandardEphemeris() {
        const CDN_BASE = "https://cdn.jsdelivr.net/gh/aloistr/swisseph/ephe";
        await this.loadEphemerisFiles([
          { name: "sepl_18.se1", url: `${CDN_BASE}/sepl_18.se1` },
          { name: "semo_18.se1", url: `${CDN_BASE}/semo_18.se1` },
          { name: "seas_18.se1", url: `${CDN_BASE}/seas_18.se1` }
        ]);
      }
      /**
       * Load Swiss Ephemeris data files from URLs
       *
       * Downloads ephemeris files and writes them to the virtual filesystem.
       * Use this for maximum precision calculations or custom file sources.
       *
       * @param files - Array of files to download with name and URL
       *
       * @example
       * // Load from custom CDN or server
       * await swe.loadEphemerisFiles([
       *   {
       *     name: 'sepl_18.se1',
       *     url: 'https://your-cdn.com/ephemeris/sepl_18.se1'
       *   },
       *   {
       *     name: 'semo_18.se1',
       *     url: 'https://your-cdn.com/ephemeris/semo_18.se1'
       *   }
       * ]);
       *
       * // Then use Swiss Ephemeris
       * const sun = swe.calculatePosition(jd, Planet.Sun, CalculationFlag.SwissEphemeris);
       */
      async loadEphemerisFiles(files) {
        this._checkReady();
        const m = this.module;
        try {
          m.FS.mkdir("/ephemeris");
        } catch (e) {
        }
        for (const file of files) {
          const response = await fetch(file.url);
          if (!response.ok) {
            throw new Error(`Failed to download ${file.name}: ${response.statusText}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          m.FS.writeFile(`/ephemeris/${file.name}`, data);
        }
        this.setEphemerisPath("/ephemeris");
      }
      /**
       * Calculate Julian day number from calendar date
       *
       * @param year - Year (negative for BCE)
       * @param month - Month (1-12)
       * @param day - Day (1-31)
       * @param hour - Hour as decimal (0.0-23.999...)
       * @param calendarType - Calendar system (default: Gregorian)
       * @returns Julian day number
       *
       * @example
       * const jd = swe.julianDay(2007, 3, 3);
       * console.log(jd); // 2454162.5
       */
      julianDay(year, month, day, hour = 0, calendarType = CalendarType.Gregorian) {
        this._checkReady();
        if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) || !Number.isFinite(hour)) {
          throw new TypeError(
            `julianDay requires finite numbers. Received: year=${year}, month=${month}, day=${day}, hour=${hour}`
          );
        }
        return this._julday(year, month, day, hour, calendarType);
      }
      /**
       * Calculate Julian day number from a JavaScript Date object
       *
       * Convenience function that converts a JavaScript Date to Julian day number.
       * The Date is interpreted as UTC.
       *
       * @param date - JavaScript Date object (interpreted as UTC)
       * @param calendarType - Calendar system (default: Gregorian)
       * @returns Julian day number
       *
       * @example
       * // From Date object
       * const date = new Date('1990-05-15T14:30:00Z');
       * const jd = swe.dateToJulianDay(date);
       *
       * // From timestamp
       * const now = new Date();
       * const jdNow = swe.dateToJulianDay(now);
       *
       * // Equivalent to swe.julianDay(1990, 5, 15, 14.5)
       * const jd2 = swe.dateToJulianDay(new Date(Date.UTC(1990, 4, 15, 14, 30)));
       */
      dateToJulianDay(date, calendarType = CalendarType.Gregorian) {
        this._checkReady();
        if (!(date instanceof Date)) {
          throw new TypeError("dateToJulianDay expects a Date object");
        }
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const milliseconds = date.getUTCMilliseconds();
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours)) {
          throw new TypeError(
            `Invalid Date object provided to dateToJulianDay. Date.toString() returned: "${date.toString()}". Please ensure the date is valid (e.g., avoid new Date("invalid")).`
          );
        }
        const decimalHours = hours + minutes / 60 + seconds / 3600 + milliseconds / 36e5;
        return this.julianDay(year, month, day, decimalHours, calendarType);
      }
      /**
       * Convert Julian day number to calendar date
       *
       * @param jd - Julian day number
       * @param calendarType - Calendar system (default: Gregorian)
       * @returns DateTime object
       *
       * @example
       * const date = swe.julianDayToDate(2454162.5);
       * console.log(date.toString());
       */
      julianDayToDate(jd, calendarType = CalendarType.Gregorian) {
        this._checkReady();
        const m = this.module;
        const yearPtr = m._malloc(4);
        const monthPtr = m._malloc(4);
        const dayPtr = m._malloc(4);
        const hourPtr = m._malloc(8);
        m.ccall(
          "swe_revjul_wrap",
          null,
          ["number", "number", "number", "number", "number", "number"],
          [jd, calendarType, yearPtr, monthPtr, dayPtr, hourPtr]
        );
        const year = m.getValue(yearPtr, "i32");
        const month = m.getValue(monthPtr, "i32");
        const day = m.getValue(dayPtr, "i32");
        const hour = m.getValue(hourPtr, "double");
        m._free(yearPtr);
        m._free(monthPtr);
        m._free(dayPtr);
        m._free(hourPtr);
        return new DateTimeImpl(year, month, day, hour, calendarType);
      }
      /**
       * Calculate planetary positions
       *
       * Note: Browser version uses Moshier ephemeris by default.
       *
       * @param julianDay - Julian day number in Universal Time
       * @param body - Celestial body to calculate
       * @param flags - Calculation flags (default: Moshier with speed)
       * @returns PlanetaryPosition object
       *
       * @example
       * const sun = swe.calculatePosition(jd, Planet.Sun);
       * console.log(`Sun: ${sun.longitude}°, ${sun.latitude}°`);
       *
       * const moon = swe.calculatePosition(
       *   jd,
       *   Planet.Moon,
       *   CalculationFlag.MoshierEphemeris | CalculationFlag.Speed
       * );
       */
      calculatePosition(julianDay, body, flags = CommonCalculationFlags.DefaultMoshier) {
        this._checkReady();
        const normalizedFlags = normalizeFlags(flags);
        const m = this.module;
        const xxPtr = m._malloc(6 * 8);
        const serrPtr = m._malloc(256);
        const retflag = m.ccall(
          "swe_calc_ut_wrap",
          "number",
          ["number", "number", "number", "number", "number"],
          [julianDay, body, normalizedFlags, xxPtr, serrPtr]
        );
        if (retflag < 0) {
          const error = m.UTF8ToString(serrPtr);
          m._free(xxPtr);
          m._free(serrPtr);
          throw new Error(error);
        }
        const xx = [];
        for (let i = 0; i < 6; i++) {
          xx[i] = m.getValue(xxPtr + i * 8, "double");
        }
        m._free(xxPtr);
        m._free(serrPtr);
        return {
          longitude: xx[0],
          latitude: xx[1],
          distance: xx[2],
          longitudeSpeed: xx[3],
          latitudeSpeed: xx[4],
          distanceSpeed: xx[5],
          flags: retflag
        };
      }
      /**
       * Get celestial body name
       *
       * @param body - Celestial body identifier
       * @returns Name as a string
       *
       * @example
       * const name = swe.getCelestialBodyName(Planet.Mars);
       * console.log(name); // "Mars"
       */
      getCelestialBodyName(body) {
        this._checkReady();
        return this._getPlanetName(body);
      }
      /** Set the ayanamsa system used for sidereal calculations. */
      setSiderealMode(siderealMode, t0 = 0, ayanT0 = 0) {
        this._checkReady();
        this._setSiderealMode(siderealMode, t0, ayanT0);
      }
      /** Get the ayanamsa for a Julian Day in Universal Time. */
      getAyanamsa(julianDay) {
        this._checkReady();
        return this._getAyanamsa(julianDay);
      }
      /** Get the ayanamsa using explicit calculation flags. */
      getAyanamsaExUt(julianDay, flags = CalculationFlag.SwissEphemeris) {
        this._checkReady();
        const normalizedFlags = normalizeFlags(flags);
        const m = this.module;
        const ayanamsaPtr = m._malloc(8);
        const serrPtr = m._malloc(256);
        try {
          const retflag = m.ccall(
            "swe_get_ayanamsa_ex_ut_wrap",
            "number",
            ["number", "number", "number", "number"],
            [julianDay, normalizedFlags, ayanamsaPtr, serrPtr]
          );
          if (retflag < 0) {
            const error = m.UTF8ToString(serrPtr);
            throw new Error(error || "Failed to calculate ayanamsa");
          }
          return m.getValue(ayanamsaPtr, "double");
        } finally {
          m._free(ayanamsaPtr);
          m._free(serrPtr);
        }
      }
      /**
       * Find next lunar eclipse
       *
       * @param startJulianDay - Julian day to start search from
       * @param flags - Calculation flags (default: Moshier)
       * @param eclipseType - Filter by eclipse type (0 = all types)
       * @param backward - Search backward in time if true
       * @returns LunarEclipse object
       *
       * @example
       * const eclipse = swe.findNextLunarEclipse(jd);
       * console.log(`Is total: ${eclipse.isTotal()}`);
       * console.log(`Duration: ${eclipse.getTotalityDuration()} hours`);
       */
      findNextLunarEclipse(startJulianDay, flags = CalculationFlag.MoshierEphemeris, eclipseType = 0, backward = false) {
        this._checkReady();
        const normalizedFlags = normalizeFlags(flags);
        const normalizedEclipseType = normalizeEclipseTypes(eclipseType);
        const m = this.module;
        const tretPtr = m._malloc(10 * 8);
        const serrPtr = m._malloc(256);
        const retflag = m.ccall(
          "swe_lun_eclipse_when_wrap",
          "number",
          ["number", "number", "number", "number", "number", "number"],
          [startJulianDay, normalizedFlags, normalizedEclipseType, tretPtr, backward ? 1 : 0, serrPtr]
        );
        if (retflag < 0) {
          const error = m.UTF8ToString(serrPtr);
          m._free(tretPtr);
          m._free(serrPtr);
          throw new Error(error);
        }
        const tret = [];
        for (let i = 0; i < 10; i++) {
          tret[i] = m.getValue(tretPtr + i * 8, "double");
        }
        m._free(tretPtr);
        m._free(serrPtr);
        return new LunarEclipseImpl(
          retflag,
          tret[0],
          tret[1],
          tret[2],
          tret[3],
          tret[4],
          tret[5],
          tret[6]
        );
      }
      /**
       * Find next solar eclipse globally
       *
       * @param startJulianDay - Julian day to start search from
       * @param flags - Calculation flags (default: Moshier)
       * @param eclipseType - Filter by eclipse type (0 = all types)
       * @param backward - Search backward in time if true
       * @returns SolarEclipse object
       *
       * @example
       * const eclipse = swe.findNextSolarEclipse(jd);
       * console.log(`Is total: ${eclipse.isTotal()}`);
       * console.log(`Is central: ${eclipse.isCentral()}`);
       */
      findNextSolarEclipse(startJulianDay, flags = CalculationFlag.MoshierEphemeris, eclipseType = 0, backward = false) {
        this._checkReady();
        const normalizedFlags = normalizeFlags(flags);
        const normalizedEclipseType = normalizeEclipseTypes(eclipseType);
        const m = this.module;
        const tretPtr = m._malloc(10 * 8);
        const serrPtr = m._malloc(256);
        const retflag = m.ccall(
          "swe_sol_eclipse_when_glob_wrap",
          "number",
          ["number", "number", "number", "number", "number", "number"],
          [startJulianDay, normalizedFlags, normalizedEclipseType, tretPtr, backward ? 1 : 0, serrPtr]
        );
        if (retflag < 0) {
          const error = m.UTF8ToString(serrPtr);
          m._free(tretPtr);
          m._free(serrPtr);
          throw new Error(error);
        }
        const tret = [];
        for (let i = 0; i < 10; i++) {
          tret[i] = m.getValue(tretPtr + i * 8, "double");
        }
        m._free(tretPtr);
        m._free(serrPtr);
        return new SolarEclipseImpl(
          retflag,
          tret[0],
          tret[1],
          tret[2],
          tret[3],
          tret[4],
          tret[5],
          tret[6]
        );
      }
      /**
       * Calculate house cusps and angles
       *
       * @param julianDay - Julian day number in Universal Time
       * @param latitude - Geographic latitude
       * @param longitude - Geographic longitude
       * @param houseSystem - House system (default: Placidus)
       * @returns HouseData object
       *
       * @example
       * const houses = swe.calculateHouses(jd, 40.7128, -74.0060);
       * console.log(`Ascendant: ${houses.ascendant}°`);
       * console.log(`MC: ${houses.mc}°`);
       */
      calculateHouses(julianDay, latitude, longitude, houseSystem = HouseSystem.Placidus) {
        this._checkReady();
        const m = this.module;
        const cuspsPtr = m._malloc(13 * 8);
        const ascmcPtr = m._malloc(10 * 8);
        const hsysCode = houseSystem.charCodeAt(0);
        m.ccall(
          "swe_houses_wrap",
          "number",
          ["number", "number", "number", "number", "number", "number"],
          [julianDay, latitude, longitude, hsysCode, cuspsPtr, ascmcPtr]
        );
        const cusps = [];
        for (let i = 0; i < 13; i++) {
          cusps[i] = m.getValue(cuspsPtr + i * 8, "double");
        }
        const ascmc = [];
        for (let i = 0; i < 10; i++) {
          ascmc[i] = m.getValue(ascmcPtr + i * 8, "double");
        }
        m._free(cuspsPtr);
        m._free(ascmcPtr);
        return {
          cusps,
          ascendant: ascmc[HousePoint.Ascendant],
          mc: ascmc[HousePoint.MC],
          armc: ascmc[HousePoint.ARMC],
          vertex: ascmc[HousePoint.Vertex],
          equatorialAscendant: ascmc[HousePoint.EquatorialAscendant],
          coAscendant1: ascmc[HousePoint.CoAscendant1],
          coAscendant2: ascmc[HousePoint.CoAscendant2],
          polarAscendant: ascmc[HousePoint.PolarAscendant],
          houseSystem
        };
      }
      /**
       * Close Swiss Ephemeris and free resources
       */
      close() {
        if (this.ready) {
          this._close();
        }
      }
    };
    __name(_SwissEphemeris, "SwissEphemeris");
    SwissEphemeris = _SwissEphemeris;
    swisseph = new SwissEphemeris();
    swisseph_browser_default = SwissEphemeris;
    if (typeof window !== "undefined") {
      window.SwissEphemeris = SwissEphemeris;
      window.swisseph = swisseph;
    }
  }
});

// skills/read-vedic-jyotish/scripts/src/cli.ts
init_swisseph_browser();
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// skills/read-vedic-jyotish/scripts/src/chart.ts
var signs = [
  { roman: "Mesh", symbol: "Ar" },
  { roman: "Vrishabha", symbol: "Ta" },
  { roman: "Mithuna", symbol: "Ge" },
  { roman: "Karka", symbol: "Ca" },
  { roman: "Simha", symbol: "Le" },
  { roman: "Kanya", symbol: "Vi" },
  { roman: "Tula", symbol: "Li" },
  { roman: "Vrishchika", symbol: "Sc" },
  { roman: "Dhanu", symbol: "Sg" },
  { roman: "Makara", symbol: "Cp" },
  { roman: "Kumbha", symbol: "Aq" },
  { roman: "Meena", symbol: "Pi" }
];
var nakshatras = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
];
var dashaOrder = [
  "Ketu",
  "Shukra",
  "Surya",
  "Chandra",
  "Mangal",
  "Rahu",
  "Guru",
  "Shani",
  "Budh"
];
function normalize(value) {
  return (value % 360 + 360) % 360;
}
function signIndexOf(longitude) {
  return Math.floor(normalize(longitude) / 30);
}
function signOf(longitude) {
  return signs[signIndexOf(longitude)].roman;
}
function houseOf(longitude, ascendant) {
  return (signIndexOf(longitude) - signIndexOf(ascendant) + 12) % 12 + 1;
}
function nakshatraOf(longitude) {
  const position = normalize(longitude) * 27 / 360;
  const index = Math.min(26, Math.floor(position + 1e-12));
  const fraction = Math.max(0, position - index);
  const pada = Math.min(4, Math.floor(fraction * 4 + 1e-12) + 1);
  return {
    index,
    pada,
    label: `${nakshatras[index]}, Pada ${pada}`,
    lord: dashaOrder[index % dashaOrder.length]
  };
}
function lagnaStability(before, current, after) {
  const currentSign = signOf(current);
  const degree = normalize(current) % 30;
  const boundaryDistance = Math.min(degree, 30 - degree);
  return signOf(before) === currentSign && signOf(after) === currentSign && boundaryDistance > 0.1 ? "stable" : "sensitive";
}
function nakshatraStability(longitude, longitudeSpeed, minuteWindow = 5) {
  const segment = 360 / 27;
  const offset = normalize(longitude) % segment;
  const boundaryDistance = Math.min(offset, segment - offset);
  const estimatedTravel = Math.abs(longitudeSpeed) * minuteWindow / (24 * 60);
  return boundaryDistance > estimatedTravel ? "stable" : "sensitive";
}
function sensitivityText(before, current, after) {
  const beforeSign = signOf(before);
  const currentSign = signOf(current);
  const afterSign = signOf(after);
  const stable = lagnaStability(before, current, after) === "stable";
  if (stable) {
    return `Birth time se 5 minute pehle aur baad bhi Lagna ${currentSign} hi rehta hai.`;
  }
  const sampledSigns = [beforeSign, currentSign, afterSign];
  const transitions = sampledSigns.filter(
    (sign, index) => index === 0 || sign !== sampledSigns[index - 1]
  );
  if (transitions.length === 1) {
    return `Lagna ${currentSign} ki boundary ke kareeb hai. 5-minute check mein sign nahi badla, phir bhi birth record ka time verify karna useful rahega.`;
  }
  return `Birth time ke aas-paas 5 minute mein Lagna ${transitions.join(" se ")} badal raha hai. Birth record ka exact time verify karein.`;
}
function zonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = formatter.formatToParts(date);
  const value = (type) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second")
  };
}
function matchesLocalParts(parts, year, month, day, hour, minute) {
  return parts.year === year && parts.month === month && parts.day === day && parts.hour === hour && parts.minute === minute;
}
function timeZoneOffsetMilliseconds(date, timeZone) {
  const parts = zonedParts(date, timeZone);
  const represented = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return represented - date.getTime();
}
function localDateTimeToUtc(dateValue, timeValue, timeZone) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue) || !/^\d{2}:\d{2}(?::\d{2})?$/.test(timeValue)) {
    throw new Error("Invalid local date or time");
  }
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute, second = 0] = timeValue.split(":").map(Number);
  const calendarCheck = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second)
  );
  if (year < 1 || month < 1 || month > 12 || day < 1 || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59 || calendarCheck.getUTCFullYear() !== year || calendarCheck.getUTCMonth() !== month - 1 || calendarCheck.getUTCDate() !== day) {
    throw new Error("Invalid local date or time");
  }
  const desired = Date.UTC(year, month - 1, day, hour, minute, second);
  let candidate = desired;
  for (let index = 0; index < 4; index += 1) {
    const parts = zonedParts(new Date(candidate), timeZone);
    const represented = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );
    const adjustment = desired - represented;
    candidate += adjustment;
    if (Math.abs(adjustment) < 1e3) break;
  }
  const verified = zonedParts(new Date(candidate), timeZone);
  if (!matchesLocalParts(verified, year, month, day, hour, minute)) {
    throw new Error("This local time does not exist in the selected timezone");
  }
  const nearbyOffsets = /* @__PURE__ */ new Set();
  const hourMilliseconds = 60 * 60 * 1e3;
  for (let offsetHours = -48; offsetHours <= 48; offsetHours += 1) {
    nearbyOffsets.add(
      timeZoneOffsetMilliseconds(
        new Date(candidate + offsetHours * hourMilliseconds),
        timeZone
      )
    );
  }
  for (const offsetMilliseconds of nearbyOffsets) {
    const alternativeTimestamp = desired - offsetMilliseconds;
    if (alternativeTimestamp === candidate) continue;
    const alternative = zonedParts(
      new Date(alternativeTimestamp),
      timeZone
    );
    if (matchesLocalParts(alternative, year, month, day, hour, minute)) {
      throw new Error("This local time is ambiguous in the selected timezone");
    }
  }
  return new Date(candidate);
}

// skills/read-vedic-jyotish/scripts/src/jyotish/config.ts
var RULE_SET_VERSION = "jyotish-core-2.0";
var VIMSHOTTARI_YEAR_DAYS = 365.25;
var SIGN_NAMES = [
  "Mesh",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena"
];
var CLASSICAL_PLANETS = [
  "Surya",
  "Chandra",
  "Budh",
  "Shukra",
  "Mangal",
  "Guru",
  "Shani"
];
var PLANET_ORDER = [
  ...CLASSICAL_PLANETS,
  "Rahu",
  "Ketu"
];
var SIGN_LORDS = {
  Mesh: "Mangal",
  Vrishabha: "Shukra",
  Mithuna: "Budh",
  Karka: "Chandra",
  Simha: "Surya",
  Kanya: "Budh",
  Tula: "Shukra",
  Vrishchika: "Mangal",
  Dhanu: "Guru",
  Makara: "Shani",
  Kumbha: "Shani",
  Meena: "Guru"
};
var OWN_SIGNS = {
  Surya: ["Simha"],
  Chandra: ["Karka"],
  Budh: ["Mithuna", "Kanya"],
  Shukra: ["Vrishabha", "Tula"],
  Mangal: ["Mesh", "Vrishchika"],
  Guru: ["Dhanu", "Meena"],
  Shani: ["Makara", "Kumbha"]
};
var EXALTATION_SIGNS = {
  Surya: "Mesh",
  Chandra: "Vrishabha",
  Budh: "Kanya",
  Shukra: "Meena",
  Mangal: "Makara",
  Guru: "Karka",
  Shani: "Tula"
};
var DEBILITATION_SIGNS = {
  Surya: "Tula",
  Chandra: "Vrishchika",
  Budh: "Meena",
  Shukra: "Kanya",
  Mangal: "Karka",
  Guru: "Makara",
  Shani: "Mesh"
};
var DASHA_ORDER = [
  "Ketu",
  "Shukra",
  "Surya",
  "Chandra",
  "Mangal",
  "Rahu",
  "Guru",
  "Shani",
  "Budh"
];
var DASHA_YEARS = {
  Ketu: 7,
  Shukra: 20,
  Surya: 6,
  Chandra: 10,
  Mangal: 7,
  Rahu: 18,
  Guru: 16,
  Shani: 19,
  Budh: 17
};
var DOMAIN_HOUSES = {
  self: [1, 3, 8],
  career: [6, 10],
  money: [2, 11],
  relationships: [7],
  children: [5],
  family: [2, 4],
  wellbeing: [1, 6, 8, 12],
  education: [4, 5, 9],
  property: [4],
  travel: [3, 9, 12]
};
var DOMAIN_TITLES = {
  self: "Nature aur life direction",
  career: "Career aur work",
  money: "Money aur financial pattern",
  relationships: "Marriage, spouse aur partnership",
  children: "Children, parenting aur creativity",
  family: "Family aur home",
  wellbeing: "Health aur wellbeing",
  education: "Education aur skills",
  property: "Property, residence aur vehicles",
  travel: "Travel aur foreign connections"
};

// skills/read-vedic-jyotish/scripts/src/jyotish/math.ts
function normalizeLongitude(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Longitude must be finite. Received ${value}.`);
  }
  return (value % 360 + 360) % 360;
}
function signIndexOf2(longitude) {
  return Math.floor(normalizeLongitude(longitude) / 30);
}
function signNameOf(longitude) {
  return SIGN_NAMES[signIndexOf2(longitude)];
}
function rashiStability(beforeLongitude, currentLongitude, afterLongitude) {
  const currentSignIndex = signIndexOf2(currentLongitude);
  return signIndexOf2(beforeLongitude) === currentSignIndex && signIndexOf2(afterLongitude) === currentSignIndex ? "stable" : "sensitive";
}
function wholeSignHouseOf(longitude, ascendantLongitude) {
  return (signIndexOf2(longitude) - signIndexOf2(ascendantLongitude) + 12) % 12 + 1;
}
function angularSeparation(first, second) {
  const difference = Math.abs(
    normalizeLongitude(first) - normalizeLongitude(second)
  );
  return Math.min(difference, 360 - difference);
}
function relativeHouseOf(longitude, reference) {
  return (signIndexOf2(longitude) - signIndexOf2(reference) + 12) % 12 + 1;
}
function houseSignName(house, ascendantLongitude) {
  if (!Number.isInteger(house) || house < 1 || house > 12) {
    throw new RangeError(`House must be an integer from 1 to 12. Received ${house}.`);
  }
  const signIndex = (signIndexOf2(ascendantLongitude) + house - 1) % 12;
  return SIGN_NAMES[signIndex];
}

// skills/read-vedic-jyotish/scripts/src/jyotish/aspects.ts
var seventhAspect = {
  offset: 6,
  kind: "seventh",
  label: "7th house"
};
var specialAspects = {
  Mangal: [
    { offset: 3, kind: "mars-fourth", label: "4th house" },
    { offset: 7, kind: "mars-eighth", label: "8th house" }
  ],
  Guru: [
    { offset: 4, kind: "jupiter-fifth", label: "5th house" },
    { offset: 8, kind: "jupiter-ninth", label: "9th house" }
  ],
  Shani: [
    { offset: 2, kind: "saturn-third", label: "3rd house" },
    { offset: 9, kind: "saturn-tenth", label: "10th house" }
  ]
};
function deriveGrahaAspects(ascendantLongitude, planets) {
  const houseByPlanet = new Map(
    planets.map((planet) => [
      planet.name,
      wholeSignHouseOf(planet.longitude, ascendantLongitude)
    ])
  );
  const aspects = [];
  for (const sourceName of CLASSICAL_PLANETS) {
    const fromHouse = houseByPlanet.get(sourceName);
    if (!fromHouse) {
      throw new Error(
        `Missing classical planet required for graha drishti: ${sourceName}.`
      );
    }
    const definitions = [
      seventhAspect,
      ...specialAspects[sourceName] ?? []
    ];
    for (const definition of definitions) {
      const toHouse = (fromHouse - 1 + definition.offset) % 12 + 1;
      const targetPlanets = planets.filter((planet) => houseByPlanet.get(planet.name) === toHouse).map((planet) => planet.name);
      aspects.push({
        id: `aspect-${sourceName}-${definition.kind}-${toHouse}`,
        source: sourceName,
        kind: definition.kind,
        label: definition.label,
        fromHouse,
        toHouse,
        toSign: houseSignName(toHouse, ascendantLongitude),
        targetPlanets
      });
    }
  }
  return aspects;
}

// skills/read-vedic-jyotish/scripts/src/jyotish/conjunctions.ts
function tightnessFor(separation) {
  if (separation <= 5) return "tight";
  if (separation <= 10) return "moderate";
  return "wide";
}
function deriveSameSignConjunctions(planets) {
  const sorted = [...planets].sort(
    (first, second) => PLANET_ORDER.indexOf(first.name) - PLANET_ORDER.indexOf(second.name)
  );
  const conjunctions = [];
  for (let firstIndex = 0; firstIndex < sorted.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < sorted.length; secondIndex += 1) {
      const first = sorted[firstIndex];
      const second = sorted[secondIndex];
      if (signIndexOf2(first.longitude) !== signIndexOf2(second.longitude)) {
        continue;
      }
      const angularDistance = angularSeparation(
        first.longitude,
        second.longitude
      );
      conjunctions.push({
        id: `conjunction-${first.name}-${second.name}`,
        planets: [first.name, second.name],
        sign: signNameOf(first.longitude),
        angularSeparation: angularDistance,
        tightness: tightnessFor(angularDistance)
      });
    }
  }
  return conjunctions;
}

// skills/read-vedic-jyotish/scripts/src/jyotish/dignity.ts
function dignityFor(planet, sign) {
  if (!CLASSICAL_PLANETS.includes(planet)) {
    return "unclassified";
  }
  const classicalPlanet = planet;
  if (EXALTATION_SIGNS[classicalPlanet] === sign) return "exalted";
  if (DEBILITATION_SIGNS[classicalPlanet] === sign) return "debilitated";
  if (OWN_SIGNS[classicalPlanet].includes(sign)) return "own";
  return "unclassified";
}
function deriveDignities(planets) {
  return planets.map((planet) => {
    const sign = signNameOf(planet.longitude);
    return {
      planet: planet.name,
      sign,
      signIndex: signIndexOf2(planet.longitude),
      dignity: dignityFor(planet.name, sign)
    };
  });
}

// skills/read-vedic-jyotish/scripts/src/jyotish/house-lords.ts
function deriveHouseLords(ascendantLongitude, planets) {
  const planetByName = new Map(
    planets.map((planet) => [planet.name, planet])
  );
  const ascendantSignIndex = signIndexOf2(ascendantLongitude);
  return Array.from({ length: 12 }, (_, index) => {
    const house = index + 1;
    const houseSign = SIGN_NAMES[(ascendantSignIndex + index) % SIGN_NAMES.length];
    const lord = SIGN_LORDS[houseSign];
    const lordPlanet = planetByName.get(lord);
    if (!lordPlanet) {
      throw new Error(`Missing classical planet required for house lord: ${lord}.`);
    }
    const lordSign = signNameOf(lordPlanet.longitude);
    return {
      house,
      houseSign: houseSignName(house, ascendantLongitude),
      lord,
      lordSign,
      lordHouse: wholeSignHouseOf(
        lordPlanet.longitude,
        ascendantLongitude
      ),
      dignity: dignityFor(lord, lordSign)
    };
  });
}

// skills/read-vedic-jyotish/scripts/src/jyotish/synthesis-copy.ts
function practicalTakeaway(domain, polarity) {
  const takeaways = {
    self: {
      supportive: "Aap initiative lene aur apne decisions ki zimmedari uthane mein comfortable ho sakte hain.",
      challenging: "Andar ki feeling aur bahar ka response kabhi match na kare; bade decisions se pehle thoda rukna aur trusted feedback lena useful rahega.",
      mixed: "Kabhi confidence jaldi aata hai aur feelings baad mein settle hoti hain; apni pace par sochkar decide karna better rahega."
    },
    career: {
      supportive: "Structured roles, zimmedari aur kisi skill mein depth aapke career ko aage le ja sakti hai.",
      challenging: "Workload, boss ya direction ko lekar friction ho sakti hai; role aur priorities pehle se clear rakhein.",
      mixed: "Career progress ho sakti hai, par seedha route zaroori nahi; difficult problems solve karna aur kaam finish karna strength ban sakta hai."
    },
    money: {
      supportive: "Income ko stable skill, regular saving aur long-term planning se zyada support mil sakta hai.",
      challenging: "Cash flow ya risk decisions kabhi uneven ho sakte hain; emergency fund aur spending limits pehle se tay rakhein.",
      mixed: "Kamai ke chances ke saath ups and downs bhi aa sakte hain; bada financial step lene se pehle cash buffer aur worst-case limit clear rakhein."
    },
    relationships: {
      supportive: "Mutual respect, practical understanding aur healthy personal space se partnership stable ho sakti hai.",
      challenging: "Pace, control ya communication par tension ho sakti hai; assumptions ke bajay seedhi baat aur clear boundaries rakhein.",
      mixed: "Connection aur independence dono important ho sakte hain; compatibility ka real test disagreement ke baad ka behavior hoga."
    },
    children: {
      supportive: "Children, mentoring ya creative responsibility mein patience aur steady involvement strength ban sakti hai.",
      challenging: "Expectations ya timing ko force karne ke bajay patience, support aur practical planning ko priority dein.",
      mixed: "Care, creativity aur responsibility ka mix strong ho sakta hai; flexibility aur realistic expectations useful rahengi."
    },
    family: {
      supportive: "Family ke saath dependable communication aur clear responsibilities emotional stability ko support kar sakti hain.",
      challenging: "Family expectations aur personal boundaries takra sakte hain; responsibility ko silently carry karne ke bajay baat clear rakhein.",
      mixed: "Family attachment strong ho sakta hai, par space bhi zaroori rahegi; roles aur expectations ko openly define karna helpful hoga."
    },
    wellbeing: {
      supportive: "Regular sleep, movement aur predictable routine energy ko stable rakhne mein help kar sakte hain.",
      challenging: "Stress ko ignore karna routine ko disturb kar sakta hai; rest aur professional care ko delay na karein.",
      mixed: "Energy phases mein chal sakti hai; demanding periods ke saath recovery time pehle se plan karna useful rahega."
    },
    education: {
      supportive: "Structured learning, good mentors aur repeated practice se skills steadily deepen ho sakti hain.",
      challenging: "Too many directions focus tod sakti hain; ek clear syllabus aur measurable practice schedule rakhein.",
      mixed: "Curiosity strong ho sakti hai, par consistency vary karegi; theory ko practical projects ke saath jodna better rahega."
    },
    property: {
      supportive: "Residence ya property decisions mein patient research aur long-term affordability ko priority dena supportive rahega.",
      challenging: "Emotional urgency ya family pressure mein property decision na lein; documents, debt aur maintenance cost independently verify karein.",
      mixed: "Home base important rahega, par timing straight-line nahi ho sakti; flexibility aur financial buffer rakhein."
    },
    travel: {
      supportive: "Travel, distant networks aur new environments learning aur opportunity ko support kar sakte hain.",
      challenging: "Travel ya relocation ko escape plan na banayein; visa, work, housing aur support system pehle verify karein.",
      mixed: "Foreign connections meaningful ho sakte hain, par permanent settlement automatic nahi; options ko practical milestones se test karein."
    }
  };
  return takeaways[domain][polarity];
}

// skills/read-vedic-jyotish/scripts/src/jyotish/domain-synthesis.ts
function stableSortEvidence(evidence) {
  const kindPriority = {
    dasha: 6,
    "rashi-synthesis": 5,
    "house-lord": 4,
    conjunction: 3,
    aspect: 2,
    yoga: 1
  };
  return [...evidence].sort(
    (first, second) => second.strength - first.strength || kindPriority[second.kind] - kindPriority[first.kind] || first.id.localeCompare(second.id)
  );
}
function isIndependent(first, second) {
  const firstFacts = new Set(first.factIds);
  return second.factIds.every((factId) => !firstFacts.has(factId));
}
function canCorroborate(lead, candidate) {
  if (lead.polarity === "mixed") {
    return candidate.polarity === "mixed";
  }
  return candidate.polarity === lead.polarity || candidate.polarity === "mixed";
}
function countersLead(lead, candidate) {
  if (lead.polarity === "mixed") {
    return candidate.polarity !== "mixed";
  }
  return candidate.polarity !== "mixed" && candidate.polarity !== lead.polarity;
}
function confidenceFor(selected, counter) {
  const considered = [...selected, ...counter];
  if (considered.some((item) => item.stability === "sensitive")) {
    return "low";
  }
  const independentRoots = new Set(
    selected.map((item) => item.factIds[0])
  ).size;
  const allStable = considered.every(
    (item) => item.stability === "stable"
  );
  if (independentRoots >= 2 && counter.length === 0 && allStable && selected.every((item) => item.polarity === "supportive")) {
    return "high";
  }
  return considered.length ? "medium" : "low";
}
function synthesizeDomain(domain, domainEvidence) {
  const ranked = stableSortEvidence(domainEvidence);
  const timeframe = ranked.find((item) => item.kind === "dasha")?.timeframe;
  if (!ranked.length) {
    return {
      domain,
      title: DOMAIN_TITLES[domain],
      quickText: "Is area ke liye clear chart pattern available nahi hai.",
      text: "Is area par clear pattern nahi bana, isliye yahan broad prediction nahi dikhayi gayi.",
      overviewFacts: [],
      tone: "mixed",
      confidence: "low",
      fingerprint: `${domain}:no-evidence`,
      insights: [],
      practicalText: practicalTakeaway(domain, "mixed"),
      limitations: [],
      evidenceIds: [],
      counterEvidenceIds: [],
      omittedCounterEvidenceIds: [],
      omittedCounterEvidenceCount: 0
    };
  }
  const lead = ranked[0];
  const corroboration = ranked.slice(1).find(
    (candidate) => canCorroborate(lead, candidate) && isIndependent(lead, candidate)
  );
  const selected = corroboration ? [lead, corroboration] : [lead];
  const counterCandidates = ranked.filter(
    (candidate) => !selected.includes(candidate) && countersLead(lead, candidate)
  );
  const counter = counterCandidates.slice(0, 1);
  return {
    domain,
    title: DOMAIN_TITLES[domain],
    quickText: practicalTakeaway(domain, lead.polarity),
    text: practicalTakeaway(domain, lead.polarity),
    overviewFacts: [],
    tone: lead.polarity,
    confidence: confidenceFor(selected, counter),
    fingerprint: `${domain}:${selected.map((item) => item.id).join("|")}`,
    insights: [],
    practicalText: practicalTakeaway(domain, lead.polarity),
    limitations: [],
    evidenceIds: selected.map((item) => item.id),
    counterEvidenceIds: counter.map((item) => item.id),
    omittedCounterEvidenceIds: counterCandidates.slice(1).map((item) => item.id),
    omittedCounterEvidenceCount: Math.max(
      0,
      counterCandidates.length - counter.length
    ),
    timeframe
  };
}

// skills/read-vedic-jyotish/scripts/src/jyotish/format.ts
function formatOrdinal(value) {
  const remainder100 = value % 100;
  if (remainder100 >= 11 && remainder100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

// skills/read-vedic-jyotish/scripts/src/jyotish/reading-vocabulary.ts
var SIGN_STYLE = {
  Mesh: "fast action, independence aur direct response",
  Vrishabha: "stability, patience aur practical security",
  Mithuna: "curiosity, communication aur multiple options",
  Karka: "care, emotional safety aur close attachment",
  Simha: "self-expression, pride aur visible ownership",
  Kanya: "detail, usefulness aur continuous improvement",
  Tula: "balance, fairness aur mutual consideration",
  Vrishchika: "depth, privacy aur strong trust boundaries",
  Dhanu: "learning, freedom aur larger purpose",
  Makara: "structure, responsibility aur long-term effort",
  Kumbha: "independence, networks aur unconventional thinking",
  Meena: "empathy, imagination aur intuitive response"
};
var PARTNER_STYLE = {
  Mesh: "independent, decisive aur straightforward",
  Vrishabha: "steady, comfort-conscious aur dependable",
  Mithuna: "talkative, curious aur mentally active",
  Karka: "caring, family-aware aur emotionally responsive",
  Simha: "expressive, proud aur recognition-conscious",
  Kanya: "practical, observant aur improvement-oriented",
  Tula: "social, diplomatic aur fairness-conscious",
  Vrishchika: "private, intense aur loyalty-conscious",
  Dhanu: "open-minded, freedom-loving aur learning-oriented",
  Makara: "responsible, composed aur long-term focused",
  Kumbha: "independent, idea-led aur socially aware",
  Meena: "sensitive, imaginative aur compassionate"
};
var PARENTING_STYLE = {
  Mesh: "initiative aur independence encourage karne wala",
  Vrishabha: "routine, patience aur practical support dene wala",
  Mithuna: "questions, conversation aur variety ko encourage karne wala",
  Karka: "protective, emotionally present aur family-centred",
  Simha: "confidence, creativity aur visibility encourage karne wala",
  Kanya: "skills, routine aur careful guidance par focused",
  Tula: "fairness, manners aur cooperation ko value karne wala",
  Vrishchika: "protective, deeply involved aur trust-conscious",
  Dhanu: "exploration, learning aur independence encourage karne wala",
  Makara: "discipline, responsibility aur long-term progress par focused",
  Kumbha: "individuality, ideas aur social awareness encourage karne wala",
  Meena: "empathetic, imaginative aur emotionally receptive"
};
var LEARNING_STYLE = {
  Mesh: "short experiments aur hands-on challenge",
  Vrishabha: "steady repetition aur practical examples",
  Mithuna: "discussion, comparison aur varied material",
  Karka: "safe environment aur emotionally meaningful examples",
  Simha: "presentation, creation aur visible ownership",
  Kanya: "structured notes, detail aur repeated correction",
  Tula: "dialogue, examples aur balanced viewpoints",
  Vrishchika: "deep research aur difficult subjects",
  Dhanu: "big-picture frameworks aur real-world exploration",
  Makara: "clear syllabus, milestones aur disciplined practice",
  Kumbha: "systems, communities aur unconventional sources",
  Meena: "visual material, stories aur intuitive association"
};
var HOUSE_CHANNEL = {
  1: "self-development, personal decisions aur direct initiative",
  2: "family, speech, savings aur accumulated resources",
  3: "communication, local movement, siblings aur self-effort",
  4: "home, education, property aur emotional foundation",
  5: "study, creativity, children aur mentoring",
  6: "daily work, service, routines aur practical problem-solving",
  7: "partnerships, clients aur one-to-one connections",
  8: "shared resources, research, privacy aur major transitions",
  9: "higher learning, mentors, belief systems aur long journeys",
  10: "career, public responsibility aur visible contribution",
  11: "income, networks, teams aur long-term goals",
  12: "foreign environments, rest, expenses aur work behind the scenes"
};
var PLANET_THEME = {
  Surya: "ownership, confidence aur visibility",
  Chandra: "emotional response, care aur daily comfort",
  Budh: "analysis, language aur adaptability",
  Shukra: "attraction, cooperation aur quality of life",
  Mangal: "initiative, competition aur decisive action",
  Guru: "guidance, growth aur long-term judgement",
  Shani: "discipline, delay tolerance aur responsibility"
};
function dignityContext(dignity) {
  if (dignity === "exalted") {
    return "uccha mani gayi hai aur clear expression ko support karti hai";
  }
  if (dignity === "own") {
    return "apne sign mein hai aur stable expression ko support karti hai";
  }
  if (dignity === "debilitated") {
    return "neecha mani gayi hai, isliye extra practice aur realistic pacing maang sakti hai";
  }
  return "neutral mani gayi hai; outcome ko placement aur connections ke saath dekhna chahiye";
}

// skills/read-vedic-jyotish/scripts/src/jyotish/reading-context.ts
function requirePlanet(input, name) {
  const planet = input.planets.find((candidate) => candidate.name === name);
  if (!planet) throw new Error(`Missing ${name} for personalized reading.`);
  return planet;
}
function planetPlacement(input, name) {
  const planet = requirePlanet(input, name);
  const sign = signNameOf(planet.longitude);
  const house = wholeSignHouseOf(
    planet.longitude,
    input.ascendantLongitude
  );
  const dignity = input.dignities.find((item) => item.planet === name)?.dignity ?? "unclassified";
  return {
    name,
    sign,
    house,
    dignity
  };
}
function houseLord(input, house) {
  const placement = input.houseLords.find((item) => item.house === house);
  if (!placement) {
    throw new Error(`Missing ${house}th-house lord for personalized reading.`);
  }
  return placement;
}
function dignityLabel(dignity) {
  if (dignity === "exalted") return "uccha";
  if (dignity === "own") return "own sign";
  if (dignity === "debilitated") return "neecha";
  return "neutral";
}
function ascendantFact(sign) {
  return {
    id: `ascendant-sign-${sign}`,
    label: `Lagna sign: ${sign}`
  };
}
function houseSignFact(house, sign) {
  return {
    id: `house-${house}-sign-${sign}`,
    label: `H${house} sign: ${sign}`
  };
}
function lordPlacementFacts(placement) {
  return [
    {
      id: `house-${placement.house}-lord-${placement.lord}`,
      label: `H${placement.house} lord: ${placement.lord}`
    },
    {
      id: `planet-${placement.lord}-${placement.lordSign}-${placement.lordHouse}`,
      label: `${placement.lord}: ${placement.lordSign}, H${placement.lordHouse}`
    }
  ];
}
function lordDignityFact(placement) {
  return {
    id: `planet-${placement.lord}-dignity-${placement.dignity}`,
    label: `${placement.lord} dignity: ${dignityLabel(placement.dignity)}`
  };
}
function planetPositionFact(placement) {
  return {
    id: `planet-${placement.name}-${placement.sign}-${placement.house}`,
    label: `${placement.name}: ${placement.sign}, H${placement.house}`
  };
}
function planetDignityFact(placement) {
  return {
    id: `planet-${placement.name}-dignity-${placement.dignity}`,
    label: `${placement.name} dignity: ${dignityLabel(placement.dignity)}`
  };
}
function houseActivators(input, houses) {
  const houseSet = new Set(houses);
  const occupants = input.planets.filter(
    (planet) => houseSet.has(
      wholeSignHouseOf(planet.longitude, input.ascendantLongitude)
    )
  );
  const matchingAspects = input.aspects.filter(
    (aspect) => houseSet.has(aspect.toHouse)
  );
  const aspectSources = [
    ...new Set(matchingAspects.map((aspect) => aspect.source))
  ];
  if (occupants.length > 0) {
    return {
      text: `${occupants.map((planet) => planet.name).join(", ")} relevant houses mein directly placed hain, isliye yeh topic background theme ke bajay visibly repeat ho sakta hai.`,
      facts: occupants.map(
        (planet) => planetPositionFact(
          planetPlacement(input, planet.name)
        )
      )
    };
  }
  if (aspectSources.length > 0) {
    return {
      text: `${aspectSources.join(", ")} ki graha drishti is topic ko activate karti hai, isliye response effort aur timing ke saath change ho sakta hai.`,
      facts: matchingAspects.map((aspect) => ({
        id: aspect.id,
        label: `${aspect.source}: ${aspect.label} drishti to H${aspect.toHouse}`
      }))
    };
  }
  return {
    text: "Relevant house empty hone par bhi topic absent nahi hota. Is reading mein house lord ki placement main signal hai.",
    facts: lordPlacementFacts(houseLord(input, houses[0]))
  };
}
function insight(label, text, facts) {
  return {
    label,
    text,
    facts: [
      ...new Map(facts.map((fact) => [fact.id, fact])).values()
    ]
  };
}
function fingerprint(domain, parts) {
  return `${domain}:${parts.join("|")}`;
}
function placementKey(placement) {
  if ("lord" in placement) {
    return `${placement.house}L-${placement.lord}-${placement.lordSign}-H${placement.lordHouse}-${placement.dignity}`;
  }
  return `${placement.name}-${placement.sign}-H${placement.house}-${placement.dignity}`;
}

// skills/read-vedic-jyotish/scripts/src/jyotish/personalized-reading-core.ts
function selfReading(base, input) {
  const lagnaSign = signNameOf(input.ascendantLongitude);
  const lagnaLord = houseLord(input, 1);
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [1, 3, 8]);
  return {
    quickText: `${lagnaSign} Lagna ke saath life direction ${HOUSE_CHANNEL[lagnaLord.lordHouse]} se strongly linked dikh rahi hai.`,
    text: `${lagnaSign} Lagna aapki visible approach mein ${SIGN_STYLE[lagnaSign]} ko foreground karta hai. Lagna lord ${lagnaLord.lord} ${lagnaLord.lordSign} ke H${lagnaLord.lordHouse} mein hai, isliye identity aur major decisions ka connection ${HOUSE_CHANNEL[lagnaLord.lordHouse]} se ban sakta hai.`,
    overviewFacts: [
      ascendantFact(lagnaSign),
      ...lordPlacementFacts(lagnaLord)
    ],
    fingerprint: fingerprint("self", [
      lagnaSign,
      placementKey(lagnaLord),
      placementKey(moon)
    ]),
    insights: [
      insight(
        "Inner response",
        `Chandra ${moon.sign} ke H${moon.house} mein hai. Emotions aur visible style ${moon.sign === lagnaSign ? "relatively aligned" : "alag pace par"} kaam kar sakte hain.`,
        [
          ascendantFact(lagnaSign),
          planetPositionFact(moon)
        ]
      ),
      insight(
        "Core capacity",
        `${lagnaLord.lord} ki traditional dignity ${dignityContext(lagnaLord.dignity)}.`,
        [
          ...lordPlacementFacts(lagnaLord),
          lordDignityFact(lagnaLord)
        ]
      ),
      insight("Repeated pattern", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("self", base.tone),
    limitations: []
  };
}
function careerReading(base, input) {
  const tenth = houseLord(input, 10);
  const sixth = houseLord(input, 6);
  const saturn = planetPlacement(input, "Shani");
  const tenthSign = houseSignName(10, input.ascendantLongitude);
  const activators = houseActivators(input, [6, 10]);
  return {
    quickText: `10th lord ${tenth.lord} H${tenth.lordHouse} mein hai, isliye career route ${HOUSE_CHANNEL[tenth.lordHouse]} se grow kar sakta hai.`,
    text: `10th house ka ${tenthSign} sign work mein ${SIGN_STYLE[tenthSign]} ko value karta hai. Iska lord ${tenth.lord} H${tenth.lordHouse} mein hai, isliye career ki visible direction ${HOUSE_CHANNEL[tenth.lordHouse]} se jud sakti hai.`,
    overviewFacts: [
      houseSignFact(10, tenthSign),
      ...lordPlacementFacts(tenth)
    ],
    fingerprint: fingerprint("career", [
      placementKey(tenth),
      placementKey(sixth),
      placementKey(saturn)
    ]),
    insights: [
      insight(
        "Daily work pattern",
        `6th lord ${sixth.lord} H${sixth.lordHouse} mein hai. Routine work, service aur problem-solving ka link ${HOUSE_CHANNEL[sixth.lordHouse]} se banta hai.`,
        lordPlacementFacts(sixth)
      ),
      insight(
        "Responsibility style",
        `Shani ${saturn.sign} ke H${saturn.house} mein ${PLANET_THEME.Shani} ko career decisions ke saath jodta hai.`,
        [planetPositionFact(saturn)]
      ),
      insight("Direct activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("career", base.tone),
    limitations: [
      "Exact profession, promotion date ya salary Rashi chart se guarantee nahi ki jaati."
    ]
  };
}
function moneyReading(base, input) {
  const second = houseLord(input, 2);
  const eleventh = houseLord(input, 11);
  const jupiter = planetPlacement(input, "Guru");
  const activators = houseActivators(input, [2, 11]);
  return {
    quickText: "Savings ke 2nd lord aur gains ke 11th lord aapke money pattern ko do alag channels se shape karte hain.",
    text: `2nd lord ${second.lord} H${second.lordHouse} mein hai, jo savings aur family resources ko ${HOUSE_CHANNEL[second.lordHouse]} se jodta hai. 11th lord ${eleventh.lord} H${eleventh.lordHouse} mein hone se income aur gains ka route ${HOUSE_CHANNEL[eleventh.lordHouse]} ki taraf ja sakta hai.`,
    overviewFacts: [
      ...lordPlacementFacts(second),
      ...lordPlacementFacts(eleventh)
    ],
    fingerprint: fingerprint("money", [
      placementKey(second),
      placementKey(eleventh),
      placementKey(jupiter)
    ]),
    insights: [
      insight(
        "Savings pattern",
        `${second.lord} ki traditional dignity ${dignityContext(second.dignity)}. Saving decisions mein isi capacity ka disciplined use important rahega.`,
        [
          ...lordPlacementFacts(second),
          lordDignityFact(second)
        ]
      ),
      insight(
        "Financial judgement",
        `Guru ${jupiter.sign} ke H${jupiter.house} mein hai. Long-term judgement aur expansion ko ${HOUSE_CHANNEL[jupiter.house]} ke context mein test karna better rahega.`,
        [planetPositionFact(jupiter)]
      ),
      insight("Direct activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("money", base.tone),
    limitations: [
      "Income amount, investment return ya guaranteed wealth predict nahi ki jaati."
    ]
  };
}
function relationshipReading(base, input) {
  const seventh = houseLord(input, 7);
  const seventhSign = houseSignName(7, input.ascendantLongitude);
  const venus = planetPlacement(input, "Shukra");
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [7]);
  return {
    quickText: `${seventhSign} 7th house aur ${seventh.lord} ki H${seventh.lordHouse} placement partnership ka main pattern banate hain.`,
    text: `7th house ${seventhSign} mein hai, isliye traditional spouse symbolism ${PARTNER_STYLE[seventhSign]} qualities ko prefer kar sakta hai. 7th lord ${seventh.lord} H${seventh.lordHouse} mein hai, jo committed partnership ko ${HOUSE_CHANNEL[seventh.lordHouse]} se connect karta hai.`,
    overviewFacts: [
      houseSignFact(7, seventhSign),
      ...lordPlacementFacts(seventh)
    ],
    fingerprint: fingerprint("relationships", [
      seventhSign,
      placementKey(seventh),
      placementKey(venus),
      placementKey(moon)
    ]),
    insights: [
      insight(
        "Meeting context",
        `7th lord H${seventh.lordHouse} mein hone se meeting ya relationship development ${HOUSE_CHANNEL[seventh.lordHouse]} ke environment se linked ho sakta hai.`,
        lordPlacementFacts(seventh)
      ),
      insight(
        "Attraction aur bonding",
        `Shukra ${venus.sign} ke H${venus.house} mein hai. Attraction, cooperation aur shared comfort ka link ${HOUSE_CHANNEL[venus.house]} se ban sakta hai.`,
        [planetPositionFact(venus)]
      ),
      insight(
        "Emotional rhythm",
        `Chandra ${moon.sign} ke H${moon.house} mein hai. Partnership mein emotional safety aur response ka context ${HOUSE_CHANNEL[moon.house]} se ban sakta hai.`,
        [planetPositionFact(moon)]
      ),
      insight("Relationship activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("relationships", base.tone),
    limitations: [
      "Yeh Rashi-level reading hai. Exact appearance, profession, culture, marriage count, divorce ya legal outcome assess nahi kiya gaya."
    ]
  };
}
function childrenReading(base, input) {
  const fifth = houseLord(input, 5);
  const fifthSign = houseSignName(5, input.ascendantLongitude);
  const jupiter = planetPlacement(input, "Guru");
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [5]);
  return {
    quickText: `5th house ka ${fifthSign} sign aur 5th lord ${fifth.lord} children, mentoring aur creativity ka base pattern dikhate hain.`,
    text: `5th house ${fifthSign} mein hai, isliye parenting, mentoring ya creative responsibility mein ${PARENTING_STYLE[fifthSign]} approach aa sakta hai. 5th lord ${fifth.lord} H${fifth.lordHouse} mein hai, jo is area ko ${HOUSE_CHANNEL[fifth.lordHouse]} se connect karta hai.`,
    overviewFacts: [
      houseSignFact(5, fifthSign),
      ...lordPlacementFacts(fifth)
    ],
    fingerprint: fingerprint("children", [
      fifthSign,
      placementKey(fifth),
      placementKey(jupiter),
      placementKey(moon)
    ]),
    insights: [
      insight(
        "Emotional care",
        `Chandra ${moon.sign} ke H${moon.house} mein hai. Care aur emotional availability ka context ${HOUSE_CHANNEL[moon.house]} se ban sakta hai.`,
        [planetPositionFact(moon)]
      ),
      insight(
        "Guidance capacity",
        `Guru ${jupiter.sign} ke H${jupiter.house} mein ${PLANET_THEME.Guru} ko ${HOUSE_CHANNEL[jupiter.house]} se jodta hai. Iski traditional dignity ${dignityContext(jupiter.dignity)}.`,
        [
          planetPositionFact(jupiter),
          planetDignityFact(jupiter)
        ]
      ),
      insight("Direct activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("children", base.tone),
    limitations: [
      "Exact child count, gender, fertility status ya pregnancy timing is Rashi-only report se assess nahi ki jaati."
    ]
  };
}
var CORE_READING_BUILDERS = {
  self: selfReading,
  career: careerReading,
  money: moneyReading,
  relationships: relationshipReading,
  children: childrenReading
};

// skills/read-vedic-jyotish/scripts/src/jyotish/personalized-reading-life.ts
function familyReading(base, input) {
  const second = houseLord(input, 2);
  const fourth = houseLord(input, 4);
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [2, 4]);
  return {
    quickText: "2nd aur 4th house lords family expectations aur emotional home base ko alag layers mein dikhate hain.",
    text: `2nd lord ${second.lord} H${second.lordHouse} mein hai, isliye family, speech aur shared resources ${HOUSE_CHANNEL[second.lordHouse]} se linked hain. 4th lord ${fourth.lord} H${fourth.lordHouse} mein hone se inner security aur home base ${HOUSE_CHANNEL[fourth.lordHouse]} se shape ho sakte hain.`,
    overviewFacts: [
      ...lordPlacementFacts(second),
      ...lordPlacementFacts(fourth)
    ],
    fingerprint: fingerprint("family", [
      placementKey(second),
      placementKey(fourth),
      placementKey(moon)
    ]),
    insights: [
      insight(
        "Family role",
        `2nd lord ${second.lord} ki traditional dignity ${dignityContext(second.dignity)}. Speech aur financial boundaries family dynamics mein important rahengi.`,
        [
          ...lordPlacementFacts(second),
          lordDignityFact(second)
        ]
      ),
      insight(
        "Emotional home",
        `Chandra ${moon.sign} ke H${moon.house} mein hai, isliye comfort aur care ka link ${HOUSE_CHANNEL[moon.house]} se banta hai.`,
        [planetPositionFact(moon)]
      ),
      insight("Direct activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("family", base.tone),
    limitations: []
  };
}
function wellbeingReading(base, input) {
  const first = houseLord(input, 1);
  const sixth = houseLord(input, 6);
  const eighth = houseLord(input, 8);
  const twelfth = houseLord(input, 12);
  const sun = planetPlacement(input, "Surya");
  return {
    quickText: "Lagna lord, 6th lord aur 12th lord routine, workload aur recovery ka combined wellbeing pattern dikhate hain.",
    text: `Lagna lord ${first.lord} H${first.lordHouse} mein vitality ko ${HOUSE_CHANNEL[first.lordHouse]} se jodta hai. 6th lord daily routine, 8th lord recovery aur 12th lord rest ke patterns ko alag layers mein dikhate hain.`,
    overviewFacts: [
      ...lordPlacementFacts(first),
      ...lordPlacementFacts(sixth),
      ...lordPlacementFacts(eighth),
      ...lordPlacementFacts(twelfth)
    ],
    fingerprint: fingerprint("wellbeing", [
      placementKey(first),
      placementKey(sixth),
      placementKey(eighth),
      placementKey(twelfth),
      placementKey(sun)
    ]),
    insights: [
      insight(
        "Energy management",
        `Surya ${sun.sign} ke H${sun.house} mein ${PLANET_THEME.Surya} ko ${HOUSE_CHANNEL[sun.house]} se jodta hai.`,
        [planetPositionFact(sun)]
      ),
      insight(
        "Routine pressure",
        `6th lord ${sixth.lord} ki traditional dignity ${dignityContext(sixth.dignity)}. Workload aur daily habits ko isi hisaab se pace karna useful rahega.`,
        [
          ...lordPlacementFacts(sixth),
          lordDignityFact(sixth)
        ]
      ),
      insight(
        "Recovery pattern",
        `8th lord ${eighth.lord} H${eighth.lordHouse} mein hai. Change, recovery aur difficult phases ko process karne ka context ${HOUSE_CHANNEL[eighth.lordHouse]} se ban sakta hai.`,
        lordPlacementFacts(eighth)
      ),
      insight(
        "Rest aur recovery",
        `12th lord ${twelfth.lord} H${twelfth.lordHouse} mein hai, isliye sleep, rest aur decompression ka link ${HOUSE_CHANNEL[twelfth.lordHouse]} se banta hai.`,
        lordPlacementFacts(twelfth)
      )
    ],
    practicalText: practicalTakeaway("wellbeing", base.tone),
    limitations: [
      "Yeh medical diagnosis, treatment advice ya lifespan assessment nahi hai. Symptoms ke liye qualified professional se baat karein."
    ]
  };
}
function educationReading(base, input) {
  const fourth = houseLord(input, 4);
  const fifth = houseLord(input, 5);
  const ninth = houseLord(input, 9);
  const mercury = planetPlacement(input, "Budh");
  const fifthSign = houseSignName(5, input.ascendantLongitude);
  const activators = houseActivators(input, [4, 5, 9]);
  return {
    quickText: "Budh aur 4th, 5th, 9th lords learning style, skill practice aur higher study ko separate layers mein dikhate hain.",
    text: `5th house ka ${fifthSign} sign learning mein ${LEARNING_STYLE[fifthSign]} ko support karta hai. 9th lord ${ninth.lord} H${ninth.lordHouse} mein hone se higher study, mentors aur worldview ${HOUSE_CHANNEL[ninth.lordHouse]} se develop ho sakte hain.`,
    overviewFacts: [
      houseSignFact(5, fifthSign),
      ...lordPlacementFacts(ninth)
    ],
    fingerprint: fingerprint("education", [
      placementKey(fourth),
      placementKey(fifth),
      placementKey(ninth),
      placementKey(mercury)
    ]),
    insights: [
      insight(
        "Foundation",
        `4th lord ${fourth.lord} H${fourth.lordHouse} mein hai, isliye foundational education aur study environment ${HOUSE_CHANNEL[fourth.lordHouse]} se linked hain.`,
        lordPlacementFacts(fourth)
      ),
      insight(
        "Skills aur communication",
        `Budh ${mercury.sign} ke H${mercury.house} mein ${PLANET_THEME.Budh} ko ${HOUSE_CHANNEL[mercury.house]} se jodta hai.`,
        [planetPositionFact(mercury)]
      ),
      insight("Direct activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("education", base.tone),
    limitations: [
      "Exact degree, admission result ya academic rank predict nahi ki jaati."
    ]
  };
}
function propertyReading(base, input) {
  const fourth = houseLord(input, 4);
  const fourthSign = houseSignName(4, input.ascendantLongitude);
  const mars = planetPlacement(input, "Mangal");
  const venus = planetPlacement(input, "Shukra");
  const activators = houseActivators(input, [4]);
  return {
    quickText: `4th lord ${fourth.lord} H${fourth.lordHouse} mein residence aur property decisions ko ${HOUSE_CHANNEL[fourth.lordHouse]} se jodta hai.`,
    text: `4th house ${fourthSign} mein hai, isliye residence aur emotional security mein ${SIGN_STYLE[fourthSign]} important ho sakta hai. 4th lord ${fourth.lord} H${fourth.lordHouse} mein hone se property, home base aur vehicles ka attention ${HOUSE_CHANNEL[fourth.lordHouse]} se linked ho sakta hai.`,
    overviewFacts: [
      houseSignFact(4, fourthSign),
      ...lordPlacementFacts(fourth)
    ],
    fingerprint: fingerprint("property", [
      fourthSign,
      placementKey(fourth),
      placementKey(mars),
      placementKey(venus)
    ]),
    insights: [
      insight(
        "Decision style",
        `Mangal ${mars.sign} ke H${mars.house} mein action aur land-related initiative ko ${HOUSE_CHANNEL[mars.house]} se jodta hai.`,
        [planetPositionFact(mars)]
      ),
      insight(
        "Comfort aur vehicles",
        `Shukra ${venus.sign} ke H${venus.house} mein comfort, aesthetics aur quality decisions ko ${HOUSE_CHANNEL[venus.house]} se connect karta hai.`,
        [planetPositionFact(venus)]
      ),
      insight("Direct activators", activators.text, activators.facts)
    ],
    practicalText: practicalTakeaway("property", base.tone),
    limitations: [
      "Purchase date, inheritance ya ownership guarantee nahi ki jaati. Legal aur financial checks separately karein."
    ]
  };
}
function travelReading(base, input) {
  const third = houseLord(input, 3);
  const ninth = houseLord(input, 9);
  const twelfth = houseLord(input, 12);
  const rahu = planetPlacement(input, "Rahu");
  const hasLordLink = ninth.lordHouse === 12 || twelfth.lordHouse === 9;
  const hasRahuLink = [9, 12].includes(rahu.house);
  const foreignSignals = Number(hasLordLink) + Number(hasRahuLink);
  const foreignTone = foreignSignals >= 2 ? "multiple Rashi-level indicators foreign exposure ko support karte hain; permanent settlement phir bhi establish nahi hota" : foreignSignals === 1 ? "ek Rashi-level indicator foreign exposure ko support karta hai; settlement automatic nahi" : "is limited Rashi rule set mein strong relocation emphasis establish nahi hota";
  return {
    quickText: "3rd, 9th aur 12th lords short travel, long journeys aur foreign residence ko alag patterns mein dikhate hain.",
    text: `3rd lord ${third.lord} H${third.lordHouse} mein local movement ko ${HOUSE_CHANNEL[third.lordHouse]} se jodta hai. 9th lord ${ninth.lord} H${ninth.lordHouse} aur 12th lord ${twelfth.lord} H${twelfth.lordHouse} mein hone se ${foreignTone}.`,
    overviewFacts: [
      ...lordPlacementFacts(third),
      ...lordPlacementFacts(ninth),
      ...lordPlacementFacts(twelfth),
      planetPositionFact(rahu)
    ],
    fingerprint: fingerprint("travel", [
      placementKey(third),
      placementKey(ninth),
      placementKey(twelfth),
      placementKey(rahu),
      foreignSignals
    ]),
    insights: [
      insight(
        "Short movement",
        `3rd lord H${third.lordHouse} mein hai, isliye frequent movement, communication ya nearby travel ${HOUSE_CHANNEL[third.lordHouse]} se linked ho sakte hain.`,
        lordPlacementFacts(third)
      ),
      insight(
        "Long journeys",
        `9th lord ${ninth.lord} H${ninth.lordHouse} mein higher learning aur long-distance travel ko ${HOUSE_CHANNEL[ninth.lordHouse]} se connect karta hai.`,
        lordPlacementFacts(ninth)
      ),
      insight(
        "Foreign environment",
        `12th lord ${twelfth.lord} H${twelfth.lordHouse} mein hai aur Rahu ${rahu.sign} ke H${rahu.house} mein hai. Dono ko saath dekhne par ${foreignTone}.`,
        [
          ...lordPlacementFacts(ninth),
          ...lordPlacementFacts(twelfth),
          planetPositionFact(rahu)
        ]
      )
    ],
    practicalText: practicalTakeaway("travel", base.tone),
    limitations: [
      "Foreign settlement, visa approval ya specific country guarantee nahi ki jaati."
    ]
  };
}
var LIFE_READING_BUILDERS = {
  family: familyReading,
  wellbeing: wellbeingReading,
  education: educationReading,
  property: propertyReading,
  travel: travelReading
};

// skills/read-vedic-jyotish/scripts/src/jyotish/personalized-reading.ts
var BUILDERS = {
  ...CORE_READING_BUILDERS,
  ...LIFE_READING_BUILDERS
};
function personalizeDomain(base, input) {
  const builder = BUILDERS[base.domain];
  if (!builder) {
    throw new Error(`Missing personalized reading builder: ${base.domain}.`);
  }
  return {
    ...base,
    ...builder(base, input)
  };
}

// skills/read-vedic-jyotish/scripts/src/jyotish/rashi-synthesis.ts
var lagnaVoice = {
  Mesh: "Visible approach direct aur action-led ho sakta hai.",
  Vrishabha: "Visible approach stability aur practical proof ko value kar sakta hai.",
  Mithuna: "Visible approach curious, verbal aur adaptable ho sakta hai.",
  Karka: "Visible approach protective aur environment-sensitive ho sakta hai.",
  Simha: "Visible approach expressive, confident aur ownership-led ho sakta hai.",
  Kanya: "Visible approach detail, craft aur improvement par focus kar sakta hai.",
  Tula: "Visible approach balance, fairness aur relationship awareness ko value kar sakta hai.",
  Vrishchika: "Visible approach private, focused aur trust-conscious ho sakta hai.",
  Dhanu: "Visible approach learning, freedom aur principles se guided ho sakta hai.",
  Makara: "Visible approach structured, responsible aur long-term ho sakta hai.",
  Kumbha: "Visible approach independent, systems-oriented aur unconventional ho sakta hai.",
  Meena: "Visible approach imaginative, empathetic aur intuitive ho sakta hai."
};
function deriveRashiSynthesisEvidence({
  ascendantLongitude,
  planets,
  stability
}) {
  const moon = planets.find((planet) => planet.name === "Chandra");
  if (!moon) {
    throw new Error("Chandra is required for Lagna-Chandra synthesis.");
  }
  const ascendantSign = signNameOf(ascendantLongitude);
  const moonSign = signNameOf(moon.longitude);
  const aligned = ascendantSign === moonSign;
  const hasSensitiveInput = stability.ascendant === "sensitive" || stability.moonRashi === "sensitive";
  const hasUnknownInput = stability.ascendant === "unknown" || stability.moonRashi === "unknown";
  return {
    id: `evidence-rashi-${ascendantSign}-${moonSign}-self`,
    label: "Lagna-Chandra synthesis",
    kind: "rashi-synthesis",
    domain: "self",
    polarity: "mixed",
    strength: 2,
    summary: aligned ? `${lagnaVoice[ascendantSign]} Chandra bhi ${moonSign} mein hai, isliye inner response aur visible approach ko relatively aligned read kiya jata hai.` : `${lagnaVoice[ascendantSign]} Chandra ${moonSign} mein hai, isliye inner response aur visible approach mein contrast ho sakta hai.`,
    factIds: [
      `ascendant-sign-${ascendantSign}`,
      "planet-Chandra",
      `moon-sign-${moonSign}`
    ],
    stability: hasSensitiveInput ? "sensitive" : hasUnknownInput ? "unknown" : "stable"
  };
}

// skills/read-vedic-jyotish/scripts/src/jyotish/synthesis.ts
var allDomains = Object.keys(DOMAIN_HOUSES);
function domainsForHouses(houses) {
  const houseSet = new Set(houses);
  return allDomains.filter(
    (domain) => DOMAIN_HOUSES[domain].some((house) => houseSet.has(house))
  );
}
function polarityForDignities(dignities) {
  const hasSupport = dignities.some(
    (dignity) => dignity === "own" || dignity === "exalted"
  );
  const hasChallenge = dignities.includes("debilitated");
  if (hasSupport && hasChallenge) return "mixed";
  if (hasChallenge) return "challenging";
  if (dignities.length > 0 && dignities.every(
    (dignity) => dignity === "own" || dignity === "exalted"
  )) {
    return "supportive";
  }
  return "mixed";
}
function dignityPhrase(dignity) {
  switch (dignity) {
    case "exalted":
      return "uchcha dignity ke saath";
    case "own":
      return "own-sign dignity ke saath";
    case "debilitated":
      return "neecha dignity ke saath";
    default:
      return "bina kisi special dignity tag ke";
  }
}
function dignityStrength(dignity) {
  if (dignity === "exalted" || dignity === "debilitated") return 3;
  if (dignity === "own") return 2;
  return 1;
}
function evidenceForHouseLords(input) {
  const evidence = [];
  for (const placement of input.houseLords) {
    for (const domain of domainsForHouses([placement.house])) {
      evidence.push({
        id: `evidence-house-${placement.house}-${domain}`,
        label: "Rashi house-lord placement",
        kind: "house-lord",
        domain,
        polarity: polarityForDignities([placement.dignity]),
        strength: dignityStrength(placement.dignity),
        summary: `${formatOrdinal(placement.house)} house ka lord ${placement.lord} ${formatOrdinal(placement.lordHouse)} house ke ${placement.lordSign} sign mein ${dignityPhrase(placement.dignity)} placed hai.`,
        factIds: [
          `planet-${placement.lord}`,
          `house-${placement.house}-lord-${placement.lord}`,
          `planet-${placement.lord}-${placement.lordSign}-${placement.lordHouse}`
        ],
        stability: input.stability.ascendant
      });
    }
  }
  return evidence;
}
function evidenceForConjunctions(input) {
  const dignityByPlanet = new Map(
    input.dignities.map((record) => [record.planet, record.dignity])
  );
  const planetByName = new Map(
    input.planets.map((planet) => [planet.name, planet])
  );
  const evidence = [];
  for (const conjunction of input.conjunctions) {
    const activatedHouses = /* @__PURE__ */ new Set();
    for (const participant of conjunction.planets) {
      const planet = planetByName.get(participant);
      if (planet) {
        activatedHouses.add(
          wholeSignHouseOf(planet.longitude, input.ascendantLongitude)
        );
      }
      input.houseLords.filter((placement) => placement.lord === participant).forEach((placement) => activatedHouses.add(placement.house));
    }
    const participantDignities = conjunction.planets.map(
      (planet) => dignityByPlanet.get(planet) ?? "unclassified"
    );
    const strength = conjunction.tightness === "tight" ? 3 : conjunction.tightness === "moderate" ? 2 : 1;
    for (const domain of domainsForHouses(activatedHouses)) {
      evidence.push({
        id: `evidence-${conjunction.id}-${domain}`,
        label: "Same-sign conjunction",
        kind: "conjunction",
        domain,
        polarity: polarityForDignities(participantDignities),
        strength,
        summary: `${conjunction.planets.join(" aur ")} ${conjunction.sign} mein ${conjunction.angularSeparation.toFixed(1)}\xB0 separation ke saath ${conjunction.tightness} conjunction banate hain.`,
        factIds: [
          ...conjunction.planets.map((planet) => `planet-${planet}`),
          conjunction.id
        ],
        stability: input.stability.ascendant
      });
    }
  }
  return evidence;
}
function evidenceForAspects(input) {
  const dignityByPlanet = new Map(
    input.dignities.map((record) => [record.planet, record.dignity])
  );
  const evidence = [];
  for (const aspect of input.aspects) {
    for (const domain of domainsForHouses([aspect.toHouse])) {
      const dignity = dignityByPlanet.get(aspect.source) ?? "unclassified";
      evidence.push({
        id: `evidence-${aspect.id}-${domain}`,
        label: "Classical graha drishti",
        kind: "aspect",
        domain,
        polarity: polarityForDignities([dignity]),
        strength: dignityStrength(dignity),
        summary: `${aspect.source} ${aspect.label} drishti se ${formatOrdinal(aspect.toHouse)} house (${aspect.toSign}) ko activate karta hai.`,
        factIds: [
          `planet-${aspect.source}`,
          aspect.id,
          `planet-${aspect.source}-dignity-${dignity}`
        ],
        stability: input.stability.ascendant
      });
    }
  }
  return evidence;
}
function evidenceForYogas(input) {
  return input.yogas.flatMap(
    (yoga) => yoga.domains.map((domain) => ({
      id: `evidence-${yoga.id}-${domain}`,
      label: "Selected yoga rule",
      kind: "yoga",
      domain,
      polarity: yoga.ruleId === "parivartana" || yoga.ruleId === "chandra-mangala" ? "mixed" : "supportive",
      strength: yoga.ruleId === "pancha-mahapurusha" || yoga.ruleId === "gaja-kesari" ? 3 : 2,
      summary: yoga.summary,
      factIds: [
        ...yoga.participants.map((planet) => `planet-${planet}`),
        yoga.id
      ],
      stability: yoga.participants.includes("Chandra") ? input.stability.moonRashi : yoga.ruleId === "pancha-mahapurusha" ? input.stability.ascendant : "stable"
    }))
  );
}
function activationForDasha(input, mahadashaLord, antardashaLord) {
  const activeLords = [mahadashaLord, antardashaLord];
  const activatedHouses = /* @__PURE__ */ new Set();
  const planetByName = new Map(
    input.planets.map((planet) => [planet.name, planet])
  );
  const dignityByPlanet = new Map(
    input.dignities.map((record) => [record.planet, record.dignity])
  );
  for (const lord of activeLords) {
    const planet = planetByName.get(lord);
    if (planet) {
      activatedHouses.add(
        wholeSignHouseOf(planet.longitude, input.ascendantLongitude)
      );
    }
    input.houseLords.filter((placement) => placement.lord === lord).forEach((placement) => activatedHouses.add(placement.house));
  }
  const polarity = polarityForDignities(
    activeLords.map(
      (lord) => dignityByPlanet.get(lord) ?? "unclassified"
    )
  );
  return {
    mahadashaLord,
    antardashaLord,
    domains: domainsForHouses(activatedHouses),
    polarity
  };
}
function dashaThemesFor(input) {
  const { currentMahadasha, currentAntardasha, nextAntardasha } = input.vimshottari;
  const current = activationForDasha(
    input,
    currentMahadasha.lord,
    currentAntardasha.lord
  );
  if (!nextAntardasha) {
    return { current, nextAntardasha: null };
  }
  const nextMahadasha = input.vimshottari.mahadashas.find(
    (period) => period.antardashas.includes(nextAntardasha)
  );
  if (!nextMahadasha) {
    throw new Error("Next Antardasha is not attached to a Mahadasha.");
  }
  return {
    current,
    nextAntardasha: activationForDasha(
      input,
      nextMahadasha.lord,
      nextAntardasha.lord
    )
  };
}
function evidenceForCurrentDasha(input, activation) {
  const { currentMahadasha, currentAntardasha } = input.vimshottari;
  const timeframe = {
    start: new Date(currentAntardasha.start),
    end: new Date(currentAntardasha.end)
  };
  return activation.domains.map(
    (domain) => ({
      id: `evidence-dasha-${currentMahadasha.lord}-${currentAntardasha.lord}-${domain}`,
      label: "Vimshottari timing interpretation",
      kind: "dasha",
      domain,
      polarity: activation.polarity,
      strength: 3,
      summary: `${currentMahadasha.lord} Mahadasha aur ${currentAntardasha.lord} Antardasha ke lords is area se jude houses ko foreground mein la sakte hain.`,
      factIds: [
        `planet-${currentMahadasha.lord}`,
        `planet-${currentAntardasha.lord}`,
        `mahadasha-${currentMahadasha.lord}-${currentMahadasha.start.toISOString()}`,
        `antardasha-${currentAntardasha.lord}-${currentAntardasha.start.toISOString()}`
      ],
      stability: input.stability.nakshatra,
      timeframe
    })
  );
}
function buildEvidenceAndDomains(input) {
  const dashaThemes = dashaThemesFor(input);
  const evidence = [
    deriveRashiSynthesisEvidence(input),
    ...evidenceForHouseLords(input),
    ...evidenceForConjunctions(input),
    ...evidenceForAspects(input),
    ...evidenceForYogas(input),
    ...evidenceForCurrentDasha(input, dashaThemes.current)
  ];
  const domains2 = allDomains.map(
    (domain) => personalizeDomain(
      synthesizeDomain(
        domain,
        evidence.filter(
          (item) => item.domain === domain && item.kind !== "dasha"
        )
      ),
      input
    )
  );
  return { evidence, domains: domains2, dashaThemes };
}

// skills/read-vedic-jyotish/scripts/src/jyotish/vimshottari.ts
var DAY_MILLISECONDS = 24 * 60 * 60 * 1e3;
var YEAR_MILLISECONDS = VIMSHOTTARI_YEAR_DAYS * DAY_MILLISECONDS;
var NAKSHATRA_SPAN = 360 / 27;
var FULL_CYCLE_YEARS = 120;
function assertValidDate(date, label) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError(`${label} must be a valid Date.`);
  }
}
function rotateDashaOrder(startLord) {
  const startIndex = DASHA_ORDER.indexOf(startLord);
  return [
    ...DASHA_ORDER.slice(startIndex),
    ...DASHA_ORDER.slice(0, startIndex)
  ];
}
function periodContains(period, moment) {
  const time = moment.getTime();
  return time >= period.start.getTime() && time < period.end.getTime();
}
function buildMahadasha(lord, startMilliseconds) {
  const durationYears = DASHA_YEARS[lord];
  const endMilliseconds = startMilliseconds + durationYears * YEAR_MILLISECONDS;
  const antardashas = [];
  let periodStart = startMilliseconds;
  const antardashaOrder = rotateDashaOrder(lord);
  antardashaOrder.forEach((antardashaLord, index) => {
    const antardashaYears = durationYears * DASHA_YEARS[antardashaLord] / FULL_CYCLE_YEARS;
    const calculatedEnd = periodStart + antardashaYears * YEAR_MILLISECONDS;
    const periodEnd = index === antardashaOrder.length - 1 ? endMilliseconds : calculatedEnd;
    antardashas.push({
      lord: antardashaLord,
      start: new Date(periodStart),
      end: new Date(periodEnd),
      durationYears: antardashaYears
    });
    periodStart = periodEnd;
  });
  return {
    lord,
    start: new Date(startMilliseconds),
    end: new Date(endMilliseconds),
    durationYears,
    antardashas
  };
}
function findAntardasha(period, moment) {
  const antardasha = period.antardashas.find(
    (candidate) => periodContains(candidate, moment)
  );
  if (!antardasha) {
    throw new RangeError(
      `No antardasha contains ${moment.toISOString()} in ${period.lord} Mahadasha.`
    );
  }
  return antardasha;
}
function calculateVimshottari(moonLongitude, birthDate, asOf) {
  assertValidDate(birthDate, "birthDate");
  assertValidDate(asOf, "asOf");
  if (asOf.getTime() < birthDate.getTime()) {
    throw new RangeError("asOf cannot be earlier than birthDate.");
  }
  const normalizedMoon = normalizeLongitude(moonLongitude);
  const birthNakshatraIndex = Math.floor(
    normalizedMoon / NAKSHATRA_SPAN
  );
  const offsetWithinNakshatra = normalizedMoon - birthNakshatraIndex * NAKSHATRA_SPAN;
  const elapsedFraction = offsetWithinNakshatra / NAKSHATRA_SPAN;
  const birthMahadashaLord = DASHA_ORDER[birthNakshatraIndex % DASHA_ORDER.length];
  const birthMahadashaYears = DASHA_YEARS[birthMahadashaLord];
  const elapsedMilliseconds = elapsedFraction * birthMahadashaYears * YEAR_MILLISECONDS;
  const firstStart = birthDate.getTime() - elapsedMilliseconds;
  const mahadashas = [];
  let periodStart = firstStart;
  let lordIndex = DASHA_ORDER.indexOf(birthMahadashaLord);
  let currentPeriodFound = false;
  while (true) {
    const lord = DASHA_ORDER[lordIndex % DASHA_ORDER.length];
    const mahadasha = buildMahadasha(lord, periodStart);
    mahadashas.push(mahadasha);
    periodStart = mahadasha.end.getTime();
    lordIndex += 1;
    if (currentPeriodFound) break;
    currentPeriodFound = periodContains(mahadasha, asOf);
  }
  const birthMahadasha = mahadashas[0];
  const currentMahadasha = mahadashas.find(
    (period) => periodContains(period, asOf)
  );
  if (!currentMahadasha) {
    throw new RangeError("No mahadasha contains the requested asOf date.");
  }
  const birthAntardasha = findAntardasha(birthMahadasha, birthDate);
  const currentAntardasha = findAntardasha(currentMahadasha, asOf);
  const currentMahadashaIndex = mahadashas.indexOf(currentMahadasha);
  const currentAntardashaIndex = currentMahadasha.antardashas.indexOf(currentAntardasha);
  const nextMahadasha = mahadashas[currentMahadashaIndex + 1] ?? null;
  const nextAntardasha = currentMahadasha.antardashas[currentAntardashaIndex + 1] ?? nextMahadasha?.antardashas[0] ?? null;
  const birthBalanceDays = (birthMahadasha.end.getTime() - birthDate.getTime()) / DAY_MILLISECONDS;
  return {
    yearDays: VIMSHOTTARI_YEAR_DAYS,
    birthNakshatraIndex,
    birthMahadashaLord,
    birthBalanceDays,
    birthBalanceYears: birthBalanceDays / VIMSHOTTARI_YEAR_DAYS,
    birthMahadasha,
    birthAntardasha,
    currentMahadasha,
    currentAntardasha,
    nextAntardasha,
    nextMahadasha,
    mahadashas,
    asOf: new Date(asOf)
  };
}

// skills/read-vedic-jyotish/scripts/src/jyotish/yogas.ts
var mahapurushaNames = {
  Mangal: "Ruchaka Mahapurusha",
  Budh: "Bhadra Mahapurusha",
  Guru: "Hamsa Mahapurusha",
  Shukra: "Malavya Mahapurusha",
  Shani: "Shasha Mahapurusha"
};
var domains = Object.keys(DOMAIN_HOUSES);
function domainsForHouses2(houses) {
  return domains.filter(
    (domain) => DOMAIN_HOUSES[domain].some((house) => houses.has(house))
  );
}
function requirePlanet2(planets, name) {
  const planet = planets.find((candidate) => candidate.name === name);
  if (!planet) throw new Error(`Missing planet required for yoga rule: ${name}.`);
  return planet;
}
function detectPanchaMahapurusha(ascendantLongitude, planets) {
  return Object.entries(mahapurushaNames).flatMap(([name, yogaName]) => {
    const planetName = name;
    const planet = requirePlanet2(planets, planetName);
    const sign = signNameOf(planet.longitude);
    const dignity = dignityFor(planetName, sign);
    const house = wholeSignHouseOf(
      planet.longitude,
      ascendantLongitude
    );
    const formed = [1, 4, 7, 10].includes(house) && (dignity === "own" || dignity === "exalted");
    if (!formed || !yogaName) return [];
    return [
      {
        id: `yoga-pancha-mahapurusha-${planetName}`,
        ruleId: "pancha-mahapurusha",
        name: yogaName,
        participants: [planetName],
        domains: ["self", "career"],
        summary: `${planetName} Kendra mein ${dignity === "exalted" ? "uchcha" : "own sign"} placement se ${yogaName} formation banti hai.`
      }
    ];
  });
}
function detectGajaKesari(planets) {
  const moon = requirePlanet2(planets, "Chandra");
  const jupiter = requirePlanet2(planets, "Guru");
  const relativeHouse = relativeHouseOf(jupiter.longitude, moon.longitude);
  if (![1, 4, 7, 10].includes(relativeHouse)) return [];
  return [
    {
      id: "yoga-gaja-kesari",
      ruleId: "gaja-kesari",
      name: "Gaja Kesari",
      participants: ["Chandra", "Guru"],
      domains: ["self", "career", "family", "education"],
      summary: `Guru Chandra se ${formatOrdinal(relativeHouse)} sign mein hai, isliye Gaja Kesari formation present hai.`
    }
  ];
}
function detectBudhaAditya(planets) {
  const sun = requirePlanet2(planets, "Surya");
  const mercury = requirePlanet2(planets, "Budh");
  if (signIndexOf2(sun.longitude) !== signIndexOf2(mercury.longitude)) {
    return [];
  }
  return [
    {
      id: "yoga-budha-aditya",
      ruleId: "budha-aditya",
      name: "Budha Aditya",
      participants: ["Surya", "Budh"],
      domains: ["career", "education"],
      summary: `Surya aur Budh ${signNameOf(sun.longitude)} mein saath hain, isliye Budha Aditya formation present hai.`
    }
  ];
}
function detectChandraMangala(planets) {
  const moon = requirePlanet2(planets, "Chandra");
  const mars = requirePlanet2(planets, "Mangal");
  if (signIndexOf2(moon.longitude) !== signIndexOf2(mars.longitude)) {
    return [];
  }
  return [
    {
      id: "yoga-chandra-mangala",
      ruleId: "chandra-mangala",
      name: "Chandra Mangala",
      participants: ["Chandra", "Mangal"],
      domains: ["money", "self"],
      summary: `Chandra aur Mangal ${signNameOf(moon.longitude)} mein saath hain, isliye same-sign Chandra Mangala formation present hai.`
    }
  ];
}
function detectParivartana(ascendantLongitude, planets) {
  const formations = [];
  for (let firstIndex = 0; firstIndex < CLASSICAL_PLANETS.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < CLASSICAL_PLANETS.length; secondIndex += 1) {
      const firstName = CLASSICAL_PLANETS[firstIndex];
      const secondName = CLASSICAL_PLANETS[secondIndex];
      const first = requirePlanet2(planets, firstName);
      const second = requirePlanet2(planets, secondName);
      const firstSign = signNameOf(first.longitude);
      const secondSign = signNameOf(second.longitude);
      if (SIGN_LORDS[firstSign] !== secondName || SIGN_LORDS[secondSign] !== firstName) {
        continue;
      }
      const connectedHouses = /* @__PURE__ */ new Set([
        wholeSignHouseOf(first.longitude, ascendantLongitude),
        wholeSignHouseOf(second.longitude, ascendantLongitude)
      ]);
      for (let house = 1; house <= 12; house += 1) {
        const lord = SIGN_LORDS[houseSignName(house, ascendantLongitude)];
        if (lord === firstName || lord === secondName) {
          connectedHouses.add(house);
        }
      }
      const connectedHouseList = [...connectedHouses].sort(
        (firstHouse, secondHouse) => firstHouse - secondHouse
      );
      formations.push({
        id: `yoga-parivartana-${firstName}-${secondName}`,
        ruleId: "parivartana",
        name: "Parivartana",
        participants: [firstName, secondName],
        domains: domainsForHouses2(connectedHouses),
        summary: `${firstName} ${secondName} ke sign mein aur ${secondName} ${firstName} ke sign mein hai. Yeh exchange ${connectedHouseList.map(formatOrdinal).join(", ")} houses ko directly connect karta hai.`
      });
    }
  }
  return formations;
}
function evaluateYogas(ascendantLongitude, planets) {
  return [
    ...detectPanchaMahapurusha(ascendantLongitude, planets),
    ...detectGajaKesari(planets),
    ...detectBudhaAditya(planets),
    ...detectChandraMangala(planets),
    ...detectParivartana(ascendantLongitude, planets)
  ];
}

// skills/read-vedic-jyotish/scripts/src/jyotish/index.ts
function validateInput(input) {
  normalizeLongitude(input.ascendantLongitude);
  const seen = /* @__PURE__ */ new Set();
  for (const planet of input.planets) {
    normalizeLongitude(planet.longitude);
    if (seen.has(planet.name)) {
      throw new Error(`Duplicate planet in Jyotish input: ${planet.name}.`);
    }
    seen.add(planet.name);
  }
  for (const requiredPlanet of PLANET_ORDER) {
    if (!seen.has(requiredPlanet)) {
      throw new Error(
        `Missing planet in Jyotish input: ${requiredPlanet}.`
      );
    }
  }
}
function deriveTraditionalJyotish(input) {
  validateInput(input);
  const stability = {
    ascendant: input.stability?.ascendant ?? "unknown",
    moonRashi: input.stability?.moonRashi ?? "unknown",
    nakshatra: input.stability?.nakshatra ?? "unknown"
  };
  const moon = input.planets.find(
    (planet) => planet.name === "Chandra"
  );
  if (!moon) {
    throw new Error("Chandra is required for Vimshottari calculation.");
  }
  const houseLords = deriveHouseLords(
    input.ascendantLongitude,
    input.planets
  );
  const dignities = deriveDignities(input.planets);
  const conjunctions = deriveSameSignConjunctions(input.planets);
  const aspects = deriveGrahaAspects(
    input.ascendantLongitude,
    input.planets
  );
  const yogas = evaluateYogas(
    input.ascendantLongitude,
    input.planets
  );
  const vimshottari = calculateVimshottari(
    moon.longitude,
    input.birthDate,
    input.asOf
  );
  const { evidence, domains: domains2, dashaThemes } = buildEvidenceAndDomains({
    ascendantLongitude: input.ascendantLongitude,
    planets: input.planets,
    houseLords,
    dignities,
    conjunctions,
    aspects,
    yogas,
    vimshottari,
    stability
  });
  return {
    ruleSetVersion: RULE_SET_VERSION,
    houseLords,
    dignities,
    conjunctions,
    aspects,
    yogas,
    vimshottari,
    dashaThemes,
    evidence,
    domains: domains2
  };
}

// skills/read-vedic-jyotish/scripts/src/ephemeris.ts
var planetRows = [
  { name: "Surya", short: "Su", key: "Sun" },
  { name: "Chandra", short: "Ch", key: "Moon" },
  { name: "Budh", short: "Bu", key: "Mercury" },
  { name: "Shukra", short: "Sh", key: "Venus" },
  { name: "Mangal", short: "Ma", key: "Mars" },
  { name: "Guru", short: "Gu", key: "Jupiter" },
  { name: "Shani", short: "Sa", key: "Saturn" },
  { name: "Rahu", short: "Ra", key: "MeanNode" }
];
function formatBirthLabel(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
  return `${dateLabel}, ${timeValue}`;
}
async function calculateVedicChart({
  date,
  time,
  place,
  wasmUrl = "/swisseph.wasm",
  ephemeris: providedEphemeris,
  asOf
}) {
  const calculationTime = asOf ? new Date(asOf) : /* @__PURE__ */ new Date();
  if (Number.isNaN(calculationTime.getTime())) {
    throw new Error("Invalid calculation date");
  }
  const birthYear = Number(date.slice(0, 4));
  const currentYear = calculationTime.getUTCFullYear();
  if (birthYear < 1800 || birthYear > currentYear) {
    throw new Error("Unsupported birth date");
  }
  const utcDate = localDateTimeToUtc(date, time, place.timezone);
  if (utcDate.getTime() > calculationTime.getTime()) {
    throw new Error("Birth date is in the future");
  }
  const {
    SwissEphemeris: SwissEphemeris2,
    Planet: Planet2,
    LunarPoint: LunarPoint2,
    HouseSystem: HouseSystem2,
    SiderealMode: SiderealMode2,
    CalculationFlag: CalculationFlag2
  } = await Promise.resolve().then(() => (init_swisseph_browser(), swisseph_browser_exports));
  let ephemeris = providedEphemeris;
  const ownsEphemeris = !providedEphemeris;
  try {
    let ascendantAt = function(moment) {
      if (!ephemeris) throw new Error("Chart engine unavailable");
      const jd = ephemeris.dateToJulianDay(moment);
      const ayanamsa2 = ephemeris.getAyanamsa(jd);
      const houses = ephemeris.calculateHouses(
        jd,
        place.latitude,
        place.longitude,
        HouseSystem2.WholeSign
      );
      return normalize(houses.ascendant - ayanamsa2);
    };
    if (!ephemeris) {
      ephemeris = new SwissEphemeris2();
      await ephemeris.init(wasmUrl);
    }
    ephemeris.setSiderealMode(SiderealMode2.Lahiri);
    const flags = CalculationFlag2.MoshierEphemeris | CalculationFlag2.Speed | CalculationFlag2.Sidereal;
    const julianDay = ephemeris.dateToJulianDay(utcDate);
    const ayanamsa = ephemeris.getAyanamsa(julianDay);
    const ascendantLongitude = ascendantAt(utcDate);
    const before = ascendantAt(
      new Date(utcDate.getTime() - 5 * 60 * 1e3)
    );
    const after = ascendantAt(
      new Date(utcDate.getTime() + 5 * 60 * 1e3)
    );
    const bodies = {
      Sun: Planet2.Sun,
      Moon: Planet2.Moon,
      Mercury: Planet2.Mercury,
      Venus: Planet2.Venus,
      Mars: Planet2.Mars,
      Jupiter: Planet2.Jupiter,
      Saturn: Planet2.Saturn,
      MeanNode: LunarPoint2.MeanNode
    };
    const planets = planetRows.map((row) => {
      const position = ephemeris.calculatePosition(
        julianDay,
        bodies[row.key],
        flags
      );
      const longitude = normalize(position.longitude);
      return {
        name: row.name,
        short: row.short,
        longitude,
        longitudeSpeed: position.longitudeSpeed,
        sign: signOf(longitude),
        degree: longitude % 30,
        house: houseOf(longitude, ascendantLongitude),
        retrograde: position.longitudeSpeed < 0
      };
    });
    const rahu = planets.find((planet) => planet.name === "Rahu");
    if (rahu) {
      const longitude = normalize(rahu.longitude + 180);
      planets.push({
        name: "Ketu",
        short: "Ke",
        longitude,
        longitudeSpeed: rahu.longitudeSpeed,
        sign: signOf(longitude),
        degree: longitude % 30,
        house: houseOf(longitude, ascendantLongitude),
        retrograde: true
      });
    }
    const sunLongitude = planets.find((planet) => planet.name === "Surya")?.longitude ?? 0;
    const moonLongitude = planets.find((planet) => planet.name === "Chandra")?.longitude ?? 0;
    const moonSpeed = planets.find((planet) => planet.name === "Chandra")?.longitudeSpeed ?? 0;
    const moonBeforeLongitude = normalize(
      ephemeris.calculatePosition(
        ephemeris.dateToJulianDay(
          new Date(utcDate.getTime() - 5 * 60 * 1e3)
        ),
        bodies.Moon,
        flags
      ).longitude
    );
    const moonAfterLongitude = normalize(
      ephemeris.calculatePosition(
        ephemeris.dateToJulianDay(
          new Date(utcDate.getTime() + 5 * 60 * 1e3)
        ),
        bodies.Moon,
        flags
      ).longitude
    );
    const ascendant = signOf(ascendantLongitude);
    const moon = signOf(moonLongitude);
    const nakshatra = nakshatraOf(moonLongitude);
    const ascendantStability = lagnaStability(
      before,
      ascendantLongitude,
      after
    );
    const moonNakshatraStability = nakshatraStability(
      moonLongitude,
      moonSpeed
    );
    const moonRashiStability = rashiStability(
      moonBeforeLongitude,
      moonLongitude,
      moonAfterLongitude
    );
    const traditional = deriveTraditionalJyotish({
      ascendantLongitude,
      planets,
      birthDate: utcDate,
      asOf: calculationTime,
      stability: {
        ascendant: ascendantStability,
        moonRashi: moonRashiStability,
        nakshatra: moonNakshatraStability
      }
    });
    return {
      ascendant,
      ascendantLongitude,
      sun: signOf(sunLongitude),
      moon,
      nakshatra: nakshatra.label,
      nakshatraLord: nakshatra.lord,
      planets,
      traditional,
      sensitivity: sensitivityText(before, ascendantLongitude, after),
      ascendantStability,
      nakshatraStability: moonNakshatraStability,
      ayanamsa,
      birthUtcIso: utcDate.toISOString(),
      placeLabel: place.label,
      localDateLabel: formatBirthLabel(date, time)
    };
  } finally {
    if (ownsEphemeris) {
      ephemeris?.close();
    }
  }
}

// skills/read-vedic-jyotish/scripts/src/options.ts
var InputError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "InputError";
    this.code = code;
  }
};
var VALUE_OPTIONS = /* @__PURE__ */ new Map([
  ["--date", "date"],
  ["--time", "time"],
  ["--place-query", "placeQuery"],
  ["--place-choice", "placeChoice"],
  ["--place-label", "placeLabel"],
  ["--latitude", "latitude"],
  ["--longitude", "longitude"],
  ["--timezone", "timezone"],
  ["--as-of", "asOf"]
]);
var NUMBER_KEYS = /* @__PURE__ */ new Set([
  "placeChoice",
  "latitude",
  "longitude"
]);
function parseCliOptions(argumentsList) {
  const options = {
    pretty: false,
    help: false
  };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--pretty") {
      options.pretty = true;
      continue;
    }
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    const key = VALUE_OPTIONS.get(
      argument
    );
    if (!key) {
      throw new InputError(
        "unknown_option",
        `Unknown option: ${argument}`
      );
    }
    const rawValue = argumentsList[index + 1];
    if (!rawValue || rawValue.startsWith("--")) {
      throw new InputError(
        "missing_option_value",
        `Missing value for ${argument}`
      );
    }
    index += 1;
    if (NUMBER_KEYS.has(key)) {
      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue)) {
        throw new InputError(
          "invalid_number",
          `${argument} must be a finite number`
        );
      }
      Object.assign(options, { [key]: numericValue });
    } else {
      Object.assign(options, { [key]: rawValue });
    }
  }
  return options;
}
function requireBirthDetails(options) {
  if (!options.date) {
    throw new InputError("missing_birth_date", "Birth date is required");
  }
  if (!options.time) {
    throw new InputError("missing_birth_time", "Birth time is required");
  }
}
function usageText() {
  return [
    "Calculate a Vedic chart as structured JSON.",
    "",
    "Search for a birthplace:",
    '  node calculate-chart.mjs --date YYYY-MM-DD --time HH:MM --place-query "City, region, country"',
    "",
    "Choose a returned place:",
    '  node calculate-chart.mjs --date YYYY-MM-DD --time HH:MM --place-query "City" --place-choice ID',
    "",
    "Use verified coordinates:",
    '  node calculate-chart.mjs --date YYYY-MM-DD --time HH:MM --place-label "City, country" \\',
    "    --latitude 0 --longitude 0 --timezone Area/City",
    "",
    "Optional: --as-of YYYY-MM-DD --pretty"
  ].join("\n");
}

// skills/read-vedic-jyotish/scripts/src/packet.ts
import { createHash } from "node:crypto";
var SCHEMA_VERSION = "vedic-jyotish-reading-packet.v1";
var CALCULATION_VERSION = "vedic-jyotish-local-1.0.0";
function buildReadingPacket({
  chart,
  place,
  date,
  time,
  asOf,
  placeSource,
  swissVersion
}) {
  const timeline = chart.traditional.vimshottari;
  const periodSummary = (period) => period ? {
    lord: period.lord,
    start: period.start,
    end: period.end,
    durationYears: period.durationYears
  } : null;
  const dasha = {
    asOf: timeline.asOf,
    birthNakshatraIndex: timeline.birthNakshatraIndex,
    birthMahadashaLord: timeline.birthMahadashaLord,
    birthBalanceYears: timeline.birthBalanceYears,
    birthMahadasha: periodSummary(timeline.birthMahadasha),
    birthAntardasha: periodSummary(timeline.birthAntardasha),
    currentMahadasha: periodSummary(timeline.currentMahadasha),
    currentAntardasha: periodSummary(timeline.currentAntardasha),
    nextAntardasha: periodSummary(timeline.nextAntardasha),
    nextMahadasha: periodSummary(timeline.nextMahadasha),
    mahadashaWindows: timeline.mahadashas.map((period) => ({
      lord: period.lord,
      start: period.start,
      end: period.end
    }))
  };
  const packet = {
    status: "ok",
    schemaVersion: SCHEMA_VERSION,
    calculationVersion: CALCULATION_VERSION,
    ruleSetVersion: chart.traditional.ruleSetVersion,
    method: {
      zodiac: "sidereal",
      ayanamsha: "Lahiri",
      houseSystem: "whole-sign",
      lunarNode: "mean",
      ketu: "Rahu plus 180 degrees",
      ephemeris: "Moshier",
      swissEphemerisVersion: swissVersion,
      vimshottariYearDays: 365.25
    },
    input: {
      localDate: date,
      localTime: time,
      birthplace: place.label,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
      placeSource,
      birthUtc: chart.birthUtcIso,
      asOf: asOf.toISOString()
    },
    chart: {
      lagna: chart.ascendant,
      lagnaLongitude: chart.ascendantLongitude,
      suryaRashi: chart.sun,
      chandraRashi: chart.moon,
      nakshatra: chart.nakshatra,
      nakshatraLord: chart.nakshatraLord,
      ayanamshaDegrees: chart.ayanamsa,
      planets: chart.planets,
      sensitivity: {
        lagna: chart.ascendantStability,
        nakshatra: chart.nakshatraStability,
        summary: chart.sensitivity
      }
    },
    analysis: {
      houseLords: chart.traditional.houseLords,
      dignities: chart.traditional.dignities,
      conjunctions: chart.traditional.conjunctions,
      aspects: chart.traditional.aspects,
      yogas: chart.traditional.yogas,
      dasha,
      dashaThemes: chart.traditional.dashaThemes,
      evidence: chart.traditional.evidence,
      domains: chart.traditional.domains
    },
    interpretationBoundary: {
      evidenceMeaning: "Traditional rule support within this configured Jyotish method",
      confidenceMeaning: "Internal agreement among configured rules, not event probability",
      predictionStatus: "Traditional interpretation; future events are not guaranteed"
    }
  };
  const digest = createHash("sha256").update(JSON.stringify(packet)).digest("hex");
  return {
    ...packet,
    digest: `sha256:${digest}`
  };
}

// skills/read-vedic-jyotish/scripts/src/places.ts
function validateTimezone(timezone) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
  } catch {
    throw new InputError(
      "invalid_timezone",
      `Invalid IANA timezone: ${timezone}`
    );
  }
}
function providedPlace(options) {
  const coordinateValues = [
    options.latitude,
    options.longitude,
    options.timezone
  ];
  const hasAnyCoordinateValue = coordinateValues.some(
    (value) => value !== void 0
  );
  if (!hasAnyCoordinateValue) return null;
  if (options.latitude === void 0 || options.longitude === void 0 || !options.timezone) {
    throw new InputError(
      "incomplete_place",
      "Latitude, longitude, and timezone must be provided together"
    );
  }
  if (options.latitude < -90 || options.latitude > 90) {
    throw new InputError(
      "invalid_latitude",
      "Latitude must be between -90 and 90"
    );
  }
  if (options.longitude < -180 || options.longitude > 180) {
    throw new InputError(
      "invalid_longitude",
      "Longitude must be between -180 and 180"
    );
  }
  validateTimezone(options.timezone);
  return {
    status: "resolved",
    source: "provided",
    place: {
      id: 0,
      label: options.placeLabel?.trim() || "Provided coordinates",
      latitude: options.latitude,
      longitude: options.longitude,
      timezone: options.timezone
    }
  };
}
function candidateLabel(item) {
  return [item.name, item.admin2, item.admin1, item.country].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(", ");
}
async function searchPlaces(query) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  let response;
  try {
    response = await fetch(url, {
      headers: {
        accept: "application/json"
      }
    });
  } catch {
    throw new InputError(
      "place_lookup_unavailable",
      "Birthplace search is temporarily unavailable"
    );
  }
  if (!response.ok) {
    throw new InputError(
      "place_lookup_unavailable",
      `Birthplace search returned HTTP ${response.status}`
    );
  }
  const payload = await response.json();
  return (payload.results ?? []).filter(
    (item) => typeof item.id === "number" && typeof item.latitude === "number" && typeof item.longitude === "number" && Boolean(item.name) && Boolean(item.timezone)
  ).map((item) => ({
    id: item.id,
    label: candidateLabel(item),
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
    countryCode: item.country_code
  }));
}
async function resolvePlace(options) {
  const explicit = providedPlace(options);
  if (explicit) return explicit;
  const query = options.placeQuery?.trim();
  if (!query) {
    throw new InputError(
      "missing_birthplace",
      "Provide a birthplace query or verified coordinates and timezone"
    );
  }
  const candidates = await searchPlaces(query);
  if (!candidates.length) {
    throw new InputError(
      "place_not_found",
      `No birthplace match was found for: ${query}`
    );
  }
  const selected = options.placeChoice === void 0 ? candidates.length === 1 ? candidates[0] : null : candidates.find((candidate) => candidate.id === options.placeChoice);
  if (!selected) {
    return {
      status: "needs_place_choice",
      query,
      message: options.placeChoice === void 0 ? "Choose the birthplace that matches the birth record" : "The selected birthplace ID was not found; choose from these matches",
      candidates
    };
  }
  return {
    status: "resolved",
    source: "open-meteo",
    place: {
      id: selected.id,
      label: selected.label,
      latitude: selected.latitude,
      longitude: selected.longitude,
      timezone: selected.timezone
    }
  };
}

// skills/read-vedic-jyotish/scripts/src/cli.ts
var scriptDirectory = dirname(fileURLToPath(import.meta.url));
function parseAsOf(value) {
  if (!value) return /* @__PURE__ */ new Date();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? /* @__PURE__ */ new Date(`${value}T12:00:00.000Z`) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new InputError("invalid_as_of", "Invalid as-of date");
  }
  return date;
}
function structuredError(error) {
  if (error instanceof InputError) {
    return {
      status: "invalid_input",
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
  if (error instanceof Error) {
    const code = error.message.includes("ambiguous") ? "ambiguous_local_time" : error.message.includes("does not exist") ? "nonexistent_local_time" : "calculation_failed";
    return {
      status: code === "calculation_failed" ? code : "invalid_input",
      error: {
        code,
        message: error.message
      }
    };
  }
  return {
    status: "calculation_failed",
    error: {
      code: "unknown_error",
      message: "The chart calculation failed"
    }
  };
}
function writeJson(value, pretty = false) {
  process.stdout.write(`${JSON.stringify(value, null, pretty ? 2 : 0)}
`);
}
async function initializeEphemeris() {
  const wasmBytes = await readFile(resolve(scriptDirectory, "swisseph.wasm"));
  const wasmUrl = `data:application/wasm;base64,${wasmBytes.toString("base64")}`;
  const ephemeris = new SwissEphemeris();
  const originalLog = console.log;
  console.log = () => void 0;
  try {
    await ephemeris.init(wasmUrl);
  } finally {
    console.log = originalLog;
  }
  return ephemeris;
}
async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${usageText()}
`);
    return;
  }
  requireBirthDetails(options);
  const placeResolution = await resolvePlace(options);
  if (placeResolution.status === "needs_place_choice") {
    writeJson(placeResolution, options.pretty);
    return;
  }
  const asOf = parseAsOf(options.asOf);
  const ephemeris = await initializeEphemeris();
  try {
    const chart = await calculateVedicChart({
      date: options.date,
      time: options.time,
      place: placeResolution.place,
      ephemeris,
      asOf
    });
    writeJson(
      buildReadingPacket({
        chart,
        place: placeResolution.place,
        date: options.date,
        time: options.time,
        asOf,
        placeSource: placeResolution.source,
        swissVersion: ephemeris.version()
      }),
      options.pretty
    );
  } finally {
    ephemeris.close();
  }
}
main().catch((error) => {
  writeJson(structuredError(error));
  process.exitCode = 2;
});
