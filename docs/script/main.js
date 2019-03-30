/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./tmp/script/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./tmp/script/converter.js":
/*!*********************************!*\
  !*** ./tmp/script/converter.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_canvas_1 = __webpack_require__(/*! ./gl-utils/gl-canvas */ "./tmp/script/gl-utils/gl-canvas.js");
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-utils/gl-resource */ "./tmp/script/gl-utils/gl-resource.js"));
var ShaderManager = __importStar(__webpack_require__(/*! ./gl-utils/shader-manager */ "./tmp/script/gl-utils/shader-manager.js"));
var vbo_1 = __importDefault(__webpack_require__(/*! ./gl-utils/vbo */ "./tmp/script/gl-utils/vbo.js"));
var format_utils_1 = __webpack_require__(/*! ./format-utils */ "./tmp/script/format-utils.js");
var parameters_1 = __webpack_require__(/*! ./parameters */ "./tmp/script/parameters.js");
var Converter = (function (_super) {
    __extends(Converter, _super);
    function Converter() {
        var _this = _super.call(this, gl_canvas_1.gl) || this;
        _this._vbo = vbo_1.default.createQuad(gl_canvas_1.gl, -1, -1, 1, 1);
        _this.buildShader("_shaderBoxToBox", "converter.vert", "converterBoxToBox.frag");
        _this.buildShader("_shaderBoxToPlanet", "converter.vert", "converterBoxToPlanet.frag");
        _this.buildShader("_shaderBoxToSphere", "converter.vert", "converterBoxToSphere.frag");
        _this.buildShader("_shaderSphereToBox", "converter.vert", "converterSphereToBox.frag");
        _this.buildShader("_shaderSphereToPlanet", "converter.vert", "converterSphereToPlanet.frag");
        _this.buildShader("_shaderSphereToSphere", "converter.vert", "converterSphereToSphere.frag");
        _this.buildShader("_shaderPlanetToBox", "converter.vert", "converterPlanetToBox.frag");
        _this.buildShader("_shaderPlanetToPlanet", "converter.vert", "converterPlanetToPlanet.frag");
        _this.buildShader("_shaderPlanetToSphere", "converter.vert", "converterPlanetToSphere.frag");
        return _this;
    }
    Converter.prototype.freeGLResources = function () {
        if (this._vbo) {
            this._vbo.freeGLResources();
            this._vbo = null;
        }
        this.deleteShader("_shaderBoxToBox");
        this.deleteShader("_shaderBoxToPlanet");
        this.deleteShader("_shaderBoxToSphere");
        this.deleteShader("_shaderSphereToBox");
        this.deleteShader("_shaderSphereToPlanet");
        this.deleteShader("_shaderSphereToSphere");
        this.deleteShader("_shaderPlanetToBox");
        this.deleteShader("_shaderPlanetToPlanet");
        this.deleteShader("_shaderPlanetToSphere");
    };
    Converter.prototype.draw = function (texture) {
        var shader = this.getShader(parameters_1.Parameters.inputFormat, parameters_1.Parameters.outputFormat);
        if (shader) {
            shader.u["uTexture"].value = texture;
            shader.u["uPaddingTop"].value = parameters_1.Parameters.paddingTop;
            shader.u["uPaddingBottom"].value = parameters_1.Parameters.paddingBottom;
            shader.u["uPaddingBack"].value = parameters_1.Parameters.paddingBack;
            shader.u["uFlipVertically"].value = parameters_1.Parameters.flipVertically ? -1 : 1;
            shader.use();
            shader.bindUniformsAndAttributes();
            gl_canvas_1.gl.drawArrays(gl_canvas_1.gl.TRIANGLE_STRIP, 0, 4);
        }
    };
    Converter.prototype.deleteShader = function (name) {
        if (this[name]) {
            this[name].freeGLResources();
            this[name] = null;
        }
    };
    Converter.prototype.buildShader = function (name, vertex, fragment) {
        var _this = this;
        ShaderManager.buildShader({
            fragmentFilename: fragment,
            vertexFilename: vertex,
        }, function (shader) {
            if (shader !== null) {
                _this[name] = shader;
                _this[name].a["aCorner"].VBO = _this._vbo;
            }
        });
    };
    Converter.prototype.getShader = function (inputFormat, outputFormat) {
        if (inputFormat === format_utils_1.Format.Skybox) {
            if (outputFormat === format_utils_1.Format.Skybox) {
                return this._shaderBoxToBox;
            }
            else if (outputFormat === format_utils_1.Format.Skysphere) {
                return this._shaderBoxToSphere;
            }
            else {
                return this._shaderBoxToPlanet;
            }
        }
        else if (inputFormat === format_utils_1.Format.Skysphere) {
            if (outputFormat === format_utils_1.Format.Skybox) {
                return this._shaderSphereToBox;
            }
            else if (outputFormat === format_utils_1.Format.Skysphere) {
                return this._shaderSphereToSphere;
            }
            else {
                return this._shaderSphereToPlanet;
            }
        }
        else if (inputFormat === format_utils_1.Format.Tinyplanet) {
            if (outputFormat === format_utils_1.Format.Skybox) {
                return this._shaderPlanetToBox;
            }
            else if (outputFormat === format_utils_1.Format.Skysphere) {
                return this._shaderPlanetToSphere;
            }
            else {
                return this._shaderPlanetToPlanet;
            }
        }
    };
    return Converter;
}(gl_resource_1.default));
exports.default = Converter;


/***/ }),

/***/ "./tmp/script/format-utils.js":
/*!************************************!*\
  !*** ./tmp/script/format-utils.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Format;
(function (Format) {
    Format["Skybox"] = "skybox";
    Format["Skysphere"] = "skysphere";
    Format["Tinyplanet"] = "tinyplanet";
})(Format || (Format = {}));
exports.Format = Format;
var FormatUtils = (function () {
    function FormatUtils() {
    }
    FormatUtils.guessFormat = function (image) {
        if (FormatUtils.mayBeSkybox(image)) {
            return Format.Skybox;
        }
        var ratio = image.width / image.height;
        if (Math.abs(ratio - 1) < 0.1) {
            return Format.Tinyplanet;
        }
        return Format.Skysphere;
    };
    FormatUtils.parseString = function (str) {
        if (str === Format.Skybox) {
            return Format.Skybox;
        }
        else if (str === Format.Tinyplanet) {
            return Format.Tinyplanet;
        }
        else {
            return Format.Skysphere;
        }
    };
    FormatUtils.ratio = function (format) {
        if (format === Format.Skybox) {
            return 4 / 3;
        }
        else if (format === Format.Skysphere) {
            return 2;
        }
        else {
            return 1;
        }
    };
    FormatUtils.mayBeSkybox = function (image) {
        var context = document.createElement("canvas").getContext("2d");
        context.canvas.width = 8;
        context.canvas.height = 6;
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
        var testedPixels = [
            { x: 0, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
        ];
        var reference = context.getImageData(testedPixels[0].x, testedPixels[0].y, 1, 1).data;
        for (var _i = 0, testedPixels_1 = testedPixels; _i < testedPixels_1.length; _i++) {
            var tested = testedPixels_1[_i];
            var sample = context.getImageData(tested.x, tested.y, 1, 1).data;
            for (var i = 0; i < 4; ++i) {
                if (sample[i] !== reference[i]) {
                    return false;
                }
            }
        }
        return true;
    };
    return FormatUtils;
}());
exports.FormatUtils = FormatUtils;


/***/ }),

/***/ "./tmp/script/gl-utils/gl-canvas.js":
/*!******************************************!*\
  !*** ./tmp/script/gl-utils/gl-canvas.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl = null;
exports.gl = gl;
function initGL(flags) {
    function setError(message) {
        Demopage.setErrorMessage("webgl-support", message);
    }
    var canvas = Canvas.getCanvas();
    exports.gl = gl = canvas.getContext("webgl", flags);
    if (gl == null) {
        exports.gl = gl = canvas.getContext("experimental-webgl", flags);
        if (gl == null) {
            setError("Your browser or device does not seem to support WebGL.");
            return false;
        }
        setError("Your browser or device only supports experimental WebGL.\n" +
            "The simulation may not run as expected.");
    }
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    return true;
}
exports.initGL = initGL;
function adjustSize(hidpi) {
    if (hidpi === void 0) { hidpi = false; }
    var cssPixel = (hidpi) ? window.devicePixelRatio : 1;
    var width = Math.floor(gl.canvas.clientWidth * cssPixel);
    var height = Math.floor(gl.canvas.clientHeight * cssPixel);
    if (gl.canvas.width !== width || gl.canvas.height !== height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
}
exports.adjustSize = adjustSize;


/***/ }),

/***/ "./tmp/script/gl-utils/gl-resource.js":
/*!********************************************!*\
  !*** ./tmp/script/gl-utils/gl-resource.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GLResource = (function () {
    function GLResource(gl) {
        this._gl = gl;
    }
    GLResource.prototype.gl = function () {
        return this._gl;
    };
    return GLResource;
}());
exports.default = GLResource;


/***/ }),

/***/ "./tmp/script/gl-utils/matrix/mat4.js":
/*!********************************************!*\
  !*** ./tmp/script/gl-utils/matrix/mat4.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vec3_1 = __webpack_require__(/*! ./vec3 */ "./tmp/script/gl-utils/matrix/vec3.js");
var Mat4 = (function () {
    function Mat4() {
        this._val = new Float32Array(16);
        this.identity();
    }
    Object.defineProperty(Mat4, "tmpMatrix", {
        get: function () {
            if (Mat4._tmpMatrix === null) {
                Mat4._tmpMatrix = new Mat4();
            }
            return Mat4._tmpMatrix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mat4.prototype, "val", {
        get: function () {
            return this._val;
        },
        enumerable: true,
        configurable: true
    });
    Mat4.prototype.identity = function () {
        for (var i = 0; i < 16; ++i) {
            this._val[i] = 0;
        }
        this._val[0] = 1;
        this._val[5] = 1;
        this._val[10] = 1;
        this._val[15] = 1;
    };
    Mat4.prototype.lookAt = function (eye, center, up) {
        if (eye.equals(center)) {
            this.identity();
            return;
        }
        var z = vec3_1.Vec3.substract(eye, center);
        z.normalize();
        var x = vec3_1.Vec3.crossProduct(up, z);
        x.normalize();
        var y = vec3_1.Vec3.crossProduct(z, x);
        y.normalize();
        this._val[0] = x.x;
        this._val[1] = y.x;
        this._val[2] = z.x;
        this._val[3] = 0;
        this._val[4] = x.y;
        this._val[5] = y.y;
        this._val[6] = z.y;
        this._val[7] = 0;
        this._val[8] = x.z;
        this._val[9] = y.z;
        this._val[10] = z.z;
        this._val[11] = 0;
        this._val[12] = -vec3_1.Vec3.dotProduct(x, eye);
        this._val[13] = -vec3_1.Vec3.dotProduct(y, eye);
        this._val[14] = -vec3_1.Vec3.dotProduct(z, eye);
        this._val[15] = 1;
    };
    Mat4.prototype.multiplyRight = function (m2) {
        var tmp = Mat4.tmpMatrix._val;
        var myself = this._val;
        var other = m2._val;
        for (var iCol = 0; iCol < 4; ++iCol) {
            for (var iRow = 0; iRow < 4; ++iRow) {
                tmp[4 * iCol + iRow] = 0;
                for (var i = 0; i < 4; ++i) {
                    tmp[4 * iCol + iRow] += myself[4 * i + iRow] * other[4 * iCol + i];
                }
            }
        }
        this.swapWithTmpMatrix();
    };
    Mat4.prototype.invert = function () {
        var m = this._val;
        var m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
        var m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
        var m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
        var m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
        var b00 = m00 * m11 - m01 * m10;
        var b01 = m00 * m12 - m02 * m10;
        var b02 = m00 * m13 - m03 * m10;
        var b03 = m01 * m12 - m02 * m11;
        var b04 = m01 * m13 - m03 * m11;
        var b05 = m02 * m13 - m03 * m12;
        var b06 = m20 * m31 - m21 * m30;
        var b07 = m20 * m32 - m22 * m30;
        var b08 = m20 * m33 - m23 * m30;
        var b09 = m21 * m32 - m22 * m31;
        var b10 = m21 * m33 - m23 * m31;
        var b11 = m22 * m33 - m23 * m32;
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return false;
        }
        det = 1.0 / det;
        var tmpVals = Mat4.tmpMatrix._val;
        tmpVals[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det;
        tmpVals[1] = (m02 * b10 - m01 * b11 - m03 * b09) * det;
        tmpVals[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det;
        tmpVals[3] = (m22 * b04 - m21 * b05 - m23 * b03) * det;
        tmpVals[4] = (m12 * b08 - m10 * b11 - m13 * b07) * det;
        tmpVals[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det;
        tmpVals[6] = (m32 * b02 - m30 * b05 - m33 * b01) * det;
        tmpVals[7] = (m20 * b05 - m22 * b02 + m23 * b01) * det;
        tmpVals[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det;
        tmpVals[9] = (m01 * b08 - m00 * b10 - m03 * b06) * det;
        tmpVals[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
        tmpVals[11] = (m21 * b02 - m20 * b04 - m23 * b00) * det;
        tmpVals[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det;
        tmpVals[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det;
        tmpVals[14] = (m31 * b01 - m30 * b03 - m32 * b00) * det;
        tmpVals[15] = (m20 * b03 - m21 * b01 + m22 * b00) * det;
        this.swapWithTmpMatrix();
        return true;
    };
    Mat4.prototype.perspective = function (fovy, aspectRatio, nearPlane, farPlane) {
        var f = 1 / Math.tan(fovy / 2);
        this._val[0] = f / aspectRatio;
        this._val[1] = 0;
        this._val[2] = 0;
        this._val[3] = 0;
        this._val[4] = 0;
        this._val[5] = f;
        this._val[6] = 0;
        this._val[7] = 0;
        this._val[8] = 0;
        this._val[9] = 0;
        this._val[11] = -1;
        this._val[12] = 0;
        this._val[13] = 0;
        this._val[15] = 0;
        if (farPlane === Infinity) {
            this._val[10] = -1;
            this._val[14] = -2 * nearPlane;
        }
        else {
            var tmp = 1 / (nearPlane - farPlane);
            this._val[10] = (farPlane + nearPlane) * tmp;
            this._val[14] = (2 * farPlane * nearPlane) * tmp;
        }
    };
    Mat4.prototype.perspectiveInverse = function (fovy, aspectRatio, nearPlane, farPlane) {
        var f = Math.tan(fovy / 2);
        this._val[0] = aspectRatio * f;
        this._val[1] = 0;
        this._val[2] = 0;
        this._val[3] = 0;
        this._val[4] = 0;
        this._val[5] = f;
        this._val[6] = 0;
        this._val[7] = 0;
        this._val[8] = 0;
        this._val[9] = 0;
        this._val[10] = 0;
        this._val[12] = 0;
        this._val[13] = 0;
        this._val[14] = -1;
        if (farPlane === Infinity) {
            this._val[11] = -0.5;
            this._val[15] = 0.5 / nearPlane;
        }
        else {
            var tmp = 0.5 / (nearPlane * farPlane);
            this._val[11] = (nearPlane - farPlane) * tmp;
            this._val[15] = (nearPlane + farPlane) * tmp;
        }
    };
    Mat4.prototype.swapWithTmpMatrix = function () {
        var tmp = Mat4.tmpMatrix._val;
        Mat4.tmpMatrix._val = this._val;
        this._val = tmp;
    };
    Mat4._tmpMatrix = null;
    return Mat4;
}());
exports.Mat4 = Mat4;


/***/ }),

/***/ "./tmp/script/gl-utils/matrix/vec3.js":
/*!********************************************!*\
  !*** ./tmp/script/gl-utils/matrix/vec3.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EPSILON = 0.0001;
var Vec3 = (function () {
    function Vec3(x, y, z) {
        this._val = new Float32Array(3);
        this._val[0] = x;
        this._val[1] = y;
        this._val[2] = z;
    }
    Vec3.dotProduct = function (v1, v2) {
        return v1._val[0] * v2._val[0] +
            v1._val[1] * v2._val[1] +
            v1._val[2] * v2._val[2];
    };
    Vec3.crossProduct = function (v1, v2) {
        return new Vec3(v1._val[1] * v2._val[2] - v1._val[2] * v2._val[1], v1._val[2] * v2._val[0] - v1._val[0] * v2._val[2], v1._val[0] * v2._val[1] - v1._val[1] * v2._val[0]);
    };
    Vec3.substract = function (v1, v2) {
        return new Vec3(v1._val[0] - v2._val[0], v1._val[1] - v2._val[1], v1._val[2] - v2._val[2]);
    };
    Object.defineProperty(Vec3.prototype, "x", {
        get: function () {
            return this._val[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "y", {
        get: function () {
            return this._val[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "z", {
        get: function () {
            return this._val[2];
        },
        enumerable: true,
        configurable: true
    });
    Vec3.prototype.equals = function (other) {
        return Math.abs(this._val[0] - other._val[0]) < EPSILON &&
            Math.abs(this._val[1] - other._val[1]) < EPSILON &&
            Math.abs(this._val[2] - other._val[2]) < EPSILON;
    };
    Vec3.prototype.divideByScalar = function (scalar) {
        this._val[0] /= scalar;
        this._val[1] /= scalar;
        this._val[2] /= scalar;
    };
    Vec3.prototype.substract = function (other) {
        this._val[0] -= other._val[0];
        this._val[1] -= other._val[1];
        this._val[2] -= other._val[2];
    };
    Object.defineProperty(Vec3.prototype, "length", {
        get: function () {
            var norm = this._val[0] * this._val[0] +
                this._val[1] * this._val[1] +
                this._val[2] * this._val[2];
            return Math.sqrt(norm);
        },
        enumerable: true,
        configurable: true
    });
    Vec3.prototype.normalize = function () {
        if (Math.abs(this._val[0]) < EPSILON &&
            Math.abs(this._val[1]) < EPSILON &&
            Math.abs(this._val[2]) < EPSILON) {
            this._val[0] = 0;
            this._val[1] = 0;
            this._val[2] = 0;
            return false;
        }
        this.divideByScalar(this.length);
        return true;
    };
    return Vec3;
}());
exports.Vec3 = Vec3;


/***/ }),

/***/ "./tmp/script/gl-utils/shader-manager.js":
/*!***********************************************!*\
  !*** ./tmp/script/gl-utils/shader-manager.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_canvas_1 = __webpack_require__(/*! ./gl-canvas */ "./tmp/script/gl-utils/gl-canvas.js");
var shader_1 = __importDefault(__webpack_require__(/*! ./shader */ "./tmp/script/gl-utils/shader.js"));
var ShaderSources = __importStar(__webpack_require__(/*! ./shader-sources */ "./tmp/script/gl-utils/shader-sources.js"));
var cachedShaders = {};
function getShader(name) {
    return cachedShaders[name].shader;
}
exports.getShader = getShader;
function buildShader(infos, callback) {
    var sourcesPending = 2;
    var sourcesFailed = 0;
    function loadedSource(success) {
        sourcesPending--;
        if (!success) {
            sourcesFailed++;
        }
        if (sourcesPending === 0) {
            var shader = null;
            if (sourcesFailed === 0) {
                var vert = ShaderSources.getSource(infos.vertexFilename);
                var frag = ShaderSources.getSource(infos.fragmentFilename);
                shader = new shader_1.default(gl_canvas_1.gl, vert, frag);
            }
            callback(shader);
        }
    }
    ShaderSources.loadSource(infos.vertexFilename, loadedSource);
    ShaderSources.loadSource(infos.fragmentFilename, loadedSource);
}
exports.buildShader = buildShader;
function registerShader(name, infos, callback) {
    function callAndClearCallbacks(cached) {
        for (var _i = 0, _a = cached.callbacks; _i < _a.length; _i++) {
            var cachedCallback = _a[_i];
            cachedCallback(!cached.failed, cached.shader);
        }
        cached.callbacks = [];
    }
    if (typeof cachedShaders[name] === "undefined") {
        cachedShaders[name] = {
            callbacks: [callback],
            failed: false,
            infos: infos,
            pending: true,
            shader: null,
        };
        var cached_1 = cachedShaders[name];
        buildShader(infos, function (builtShader) {
            cached_1.pending = false;
            cached_1.failed = builtShader === null;
            cached_1.shader = builtShader;
            callAndClearCallbacks(cached_1);
        });
    }
    else {
        var cached = cachedShaders[name];
        if (cached.pending === true) {
            cached.callbacks.push(callback);
        }
        else {
            callAndClearCallbacks(cached);
        }
    }
}
exports.registerShader = registerShader;
function deleteShader(name) {
    if (cachedShaders[name]) {
        if (cachedShaders[name].shader) {
            cachedShaders[name].shader.freeGLResources();
        }
        delete cachedShaders[name];
    }
}
exports.deleteShader = deleteShader;


/***/ }),

/***/ "./tmp/script/gl-utils/shader-sources.js":
/*!***********************************************!*\
  !*** ./tmp/script/gl-utils/shader-sources.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cachedSources = {};
function loadSource(filename, callback) {
    function callAndClearCallbacks(cached) {
        for (var _i = 0, _a = cached.callbacks; _i < _a.length; _i++) {
            var cachedCallback = _a[_i];
            cachedCallback(!cached.failed);
        }
        cached.callbacks = [];
    }
    if (typeof cachedSources[filename] === "undefined") {
        cachedSources[filename] = {
            callbacks: [callback],
            failed: false,
            pending: true,
            text: null,
        };
        var cached_1 = cachedSources[filename];
        var xhr_1 = new XMLHttpRequest();
        xhr_1.open("GET", "./shaders/" + filename, true);
        xhr_1.onload = function () {
            if (xhr_1.readyState === 4) {
                cached_1.pending = false;
                if (xhr_1.status === 200) {
                    cached_1.text = xhr_1.responseText;
                    cached_1.failed = false;
                }
                else {
                    console.error("Cannot load '" + filename + "' shader source: " + xhr_1.statusText);
                    cached_1.failed = true;
                }
                callAndClearCallbacks(cached_1);
            }
        };
        xhr_1.onerror = function () {
            console.error("Cannot load '" + filename + "' shader source: " + xhr_1.statusText);
            cached_1.pending = false;
            cached_1.failed = true;
            callAndClearCallbacks(cached_1);
        };
        xhr_1.send(null);
    }
    else {
        var cached = cachedSources[filename];
        if (cached.pending === true) {
            cached.callbacks.push(callback);
        }
        else {
            callAndClearCallbacks(cached);
        }
    }
}
exports.loadSource = loadSource;
function getSource(filename) {
    return cachedSources[filename].text;
}
exports.getSource = getSource;


/***/ }),

/***/ "./tmp/script/gl-utils/shader.js":
/*!***************************************!*\
  !*** ./tmp/script/gl-utils/shader.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./tmp/script/gl-utils/gl-resource.js"));
function notImplemented(gl, location, value) {
    alert("NOT IMPLEMENTED YET");
}
function bindUniformFloat(gl, location, value) {
    if (Array.isArray(value)) {
        gl.uniform1fv(location, value);
    }
    else {
        gl.uniform1f(location, value);
    }
}
function bindUniformFloat2v(gl, location, value) {
    gl.uniform2fv(location, value);
}
function bindUniformFloat3v(gl, location, value) {
    gl.uniform3fv(location, value);
}
function bindUniformFloat4v(gl, location, value) {
    gl.uniform4fv(location, value);
}
function bindUniformInt(gl, location, value) {
    if (Array.isArray(value)) {
        gl.uniform1iv(location, value);
    }
    else {
        gl.uniform1iv(location, value);
    }
}
function bindUniformInt2v(gl, location, value) {
    gl.uniform2iv(location, value);
}
function bindUniformInt3v(gl, location, value) {
    gl.uniform3iv(location, value);
}
function bindUniformInt4v(gl, location, value) {
    gl.uniform4iv(location, value);
}
function bindUniformBool(gl, location, value) {
    gl.uniform1i(location, +value);
}
function bindUniformBool2v(gl, location, value) {
    gl.uniform2iv(location, value);
}
function bindUniformBool3v(gl, location, value) {
    gl.uniform3iv(location, value);
}
function bindUniformBool4v(gl, location, value) {
    gl.uniform4iv(location, value);
}
function bindUniformFloatMat2(gl, location, value) {
    gl.uniformMatrix2fv(location, false, value);
}
function bindUniformFloatMat3(gl, location, value) {
    gl.uniformMatrix3fv(location, false, value);
}
function bindUniformFloatMat4(gl, location, value) {
    gl.uniformMatrix4fv(location, false, value);
}
function bindSampler2D(gl, location, unitNb, value) {
    gl.uniform1i(location, unitNb);
    gl.activeTexture(gl["TEXTURE" + unitNb]);
    gl.bindTexture(gl.TEXTURE_2D, value);
}
function bindSamplerCube(gl, location, unitNb, value) {
    gl.uniform1i(location, unitNb);
    gl.activeTexture(gl["TEXTURE" + unitNb]);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, value);
}
var types = {
    0x8B50: { str: "FLOAT_VEC2", binder: bindUniformFloat2v },
    0x8B51: { str: "FLOAT_VEC3", binder: bindUniformFloat3v },
    0x8B52: { str: "FLOAT_VEC4", binder: bindUniformFloat4v },
    0x8B53: { str: "INT_VEC2", binder: bindUniformInt2v },
    0x8B54: { str: "INT_VEC3", binder: bindUniformInt3v },
    0x8B55: { str: "INT_VEC4", binder: bindUniformInt4v },
    0x8B56: { str: "BOOL", binder: bindUniformBool },
    0x8B57: { str: "BOOL_VEC2", binder: bindUniformBool2v },
    0x8B58: { str: "BOOL_VEC3", binder: bindUniformBool3v },
    0x8B59: { str: "BOOL_VEC4", binder: bindUniformBool4v },
    0x8B5A: { str: "FLOAT_MAT2", binder: bindUniformFloatMat2 },
    0x8B5B: { str: "FLOAT_MAT3", binder: bindUniformFloatMat3 },
    0x8B5C: { str: "FLOAT_MAT4", binder: bindUniformFloatMat4 },
    0x8B5E: { str: "SAMPLER_2D", binder: bindSampler2D },
    0x8B60: { str: "SAMPLER_CUBE", binder: bindSamplerCube },
    0x1400: { str: "BYTE", binder: notImplemented },
    0x1401: { str: "UNSIGNED_BYTE", binder: notImplemented },
    0x1402: { str: "SHORT", binder: notImplemented },
    0x1403: { str: "UNSIGNED_SHORT", binder: notImplemented },
    0x1404: { str: "INT", binder: bindUniformInt },
    0x1405: { str: "UNSIGNED_INT", binder: notImplemented },
    0x1406: { str: "FLOAT", binder: bindUniformFloat },
};
var ShaderProgram = (function (_super) {
    __extends(ShaderProgram, _super);
    function ShaderProgram(gl, vertexSource, fragmentSource) {
        var _this = this;
        function createShader(type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compileSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compileSuccess) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        _this = _super.call(this, gl) || this;
        _this.id = null;
        _this.uCount = 0;
        _this.aCount = 0;
        var vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
        var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
        var id = gl.createProgram();
        gl.attachShader(id, vertexShader);
        gl.attachShader(id, fragmentShader);
        gl.linkProgram(id);
        var linkSuccess = gl.getProgramParameter(id, gl.LINK_STATUS);
        if (!linkSuccess) {
            console.error(gl.getProgramInfoLog(id));
            gl.deleteProgram(id);
        }
        else {
            _this.id = id;
            _this.introspection();
        }
        return _this;
    }
    ShaderProgram.prototype.freeGLResources = function () {
        _super.prototype.gl.call(this).deleteProgram(this.id);
        this.id = null;
    };
    ShaderProgram.prototype.use = function () {
        _super.prototype.gl.call(this).useProgram(this.id);
    };
    ShaderProgram.prototype.bindUniforms = function () {
        var _this = this;
        var gl = _super.prototype.gl.call(this);
        var currTextureUnitNb = 0;
        Object.keys(this.u).forEach(function (uName) {
            var uniform = _this.u[uName];
            if (uniform.value !== null) {
                if (uniform.type === 0x8B5E || uniform.type === 0x8B60) {
                    var unitNb = currTextureUnitNb;
                    types[uniform.type].binder(gl, uniform.loc, unitNb, uniform.value);
                    currTextureUnitNb++;
                }
                else {
                    types[uniform.type].binder(gl, uniform.loc, uniform.value);
                }
            }
        });
    };
    ShaderProgram.prototype.bindAttributes = function () {
        var _this = this;
        Object.keys(this.a).forEach(function (aName) {
            var attribute = _this.a[aName];
            if (attribute.VBO !== null) {
                attribute.VBO.bind(attribute.loc);
            }
        });
    };
    ShaderProgram.prototype.bindUniformsAndAttributes = function () {
        this.bindUniforms();
        this.bindAttributes();
    };
    ShaderProgram.prototype.introspection = function () {
        var gl = _super.prototype.gl.call(this);
        this.uCount = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
        this.u = [];
        for (var i = 0; i < this.uCount; ++i) {
            var uniform = gl.getActiveUniform(this.id, i);
            var name_1 = uniform.name;
            this.u[name_1] = {
                loc: gl.getUniformLocation(this.id, name_1),
                size: uniform.size,
                type: uniform.type,
                value: null,
            };
        }
        this.aCount = gl.getProgramParameter(this.id, gl.ACTIVE_ATTRIBUTES);
        this.a = [];
        for (var i = 0; i < this.aCount; ++i) {
            var attribute = gl.getActiveAttrib(this.id, i);
            var name_2 = attribute.name;
            this.a[name_2] = {
                VBO: null,
                loc: gl.getAttribLocation(this.id, name_2),
                size: attribute.size,
                type: attribute.type,
            };
        }
    };
    return ShaderProgram;
}(gl_resource_1.default));
exports.default = ShaderProgram;


/***/ }),

/***/ "./tmp/script/gl-utils/vbo.js":
/*!************************************!*\
  !*** ./tmp/script/gl-utils/vbo.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./tmp/script/gl-utils/gl-resource.js"));
var VBO = (function (_super) {
    __extends(VBO, _super);
    function VBO(gl, array, size, type) {
        var _this = _super.call(this, gl) || this;
        _this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.id);
        gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        _this.size = size;
        _this.type = type;
        _this.normalize = false;
        _this.stride = 0;
        _this.offset = 0;
        return _this;
    }
    VBO.createQuad = function (gl, minX, minY, maxX, maxY) {
        var vert = [
            minX, minY,
            maxX, minY,
            minX, maxY,
            maxX, maxY,
        ];
        return new VBO(gl, new Float32Array(vert), 2, gl.FLOAT);
    };
    VBO.prototype.freeGLResources = function () {
        this.gl().deleteBuffer(this.id);
        this.id = null;
    };
    VBO.prototype.bind = function (location) {
        var gl = _super.prototype.gl.call(this);
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.vertexAttribPointer(location, this.size, this.type, this.normalize, this.stride, this.offset);
    };
    return VBO;
}(gl_resource_1.default));
exports.default = VBO;


/***/ }),

/***/ "./tmp/script/gl-utils/viewport.js":
/*!*****************************************!*\
  !*** ./tmp/script/gl-utils/viewport.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Viewport = (function () {
    function Viewport(left, lower, width, height) {
        this.left = left;
        this.lower = lower;
        this.width = width;
        this.height = height;
    }
    Viewport.setFullCanvas = function (gl) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    Viewport.prototype.set = function (gl) {
        gl.viewport(this.lower, this.left, this.width, this.height);
    };
    return Viewport;
}());
exports.default = Viewport;


/***/ }),

/***/ "./tmp/script/main.js":
/*!****************************!*\
  !*** ./tmp/script/main.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var converter_1 = __importDefault(__webpack_require__(/*! ./converter */ "./tmp/script/converter.js"));
var format_utils_1 = __webpack_require__(/*! ./format-utils */ "./tmp/script/format-utils.js");
var GlCanvas = __importStar(__webpack_require__(/*! ./gl-utils/gl-canvas */ "./tmp/script/gl-utils/gl-canvas.js"));
var gl_canvas_1 = __webpack_require__(/*! ./gl-utils/gl-canvas */ "./tmp/script/gl-utils/gl-canvas.js");
var viewport_1 = __importDefault(__webpack_require__(/*! ./gl-utils/viewport */ "./tmp/script/gl-utils/viewport.js"));
var parameters_1 = __webpack_require__(/*! ./parameters */ "./tmp/script/parameters.js");
var viewer_1 = __importDefault(__webpack_require__(/*! ./viewer */ "./tmp/script/viewer.js"));
function main() {
    function resetEditControls() {
        parameters_1.Parameters.paddingTop = 0;
        parameters_1.Parameters.paddingBottom = 0;
        parameters_1.Parameters.paddingBack = 0;
        parameters_1.Parameters.flipVertically = false;
    }
    Canvas.showLoader(true);
    parameters_1.Parameters.onImageLoadObservers.push(resetEditControls);
    parameters_1.Parameters.image = new Image();
    parameters_1.Parameters.image.src = "./images/skybox.jpg";
    parameters_1.Parameters.inputFormat = format_utils_1.Format.Skybox;
    parameters_1.Parameters.outputFormat = format_utils_1.Format.Skysphere;
    parameters_1.Parameters.previewOutput = false;
    parameters_1.Parameters.fov = 70 * Math.PI / 180;
    parameters_1.Parameters.showFrame = false;
    resetEditControls();
    var glParams = {
        alpha: false,
        preserveDrawingBuffer: true,
    };
    if (!GlCanvas.initGL(glParams)) {
        return;
    }
    var viewer = new viewer_1.default();
    var converter = new converter_1.default();
    var forceRedraw = false;
    FileControl.addDownloadObserver("file-download-id", function () {
        var idealWidth = parameters_1.Parameters.image.width * parameters_1.Parameters.outputPercentage;
        var width = Math.pow(2, Math.floor(Math.log(idealWidth) * Math.LOG2E));
        var height = width / format_utils_1.FormatUtils.ratio(parameters_1.Parameters.outputFormat);
        var canvas = Canvas.getCanvas();
        canvas.style.position = "absolute";
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;
        GlCanvas.adjustSize();
        viewport_1.default.setFullCanvas(gl_canvas_1.gl);
        gl_canvas_1.gl.clear(gl_canvas_1.gl.COLOR_BUFFER_BIT | gl_canvas_1.gl.DEPTH_BUFFER_BIT);
        converter.draw(viewer.texture);
        gl_canvas_1.gl.clear(gl_canvas_1.gl.COLOR_BUFFER_BIT | gl_canvas_1.gl.DEPTH_BUFFER_BIT);
        converter.draw(viewer.texture);
        function restoreCanvas() {
            canvas.style.position = "";
            canvas.style.width = "";
            canvas.style.height = "";
            forceRedraw = true;
        }
        if (canvas.msToBlob) {
            var blob = canvas.msToBlob();
            window.navigator.msSaveBlob(blob, "image.png");
            restoreCanvas();
        }
        else {
            canvas.toBlob(function (blob) {
                var link = document.createElement("a");
                link.download = "image.png";
                link.href = URL.createObjectURL(blob);
                link.click();
                restoreCanvas();
            });
        }
    });
    var previewViewport = new viewport_1.default(0, 0, 1, 1);
    function mainLoop() {
        viewer.update();
        if (viewer.needToRedraw || forceRedraw) {
            GlCanvas.adjustSize();
            viewport_1.default.setFullCanvas(gl_canvas_1.gl);
            gl_canvas_1.gl.clear(gl_canvas_1.gl.COLOR_BUFFER_BIT | gl_canvas_1.gl.DEPTH_BUFFER_BIT);
            viewer.draw();
            if (parameters_1.Parameters.previewOutput) {
                previewViewport.width = 0.3 * gl_canvas_1.gl.drawingBufferWidth;
                previewViewport.height = previewViewport.width / format_utils_1.FormatUtils.ratio(parameters_1.Parameters.outputFormat);
                previewViewport.set(gl_canvas_1.gl);
                converter.draw(viewer.texture);
            }
            forceRedraw = false;
        }
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}
main();


/***/ }),

/***/ "./tmp/script/parameters.js":
/*!**********************************!*\
  !*** ./tmp/script/parameters.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var format_utils_1 = __webpack_require__(/*! ./format-utils */ "./tmp/script/format-utils.js");
var onChangeObservers = new Array();
function callOnChangeObservers() {
    for (var _i = 0, _a = Parameters.onChangeObservers; _i < _a.length; _i++) {
        var callback = _a[_i];
        callback();
    }
}
var onImageLoadObservers = new Array();
var image;
var FILE_UPLOAD_CONTROL = "file-upload-id";
FileControl.addUploadObserver(FILE_UPLOAD_CONTROL, function (files) {
    Canvas.showLoader(true);
    var reader = new FileReader();
    reader.onload = function () {
        Parameters.image = new Image();
        Parameters.image.src = reader.result;
    };
    reader.readAsDataURL(files[0]);
});
var onInputFormatChangeObservers = new Array();
var inputFormat;
var INPUT_FORMAT_CONTROL = "input-format";
Tabs.addObserver(INPUT_FORMAT_CONTROL, function (values) {
    var previous = inputFormat;
    inputFormat = format_utils_1.FormatUtils.parseString(values[0]);
    for (var _i = 0, onInputFormatChangeObservers_1 = onInputFormatChangeObservers; _i < onInputFormatChangeObservers_1.length; _i++) {
        var callback = onInputFormatChangeObservers_1[_i];
        callback(previous, inputFormat);
    }
});
var outputFormat;
var OUTPUT_FORMAT_CONTROL = "output-format";
Tabs.addObserver(OUTPUT_FORMAT_CONTROL, function (values) {
    outputFormat = format_utils_1.FormatUtils.parseString(values[0]);
    callOnChangeObservers();
});
var outputPreview;
var OUPUT_PREVIEW_CONTROL = "output-preview-id";
Checkbox.addObserver(OUPUT_PREVIEW_CONTROL, function (checked) {
    outputPreview = checked;
    callOnChangeObservers();
});
var fov;
var FOV_CONTROL = "fov-range-id";
Range.addObserver(FOV_CONTROL, function (newFov) {
    fov = Math.PI / 180 * newFov;
    callOnChangeObservers();
});
var showFrame;
var FRAME_CONTROL = "frame-checkbox-id";
Checkbox.addObserver(FRAME_CONTROL, function (checked) {
    showFrame = checked;
    callOnChangeObservers();
});
var paddingTOP;
var PADDING_TOP_CONTROL = "padding-top-range-id";
Range.addObserver(PADDING_TOP_CONTROL, function (margin) {
    paddingTOP = margin;
    callOnChangeObservers();
});
var paddingBottom;
var PADDING_BOTTOM_CONTROL = "padding-bottom-range-id";
Range.addObserver(PADDING_BOTTOM_CONTROL, function (margin) {
    paddingBottom = margin;
    callOnChangeObservers();
});
var paddingBack;
var PADDING_BACK_CONTROL = "padding-back-range-id";
Range.addObserver(PADDING_BACK_CONTROL, function (margin) {
    paddingBack = margin;
    callOnChangeObservers();
});
var flipVertically;
var FLIP_VERTICALLY_CONTROL = "flip-vertically-checkbox-id";
Checkbox.addObserver(FLIP_VERTICALLY_CONTROL, function (checked) {
    flipVertically = checked;
    callOnChangeObservers();
});
Canvas.Observers.mouseWheel.push(function (delta) {
    Parameters.fov += delta * 10 * Math.PI / 180;
});
var Parameters = (function () {
    function Parameters() {
    }
    Object.defineProperty(Parameters, "onChangeObservers", {
        get: function () {
            return onChangeObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "onInputFormatChangeObservers", {
        get: function () {
            return onInputFormatChangeObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "onImageLoadObservers", {
        get: function () {
            return onImageLoadObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "image", {
        get: function () {
            return image;
        },
        set: function (img) {
            var ERROR_MESSAGE_ID = "invalid-image";
            image = img;
            image.addEventListener("load", function () {
                Demopage.removeErrorMessage(ERROR_MESSAGE_ID);
                for (var _i = 0, onImageLoadObservers_1 = onImageLoadObservers; _i < onImageLoadObservers_1.length; _i++) {
                    var callback = onImageLoadObservers_1[_i];
                    callback(image);
                }
                callOnChangeObservers();
            });
            image.addEventListener("error", function () {
                Demopage.setErrorMessage(ERROR_MESSAGE_ID, "The image could not be loaded.");
                Canvas.showLoader(false);
                console.error("Image could not be loaded.");
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "inputFormat", {
        get: function () {
            return inputFormat;
        },
        set: function (value) {
            inputFormat = value;
            Tabs.setValues(INPUT_FORMAT_CONTROL, [value]);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "previewOutput", {
        get: function () {
            return outputPreview;
        },
        set: function (show) {
            outputPreview = show;
            Checkbox.setChecked(OUPUT_PREVIEW_CONTROL, show);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "outputFormat", {
        get: function () {
            return outputFormat;
        },
        set: function (value) {
            outputFormat = value;
            Tabs.setValues(OUTPUT_FORMAT_CONTROL, [value]);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "outputPercentage", {
        get: function () {
            return +Tabs.getValues("output-quality")[0] / 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "fov", {
        get: function () {
            return fov;
        },
        set: function (value) {
            Range.setValue(FOV_CONTROL, value * 180 / Math.PI);
            fov = Range.getValue(FOV_CONTROL) * Math.PI / 180;
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "showFrame", {
        get: function () {
            return showFrame;
        },
        set: function (show) {
            showFrame = show;
            Checkbox.setChecked(FRAME_CONTROL, show);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "paddingTop", {
        get: function () {
            return paddingTOP;
        },
        set: function (margin) {
            Range.setValue(PADDING_TOP_CONTROL, margin);
            paddingTOP = Range.getValue(PADDING_TOP_CONTROL);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "paddingBottom", {
        get: function () {
            return paddingBottom;
        },
        set: function (margin) {
            Range.setValue(PADDING_BOTTOM_CONTROL, margin);
            paddingBottom = Range.getValue(PADDING_BOTTOM_CONTROL);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "paddingBack", {
        get: function () {
            return paddingBack;
        },
        set: function (margin) {
            Range.setValue(PADDING_BACK_CONTROL, margin);
            paddingBack = Range.getValue(PADDING_BACK_CONTROL);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "flipVertically", {
        get: function () {
            return flipVertically;
        },
        set: function (show) {
            flipVertically = show;
            Checkbox.setChecked(FLIP_VERTICALLY_CONTROL, show);
            callOnChangeObservers();
        },
        enumerable: true,
        configurable: true
    });
    return Parameters;
}());
exports.Parameters = Parameters;
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "canvas:active { cursor: grab; }";
document.body.appendChild(css);


/***/ }),

/***/ "./tmp/script/viewer.js":
/*!******************************!*\
  !*** ./tmp/script/viewer.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_canvas_1 = __webpack_require__(/*! ./gl-utils/gl-canvas */ "./tmp/script/gl-utils/gl-canvas.js");
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-utils/gl-resource */ "./tmp/script/gl-utils/gl-resource.js"));
var ShaderManager = __importStar(__webpack_require__(/*! ./gl-utils/shader-manager */ "./tmp/script/gl-utils/shader-manager.js"));
var vbo_1 = __importDefault(__webpack_require__(/*! ./gl-utils/vbo */ "./tmp/script/gl-utils/vbo.js"));
var mat4_1 = __webpack_require__(/*! ./gl-utils/matrix/mat4 */ "./tmp/script/gl-utils/matrix/mat4.js");
var vec3_1 = __webpack_require__(/*! ./gl-utils/matrix/vec3 */ "./tmp/script/gl-utils/matrix/vec3.js");
var format_utils_1 = __webpack_require__(/*! ./format-utils */ "./tmp/script/format-utils.js");
var parameters_1 = __webpack_require__(/*! ./parameters */ "./tmp/script/parameters.js");
var Viewer = (function (_super) {
    __extends(Viewer, _super);
    function Viewer() {
        var _this = _super.call(this, gl_canvas_1.gl) || this;
        _this._eyePos = new vec3_1.Vec3(0, 0, 0);
        _this._vertical = new vec3_1.Vec3(0, 0, 1);
        _this._tmpMatrix = new mat4_1.Mat4();
        _this._projToWorldMatrix = new mat4_1.Mat4();
        _this.resetThetaPhi();
        _this._needToReloadImage = false;
        _this._needToRedraw = true;
        var doNeedToRedraw = function () { _this._needToRedraw = true; };
        var doNeedToReloadImage = function () {
            doNeedToRedraw();
            _this.resetThetaPhi();
            _this._needToReloadImage = true;
        };
        parameters_1.Parameters.onInputFormatChangeObservers.push(function (previous, newOne) {
            if (previous === format_utils_1.Format.Skybox || newOne === format_utils_1.Format.Skybox) {
                Canvas.showLoader(true);
                doNeedToReloadImage();
            }
            else {
                doNeedToRedraw();
            }
        });
        parameters_1.Parameters.onChangeObservers.push(doNeedToRedraw);
        Canvas.Observers.canvasResize.push(doNeedToRedraw);
        Canvas.Observers.mouseDrag.push(doNeedToRedraw);
        _this._vbo = vbo_1.default.createQuad(gl_canvas_1.gl, -1, -1, 1, 1);
        _this.buildShader("_shaderSkysphere", "viewer.vert", "viewerSkysphere.frag");
        _this.buildShader("_shaderSkybox", "viewer.vert", "viewerSkybox.frag");
        _this.buildShader("_shaderTinyplanet", "viewer.vert", "viewerTinyplanet.frag");
        Canvas.Observers.mouseDrag.push(function (dX, dY) {
            _this._phi += parameters_1.Parameters.fov * Canvas.getAspectRatio() * dX;
            _this._theta -= parameters_1.Parameters.fov * dY;
            _this._theta = Math.min(Math.PI - 0.001, Math.max(0.001, _this._theta));
            doNeedToRedraw();
        });
        parameters_1.Parameters.onImageLoadObservers.push(function (image) {
            parameters_1.Parameters.inputFormat = format_utils_1.FormatUtils.guessFormat(image);
            doNeedToReloadImage();
        });
        return _this;
    }
    Viewer.prototype.freeGLResources = function () {
        if (this._vbo) {
            this._vbo.freeGLResources();
            this._vbo = null;
        }
        if (this._texture) {
            gl_canvas_1.gl.deleteTexture(this._texture);
            this._texture = null;
        }
        if (this._shaderSkybox) {
            this._shaderSkybox.freeGLResources();
            this._shaderSkybox = null;
        }
        if (this._shaderSkysphere) {
            this._shaderSkysphere.freeGLResources();
            this._shaderSkysphere = null;
        }
        if (this._shaderTinyplanet) {
            this._shaderTinyplanet.freeGLResources();
            this._shaderTinyplanet = null;
        }
    };
    Object.defineProperty(Viewer.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Viewer.prototype, "needToRedraw", {
        get: function () {
            return this._needToRedraw;
        },
        enumerable: true,
        configurable: true
    });
    Viewer.prototype.update = function () {
        if (this._needToReloadImage) {
            if (parameters_1.Parameters.inputFormat === format_utils_1.Format.Skybox) {
                this.splitAndLoadSkybox(parameters_1.Parameters.image);
            }
            else {
                this.loadTexture(parameters_1.Parameters.image);
            }
            this._needToReloadImage = false;
            Canvas.showLoader(false);
        }
    };
    Viewer.prototype.draw = function () {
        var shader;
        if (parameters_1.Parameters.inputFormat === format_utils_1.Format.Skybox) {
            shader = this._shaderSkybox;
        }
        else if (parameters_1.Parameters.inputFormat === format_utils_1.Format.Skysphere) {
            shader = this._shaderSkysphere;
        }
        else {
            shader = this._shaderTinyplanet;
        }
        if (shader) {
            this.recomputeMatrices();
            shader.u["uProjToWorld"].value = this._projToWorldMatrix.val;
            shader.u["uTexture"].value = this._texture;
            shader.u["uPaddingTop"].value = parameters_1.Parameters.paddingTop;
            shader.u["uPaddingBottom"].value = parameters_1.Parameters.paddingBottom;
            shader.u["uPaddingBack"].value = parameters_1.Parameters.paddingBack;
            shader.u["uFlipVertically"].value = parameters_1.Parameters.flipVertically ? -1 : 1;
            shader.u["uShowFrame"].value = parameters_1.Parameters.showFrame ? 1 : 0;
            shader.use();
            shader.bindUniformsAndAttributes();
            gl_canvas_1.gl.drawArrays(gl_canvas_1.gl.TRIANGLE_STRIP, 0, 4);
        }
        this._needToRedraw = false;
    };
    Viewer.prototype.resetThetaPhi = function () {
        this._theta = 0.5 * Math.PI;
        this._phi = 0;
        this._needToRedraw = true;
    };
    Viewer.prototype.loadTexture = function (image) {
        gl_canvas_1.gl.deleteTexture(this._texture);
        this._texture = gl_canvas_1.gl.createTexture();
        gl_canvas_1.gl.bindTexture(gl_canvas_1.gl.TEXTURE_2D, this._texture);
        gl_canvas_1.gl.texImage2D(gl_canvas_1.gl.TEXTURE_2D, 0, gl_canvas_1.gl.RGBA, gl_canvas_1.gl.RGBA, gl_canvas_1.gl.UNSIGNED_BYTE, image);
        gl_canvas_1.gl.texParameteri(gl_canvas_1.gl.TEXTURE_2D, gl_canvas_1.gl.TEXTURE_WRAP_S, gl_canvas_1.gl.CLAMP_TO_EDGE);
        gl_canvas_1.gl.texParameteri(gl_canvas_1.gl.TEXTURE_2D, gl_canvas_1.gl.TEXTURE_WRAP_T, gl_canvas_1.gl.CLAMP_TO_EDGE);
        gl_canvas_1.gl.texParameteri(gl_canvas_1.gl.TEXTURE_2D, gl_canvas_1.gl.TEXTURE_MIN_FILTER, gl_canvas_1.gl.LINEAR);
        gl_canvas_1.gl.texParameteri(gl_canvas_1.gl.TEXTURE_2D, gl_canvas_1.gl.TEXTURE_MAG_FILTER, gl_canvas_1.gl.LINEAR);
    };
    Viewer.prototype.splitAndLoadSkybox = function (image) {
        function chooseUpperPowerOfTwo(n) {
            return Math.pow(2, Math.ceil(Math.log(n) * Math.LOG2E));
        }
        var side = chooseUpperPowerOfTwo(Math.floor(Math.max(image.width / 4, image.height / 3)));
        gl_canvas_1.gl.deleteTexture(this._texture);
        this._texture = gl_canvas_1.gl.createTexture();
        var context = document.createElement("canvas").getContext("2d");
        context.canvas.width = side;
        context.canvas.height = side;
        var sidesStyles = [
            { target: gl_canvas_1.gl.TEXTURE_CUBE_MAP_POSITIVE_X, position: { x: 2, y: 1 }, rotation: 0.5 * Math.PI },
            { target: gl_canvas_1.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, position: { x: 0, y: 1 }, rotation: -0.5 * Math.PI },
            { target: gl_canvas_1.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, position: { x: 1, y: 1 }, rotation: -Math.PI },
            { target: gl_canvas_1.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, position: { x: 3, y: 1 }, rotation: 0 },
            { target: gl_canvas_1.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, position: { x: 1, y: 0 }, rotation: Math.PI },
            { target: gl_canvas_1.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, position: { x: 1, y: 2 }, rotation: 0 },
        ];
        gl_canvas_1.gl.bindTexture(gl_canvas_1.gl.TEXTURE_CUBE_MAP, this._texture);
        context.translate(side, 0);
        context.scale(-1, 1);
        var sourceWidth = image.width / 4;
        var sourceHeight = image.height / 3;
        for (var _i = 0, sidesStyles_1 = sidesStyles; _i < sidesStyles_1.length; _i++) {
            var sideStyle = sidesStyles_1[_i];
            context.translate(0.5 * side, 0.5 * side);
            context.rotate(sideStyle.rotation);
            context.translate(-0.5 * side, -0.5 * side);
            context.drawImage(image, sideStyle.position.x * sourceWidth, sideStyle.position.y * sourceHeight, sourceWidth, sourceHeight, 0, 0, side, side);
            gl_canvas_1.gl.texImage2D(sideStyle.target, 0, gl_canvas_1.gl.RGBA, gl_canvas_1.gl.RGBA, gl_canvas_1.gl.UNSIGNED_BYTE, context.canvas);
            context.translate(0.5 * side, 0.5 * side);
            context.rotate(-sideStyle.rotation);
            context.translate(-0.5 * side, -0.5 * side);
        }
        gl_canvas_1.gl.generateMipmap(gl_canvas_1.gl.TEXTURE_CUBE_MAP);
        gl_canvas_1.gl.texParameteri(gl_canvas_1.gl.TEXTURE_CUBE_MAP, gl_canvas_1.gl.TEXTURE_MIN_FILTER, gl_canvas_1.gl.LINEAR_MIPMAP_LINEAR);
        gl_canvas_1.gl.texParameteri(gl_canvas_1.gl.TEXTURE_CUBE_MAP, gl_canvas_1.gl.TEXTURE_MAG_FILTER, gl_canvas_1.gl.LINEAR);
    };
    Viewer.prototype.buildShader = function (name, vertex, fragment) {
        var _this = this;
        ShaderManager.buildShader({
            fragmentFilename: fragment,
            vertexFilename: vertex,
        }, function (shader) {
            if (shader !== null) {
                _this[name] = shader;
                _this[name].a["aCorner"].VBO = _this._vbo;
                _this._needToRedraw = true;
            }
        });
    };
    Viewer.prototype.recomputeMatrices = function () {
        var lookAt = new vec3_1.Vec3(Math.sin(this._theta) * Math.cos(this._phi), Math.sin(this._theta) * Math.sin(this._phi), Math.cos(this._theta));
        this._projToWorldMatrix.lookAt(this._eyePos, lookAt, this._vertical);
        this._projToWorldMatrix.invert();
        var aspectRatio = gl_canvas_1.gl.canvas.clientWidth / gl_canvas_1.gl.canvas.clientHeight;
        this._tmpMatrix.perspectiveInverse(parameters_1.Parameters.fov, aspectRatio, 0.1, Infinity);
        this._projToWorldMatrix.multiplyRight(this._tmpMatrix);
    };
    return Viewer;
}(gl_resource_1.default));
exports.default = Viewer;


/***/ })

/******/ });