var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/mersenne-twister/src/mersenne-twister.js
var require_mersenne_twister = __commonJS({
  "node_modules/mersenne-twister/src/mersenne-twister.js"(exports, module) {
    "use strict";
    var MersenneTwister2 = function(seed) {
      if (seed == void 0) {
        seed = (/* @__PURE__ */ new Date()).getTime();
      }
      this.N = 624;
      this.M = 397;
      this.MATRIX_A = 2567483615;
      this.UPPER_MASK = 2147483648;
      this.LOWER_MASK = 2147483647;
      this.mt = new Array(this.N);
      this.mti = this.N + 1;
      if (seed.constructor == Array) {
        this.init_by_array(seed, seed.length);
      } else {
        this.init_seed(seed);
      }
    };
    MersenneTwister2.prototype.init_seed = function(s) {
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        var s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
        this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti;
        this.mt[this.mti] >>>= 0;
      }
    };
    MersenneTwister2.prototype.init_by_array = function(init_key, key_length) {
      var i, j, k;
      this.init_seed(19650218);
      i = 1;
      j = 0;
      k = this.N > key_length ? this.N : key_length;
      for (; k; k--) {
        var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
        this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1664525 << 16) + (s & 65535) * 1664525) + init_key[j] + j;
        this.mt[i] >>>= 0;
        i++;
        j++;
        if (i >= this.N) {
          this.mt[0] = this.mt[this.N - 1];
          i = 1;
        }
        if (j >= key_length) j = 0;
      }
      for (k = this.N - 1; k; k--) {
        var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
        this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1566083941 << 16) + (s & 65535) * 1566083941) - i;
        this.mt[i] >>>= 0;
        i++;
        if (i >= this.N) {
          this.mt[0] = this.mt[this.N - 1];
          i = 1;
        }
      }
      this.mt[0] = 2147483648;
    };
    MersenneTwister2.prototype.random_int = function() {
      var y;
      var mag01 = new Array(0, this.MATRIX_A);
      if (this.mti >= this.N) {
        var kk;
        if (this.mti == this.N + 1)
          this.init_seed(5489);
        for (kk = 0; kk < this.N - this.M; kk++) {
          y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
          this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 1];
        }
        for (; kk < this.N - 1; kk++) {
          y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
          this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 1];
        }
        y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
        this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 1];
        this.mti = 0;
      }
      y = this.mt[this.mti++];
      y ^= y >>> 11;
      y ^= y << 7 & 2636928640;
      y ^= y << 15 & 4022730752;
      y ^= y >>> 18;
      return y >>> 0;
    };
    MersenneTwister2.prototype.random_int31 = function() {
      return this.random_int() >>> 1;
    };
    MersenneTwister2.prototype.random_incl = function() {
      return this.random_int() * (1 / 4294967295);
    };
    MersenneTwister2.prototype.random = function() {
      return this.random_int() * (1 / 4294967296);
    };
    MersenneTwister2.prototype.random_excl = function() {
      return (this.random_int() + 0.5) * (1 / 4294967296);
    };
    MersenneTwister2.prototype.random_long = function() {
      var a = this.random_int() >>> 5, b = this.random_int() >>> 6;
      return (a * 67108864 + b) * (1 / 9007199254740992);
    };
    module.exports = MersenneTwister2;
  }
});

// node_modules/@cesium/engine/Source/Core/defined.js
function defined(value) {
  return value !== void 0 && value !== null;
}
var defined_default = defined;

// node_modules/@cesium/engine/Source/Core/DeveloperError.js
function DeveloperError(message) {
  this.name = "DeveloperError";
  this.message = message;
  let stack;
  try {
    throw new Error();
  } catch (e) {
    stack = e.stack;
  }
  this.stack = stack;
}
if (defined_default(Object.create)) {
  DeveloperError.prototype = Object.create(Error.prototype);
  DeveloperError.prototype.constructor = DeveloperError;
}
DeveloperError.prototype.toString = function() {
  let str = `${this.name}: ${this.message}`;
  if (defined_default(this.stack)) {
    str += `
${this.stack.toString()}`;
  }
  return str;
};
DeveloperError.throwInstantiationError = function() {
  throw new DeveloperError(
    "This function defines an interface and should not be called directly."
  );
};
var DeveloperError_default = DeveloperError;

// node_modules/@cesium/engine/Source/Core/Check.js
var Check = {};
Check.typeOf = {};
function getUndefinedErrorMessage(name) {
  return `${name} is required, actual value was undefined`;
}
function getFailedTypeErrorMessage(actual, expected, name) {
  return `Expected ${name} to be typeof ${expected}, actual typeof was ${actual}`;
}
Check.defined = function(name, test) {
  if (!defined_default(test)) {
    throw new DeveloperError_default(getUndefinedErrorMessage(name));
  }
};
Check.typeOf.func = function(name, test) {
  if (typeof test !== "function") {
    throw new DeveloperError_default(
      getFailedTypeErrorMessage(typeof test, "function", name)
    );
  }
};
Check.typeOf.string = function(name, test) {
  if (typeof test !== "string") {
    throw new DeveloperError_default(
      getFailedTypeErrorMessage(typeof test, "string", name)
    );
  }
};
Check.typeOf.number = function(name, test) {
  if (typeof test !== "number") {
    throw new DeveloperError_default(
      getFailedTypeErrorMessage(typeof test, "number", name)
    );
  }
};
Check.typeOf.number.lessThan = function(name, test, limit) {
  Check.typeOf.number(name, test);
  if (test >= limit) {
    throw new DeveloperError_default(
      `Expected ${name} to be less than ${limit}, actual value was ${test}`
    );
  }
};
Check.typeOf.number.lessThanOrEquals = function(name, test, limit) {
  Check.typeOf.number(name, test);
  if (test > limit) {
    throw new DeveloperError_default(
      `Expected ${name} to be less than or equal to ${limit}, actual value was ${test}`
    );
  }
};
Check.typeOf.number.greaterThan = function(name, test, limit) {
  Check.typeOf.number(name, test);
  if (test <= limit) {
    throw new DeveloperError_default(
      `Expected ${name} to be greater than ${limit}, actual value was ${test}`
    );
  }
};
Check.typeOf.number.greaterThanOrEquals = function(name, test, limit) {
  Check.typeOf.number(name, test);
  if (test < limit) {
    throw new DeveloperError_default(
      `Expected ${name} to be greater than or equal to ${limit}, actual value was ${test}`
    );
  }
};
Check.typeOf.object = function(name, test) {
  if (typeof test !== "object") {
    throw new DeveloperError_default(
      getFailedTypeErrorMessage(typeof test, "object", name)
    );
  }
};
Check.typeOf.bool = function(name, test) {
  if (typeof test !== "boolean") {
    throw new DeveloperError_default(
      getFailedTypeErrorMessage(typeof test, "boolean", name)
    );
  }
};
Check.typeOf.bigint = function(name, test) {
  if (typeof test !== "bigint") {
    throw new DeveloperError_default(
      getFailedTypeErrorMessage(typeof test, "bigint", name)
    );
  }
};
Check.typeOf.number.equals = function(name1, name2, test1, test2) {
  Check.typeOf.number(name1, test1);
  Check.typeOf.number(name2, test2);
  if (test1 !== test2) {
    throw new DeveloperError_default(
      `${name1} must be equal to ${name2}, the actual values are ${test1} and ${test2}`
    );
  }
};
var Check_default = Check;

// node_modules/@cesium/engine/Source/Core/Math.js
var import_mersenne_twister = __toESM(require_mersenne_twister(), 1);
var CesiumMath = {};
CesiumMath.EPSILON1 = 0.1;
CesiumMath.EPSILON2 = 0.01;
CesiumMath.EPSILON3 = 1e-3;
CesiumMath.EPSILON4 = 1e-4;
CesiumMath.EPSILON5 = 1e-5;
CesiumMath.EPSILON6 = 1e-6;
CesiumMath.EPSILON7 = 1e-7;
CesiumMath.EPSILON8 = 1e-8;
CesiumMath.EPSILON9 = 1e-9;
CesiumMath.EPSILON10 = 1e-10;
CesiumMath.EPSILON11 = 1e-11;
CesiumMath.EPSILON12 = 1e-12;
CesiumMath.EPSILON13 = 1e-13;
CesiumMath.EPSILON14 = 1e-14;
CesiumMath.EPSILON15 = 1e-15;
CesiumMath.EPSILON16 = 1e-16;
CesiumMath.EPSILON17 = 1e-17;
CesiumMath.EPSILON18 = 1e-18;
CesiumMath.EPSILON19 = 1e-19;
CesiumMath.EPSILON20 = 1e-20;
CesiumMath.EPSILON21 = 1e-21;
CesiumMath.GRAVITATIONALPARAMETER = 3986004418e5;
CesiumMath.SOLAR_RADIUS = 6955e5;
CesiumMath.LUNAR_RADIUS = 1737400;
CesiumMath.SIXTY_FOUR_KILOBYTES = 64 * 1024;
CesiumMath.FOUR_GIGABYTES = 4 * 1024 * 1024 * 1024;
CesiumMath.sign = Math.sign ?? function sign(value) {
  value = +value;
  if (value === 0 || value !== value) {
    return value;
  }
  return value > 0 ? 1 : -1;
};
CesiumMath.signNotZero = function(value) {
  return value < 0 ? -1 : 1;
};
CesiumMath.toSNorm = function(value, rangeMaximum) {
  rangeMaximum = rangeMaximum ?? 255;
  return Math.round(
    (CesiumMath.clamp(value, -1, 1) * 0.5 + 0.5) * rangeMaximum
  );
};
CesiumMath.fromSNorm = function(value, rangeMaximum) {
  rangeMaximum = rangeMaximum ?? 255;
  return CesiumMath.clamp(value, 0, rangeMaximum) / rangeMaximum * 2 - 1;
};
CesiumMath.normalize = function(value, rangeMinimum, rangeMaximum) {
  rangeMaximum = Math.max(rangeMaximum - rangeMinimum, 0);
  return rangeMaximum === 0 ? 0 : CesiumMath.clamp((value - rangeMinimum) / rangeMaximum, 0, 1);
};
CesiumMath.sinh = Math.sinh ?? function sinh(value) {
  return (Math.exp(value) - Math.exp(-value)) / 2;
};
CesiumMath.cosh = Math.cosh ?? function cosh(value) {
  return (Math.exp(value) + Math.exp(-value)) / 2;
};
CesiumMath.lerp = function(p, q, time) {
  return (1 - time) * p + time * q;
};
CesiumMath.PI = Math.PI;
CesiumMath.ONE_OVER_PI = 1 / Math.PI;
CesiumMath.PI_OVER_TWO = Math.PI / 2;
CesiumMath.PI_OVER_THREE = Math.PI / 3;
CesiumMath.PI_OVER_FOUR = Math.PI / 4;
CesiumMath.PI_OVER_SIX = Math.PI / 6;
CesiumMath.THREE_PI_OVER_TWO = 3 * Math.PI / 2;
CesiumMath.TWO_PI = 2 * Math.PI;
CesiumMath.ONE_OVER_TWO_PI = 1 / (2 * Math.PI);
CesiumMath.RADIANS_PER_DEGREE = Math.PI / 180;
CesiumMath.DEGREES_PER_RADIAN = 180 / Math.PI;
CesiumMath.RADIANS_PER_ARCSECOND = CesiumMath.RADIANS_PER_DEGREE / 3600;
CesiumMath.toRadians = function(degrees) {
  if (!defined_default(degrees)) {
    throw new DeveloperError_default("degrees is required.");
  }
  return degrees * CesiumMath.RADIANS_PER_DEGREE;
};
CesiumMath.toDegrees = function(radians) {
  if (!defined_default(radians)) {
    throw new DeveloperError_default("radians is required.");
  }
  return radians * CesiumMath.DEGREES_PER_RADIAN;
};
CesiumMath.convertLongitudeRange = function(angle) {
  if (!defined_default(angle)) {
    throw new DeveloperError_default("angle is required.");
  }
  const twoPi = CesiumMath.TWO_PI;
  const simplified = angle - Math.floor(angle / twoPi) * twoPi;
  if (simplified < -Math.PI) {
    return simplified + twoPi;
  }
  if (simplified >= Math.PI) {
    return simplified - twoPi;
  }
  return simplified;
};
CesiumMath.clampToLatitudeRange = function(angle) {
  if (!defined_default(angle)) {
    throw new DeveloperError_default("angle is required.");
  }
  return CesiumMath.clamp(
    angle,
    -1 * CesiumMath.PI_OVER_TWO,
    CesiumMath.PI_OVER_TWO
  );
};
CesiumMath.negativePiToPi = function(angle) {
  if (!defined_default(angle)) {
    throw new DeveloperError_default("angle is required.");
  }
  if (angle >= -CesiumMath.PI && angle <= CesiumMath.PI) {
    return angle;
  }
  return CesiumMath.zeroToTwoPi(angle + CesiumMath.PI) - CesiumMath.PI;
};
CesiumMath.zeroToTwoPi = function(angle) {
  if (!defined_default(angle)) {
    throw new DeveloperError_default("angle is required.");
  }
  if (angle >= 0 && angle <= CesiumMath.TWO_PI) {
    return angle;
  }
  const mod = CesiumMath.mod(angle, CesiumMath.TWO_PI);
  if (Math.abs(mod) < CesiumMath.EPSILON14 && Math.abs(angle) > CesiumMath.EPSILON14) {
    return CesiumMath.TWO_PI;
  }
  return mod;
};
CesiumMath.mod = function(m, n) {
  if (!defined_default(m)) {
    throw new DeveloperError_default("m is required.");
  }
  if (!defined_default(n)) {
    throw new DeveloperError_default("n is required.");
  }
  if (n === 0) {
    throw new DeveloperError_default("divisor cannot be 0.");
  }
  if (CesiumMath.sign(m) === CesiumMath.sign(n) && Math.abs(m) < Math.abs(n)) {
    return m;
  }
  return (m % n + n) % n;
};
CesiumMath.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("left is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("right is required.");
  }
  relativeEpsilon = relativeEpsilon ?? 0;
  absoluteEpsilon = absoluteEpsilon ?? relativeEpsilon;
  const absDiff = Math.abs(left - right);
  return absDiff <= absoluteEpsilon || absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right));
};
CesiumMath.lessThan = function(left, right, absoluteEpsilon) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("first is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("second is required.");
  }
  if (!defined_default(absoluteEpsilon)) {
    throw new DeveloperError_default("absoluteEpsilon is required.");
  }
  return left - right < -absoluteEpsilon;
};
CesiumMath.lessThanOrEquals = function(left, right, absoluteEpsilon) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("first is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("second is required.");
  }
  if (!defined_default(absoluteEpsilon)) {
    throw new DeveloperError_default("absoluteEpsilon is required.");
  }
  return left - right < absoluteEpsilon;
};
CesiumMath.greaterThan = function(left, right, absoluteEpsilon) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("first is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("second is required.");
  }
  if (!defined_default(absoluteEpsilon)) {
    throw new DeveloperError_default("absoluteEpsilon is required.");
  }
  return left - right > absoluteEpsilon;
};
CesiumMath.greaterThanOrEquals = function(left, right, absoluteEpsilon) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("first is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("second is required.");
  }
  if (!defined_default(absoluteEpsilon)) {
    throw new DeveloperError_default("absoluteEpsilon is required.");
  }
  return left - right > -absoluteEpsilon;
};
var factorials = [1];
CesiumMath.factorial = function(n) {
  if (typeof n !== "number" || n < 0) {
    throw new DeveloperError_default(
      "A number greater than or equal to 0 is required."
    );
  }
  const length = factorials.length;
  if (n >= length) {
    let sum = factorials[length - 1];
    for (let i = length; i <= n; i++) {
      const next = sum * i;
      factorials.push(next);
      sum = next;
    }
  }
  return factorials[n];
};
CesiumMath.incrementWrap = function(n, maximumValue, minimumValue) {
  minimumValue = minimumValue ?? 0;
  if (!defined_default(n)) {
    throw new DeveloperError_default("n is required.");
  }
  if (maximumValue <= minimumValue) {
    throw new DeveloperError_default("maximumValue must be greater than minimumValue.");
  }
  ++n;
  if (n > maximumValue) {
    n = minimumValue;
  }
  return n;
};
CesiumMath.isPowerOfTwo = function(n) {
  if (typeof n !== "number" || n < 0 || n > 4294967295) {
    throw new DeveloperError_default("A number between 0 and (2^32)-1 is required.");
  }
  return n !== 0 && (n & n - 1) === 0;
};
CesiumMath.nextPowerOfTwo = function(n) {
  if (typeof n !== "number" || n < 0 || n > 2147483648) {
    throw new DeveloperError_default("A number between 0 and 2^31 is required.");
  }
  --n;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  ++n;
  return n;
};
CesiumMath.previousPowerOfTwo = function(n) {
  if (typeof n !== "number" || n < 0 || n > 4294967295) {
    throw new DeveloperError_default("A number between 0 and (2^32)-1 is required.");
  }
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  n |= n >> 32;
  n = (n >>> 0) - (n >>> 1);
  return n;
};
CesiumMath.clamp = function(value, min, max) {
  Check_default.typeOf.number("value", value);
  Check_default.typeOf.number("min", min);
  Check_default.typeOf.number("max", max);
  return value < min ? min : value > max ? max : value;
};
var randomNumberGenerator = new import_mersenne_twister.default();
CesiumMath.setRandomNumberSeed = function(seed) {
  if (!defined_default(seed)) {
    throw new DeveloperError_default("seed is required.");
  }
  randomNumberGenerator = new import_mersenne_twister.default(seed);
};
CesiumMath.nextRandomNumber = function() {
  return randomNumberGenerator.random();
};
CesiumMath.randomBetween = function(min, max) {
  return CesiumMath.nextRandomNumber() * (max - min) + min;
};
CesiumMath.acosClamped = function(value) {
  if (!defined_default(value)) {
    throw new DeveloperError_default("value is required.");
  }
  return Math.acos(CesiumMath.clamp(value, -1, 1));
};
CesiumMath.asinClamped = function(value) {
  if (!defined_default(value)) {
    throw new DeveloperError_default("value is required.");
  }
  return Math.asin(CesiumMath.clamp(value, -1, 1));
};
CesiumMath.chordLength = function(angle, radius) {
  if (!defined_default(angle)) {
    throw new DeveloperError_default("angle is required.");
  }
  if (!defined_default(radius)) {
    throw new DeveloperError_default("radius is required.");
  }
  return 2 * radius * Math.sin(angle * 0.5);
};
CesiumMath.logBase = function(number, base) {
  if (!defined_default(number)) {
    throw new DeveloperError_default("number is required.");
  }
  if (!defined_default(base)) {
    throw new DeveloperError_default("base is required.");
  }
  return Math.log(number) / Math.log(base);
};
CesiumMath.cbrt = Math.cbrt ?? function cbrt(number) {
  const result = Math.pow(Math.abs(number), 1 / 3);
  return number < 0 ? -result : result;
};
CesiumMath.log2 = Math.log2 ?? function log2(number) {
  return Math.log(number) * Math.LOG2E;
};
CesiumMath.fog = function(distanceToCamera, density) {
  const scalar = distanceToCamera * density;
  return 1 - Math.exp(-(scalar * scalar));
};
CesiumMath.fastApproximateAtan = function(x) {
  Check_default.typeOf.number("x", x);
  return x * (-0.1784 * Math.abs(x) - 0.0663 * x * x + 1.0301);
};
CesiumMath.fastApproximateAtan2 = function(x, y) {
  Check_default.typeOf.number("x", x);
  Check_default.typeOf.number("y", y);
  let opposite;
  let t = Math.abs(x);
  opposite = Math.abs(y);
  const adjacent = Math.max(t, opposite);
  opposite = Math.min(t, opposite);
  const oppositeOverAdjacent = opposite / adjacent;
  if (isNaN(oppositeOverAdjacent)) {
    throw new DeveloperError_default("either x or y must be nonzero");
  }
  t = CesiumMath.fastApproximateAtan(oppositeOverAdjacent);
  t = Math.abs(y) > Math.abs(x) ? CesiumMath.PI_OVER_TWO - t : t;
  t = x < 0 ? CesiumMath.PI - t : t;
  t = y < 0 ? -t : t;
  return t;
};
var Math_default = CesiumMath;

// node_modules/@cesium/engine/Source/Core/Cartesian3.js
function Cartesian3(x, y, z) {
  this.x = x ?? 0;
  this.y = y ?? 0;
  this.z = z ?? 0;
}
Cartesian3.fromSpherical = function(spherical, result) {
  Check_default.typeOf.object("spherical", spherical);
  if (!defined_default(result)) {
    result = new Cartesian3();
  }
  const clock = spherical.clock;
  const cone = spherical.cone;
  const magnitude = spherical.magnitude ?? 1;
  const radial = magnitude * Math.sin(cone);
  result.x = radial * Math.cos(clock);
  result.y = radial * Math.sin(clock);
  result.z = magnitude * Math.cos(cone);
  return result;
};
Cartesian3.fromElements = function(x, y, z, result) {
  if (!defined_default(result)) {
    return new Cartesian3(x, y, z);
  }
  result.x = x;
  result.y = y;
  result.z = z;
  return result;
};
Cartesian3.clone = function(cartesian, result) {
  if (!defined_default(cartesian)) {
    return void 0;
  }
  if (!defined_default(result)) {
    return new Cartesian3(cartesian.x, cartesian.y, cartesian.z);
  }
  result.x = cartesian.x;
  result.y = cartesian.y;
  result.z = cartesian.z;
  return result;
};
Cartesian3.fromCartesian4 = Cartesian3.clone;
Cartesian3.packedLength = 3;
Cartesian3.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  array[startingIndex++] = value.x;
  array[startingIndex++] = value.y;
  array[startingIndex] = value.z;
  return array;
};
Cartesian3.unpack = function(array, startingIndex, result) {
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  if (!defined_default(result)) {
    result = new Cartesian3();
  }
  result.x = array[startingIndex++];
  result.y = array[startingIndex++];
  result.z = array[startingIndex];
  return result;
};
Cartesian3.packArray = function(array, result) {
  Check_default.defined("array", array);
  const length = array.length;
  const resultLength = length * 3;
  if (!defined_default(result)) {
    result = new Array(resultLength);
  } else if (!Array.isArray(result) && result.length !== resultLength) {
    throw new DeveloperError_default(
      "If result is a typed array, it must have exactly array.length * 3 elements"
    );
  } else if (result.length !== resultLength) {
    result.length = resultLength;
  }
  for (let i = 0; i < length; ++i) {
    Cartesian3.pack(array[i], result, i * 3);
  }
  return result;
};
Cartesian3.unpackArray = function(array, result) {
  Check_default.defined("array", array);
  Check_default.typeOf.number.greaterThanOrEquals("array.length", array.length, 3);
  if (array.length % 3 !== 0) {
    throw new DeveloperError_default("array length must be a multiple of 3.");
  }
  const length = array.length;
  if (!defined_default(result)) {
    result = new Array(length / 3);
  } else {
    result.length = length / 3;
  }
  for (let i = 0; i < length; i += 3) {
    const index = i / 3;
    result[index] = Cartesian3.unpack(array, i, result[index]);
  }
  return result;
};
Cartesian3.fromArray = Cartesian3.unpack;
Cartesian3.maximumComponent = function(cartesian) {
  Check_default.typeOf.object("cartesian", cartesian);
  return Math.max(cartesian.x, cartesian.y, cartesian.z);
};
Cartesian3.minimumComponent = function(cartesian) {
  Check_default.typeOf.object("cartesian", cartesian);
  return Math.min(cartesian.x, cartesian.y, cartesian.z);
};
Cartesian3.minimumByComponent = function(first, second, result) {
  Check_default.typeOf.object("first", first);
  Check_default.typeOf.object("second", second);
  Check_default.typeOf.object("result", result);
  result.x = Math.min(first.x, second.x);
  result.y = Math.min(first.y, second.y);
  result.z = Math.min(first.z, second.z);
  return result;
};
Cartesian3.maximumByComponent = function(first, second, result) {
  Check_default.typeOf.object("first", first);
  Check_default.typeOf.object("second", second);
  Check_default.typeOf.object("result", result);
  result.x = Math.max(first.x, second.x);
  result.y = Math.max(first.y, second.y);
  result.z = Math.max(first.z, second.z);
  return result;
};
Cartesian3.clamp = function(value, min, max, result) {
  Check_default.typeOf.object("value", value);
  Check_default.typeOf.object("min", min);
  Check_default.typeOf.object("max", max);
  Check_default.typeOf.object("result", result);
  const x = Math_default.clamp(value.x, min.x, max.x);
  const y = Math_default.clamp(value.y, min.y, max.y);
  const z = Math_default.clamp(value.z, min.z, max.z);
  result.x = x;
  result.y = y;
  result.z = z;
  return result;
};
Cartesian3.magnitudeSquared = function(cartesian) {
  Check_default.typeOf.object("cartesian", cartesian);
  return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z;
};
Cartesian3.magnitude = function(cartesian) {
  return Math.sqrt(Cartesian3.magnitudeSquared(cartesian));
};
var distanceScratch = new Cartesian3();
Cartesian3.distance = function(left, right) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Cartesian3.subtract(left, right, distanceScratch);
  return Cartesian3.magnitude(distanceScratch);
};
Cartesian3.distanceSquared = function(left, right) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Cartesian3.subtract(left, right, distanceScratch);
  return Cartesian3.magnitudeSquared(distanceScratch);
};
Cartesian3.normalize = function(cartesian, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  Check_default.typeOf.object("result", result);
  const magnitude = Cartesian3.magnitude(cartesian);
  result.x = cartesian.x / magnitude;
  result.y = cartesian.y / magnitude;
  result.z = cartesian.z / magnitude;
  if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
    throw new DeveloperError_default("normalized result is not a number");
  }
  return result;
};
Cartesian3.dot = function(left, right) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  return left.x * right.x + left.y * right.y + left.z * right.z;
};
Cartesian3.multiplyComponents = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.x = left.x * right.x;
  result.y = left.y * right.y;
  result.z = left.z * right.z;
  return result;
};
Cartesian3.divideComponents = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.x = left.x / right.x;
  result.y = left.y / right.y;
  result.z = left.z / right.z;
  return result;
};
Cartesian3.add = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.x = left.x + right.x;
  result.y = left.y + right.y;
  result.z = left.z + right.z;
  return result;
};
Cartesian3.subtract = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.x = left.x - right.x;
  result.y = left.y - right.y;
  result.z = left.z - right.z;
  return result;
};
Cartesian3.multiplyByScalar = function(cartesian, scalar, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  Check_default.typeOf.number("scalar", scalar);
  Check_default.typeOf.object("result", result);
  result.x = cartesian.x * scalar;
  result.y = cartesian.y * scalar;
  result.z = cartesian.z * scalar;
  return result;
};
Cartesian3.divideByScalar = function(cartesian, scalar, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  Check_default.typeOf.number("scalar", scalar);
  Check_default.typeOf.object("result", result);
  result.x = cartesian.x / scalar;
  result.y = cartesian.y / scalar;
  result.z = cartesian.z / scalar;
  return result;
};
Cartesian3.negate = function(cartesian, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  Check_default.typeOf.object("result", result);
  result.x = -cartesian.x;
  result.y = -cartesian.y;
  result.z = -cartesian.z;
  return result;
};
Cartesian3.abs = function(cartesian, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  Check_default.typeOf.object("result", result);
  result.x = Math.abs(cartesian.x);
  result.y = Math.abs(cartesian.y);
  result.z = Math.abs(cartesian.z);
  return result;
};
var lerpScratch = new Cartesian3();
Cartesian3.lerp = function(start, end, t, result) {
  Check_default.typeOf.object("start", start);
  Check_default.typeOf.object("end", end);
  Check_default.typeOf.number("t", t);
  Check_default.typeOf.object("result", result);
  Cartesian3.multiplyByScalar(end, t, lerpScratch);
  result = Cartesian3.multiplyByScalar(start, 1 - t, result);
  return Cartesian3.add(lerpScratch, result, result);
};
var angleBetweenScratch = new Cartesian3();
var angleBetweenScratch2 = new Cartesian3();
Cartesian3.angleBetween = function(left, right) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Cartesian3.normalize(left, angleBetweenScratch);
  Cartesian3.normalize(right, angleBetweenScratch2);
  const cosine = Cartesian3.dot(angleBetweenScratch, angleBetweenScratch2);
  const sine = Cartesian3.magnitude(
    Cartesian3.cross(
      angleBetweenScratch,
      angleBetweenScratch2,
      angleBetweenScratch
    )
  );
  return Math.atan2(sine, cosine);
};
var mostOrthogonalAxisScratch = new Cartesian3();
Cartesian3.mostOrthogonalAxis = function(cartesian, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  Check_default.typeOf.object("result", result);
  const f = Cartesian3.normalize(cartesian, mostOrthogonalAxisScratch);
  Cartesian3.abs(f, f);
  if (f.x <= f.y) {
    if (f.x <= f.z) {
      result = Cartesian3.clone(Cartesian3.UNIT_X, result);
    } else {
      result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
    }
  } else if (f.y <= f.z) {
    result = Cartesian3.clone(Cartesian3.UNIT_Y, result);
  } else {
    result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
  }
  return result;
};
Cartesian3.projectVector = function(a, b, result) {
  Check_default.defined("a", a);
  Check_default.defined("b", b);
  Check_default.defined("result", result);
  const scalar = Cartesian3.dot(a, b) / Cartesian3.dot(b, b);
  return Cartesian3.multiplyByScalar(b, scalar, result);
};
Cartesian3.equals = function(left, right) {
  return left === right || defined_default(left) && defined_default(right) && left.x === right.x && left.y === right.y && left.z === right.z;
};
Cartesian3.equalsArray = function(cartesian, array, offset) {
  return cartesian.x === array[offset] && cartesian.y === array[offset + 1] && cartesian.z === array[offset + 2];
};
Cartesian3.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
  return left === right || defined_default(left) && defined_default(right) && Math_default.equalsEpsilon(
    left.x,
    right.x,
    relativeEpsilon,
    absoluteEpsilon
  ) && Math_default.equalsEpsilon(
    left.y,
    right.y,
    relativeEpsilon,
    absoluteEpsilon
  ) && Math_default.equalsEpsilon(
    left.z,
    right.z,
    relativeEpsilon,
    absoluteEpsilon
  );
};
Cartesian3.cross = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  const leftX = left.x;
  const leftY = left.y;
  const leftZ = left.z;
  const rightX = right.x;
  const rightY = right.y;
  const rightZ = right.z;
  const x = leftY * rightZ - leftZ * rightY;
  const y = leftZ * rightX - leftX * rightZ;
  const z = leftX * rightY - leftY * rightX;
  result.x = x;
  result.y = y;
  result.z = z;
  return result;
};
Cartesian3.midpoint = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.x = (left.x + right.x) * 0.5;
  result.y = (left.y + right.y) * 0.5;
  result.z = (left.z + right.z) * 0.5;
  return result;
};
Cartesian3.fromDegrees = function(longitude, latitude, height, ellipsoid, result) {
  Check_default.typeOf.number("longitude", longitude);
  Check_default.typeOf.number("latitude", latitude);
  longitude = Math_default.toRadians(longitude);
  latitude = Math_default.toRadians(latitude);
  return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
};
var scratchN = new Cartesian3();
var scratchK = new Cartesian3();
Cartesian3._ellipsoidRadiiSquared = new Cartesian3(
  6378137 * 6378137,
  6378137 * 6378137,
  6356752314245179e-9 * 6356752314245179e-9
);
Cartesian3.fromRadians = function(longitude, latitude, height, ellipsoid, result) {
  Check_default.typeOf.number("longitude", longitude);
  Check_default.typeOf.number("latitude", latitude);
  height = height ?? 0;
  const radiiSquared = !defined_default(ellipsoid) ? Cartesian3._ellipsoidRadiiSquared : ellipsoid.radiiSquared;
  const cosLatitude = Math.cos(latitude);
  scratchN.x = cosLatitude * Math.cos(longitude);
  scratchN.y = cosLatitude * Math.sin(longitude);
  scratchN.z = Math.sin(latitude);
  scratchN = Cartesian3.normalize(scratchN, scratchN);
  Cartesian3.multiplyComponents(radiiSquared, scratchN, scratchK);
  const gamma = Math.sqrt(Cartesian3.dot(scratchN, scratchK));
  scratchK = Cartesian3.divideByScalar(scratchK, gamma, scratchK);
  scratchN = Cartesian3.multiplyByScalar(scratchN, height, scratchN);
  if (!defined_default(result)) {
    result = new Cartesian3();
  }
  return Cartesian3.add(scratchK, scratchN, result);
};
Cartesian3.fromDegreesArray = function(coordinates, ellipsoid, result) {
  Check_default.defined("coordinates", coordinates);
  if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
    throw new DeveloperError_default(
      "the number of coordinates must be a multiple of 2 and at least 2"
    );
  }
  const length = coordinates.length;
  if (!defined_default(result)) {
    result = new Array(length / 2);
  } else {
    result.length = length / 2;
  }
  for (let i = 0; i < length; i += 2) {
    const longitude = coordinates[i];
    const latitude = coordinates[i + 1];
    const index = i / 2;
    result[index] = Cartesian3.fromDegrees(
      longitude,
      latitude,
      0,
      ellipsoid,
      result[index]
    );
  }
  return result;
};
Cartesian3.fromRadiansArray = function(coordinates, ellipsoid, result) {
  Check_default.defined("coordinates", coordinates);
  if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
    throw new DeveloperError_default(
      "the number of coordinates must be a multiple of 2 and at least 2"
    );
  }
  const length = coordinates.length;
  if (!defined_default(result)) {
    result = new Array(length / 2);
  } else {
    result.length = length / 2;
  }
  for (let i = 0; i < length; i += 2) {
    const longitude = coordinates[i];
    const latitude = coordinates[i + 1];
    const index = i / 2;
    result[index] = Cartesian3.fromRadians(
      longitude,
      latitude,
      0,
      ellipsoid,
      result[index]
    );
  }
  return result;
};
Cartesian3.fromDegreesArrayHeights = function(coordinates, ellipsoid, result) {
  Check_default.defined("coordinates", coordinates);
  if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
    throw new DeveloperError_default(
      "the number of coordinates must be a multiple of 3 and at least 3"
    );
  }
  const length = coordinates.length;
  if (!defined_default(result)) {
    result = new Array(length / 3);
  } else {
    result.length = length / 3;
  }
  for (let i = 0; i < length; i += 3) {
    const longitude = coordinates[i];
    const latitude = coordinates[i + 1];
    const height = coordinates[i + 2];
    const index = i / 3;
    result[index] = Cartesian3.fromDegrees(
      longitude,
      latitude,
      height,
      ellipsoid,
      result[index]
    );
  }
  return result;
};
Cartesian3.fromRadiansArrayHeights = function(coordinates, ellipsoid, result) {
  Check_default.defined("coordinates", coordinates);
  if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
    throw new DeveloperError_default(
      "the number of coordinates must be a multiple of 3 and at least 3"
    );
  }
  const length = coordinates.length;
  if (!defined_default(result)) {
    result = new Array(length / 3);
  } else {
    result.length = length / 3;
  }
  for (let i = 0; i < length; i += 3) {
    const longitude = coordinates[i];
    const latitude = coordinates[i + 1];
    const height = coordinates[i + 2];
    const index = i / 3;
    result[index] = Cartesian3.fromRadians(
      longitude,
      latitude,
      height,
      ellipsoid,
      result[index]
    );
  }
  return result;
};
Cartesian3.ZERO = Object.freeze(new Cartesian3(0, 0, 0));
Cartesian3.ONE = Object.freeze(new Cartesian3(1, 1, 1));
Cartesian3.UNIT_X = Object.freeze(new Cartesian3(1, 0, 0));
Cartesian3.UNIT_Y = Object.freeze(new Cartesian3(0, 1, 0));
Cartesian3.UNIT_Z = Object.freeze(new Cartesian3(0, 0, 1));
Cartesian3.prototype.clone = function(result) {
  return Cartesian3.clone(this, result);
};
Cartesian3.prototype.equals = function(right) {
  return Cartesian3.equals(this, right);
};
Cartesian3.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
  return Cartesian3.equalsEpsilon(
    this,
    right,
    relativeEpsilon,
    absoluteEpsilon
  );
};
Cartesian3.prototype.toString = function() {
  return `(${this.x}, ${this.y}, ${this.z})`;
};
var Cartesian3_default = Cartesian3;

// node_modules/@cesium/engine/Source/Core/Frozen.js
var Frozen = {};
Frozen.EMPTY_OBJECT = Object.freeze({});
Frozen.EMPTY_ARRAY = Object.freeze([]);
var Frozen_default = Frozen;

// node_modules/@cesium/engine/Source/Core/Fullscreen.js
var _supportsFullscreen;
var _names = {
  requestFullscreen: void 0,
  exitFullscreen: void 0,
  fullscreenEnabled: void 0,
  fullscreenElement: void 0,
  fullscreenchange: void 0,
  fullscreenerror: void 0
};
var Fullscreen = {};
Object.defineProperties(Fullscreen, {
  /**
   * The element that is currently fullscreen, if any.  To simply check if the
   * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
   * @memberof Fullscreen
   * @type {object}
   * @readonly
   */
  element: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return document[_names.fullscreenElement];
    }
  },
  /**
   * The name of the event on the document that is fired when fullscreen is
   * entered or exited.  This event name is intended for use with addEventListener.
   * In your event handler, to determine if the browser is in fullscreen mode or not,
   * use {@link Fullscreen#fullscreen}.
   * @memberof Fullscreen
   * @type {string}
   * @readonly
   */
  changeEventName: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return _names.fullscreenchange;
    }
  },
  /**
   * The name of the event that is fired when a fullscreen error
   * occurs.  This event name is intended for use with addEventListener.
   * @memberof Fullscreen
   * @type {string}
   * @readonly
   */
  errorEventName: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return _names.fullscreenerror;
    }
  },
  /**
   * Determine whether the browser will allow an element to be made fullscreen, or not.
   * For example, by default, iframes cannot go fullscreen unless the containing page
   * adds an "allowfullscreen" attribute (or prefixed equivalent).
   * @memberof Fullscreen
   * @type {boolean}
   * @readonly
   */
  enabled: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return document[_names.fullscreenEnabled];
    }
  },
  /**
   * Determines if the browser is currently in fullscreen mode.
   * @memberof Fullscreen
   * @type {boolean}
   * @readonly
   */
  fullscreen: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return Fullscreen.element !== null;
    }
  }
});
Fullscreen.supportsFullscreen = function() {
  if (defined_default(_supportsFullscreen)) {
    return _supportsFullscreen;
  }
  _supportsFullscreen = false;
  const body = document.body;
  if (typeof body.requestFullscreen === "function") {
    _names.requestFullscreen = "requestFullscreen";
    _names.exitFullscreen = "exitFullscreen";
    _names.fullscreenEnabled = "fullscreenEnabled";
    _names.fullscreenElement = "fullscreenElement";
    _names.fullscreenchange = "fullscreenchange";
    _names.fullscreenerror = "fullscreenerror";
    _supportsFullscreen = true;
    return _supportsFullscreen;
  }
  const prefixes = ["webkit", "moz", "o", "ms", "khtml"];
  let name;
  for (let i = 0, len = prefixes.length; i < len; ++i) {
    const prefix = prefixes[i];
    name = `${prefix}RequestFullscreen`;
    if (typeof body[name] === "function") {
      _names.requestFullscreen = name;
      _supportsFullscreen = true;
    } else {
      name = `${prefix}RequestFullScreen`;
      if (typeof body[name] === "function") {
        _names.requestFullscreen = name;
        _supportsFullscreen = true;
      }
    }
    name = `${prefix}ExitFullscreen`;
    if (typeof document[name] === "function") {
      _names.exitFullscreen = name;
    } else {
      name = `${prefix}CancelFullScreen`;
      if (typeof document[name] === "function") {
        _names.exitFullscreen = name;
      }
    }
    name = `${prefix}FullscreenEnabled`;
    if (document[name] !== void 0) {
      _names.fullscreenEnabled = name;
    } else {
      name = `${prefix}FullScreenEnabled`;
      if (document[name] !== void 0) {
        _names.fullscreenEnabled = name;
      }
    }
    name = `${prefix}FullscreenElement`;
    if (document[name] !== void 0) {
      _names.fullscreenElement = name;
    } else {
      name = `${prefix}FullScreenElement`;
      if (document[name] !== void 0) {
        _names.fullscreenElement = name;
      }
    }
    name = `${prefix}fullscreenchange`;
    if (document[`on${name}`] !== void 0) {
      if (prefix === "ms") {
        name = "MSFullscreenChange";
      }
      _names.fullscreenchange = name;
    }
    name = `${prefix}fullscreenerror`;
    if (document[`on${name}`] !== void 0) {
      if (prefix === "ms") {
        name = "MSFullscreenError";
      }
      _names.fullscreenerror = name;
    }
  }
  return _supportsFullscreen;
};
Fullscreen.requestFullscreen = function(element, vrDevice) {
  if (!Fullscreen.supportsFullscreen()) {
    return;
  }
  element[_names.requestFullscreen]({ vrDisplay: vrDevice });
};
Fullscreen.exitFullscreen = function() {
  if (!Fullscreen.supportsFullscreen()) {
    return;
  }
  document[_names.exitFullscreen]();
};
Fullscreen._names = _names;
var Fullscreen_default = Fullscreen;

// node_modules/@cesium/engine/Source/Core/FeatureDetection.js
var theNavigator;
if (typeof navigator !== "undefined") {
  theNavigator = navigator;
} else {
  theNavigator = {};
}
function extractVersion(versionString) {
  const parts = versionString.split(".");
  for (let i = 0, len = parts.length; i < len; ++i) {
    parts[i] = parseInt(parts[i], 10);
  }
  return parts;
}
var isChromeResult;
var chromeVersionResult;
function isChrome() {
  if (!defined_default(isChromeResult)) {
    isChromeResult = false;
    if (!isEdge()) {
      const fields = / Chrome\/([\.0-9]+)/.exec(theNavigator.userAgent);
      if (fields !== null) {
        isChromeResult = true;
        chromeVersionResult = extractVersion(fields[1]);
      }
    }
  }
  return isChromeResult;
}
function chromeVersion() {
  return isChrome() && chromeVersionResult;
}
var isSafariResult;
var safariVersionResult;
function isSafari() {
  if (!defined_default(isSafariResult)) {
    isSafariResult = false;
    if (!isChrome() && !isEdge() && / Safari\/[\.0-9]+/.test(theNavigator.userAgent)) {
      const fields = / Version\/([\.0-9]+)/.exec(theNavigator.userAgent);
      if (fields !== null) {
        isSafariResult = true;
        safariVersionResult = extractVersion(fields[1]);
      }
    }
  }
  return isSafariResult;
}
function safariVersion() {
  return isSafari() && safariVersionResult;
}
var isWebkitResult;
var webkitVersionResult;
function isWebkit() {
  if (!defined_default(isWebkitResult)) {
    isWebkitResult = false;
    const fields = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(theNavigator.userAgent);
    if (fields !== null) {
      isWebkitResult = true;
      webkitVersionResult = extractVersion(fields[1]);
      webkitVersionResult.isNightly = !!fields[2];
    }
  }
  return isWebkitResult;
}
function webkitVersion() {
  return isWebkit() && webkitVersionResult;
}
var isInternetExplorerResult;
var internetExplorerVersionResult;
function isInternetExplorer() {
  if (!defined_default(isInternetExplorerResult)) {
    isInternetExplorerResult = false;
    let fields;
    if (theNavigator.appName === "Microsoft Internet Explorer") {
      fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
      if (fields !== null) {
        isInternetExplorerResult = true;
        internetExplorerVersionResult = extractVersion(fields[1]);
      }
    } else if (theNavigator.appName === "Netscape") {
      fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(
        theNavigator.userAgent
      );
      if (fields !== null) {
        isInternetExplorerResult = true;
        internetExplorerVersionResult = extractVersion(fields[1]);
      }
    }
  }
  return isInternetExplorerResult;
}
function internetExplorerVersion() {
  return isInternetExplorer() && internetExplorerVersionResult;
}
var isEdgeResult;
var edgeVersionResult;
function isEdge() {
  if (!defined_default(isEdgeResult)) {
    isEdgeResult = false;
    const fields = / Edg\/([\.0-9]+)/.exec(theNavigator.userAgent);
    if (fields !== null) {
      isEdgeResult = true;
      edgeVersionResult = extractVersion(fields[1]);
    }
  }
  return isEdgeResult;
}
function edgeVersion() {
  return isEdge() && edgeVersionResult;
}
var isFirefoxResult;
var firefoxVersionResult;
function isFirefox() {
  if (!defined_default(isFirefoxResult)) {
    isFirefoxResult = false;
    const fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
    if (fields !== null) {
      isFirefoxResult = true;
      firefoxVersionResult = extractVersion(fields[1]);
    }
  }
  return isFirefoxResult;
}
var isWindowsResult;
function isWindows() {
  if (!defined_default(isWindowsResult)) {
    isWindowsResult = /Windows/i.test(theNavigator.appVersion);
  }
  return isWindowsResult;
}
var isIPadOrIOSResult;
function isIPadOrIOS() {
  if (!defined_default(isIPadOrIOSResult)) {
    isIPadOrIOSResult = navigator.platform === "iPhone" || navigator.platform === "iPod" || navigator.platform === "iPad";
  }
  return isIPadOrIOSResult;
}
function firefoxVersion() {
  return isFirefox() && firefoxVersionResult;
}
var hasPointerEvents;
function supportsPointerEvents() {
  if (!defined_default(hasPointerEvents)) {
    hasPointerEvents = !isFirefox() && typeof PointerEvent !== "undefined" && (!defined_default(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
  }
  return hasPointerEvents;
}
var imageRenderingValueResult;
var supportsImageRenderingPixelatedResult;
function supportsImageRenderingPixelated() {
  if (!defined_default(supportsImageRenderingPixelatedResult)) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute(
      "style",
      "image-rendering: -moz-crisp-edges;image-rendering: pixelated;"
    );
    const tmp = canvas.style.imageRendering;
    supportsImageRenderingPixelatedResult = defined_default(tmp) && tmp !== "";
    if (supportsImageRenderingPixelatedResult) {
      imageRenderingValueResult = tmp;
    }
  }
  return supportsImageRenderingPixelatedResult;
}
function imageRenderingValue() {
  return supportsImageRenderingPixelated() ? imageRenderingValueResult : void 0;
}
function supportsWebP() {
  if (!supportsWebP.initialized) {
    throw new DeveloperError_default(
      "You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP"
    );
  }
  return supportsWebP._result;
}
supportsWebP._promise = void 0;
supportsWebP._result = void 0;
supportsWebP.initialize = function() {
  if (defined_default(supportsWebP._promise)) {
    return supportsWebP._promise;
  }
  supportsWebP._promise = new Promise((resolve) => {
    const image = new Image();
    image.onload = function() {
      supportsWebP._result = image.width > 0 && image.height > 0;
      resolve(supportsWebP._result);
    };
    image.onerror = function() {
      supportsWebP._result = false;
      resolve(supportsWebP._result);
    };
    image.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
  });
  return supportsWebP._promise;
};
Object.defineProperties(supportsWebP, {
  initialized: {
    get: function() {
      return defined_default(supportsWebP._result);
    }
  }
});
var typedArrayTypes = [];
if (typeof ArrayBuffer !== "undefined") {
  typedArrayTypes.push(
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
  );
  if (typeof Uint8ClampedArray !== "undefined") {
    typedArrayTypes.push(Uint8ClampedArray);
  }
  if (typeof Uint8ClampedArray !== "undefined") {
    typedArrayTypes.push(Uint8ClampedArray);
  }
  if (typeof BigInt64Array !== "undefined") {
    typedArrayTypes.push(BigInt64Array);
  }
  if (typeof BigUint64Array !== "undefined") {
    typedArrayTypes.push(BigUint64Array);
  }
}
var FeatureDetection = {
  isChrome,
  chromeVersion,
  isSafari,
  safariVersion,
  isWebkit,
  webkitVersion,
  isInternetExplorer,
  internetExplorerVersion,
  isEdge,
  edgeVersion,
  isFirefox,
  firefoxVersion,
  isWindows,
  isIPadOrIOS,
  hardwareConcurrency: theNavigator.hardwareConcurrency ?? 3,
  supportsPointerEvents,
  supportsImageRenderingPixelated,
  supportsWebP,
  imageRenderingValue,
  typedArrayTypes
};
FeatureDetection.supportsBasis = function(scene) {
  return FeatureDetection.supportsWebAssembly() && scene.context.supportsBasis;
};
FeatureDetection.supportsFullscreen = function() {
  return Fullscreen_default.supportsFullscreen();
};
FeatureDetection.supportsTypedArrays = function() {
  return typeof ArrayBuffer !== "undefined";
};
FeatureDetection.supportsBigInt64Array = function() {
  return typeof BigInt64Array !== "undefined";
};
FeatureDetection.supportsBigUint64Array = function() {
  return typeof BigUint64Array !== "undefined";
};
FeatureDetection.supportsBigInt = function() {
  return typeof BigInt !== "undefined";
};
FeatureDetection.supportsWebWorkers = function() {
  return typeof Worker !== "undefined";
};
FeatureDetection.supportsWebAssembly = function() {
  return typeof WebAssembly !== "undefined";
};
FeatureDetection.supportsWebgl2 = function(scene) {
  Check_default.defined("scene", scene);
  return scene.context.webgl2;
};
FeatureDetection.supportsEsmWebWorkers = function() {
  return !isFirefox() || parseInt(firefoxVersionResult) >= 114;
};
var FeatureDetection_default = FeatureDetection;

// node_modules/@cesium/engine/Source/Core/Color.js
function hue2rgb(m1, m2, h) {
  if (h < 0) {
    h += 1;
  }
  if (h > 1) {
    h -= 1;
  }
  if (h * 6 < 1) {
    return m1 + (m2 - m1) * 6 * h;
  }
  if (h * 2 < 1) {
    return m2;
  }
  if (h * 3 < 2) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }
  return m1;
}
function Color(red, green, blue, alpha) {
  this.red = red ?? 1;
  this.green = green ?? 1;
  this.blue = blue ?? 1;
  this.alpha = alpha ?? 1;
}
Color.fromCartesian4 = function(cartesian, result) {
  Check_default.typeOf.object("cartesian", cartesian);
  if (!defined_default(result)) {
    return new Color(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
  }
  result.red = cartesian.x;
  result.green = cartesian.y;
  result.blue = cartesian.z;
  result.alpha = cartesian.w;
  return result;
};
Color.fromBytes = function(red, green, blue, alpha, result) {
  red = Color.byteToFloat(red ?? 255);
  green = Color.byteToFloat(green ?? 255);
  blue = Color.byteToFloat(blue ?? 255);
  alpha = Color.byteToFloat(alpha ?? 255);
  if (!defined_default(result)) {
    return new Color(red, green, blue, alpha);
  }
  result.red = red;
  result.green = green;
  result.blue = blue;
  result.alpha = alpha;
  return result;
};
Color.fromAlpha = function(color, alpha, result) {
  Check_default.typeOf.object("color", color);
  Check_default.typeOf.number("alpha", alpha);
  if (!defined_default(result)) {
    return new Color(color.red, color.green, color.blue, alpha);
  }
  result.red = color.red;
  result.green = color.green;
  result.blue = color.blue;
  result.alpha = alpha;
  return result;
};
var scratchArrayBuffer;
var scratchUint32Array;
var scratchUint8Array;
if (FeatureDetection_default.supportsTypedArrays()) {
  scratchArrayBuffer = new ArrayBuffer(4);
  scratchUint32Array = new Uint32Array(scratchArrayBuffer);
  scratchUint8Array = new Uint8Array(scratchArrayBuffer);
}
Color.fromRgba = function(rgba, result) {
  scratchUint32Array[0] = rgba;
  return Color.fromBytes(
    scratchUint8Array[0],
    scratchUint8Array[1],
    scratchUint8Array[2],
    scratchUint8Array[3],
    result
  );
};
Color.fromHsl = function(hue, saturation, lightness, alpha, result) {
  hue = (hue ?? 0) % 1;
  saturation = saturation ?? 0;
  lightness = lightness ?? 0;
  alpha = alpha ?? 1;
  let red = lightness;
  let green = lightness;
  let blue = lightness;
  if (saturation !== 0) {
    let m2;
    if (lightness < 0.5) {
      m2 = lightness * (1 + saturation);
    } else {
      m2 = lightness + saturation - lightness * saturation;
    }
    const m1 = 2 * lightness - m2;
    red = hue2rgb(m1, m2, hue + 1 / 3);
    green = hue2rgb(m1, m2, hue);
    blue = hue2rgb(m1, m2, hue - 1 / 3);
  }
  if (!defined_default(result)) {
    return new Color(red, green, blue, alpha);
  }
  result.red = red;
  result.green = green;
  result.blue = blue;
  result.alpha = alpha;
  return result;
};
Color.fromRandom = function(options, result) {
  options = options ?? Frozen_default.EMPTY_OBJECT;
  let red = options.red;
  if (!defined_default(red)) {
    const minimumRed = options.minimumRed ?? 0;
    const maximumRed = options.maximumRed ?? 1;
    Check_default.typeOf.number.lessThanOrEquals("minimumRed", minimumRed, maximumRed);
    red = minimumRed + Math_default.nextRandomNumber() * (maximumRed - minimumRed);
  }
  let green = options.green;
  if (!defined_default(green)) {
    const minimumGreen = options.minimumGreen ?? 0;
    const maximumGreen = options.maximumGreen ?? 1;
    Check_default.typeOf.number.lessThanOrEquals(
      "minimumGreen",
      minimumGreen,
      maximumGreen
    );
    green = minimumGreen + Math_default.nextRandomNumber() * (maximumGreen - minimumGreen);
  }
  let blue = options.blue;
  if (!defined_default(blue)) {
    const minimumBlue = options.minimumBlue ?? 0;
    const maximumBlue = options.maximumBlue ?? 1;
    Check_default.typeOf.number.lessThanOrEquals(
      "minimumBlue",
      minimumBlue,
      maximumBlue
    );
    blue = minimumBlue + Math_default.nextRandomNumber() * (maximumBlue - minimumBlue);
  }
  let alpha = options.alpha;
  if (!defined_default(alpha)) {
    const minimumAlpha = options.minimumAlpha ?? 0;
    const maximumAlpha = options.maximumAlpha ?? 1;
    Check_default.typeOf.number.lessThanOrEquals(
      "minimumAlpha",
      minimumAlpha,
      maximumAlpha
    );
    alpha = minimumAlpha + Math_default.nextRandomNumber() * (maximumAlpha - minimumAlpha);
  }
  if (!defined_default(result)) {
    return new Color(red, green, blue, alpha);
  }
  result.red = red;
  result.green = green;
  result.blue = blue;
  result.alpha = alpha;
  return result;
};
var rgbaMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i;
var rrggbbaaMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
var rgbParenthesesMatcher = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
var hslParenthesesMatcher = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
Color.fromCssColorString = function(color, result) {
  Check_default.typeOf.string("color", color);
  if (!defined_default(result)) {
    result = new Color();
  }
  color = color.trim();
  const namedColor = Color[color.toUpperCase()];
  if (defined_default(namedColor)) {
    Color.clone(namedColor, result);
    return result;
  }
  let matches = rgbaMatcher.exec(color);
  if (matches !== null) {
    result.red = parseInt(matches[1], 16) / 15;
    result.green = parseInt(matches[2], 16) / 15;
    result.blue = parseInt(matches[3], 16) / 15;
    result.alpha = parseInt(matches[4] ?? "f", 16) / 15;
    return result;
  }
  matches = rrggbbaaMatcher.exec(color);
  if (matches !== null) {
    result.red = parseInt(matches[1], 16) / 255;
    result.green = parseInt(matches[2], 16) / 255;
    result.blue = parseInt(matches[3], 16) / 255;
    result.alpha = parseInt(matches[4] ?? "ff", 16) / 255;
    return result;
  }
  matches = rgbParenthesesMatcher.exec(color);
  if (matches !== null) {
    result.red = parseFloat(matches[1]) / ("%" === matches[1].substr(-1) ? 100 : 255);
    result.green = parseFloat(matches[2]) / ("%" === matches[2].substr(-1) ? 100 : 255);
    result.blue = parseFloat(matches[3]) / ("%" === matches[3].substr(-1) ? 100 : 255);
    result.alpha = parseFloat(matches[4] ?? "1.0");
    return result;
  }
  matches = hslParenthesesMatcher.exec(color);
  if (matches !== null) {
    return Color.fromHsl(
      parseFloat(matches[1]) / 360,
      parseFloat(matches[2]) / 100,
      parseFloat(matches[3]) / 100,
      parseFloat(matches[4] ?? "1.0"),
      result
    );
  }
  result = void 0;
  return result;
};
Color.packedLength = 4;
Color.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  array[startingIndex++] = value.red;
  array[startingIndex++] = value.green;
  array[startingIndex++] = value.blue;
  array[startingIndex] = value.alpha;
  return array;
};
Color.unpack = function(array, startingIndex, result) {
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  if (!defined_default(result)) {
    result = new Color();
  }
  result.red = array[startingIndex++];
  result.green = array[startingIndex++];
  result.blue = array[startingIndex++];
  result.alpha = array[startingIndex];
  return result;
};
Color.byteToFloat = function(number) {
  return number / 255;
};
Color.floatToByte = function(number) {
  return number === 1 ? 255 : number * 256 | 0;
};
Color.clone = function(color, result) {
  if (!defined_default(color)) {
    return void 0;
  }
  if (!defined_default(result)) {
    return new Color(color.red, color.green, color.blue, color.alpha);
  }
  result.red = color.red;
  result.green = color.green;
  result.blue = color.blue;
  result.alpha = color.alpha;
  return result;
};
Color.equals = function(left, right) {
  return left === right || //
  defined_default(left) && //
  defined_default(right) && //
  left.red === right.red && //
  left.green === right.green && //
  left.blue === right.blue && //
  left.alpha === right.alpha;
};
Color.equalsArray = function(color, array, offset) {
  return color.red === array[offset] && color.green === array[offset + 1] && color.blue === array[offset + 2] && color.alpha === array[offset + 3];
};
Color.prototype.clone = function(result) {
  return Color.clone(this, result);
};
Color.prototype.equals = function(other) {
  return Color.equals(this, other);
};
Color.prototype.equalsEpsilon = function(other, epsilon) {
  return this === other || //
  defined_default(other) && //
  Math.abs(this.red - other.red) <= epsilon && //
  Math.abs(this.green - other.green) <= epsilon && //
  Math.abs(this.blue - other.blue) <= epsilon && //
  Math.abs(this.alpha - other.alpha) <= epsilon;
};
Color.prototype.toString = function() {
  return `(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
};
Color.prototype.toCssColorString = function() {
  const red = Color.floatToByte(this.red);
  const green = Color.floatToByte(this.green);
  const blue = Color.floatToByte(this.blue);
  if (this.alpha === 1) {
    return `rgb(${red},${green},${blue})`;
  }
  return `rgba(${red},${green},${blue},${this.alpha})`;
};
Color.prototype.toCssHexString = function() {
  let r = Color.floatToByte(this.red).toString(16);
  if (r.length < 2) {
    r = `0${r}`;
  }
  let g = Color.floatToByte(this.green).toString(16);
  if (g.length < 2) {
    g = `0${g}`;
  }
  let b = Color.floatToByte(this.blue).toString(16);
  if (b.length < 2) {
    b = `0${b}`;
  }
  if (this.alpha < 1) {
    let hexAlpha = Color.floatToByte(this.alpha).toString(16);
    if (hexAlpha.length < 2) {
      hexAlpha = `0${hexAlpha}`;
    }
    return `#${r}${g}${b}${hexAlpha}`;
  }
  return `#${r}${g}${b}`;
};
Color.prototype.toBytes = function(result) {
  const red = Color.floatToByte(this.red);
  const green = Color.floatToByte(this.green);
  const blue = Color.floatToByte(this.blue);
  const alpha = Color.floatToByte(this.alpha);
  if (!defined_default(result)) {
    return [red, green, blue, alpha];
  }
  result[0] = red;
  result[1] = green;
  result[2] = blue;
  result[3] = alpha;
  return result;
};
Color.prototype.toRgba = function() {
  scratchUint8Array[0] = Color.floatToByte(this.red);
  scratchUint8Array[1] = Color.floatToByte(this.green);
  scratchUint8Array[2] = Color.floatToByte(this.blue);
  scratchUint8Array[3] = Color.floatToByte(this.alpha);
  return scratchUint32Array[0];
};
Color.prototype.brighten = function(magnitude, result) {
  Check_default.typeOf.number("magnitude", magnitude);
  Check_default.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0);
  Check_default.typeOf.object("result", result);
  magnitude = 1 - magnitude;
  result.red = 1 - (1 - this.red) * magnitude;
  result.green = 1 - (1 - this.green) * magnitude;
  result.blue = 1 - (1 - this.blue) * magnitude;
  result.alpha = this.alpha;
  return result;
};
Color.prototype.darken = function(magnitude, result) {
  Check_default.typeOf.number("magnitude", magnitude);
  Check_default.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0);
  Check_default.typeOf.object("result", result);
  magnitude = 1 - magnitude;
  result.red = this.red * magnitude;
  result.green = this.green * magnitude;
  result.blue = this.blue * magnitude;
  result.alpha = this.alpha;
  return result;
};
Color.prototype.withAlpha = function(alpha, result) {
  return Color.fromAlpha(this, alpha, result);
};
Color.add = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.red = left.red + right.red;
  result.green = left.green + right.green;
  result.blue = left.blue + right.blue;
  result.alpha = left.alpha + right.alpha;
  return result;
};
Color.subtract = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.red = left.red - right.red;
  result.green = left.green - right.green;
  result.blue = left.blue - right.blue;
  result.alpha = left.alpha - right.alpha;
  return result;
};
Color.multiply = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.red = left.red * right.red;
  result.green = left.green * right.green;
  result.blue = left.blue * right.blue;
  result.alpha = left.alpha * right.alpha;
  return result;
};
Color.divide = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.red = left.red / right.red;
  result.green = left.green / right.green;
  result.blue = left.blue / right.blue;
  result.alpha = left.alpha / right.alpha;
  return result;
};
Color.mod = function(left, right, result) {
  Check_default.typeOf.object("left", left);
  Check_default.typeOf.object("right", right);
  Check_default.typeOf.object("result", result);
  result.red = left.red % right.red;
  result.green = left.green % right.green;
  result.blue = left.blue % right.blue;
  result.alpha = left.alpha % right.alpha;
  return result;
};
Color.lerp = function(start, end, t, result) {
  Check_default.typeOf.object("start", start);
  Check_default.typeOf.object("end", end);
  Check_default.typeOf.number("t", t);
  Check_default.typeOf.object("result", result);
  result.red = Math_default.lerp(start.red, end.red, t);
  result.green = Math_default.lerp(start.green, end.green, t);
  result.blue = Math_default.lerp(start.blue, end.blue, t);
  result.alpha = Math_default.lerp(start.alpha, end.alpha, t);
  return result;
};
Color.multiplyByScalar = function(color, scalar, result) {
  Check_default.typeOf.object("color", color);
  Check_default.typeOf.number("scalar", scalar);
  Check_default.typeOf.object("result", result);
  result.red = color.red * scalar;
  result.green = color.green * scalar;
  result.blue = color.blue * scalar;
  result.alpha = color.alpha * scalar;
  return result;
};
Color.divideByScalar = function(color, scalar, result) {
  Check_default.typeOf.object("color", color);
  Check_default.typeOf.number("scalar", scalar);
  Check_default.typeOf.object("result", result);
  result.red = color.red / scalar;
  result.green = color.green / scalar;
  result.blue = color.blue / scalar;
  result.alpha = color.alpha / scalar;
  return result;
};
Color.ALICEBLUE = Object.freeze(Color.fromCssColorString("#F0F8FF"));
Color.ANTIQUEWHITE = Object.freeze(Color.fromCssColorString("#FAEBD7"));
Color.AQUA = Object.freeze(Color.fromCssColorString("#00FFFF"));
Color.AQUAMARINE = Object.freeze(Color.fromCssColorString("#7FFFD4"));
Color.AZURE = Object.freeze(Color.fromCssColorString("#F0FFFF"));
Color.BEIGE = Object.freeze(Color.fromCssColorString("#F5F5DC"));
Color.BISQUE = Object.freeze(Color.fromCssColorString("#FFE4C4"));
Color.BLACK = Object.freeze(Color.fromCssColorString("#000000"));
Color.BLANCHEDALMOND = Object.freeze(Color.fromCssColorString("#FFEBCD"));
Color.BLUE = Object.freeze(Color.fromCssColorString("#0000FF"));
Color.BLUEVIOLET = Object.freeze(Color.fromCssColorString("#8A2BE2"));
Color.BROWN = Object.freeze(Color.fromCssColorString("#A52A2A"));
Color.BURLYWOOD = Object.freeze(Color.fromCssColorString("#DEB887"));
Color.CADETBLUE = Object.freeze(Color.fromCssColorString("#5F9EA0"));
Color.CHARTREUSE = Object.freeze(Color.fromCssColorString("#7FFF00"));
Color.CHOCOLATE = Object.freeze(Color.fromCssColorString("#D2691E"));
Color.CORAL = Object.freeze(Color.fromCssColorString("#FF7F50"));
Color.CORNFLOWERBLUE = Object.freeze(Color.fromCssColorString("#6495ED"));
Color.CORNSILK = Object.freeze(Color.fromCssColorString("#FFF8DC"));
Color.CRIMSON = Object.freeze(Color.fromCssColorString("#DC143C"));
Color.CYAN = Object.freeze(Color.fromCssColorString("#00FFFF"));
Color.DARKBLUE = Object.freeze(Color.fromCssColorString("#00008B"));
Color.DARKCYAN = Object.freeze(Color.fromCssColorString("#008B8B"));
Color.DARKGOLDENROD = Object.freeze(Color.fromCssColorString("#B8860B"));
Color.DARKGRAY = Object.freeze(Color.fromCssColorString("#A9A9A9"));
Color.DARKGREEN = Object.freeze(Color.fromCssColorString("#006400"));
Color.DARKGREY = Color.DARKGRAY;
Color.DARKKHAKI = Object.freeze(Color.fromCssColorString("#BDB76B"));
Color.DARKMAGENTA = Object.freeze(Color.fromCssColorString("#8B008B"));
Color.DARKOLIVEGREEN = Object.freeze(Color.fromCssColorString("#556B2F"));
Color.DARKORANGE = Object.freeze(Color.fromCssColorString("#FF8C00"));
Color.DARKORCHID = Object.freeze(Color.fromCssColorString("#9932CC"));
Color.DARKRED = Object.freeze(Color.fromCssColorString("#8B0000"));
Color.DARKSALMON = Object.freeze(Color.fromCssColorString("#E9967A"));
Color.DARKSEAGREEN = Object.freeze(Color.fromCssColorString("#8FBC8F"));
Color.DARKSLATEBLUE = Object.freeze(Color.fromCssColorString("#483D8B"));
Color.DARKSLATEGRAY = Object.freeze(Color.fromCssColorString("#2F4F4F"));
Color.DARKSLATEGREY = Color.DARKSLATEGRAY;
Color.DARKTURQUOISE = Object.freeze(Color.fromCssColorString("#00CED1"));
Color.DARKVIOLET = Object.freeze(Color.fromCssColorString("#9400D3"));
Color.DEEPPINK = Object.freeze(Color.fromCssColorString("#FF1493"));
Color.DEEPSKYBLUE = Object.freeze(Color.fromCssColorString("#00BFFF"));
Color.DIMGRAY = Object.freeze(Color.fromCssColorString("#696969"));
Color.DIMGREY = Color.DIMGRAY;
Color.DODGERBLUE = Object.freeze(Color.fromCssColorString("#1E90FF"));
Color.FIREBRICK = Object.freeze(Color.fromCssColorString("#B22222"));
Color.FLORALWHITE = Object.freeze(Color.fromCssColorString("#FFFAF0"));
Color.FORESTGREEN = Object.freeze(Color.fromCssColorString("#228B22"));
Color.FUCHSIA = Object.freeze(Color.fromCssColorString("#FF00FF"));
Color.GAINSBORO = Object.freeze(Color.fromCssColorString("#DCDCDC"));
Color.GHOSTWHITE = Object.freeze(Color.fromCssColorString("#F8F8FF"));
Color.GOLD = Object.freeze(Color.fromCssColorString("#FFD700"));
Color.GOLDENROD = Object.freeze(Color.fromCssColorString("#DAA520"));
Color.GRAY = Object.freeze(Color.fromCssColorString("#808080"));
Color.GREEN = Object.freeze(Color.fromCssColorString("#008000"));
Color.GREENYELLOW = Object.freeze(Color.fromCssColorString("#ADFF2F"));
Color.GREY = Color.GRAY;
Color.HONEYDEW = Object.freeze(Color.fromCssColorString("#F0FFF0"));
Color.HOTPINK = Object.freeze(Color.fromCssColorString("#FF69B4"));
Color.INDIANRED = Object.freeze(Color.fromCssColorString("#CD5C5C"));
Color.INDIGO = Object.freeze(Color.fromCssColorString("#4B0082"));
Color.IVORY = Object.freeze(Color.fromCssColorString("#FFFFF0"));
Color.KHAKI = Object.freeze(Color.fromCssColorString("#F0E68C"));
Color.LAVENDER = Object.freeze(Color.fromCssColorString("#E6E6FA"));
Color.LAVENDAR_BLUSH = Object.freeze(Color.fromCssColorString("#FFF0F5"));
Color.LAWNGREEN = Object.freeze(Color.fromCssColorString("#7CFC00"));
Color.LEMONCHIFFON = Object.freeze(Color.fromCssColorString("#FFFACD"));
Color.LIGHTBLUE = Object.freeze(Color.fromCssColorString("#ADD8E6"));
Color.LIGHTCORAL = Object.freeze(Color.fromCssColorString("#F08080"));
Color.LIGHTCYAN = Object.freeze(Color.fromCssColorString("#E0FFFF"));
Color.LIGHTGOLDENRODYELLOW = Object.freeze(Color.fromCssColorString("#FAFAD2"));
Color.LIGHTGRAY = Object.freeze(Color.fromCssColorString("#D3D3D3"));
Color.LIGHTGREEN = Object.freeze(Color.fromCssColorString("#90EE90"));
Color.LIGHTGREY = Color.LIGHTGRAY;
Color.LIGHTPINK = Object.freeze(Color.fromCssColorString("#FFB6C1"));
Color.LIGHTSEAGREEN = Object.freeze(Color.fromCssColorString("#20B2AA"));
Color.LIGHTSKYBLUE = Object.freeze(Color.fromCssColorString("#87CEFA"));
Color.LIGHTSLATEGRAY = Object.freeze(Color.fromCssColorString("#778899"));
Color.LIGHTSLATEGREY = Color.LIGHTSLATEGRAY;
Color.LIGHTSTEELBLUE = Object.freeze(Color.fromCssColorString("#B0C4DE"));
Color.LIGHTYELLOW = Object.freeze(Color.fromCssColorString("#FFFFE0"));
Color.LIME = Object.freeze(Color.fromCssColorString("#00FF00"));
Color.LIMEGREEN = Object.freeze(Color.fromCssColorString("#32CD32"));
Color.LINEN = Object.freeze(Color.fromCssColorString("#FAF0E6"));
Color.MAGENTA = Object.freeze(Color.fromCssColorString("#FF00FF"));
Color.MAROON = Object.freeze(Color.fromCssColorString("#800000"));
Color.MEDIUMAQUAMARINE = Object.freeze(Color.fromCssColorString("#66CDAA"));
Color.MEDIUMBLUE = Object.freeze(Color.fromCssColorString("#0000CD"));
Color.MEDIUMORCHID = Object.freeze(Color.fromCssColorString("#BA55D3"));
Color.MEDIUMPURPLE = Object.freeze(Color.fromCssColorString("#9370DB"));
Color.MEDIUMSEAGREEN = Object.freeze(Color.fromCssColorString("#3CB371"));
Color.MEDIUMSLATEBLUE = Object.freeze(Color.fromCssColorString("#7B68EE"));
Color.MEDIUMSPRINGGREEN = Object.freeze(Color.fromCssColorString("#00FA9A"));
Color.MEDIUMTURQUOISE = Object.freeze(Color.fromCssColorString("#48D1CC"));
Color.MEDIUMVIOLETRED = Object.freeze(Color.fromCssColorString("#C71585"));
Color.MIDNIGHTBLUE = Object.freeze(Color.fromCssColorString("#191970"));
Color.MINTCREAM = Object.freeze(Color.fromCssColorString("#F5FFFA"));
Color.MISTYROSE = Object.freeze(Color.fromCssColorString("#FFE4E1"));
Color.MOCCASIN = Object.freeze(Color.fromCssColorString("#FFE4B5"));
Color.NAVAJOWHITE = Object.freeze(Color.fromCssColorString("#FFDEAD"));
Color.NAVY = Object.freeze(Color.fromCssColorString("#000080"));
Color.OLDLACE = Object.freeze(Color.fromCssColorString("#FDF5E6"));
Color.OLIVE = Object.freeze(Color.fromCssColorString("#808000"));
Color.OLIVEDRAB = Object.freeze(Color.fromCssColorString("#6B8E23"));
Color.ORANGE = Object.freeze(Color.fromCssColorString("#FFA500"));
Color.ORANGERED = Object.freeze(Color.fromCssColorString("#FF4500"));
Color.ORCHID = Object.freeze(Color.fromCssColorString("#DA70D6"));
Color.PALEGOLDENROD = Object.freeze(Color.fromCssColorString("#EEE8AA"));
Color.PALEGREEN = Object.freeze(Color.fromCssColorString("#98FB98"));
Color.PALETURQUOISE = Object.freeze(Color.fromCssColorString("#AFEEEE"));
Color.PALEVIOLETRED = Object.freeze(Color.fromCssColorString("#DB7093"));
Color.PAPAYAWHIP = Object.freeze(Color.fromCssColorString("#FFEFD5"));
Color.PEACHPUFF = Object.freeze(Color.fromCssColorString("#FFDAB9"));
Color.PERU = Object.freeze(Color.fromCssColorString("#CD853F"));
Color.PINK = Object.freeze(Color.fromCssColorString("#FFC0CB"));
Color.PLUM = Object.freeze(Color.fromCssColorString("#DDA0DD"));
Color.POWDERBLUE = Object.freeze(Color.fromCssColorString("#B0E0E6"));
Color.PURPLE = Object.freeze(Color.fromCssColorString("#800080"));
Color.RED = Object.freeze(Color.fromCssColorString("#FF0000"));
Color.ROSYBROWN = Object.freeze(Color.fromCssColorString("#BC8F8F"));
Color.ROYALBLUE = Object.freeze(Color.fromCssColorString("#4169E1"));
Color.SADDLEBROWN = Object.freeze(Color.fromCssColorString("#8B4513"));
Color.SALMON = Object.freeze(Color.fromCssColorString("#FA8072"));
Color.SANDYBROWN = Object.freeze(Color.fromCssColorString("#F4A460"));
Color.SEAGREEN = Object.freeze(Color.fromCssColorString("#2E8B57"));
Color.SEASHELL = Object.freeze(Color.fromCssColorString("#FFF5EE"));
Color.SIENNA = Object.freeze(Color.fromCssColorString("#A0522D"));
Color.SILVER = Object.freeze(Color.fromCssColorString("#C0C0C0"));
Color.SKYBLUE = Object.freeze(Color.fromCssColorString("#87CEEB"));
Color.SLATEBLUE = Object.freeze(Color.fromCssColorString("#6A5ACD"));
Color.SLATEGRAY = Object.freeze(Color.fromCssColorString("#708090"));
Color.SLATEGREY = Color.SLATEGRAY;
Color.SNOW = Object.freeze(Color.fromCssColorString("#FFFAFA"));
Color.SPRINGGREEN = Object.freeze(Color.fromCssColorString("#00FF7F"));
Color.STEELBLUE = Object.freeze(Color.fromCssColorString("#4682B4"));
Color.TAN = Object.freeze(Color.fromCssColorString("#D2B48C"));
Color.TEAL = Object.freeze(Color.fromCssColorString("#008080"));
Color.THISTLE = Object.freeze(Color.fromCssColorString("#D8BFD8"));
Color.TOMATO = Object.freeze(Color.fromCssColorString("#FF6347"));
Color.TURQUOISE = Object.freeze(Color.fromCssColorString("#40E0D0"));
Color.VIOLET = Object.freeze(Color.fromCssColorString("#EE82EE"));
Color.WHEAT = Object.freeze(Color.fromCssColorString("#F5DEB3"));
Color.WHITE = Object.freeze(Color.fromCssColorString("#FFFFFF"));
Color.WHITESMOKE = Object.freeze(Color.fromCssColorString("#F5F5F5"));
Color.YELLOW = Object.freeze(Color.fromCssColorString("#FFFF00"));
Color.YELLOWGREEN = Object.freeze(Color.fromCssColorString("#9ACD32"));
Color.TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0));
var Color_default = Color;

// node_modules/@cesium/engine/Source/Core/scaleToGeodeticSurface.js
var scaleToGeodeticSurfaceIntersection = new Cartesian3_default();
var scaleToGeodeticSurfaceGradient = new Cartesian3_default();
function scaleToGeodeticSurface(cartesian, oneOverRadii, oneOverRadiiSquared, centerToleranceSquared, result) {
  if (!defined_default(cartesian)) {
    throw new DeveloperError_default("cartesian is required.");
  }
  if (!defined_default(oneOverRadii)) {
    throw new DeveloperError_default("oneOverRadii is required.");
  }
  if (!defined_default(oneOverRadiiSquared)) {
    throw new DeveloperError_default("oneOverRadiiSquared is required.");
  }
  if (!defined_default(centerToleranceSquared)) {
    throw new DeveloperError_default("centerToleranceSquared is required.");
  }
  const positionX = cartesian.x;
  const positionY = cartesian.y;
  const positionZ = cartesian.z;
  const oneOverRadiiX = oneOverRadii.x;
  const oneOverRadiiY = oneOverRadii.y;
  const oneOverRadiiZ = oneOverRadii.z;
  const x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
  const y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
  const z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;
  const squaredNorm = x2 + y2 + z2;
  const ratio = Math.sqrt(1 / squaredNorm);
  const intersection = Cartesian3_default.multiplyByScalar(
    cartesian,
    ratio,
    scaleToGeodeticSurfaceIntersection
  );
  if (squaredNorm < centerToleranceSquared) {
    return !isFinite(ratio) ? void 0 : Cartesian3_default.clone(intersection, result);
  }
  const oneOverRadiiSquaredX = oneOverRadiiSquared.x;
  const oneOverRadiiSquaredY = oneOverRadiiSquared.y;
  const oneOverRadiiSquaredZ = oneOverRadiiSquared.z;
  const gradient = scaleToGeodeticSurfaceGradient;
  gradient.x = intersection.x * oneOverRadiiSquaredX * 2;
  gradient.y = intersection.y * oneOverRadiiSquaredY * 2;
  gradient.z = intersection.z * oneOverRadiiSquaredZ * 2;
  let lambda = (1 - ratio) * Cartesian3_default.magnitude(cartesian) / (0.5 * Cartesian3_default.magnitude(gradient));
  let correction = 0;
  let func;
  let denominator;
  let xMultiplier;
  let yMultiplier;
  let zMultiplier;
  let xMultiplier2;
  let yMultiplier2;
  let zMultiplier2;
  let xMultiplier3;
  let yMultiplier3;
  let zMultiplier3;
  do {
    lambda -= correction;
    xMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredX);
    yMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredY);
    zMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredZ);
    xMultiplier2 = xMultiplier * xMultiplier;
    yMultiplier2 = yMultiplier * yMultiplier;
    zMultiplier2 = zMultiplier * zMultiplier;
    xMultiplier3 = xMultiplier2 * xMultiplier;
    yMultiplier3 = yMultiplier2 * yMultiplier;
    zMultiplier3 = zMultiplier2 * zMultiplier;
    func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1;
    denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;
    const derivative = -2 * denominator;
    correction = func / derivative;
  } while (Math.abs(func) > Math_default.EPSILON12);
  if (!defined_default(result)) {
    return new Cartesian3_default(
      positionX * xMultiplier,
      positionY * yMultiplier,
      positionZ * zMultiplier
    );
  }
  result.x = positionX * xMultiplier;
  result.y = positionY * yMultiplier;
  result.z = positionZ * zMultiplier;
  return result;
}
var scaleToGeodeticSurface_default = scaleToGeodeticSurface;

// node_modules/@cesium/engine/Source/Core/Cartographic.js
function Cartographic(longitude, latitude, height) {
  this.longitude = longitude ?? 0;
  this.latitude = latitude ?? 0;
  this.height = height ?? 0;
}
Cartographic.fromRadians = function(longitude, latitude, height, result) {
  Check_default.typeOf.number("longitude", longitude);
  Check_default.typeOf.number("latitude", latitude);
  height = height ?? 0;
  if (!defined_default(result)) {
    return new Cartographic(longitude, latitude, height);
  }
  result.longitude = longitude;
  result.latitude = latitude;
  result.height = height;
  return result;
};
Cartographic.fromDegrees = function(longitude, latitude, height, result) {
  Check_default.typeOf.number("longitude", longitude);
  Check_default.typeOf.number("latitude", latitude);
  longitude = Math_default.toRadians(longitude);
  latitude = Math_default.toRadians(latitude);
  return Cartographic.fromRadians(longitude, latitude, height, result);
};
var cartesianToCartographicN = new Cartesian3_default();
var cartesianToCartographicP = new Cartesian3_default();
var cartesianToCartographicH = new Cartesian3_default();
Cartographic._ellipsoidOneOverRadii = new Cartesian3_default(
  1 / 6378137,
  1 / 6378137,
  1 / 6356752314245179e-9
);
Cartographic._ellipsoidOneOverRadiiSquared = new Cartesian3_default(
  1 / (6378137 * 6378137),
  1 / (6378137 * 6378137),
  1 / (6356752314245179e-9 * 6356752314245179e-9)
);
Cartographic._ellipsoidCenterToleranceSquared = Math_default.EPSILON1;
Cartographic.fromCartesian = function(cartesian, ellipsoid, result) {
  const oneOverRadii = defined_default(ellipsoid) ? ellipsoid.oneOverRadii : Cartographic._ellipsoidOneOverRadii;
  const oneOverRadiiSquared = defined_default(ellipsoid) ? ellipsoid.oneOverRadiiSquared : Cartographic._ellipsoidOneOverRadiiSquared;
  const centerToleranceSquared = defined_default(ellipsoid) ? ellipsoid._centerToleranceSquared : Cartographic._ellipsoidCenterToleranceSquared;
  const p = scaleToGeodeticSurface_default(
    cartesian,
    oneOverRadii,
    oneOverRadiiSquared,
    centerToleranceSquared,
    cartesianToCartographicP
  );
  if (!defined_default(p)) {
    return void 0;
  }
  let n = Cartesian3_default.multiplyComponents(
    p,
    oneOverRadiiSquared,
    cartesianToCartographicN
  );
  n = Cartesian3_default.normalize(n, n);
  const h = Cartesian3_default.subtract(cartesian, p, cartesianToCartographicH);
  const longitude = Math.atan2(n.y, n.x);
  const latitude = Math.asin(n.z);
  const height = Math_default.sign(Cartesian3_default.dot(h, cartesian)) * Cartesian3_default.magnitude(h);
  if (!defined_default(result)) {
    return new Cartographic(longitude, latitude, height);
  }
  result.longitude = longitude;
  result.latitude = latitude;
  result.height = height;
  return result;
};
Cartographic.toCartesian = function(cartographic, ellipsoid, result) {
  Check_default.defined("cartographic", cartographic);
  return Cartesian3_default.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    cartographic.height,
    ellipsoid,
    result
  );
};
Cartographic.clone = function(cartographic, result) {
  if (!defined_default(cartographic)) {
    return void 0;
  }
  if (!defined_default(result)) {
    return new Cartographic(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height
    );
  }
  result.longitude = cartographic.longitude;
  result.latitude = cartographic.latitude;
  result.height = cartographic.height;
  return result;
};
Cartographic.equals = function(left, right) {
  return left === right || defined_default(left) && defined_default(right) && left.longitude === right.longitude && left.latitude === right.latitude && left.height === right.height;
};
Cartographic.equalsEpsilon = function(left, right, epsilon) {
  epsilon = epsilon ?? 0;
  return left === right || defined_default(left) && defined_default(right) && Math.abs(left.longitude - right.longitude) <= epsilon && Math.abs(left.latitude - right.latitude) <= epsilon && Math.abs(left.height - right.height) <= epsilon;
};
Cartographic.ZERO = Object.freeze(new Cartographic(0, 0, 0));
Cartographic.prototype.clone = function(result) {
  return Cartographic.clone(this, result);
};
Cartographic.prototype.equals = function(right) {
  return Cartographic.equals(this, right);
};
Cartographic.prototype.equalsEpsilon = function(right, epsilon) {
  return Cartographic.equalsEpsilon(this, right, epsilon);
};
Cartographic.prototype.toString = function() {
  return `(${this.longitude}, ${this.latitude}, ${this.height})`;
};
var Cartographic_default = Cartographic;

// node_modules/@cesium/engine/Source/Core/binarySearch.js
function binarySearch(array, itemToFind, comparator) {
  Check_default.defined("array", array);
  Check_default.defined("itemToFind", itemToFind);
  Check_default.defined("comparator", comparator);
  let low = 0;
  let high = array.length - 1;
  let i;
  let comparison;
  while (low <= high) {
    i = ~~((low + high) / 2);
    comparison = comparator(array[i], itemToFind);
    if (comparison < 0) {
      low = i + 1;
      continue;
    }
    if (comparison > 0) {
      high = i - 1;
      continue;
    }
    return i;
  }
  return ~(high + 1);
}
var binarySearch_default = binarySearch;

// node_modules/@cesium/engine/Source/Core/isLeapYear.js
function isLeapYear(year) {
  if (year === null || isNaN(year)) {
    throw new DeveloperError_default("year is required and must be a number.");
  }
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
var isLeapYear_default = isLeapYear;

// node_modules/@cesium/engine/Source/Core/GregorianDate.js
var daysInYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond) {
  const minimumYear = 1;
  const minimumMonth = 1;
  const minimumDay = 1;
  const minimumHour = 0;
  const minimumMinute = 0;
  const minimumSecond = 0;
  const minimumMillisecond = 0;
  year = year ?? minimumYear;
  month = month ?? minimumMonth;
  day = day ?? minimumDay;
  hour = hour ?? minimumHour;
  minute = minute ?? minimumMinute;
  second = second ?? minimumSecond;
  millisecond = millisecond ?? minimumMillisecond;
  isLeapSecond = isLeapSecond ?? false;
  validateRange();
  validateDate();
  this.year = year;
  this.month = month;
  this.day = day;
  this.hour = hour;
  this.minute = minute;
  this.second = second;
  this.millisecond = millisecond;
  this.isLeapSecond = isLeapSecond;
  function validateRange() {
    const maximumYear = 9999;
    const maximumMonth = 12;
    const maximumDay = 31;
    const maximumHour = 23;
    const maximumMinute = 59;
    const maximumSecond = 59;
    const excludedMaximumMilisecond = 1e3;
    Check_default.typeOf.number.greaterThanOrEquals("Year", year, minimumYear);
    Check_default.typeOf.number.lessThanOrEquals("Year", year, maximumYear);
    Check_default.typeOf.number.greaterThanOrEquals("Month", month, minimumMonth);
    Check_default.typeOf.number.lessThanOrEquals("Month", month, maximumMonth);
    Check_default.typeOf.number.greaterThanOrEquals("Day", day, minimumDay);
    Check_default.typeOf.number.lessThanOrEquals("Day", day, maximumDay);
    Check_default.typeOf.number.greaterThanOrEquals("Hour", hour, minimumHour);
    Check_default.typeOf.number.lessThanOrEquals("Hour", hour, maximumHour);
    Check_default.typeOf.number.greaterThanOrEquals("Minute", minute, minimumMinute);
    Check_default.typeOf.number.lessThanOrEquals("Minute", minute, maximumMinute);
    Check_default.typeOf.bool("IsLeapSecond", isLeapSecond);
    Check_default.typeOf.number.greaterThanOrEquals("Second", second, minimumSecond);
    Check_default.typeOf.number.lessThanOrEquals(
      "Second",
      second,
      isLeapSecond ? maximumSecond + 1 : maximumSecond
    );
    Check_default.typeOf.number.greaterThanOrEquals(
      "Millisecond",
      millisecond,
      minimumMillisecond
    );
    Check_default.typeOf.number.lessThan(
      "Millisecond",
      millisecond,
      excludedMaximumMilisecond
    );
  }
  function validateDate() {
    const daysInMonth2 = month === 2 && isLeapYear_default(year) ? daysInYear[month - 1] + 1 : daysInYear[month - 1];
    if (day > daysInMonth2) {
      throw new DeveloperError_default("Month and Day represents invalid date");
    }
  }
}
var GregorianDate_default = GregorianDate;

// node_modules/@cesium/engine/Source/Core/LeapSecond.js
function LeapSecond(date, offset) {
  this.julianDate = date;
  this.offset = offset;
}
var LeapSecond_default = LeapSecond;

// node_modules/@cesium/engine/Source/Core/TimeConstants.js
var TimeConstants = {
  /**
   * The number of seconds in one millisecond: <code>0.001</code>
   * @type {number}
   * @constant
   */
  SECONDS_PER_MILLISECOND: 1e-3,
  /**
   * The number of seconds in one minute: <code>60</code>.
   * @type {number}
   * @constant
   */
  SECONDS_PER_MINUTE: 60,
  /**
   * The number of minutes in one hour: <code>60</code>.
   * @type {number}
   * @constant
   */
  MINUTES_PER_HOUR: 60,
  /**
   * The number of hours in one day: <code>24</code>.
   * @type {number}
   * @constant
   */
  HOURS_PER_DAY: 24,
  /**
   * The number of seconds in one hour: <code>3600</code>.
   * @type {number}
   * @constant
   */
  SECONDS_PER_HOUR: 3600,
  /**
   * The number of minutes in one day: <code>1440</code>.
   * @type {number}
   * @constant
   */
  MINUTES_PER_DAY: 1440,
  /**
   * The number of seconds in one day, ignoring leap seconds: <code>86400</code>.
   * @type {number}
   * @constant
   */
  SECONDS_PER_DAY: 86400,
  /**
   * The number of days in one Julian century: <code>36525</code>.
   * @type {number}
   * @constant
   */
  DAYS_PER_JULIAN_CENTURY: 36525,
  /**
   * One trillionth of a second.
   * @type {number}
   * @constant
   */
  PICOSECOND: 1e-9,
  /**
   * The number of days to subtract from a Julian date to determine the
   * modified Julian date, which gives the number of days since midnight
   * on November 17, 1858.
   * @type {number}
   * @constant
   */
  MODIFIED_JULIAN_DATE_DIFFERENCE: 24000005e-1
};
var TimeConstants_default = Object.freeze(TimeConstants);

// node_modules/@cesium/engine/Source/Core/TimeStandard.js
var TimeStandard = {
  /**
   * Represents the coordinated Universal Time (UTC) time standard.
   *
   * UTC is related to TAI according to the relationship
   * <code>UTC = TAI - deltaT</code> where <code>deltaT</code> is the number of leap
   * seconds which have been introduced as of the time in TAI.
   *
   * @type {number}
   * @constant
   */
  UTC: 0,
  /**
   * Represents the International Atomic Time (TAI) time standard.
   * TAI is the principal time standard to which the other time standards are related.
   *
   * @type {number}
   * @constant
   */
  TAI: 1
};
var TimeStandard_default = Object.freeze(TimeStandard);

// node_modules/@cesium/engine/Source/Core/JulianDate.js
var gregorianDateScratch = new GregorianDate_default();
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var daysInLeapFebruary = 29;
function compareLeapSecondDates(leapSecond, dateToFind) {
  return JulianDate.compare(leapSecond.julianDate, dateToFind.julianDate);
}
var binarySearchScratchLeapSecond = new LeapSecond_default();
function convertUtcToTai(julianDate) {
  binarySearchScratchLeapSecond.julianDate = julianDate;
  const leapSeconds = JulianDate.leapSeconds;
  let index = binarySearch_default(
    leapSeconds,
    binarySearchScratchLeapSecond,
    compareLeapSecondDates
  );
  if (index < 0) {
    index = ~index;
  }
  if (index >= leapSeconds.length) {
    index = leapSeconds.length - 1;
  }
  let offset = leapSeconds[index].offset;
  if (index > 0) {
    const difference = JulianDate.secondsDifference(
      leapSeconds[index].julianDate,
      julianDate
    );
    if (difference > offset) {
      index--;
      offset = leapSeconds[index].offset;
    }
  }
  JulianDate.addSeconds(julianDate, offset, julianDate);
}
function convertTaiToUtc(julianDate, result) {
  binarySearchScratchLeapSecond.julianDate = julianDate;
  const leapSeconds = JulianDate.leapSeconds;
  let index = binarySearch_default(
    leapSeconds,
    binarySearchScratchLeapSecond,
    compareLeapSecondDates
  );
  if (index < 0) {
    index = ~index;
  }
  if (index === 0) {
    return JulianDate.addSeconds(julianDate, -leapSeconds[0].offset, result);
  }
  if (index >= leapSeconds.length) {
    return JulianDate.addSeconds(
      julianDate,
      -leapSeconds[index - 1].offset,
      result
    );
  }
  const difference = JulianDate.secondsDifference(
    leapSeconds[index].julianDate,
    julianDate
  );
  if (difference === 0) {
    return JulianDate.addSeconds(
      julianDate,
      -leapSeconds[index].offset,
      result
    );
  }
  if (difference <= 1) {
    return void 0;
  }
  return JulianDate.addSeconds(
    julianDate,
    -leapSeconds[--index].offset,
    result
  );
}
function setComponents(wholeDays, secondsOfDay, julianDate) {
  const extraDays = secondsOfDay / TimeConstants_default.SECONDS_PER_DAY | 0;
  wholeDays += extraDays;
  secondsOfDay -= TimeConstants_default.SECONDS_PER_DAY * extraDays;
  if (secondsOfDay < 0) {
    wholeDays--;
    secondsOfDay += TimeConstants_default.SECONDS_PER_DAY;
  }
  julianDate.dayNumber = wholeDays;
  julianDate.secondsOfDay = secondsOfDay;
  return julianDate;
}
function computeJulianDateComponents(year, month, day, hour, minute, second, millisecond) {
  const a = (month - 14) / 12 | 0;
  const b = year + 4800 + a;
  let dayNumber = (1461 * b / 4 | 0) + (367 * (month - 2 - 12 * a) / 12 | 0) - (3 * ((b + 100) / 100 | 0) / 4 | 0) + day - 32075;
  hour = hour - 12;
  if (hour < 0) {
    hour += 24;
  }
  const secondsOfDay = second + (hour * TimeConstants_default.SECONDS_PER_HOUR + minute * TimeConstants_default.SECONDS_PER_MINUTE + millisecond * TimeConstants_default.SECONDS_PER_MILLISECOND);
  if (secondsOfDay >= 43200) {
    dayNumber -= 1;
  }
  return [dayNumber, secondsOfDay];
}
var matchCalendarYear = /^(\d{4})$/;
var matchCalendarMonth = /^(\d{4})-(\d{2})$/;
var matchOrdinalDate = /^(\d{4})-?(\d{3})$/;
var matchWeekDate = /^(\d{4})-?W(\d{2})-?(\d{1})?$/;
var matchCalendarDate = /^(\d{4})-?(\d{2})-?(\d{2})$/;
var utcOffset = /([Z+\-])?(\d{2})?:?(\d{2})?$/;
var matchHours = /^(\d{2})(\.\d+)?/.source + utcOffset.source;
var matchHoursMinutes = /^(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
var matchHoursMinutesSeconds = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
var iso8601ErrorMessage = "Invalid ISO 8601 date.";
function JulianDate(julianDayNumber, secondsOfDay, timeStandard) {
  this.dayNumber = void 0;
  this.secondsOfDay = void 0;
  julianDayNumber = julianDayNumber ?? 0;
  secondsOfDay = secondsOfDay ?? 0;
  timeStandard = timeStandard ?? TimeStandard_default.UTC;
  const wholeDays = julianDayNumber | 0;
  secondsOfDay = secondsOfDay + (julianDayNumber - wholeDays) * TimeConstants_default.SECONDS_PER_DAY;
  setComponents(wholeDays, secondsOfDay, this);
  if (timeStandard === TimeStandard_default.UTC) {
    convertUtcToTai(this);
  }
}
JulianDate.fromGregorianDate = function(date, result) {
  if (!(date instanceof GregorianDate_default)) {
    throw new DeveloperError_default("date must be a valid GregorianDate.");
  }
  const components = computeJulianDateComponents(
    date.year,
    date.month,
    date.day,
    date.hour,
    date.minute,
    date.second,
    date.millisecond
  );
  if (!defined_default(result)) {
    return new JulianDate(components[0], components[1], TimeStandard_default.UTC);
  }
  setComponents(components[0], components[1], result);
  convertUtcToTai(result);
  return result;
};
JulianDate.fromDate = function(date, result) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new DeveloperError_default("date must be a valid JavaScript Date.");
  }
  const components = computeJulianDateComponents(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
  if (!defined_default(result)) {
    return new JulianDate(components[0], components[1], TimeStandard_default.UTC);
  }
  setComponents(components[0], components[1], result);
  convertUtcToTai(result);
  return result;
};
JulianDate.fromIso8601 = function(iso8601String, result) {
  if (typeof iso8601String !== "string") {
    throw new DeveloperError_default(iso8601ErrorMessage);
  }
  iso8601String = iso8601String.replace(",", ".");
  let tokens = iso8601String.split("T");
  let year;
  let month = 1;
  let day = 1;
  let hour = 0;
  let minute = 0;
  let second = 0;
  let millisecond = 0;
  const date = tokens[0];
  const time = tokens[1];
  let tmp;
  let inLeapYear;
  if (!defined_default(date)) {
    throw new DeveloperError_default(iso8601ErrorMessage);
  }
  let dashCount;
  tokens = date.match(matchCalendarDate);
  if (tokens !== null) {
    dashCount = date.split("-").length - 1;
    if (dashCount > 0 && dashCount !== 2) {
      throw new DeveloperError_default(iso8601ErrorMessage);
    }
    year = +tokens[1];
    month = +tokens[2];
    day = +tokens[3];
  } else {
    tokens = date.match(matchCalendarMonth);
    if (tokens !== null) {
      year = +tokens[1];
      month = +tokens[2];
    } else {
      tokens = date.match(matchCalendarYear);
      if (tokens !== null) {
        year = +tokens[1];
      } else {
        let dayOfYear;
        tokens = date.match(matchOrdinalDate);
        if (tokens !== null) {
          year = +tokens[1];
          dayOfYear = +tokens[2];
          inLeapYear = isLeapYear_default(year);
          if (dayOfYear < 1 || inLeapYear && dayOfYear > 366 || !inLeapYear && dayOfYear > 365) {
            throw new DeveloperError_default(iso8601ErrorMessage);
          }
        } else {
          tokens = date.match(matchWeekDate);
          if (tokens !== null) {
            year = +tokens[1];
            const weekNumber = +tokens[2];
            const dayOfWeek = +tokens[3] || 0;
            dashCount = date.split("-").length - 1;
            if (dashCount > 0 && (!defined_default(tokens[3]) && dashCount !== 1 || defined_default(tokens[3]) && dashCount !== 2)) {
              throw new DeveloperError_default(iso8601ErrorMessage);
            }
            const january4 = new Date(Date.UTC(year, 0, 4));
            dayOfYear = weekNumber * 7 + dayOfWeek - january4.getUTCDay() - 3;
          } else {
            throw new DeveloperError_default(iso8601ErrorMessage);
          }
        }
        tmp = new Date(Date.UTC(year, 0, 1));
        tmp.setUTCDate(dayOfYear);
        month = tmp.getUTCMonth() + 1;
        day = tmp.getUTCDate();
      }
    }
  }
  inLeapYear = isLeapYear_default(year);
  if (month < 1 || month > 12 || day < 1 || (month !== 2 || !inLeapYear) && day > daysInMonth[month - 1] || inLeapYear && month === 2 && day > daysInLeapFebruary) {
    throw new DeveloperError_default(iso8601ErrorMessage);
  }
  let offsetIndex;
  if (defined_default(time)) {
    tokens = time.match(matchHoursMinutesSeconds);
    if (tokens !== null) {
      dashCount = time.split(":").length - 1;
      if (dashCount > 0 && dashCount !== 2 && dashCount !== 3) {
        throw new DeveloperError_default(iso8601ErrorMessage);
      }
      hour = +tokens[1];
      minute = +tokens[2];
      second = +tokens[3];
      millisecond = +(tokens[4] || 0) * 1e3;
      offsetIndex = 5;
    } else {
      tokens = time.match(matchHoursMinutes);
      if (tokens !== null) {
        dashCount = time.split(":").length - 1;
        if (dashCount > 2) {
          throw new DeveloperError_default(iso8601ErrorMessage);
        }
        hour = +tokens[1];
        minute = +tokens[2];
        second = +(tokens[3] || 0) * 60;
        offsetIndex = 4;
      } else {
        tokens = time.match(matchHours);
        if (tokens !== null) {
          hour = +tokens[1];
          minute = +(tokens[2] || 0) * 60;
          offsetIndex = 3;
        } else {
          throw new DeveloperError_default(iso8601ErrorMessage);
        }
      }
    }
    if (minute >= 60 || second >= 61 || hour > 24 || hour === 24 && (minute > 0 || second > 0 || millisecond > 0)) {
      throw new DeveloperError_default(iso8601ErrorMessage);
    }
    const offset = tokens[offsetIndex];
    const offsetHours = +tokens[offsetIndex + 1];
    const offsetMinutes = +(tokens[offsetIndex + 2] || 0);
    switch (offset) {
      case "+":
        hour = hour - offsetHours;
        minute = minute - offsetMinutes;
        break;
      case "-":
        hour = hour + offsetHours;
        minute = minute + offsetMinutes;
        break;
      case "Z":
        break;
      default:
        minute = minute + new Date(
          Date.UTC(year, month - 1, day, hour, minute)
        ).getTimezoneOffset();
        break;
    }
  }
  const isLeapSecond = second === 60;
  if (isLeapSecond) {
    second--;
  }
  while (minute >= 60) {
    minute -= 60;
    hour++;
  }
  while (hour >= 24) {
    hour -= 24;
    day++;
  }
  tmp = inLeapYear && month === 2 ? daysInLeapFebruary : daysInMonth[month - 1];
  while (day > tmp) {
    day -= tmp;
    month++;
    if (month > 12) {
      month -= 12;
      year++;
    }
    tmp = inLeapYear && month === 2 ? daysInLeapFebruary : daysInMonth[month - 1];
  }
  while (minute < 0) {
    minute += 60;
    hour--;
  }
  while (hour < 0) {
    hour += 24;
    day--;
  }
  while (day < 1) {
    month--;
    if (month < 1) {
      month += 12;
      year--;
    }
    tmp = inLeapYear && month === 2 ? daysInLeapFebruary : daysInMonth[month - 1];
    day += tmp;
  }
  const components = computeJulianDateComponents(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond
  );
  if (!defined_default(result)) {
    result = new JulianDate(components[0], components[1], TimeStandard_default.UTC);
  } else {
    setComponents(components[0], components[1], result);
    convertUtcToTai(result);
  }
  if (isLeapSecond) {
    JulianDate.addSeconds(result, 1, result);
  }
  return result;
};
JulianDate.now = function(result) {
  return JulianDate.fromDate(/* @__PURE__ */ new Date(), result);
};
var toGregorianDateScratch = new JulianDate(0, 0, TimeStandard_default.TAI);
JulianDate.toGregorianDate = function(julianDate, result) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  let isLeapSecond = false;
  let thisUtc = convertTaiToUtc(julianDate, toGregorianDateScratch);
  if (!defined_default(thisUtc)) {
    JulianDate.addSeconds(julianDate, -1, toGregorianDateScratch);
    thisUtc = convertTaiToUtc(toGregorianDateScratch, toGregorianDateScratch);
    isLeapSecond = true;
  }
  let julianDayNumber = thisUtc.dayNumber;
  const secondsOfDay = thisUtc.secondsOfDay;
  if (secondsOfDay >= 43200) {
    julianDayNumber += 1;
  }
  let L = julianDayNumber + 68569 | 0;
  const N = 4 * L / 146097 | 0;
  L = L - ((146097 * N + 3) / 4 | 0) | 0;
  const I = 4e3 * (L + 1) / 1461001 | 0;
  L = L - (1461 * I / 4 | 0) + 31 | 0;
  const J = 80 * L / 2447 | 0;
  const day = L - (2447 * J / 80 | 0) | 0;
  L = J / 11 | 0;
  const month = J + 2 - 12 * L | 0;
  const year = 100 * (N - 49) + I + L | 0;
  let hour = secondsOfDay / TimeConstants_default.SECONDS_PER_HOUR | 0;
  let remainingSeconds = secondsOfDay - hour * TimeConstants_default.SECONDS_PER_HOUR;
  const minute = remainingSeconds / TimeConstants_default.SECONDS_PER_MINUTE | 0;
  remainingSeconds = remainingSeconds - minute * TimeConstants_default.SECONDS_PER_MINUTE;
  let second = remainingSeconds | 0;
  const millisecond = (remainingSeconds - second) / TimeConstants_default.SECONDS_PER_MILLISECOND;
  hour += 12;
  if (hour > 23) {
    hour -= 24;
  }
  if (isLeapSecond) {
    second += 1;
  }
  if (!defined_default(result)) {
    return new GregorianDate_default(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      isLeapSecond
    );
  }
  result.year = year;
  result.month = month;
  result.day = day;
  result.hour = hour;
  result.minute = minute;
  result.second = second;
  result.millisecond = millisecond;
  result.isLeapSecond = isLeapSecond;
  return result;
};
JulianDate.toDate = function(julianDate) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  const gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
  let second = gDate.second;
  if (gDate.isLeapSecond) {
    second -= 1;
  }
  return new Date(
    Date.UTC(
      gDate.year,
      gDate.month - 1,
      gDate.day,
      gDate.hour,
      gDate.minute,
      second,
      gDate.millisecond
    )
  );
};
JulianDate.toIso8601 = function(julianDate, precision) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  const gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
  let year = gDate.year;
  let month = gDate.month;
  let day = gDate.day;
  let hour = gDate.hour;
  const minute = gDate.minute;
  const second = gDate.second;
  const millisecond = gDate.millisecond;
  if (year === 1e4 && month === 1 && day === 1 && hour === 0 && minute === 0 && second === 0 && millisecond === 0) {
    year = 9999;
    month = 12;
    day = 31;
    hour = 24;
  }
  let millisecondStr;
  if (!defined_default(precision) && millisecond !== 0) {
    const millisecondHundreds = millisecond * 0.01;
    millisecondStr = millisecondHundreds < 1e-6 ? millisecondHundreds.toFixed(20).replace(".", "").replace(/0+$/, "") : millisecondHundreds.toString().replace(".", "");
    return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}.${millisecondStr}Z`;
  }
  if (!defined_default(precision) || precision === 0) {
    return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}Z`;
  }
  millisecondStr = (millisecond * 0.01).toFixed(precision).replace(".", "").slice(0, precision);
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}.${millisecondStr}Z`;
};
JulianDate.clone = function(julianDate, result) {
  if (!defined_default(julianDate)) {
    return void 0;
  }
  if (!defined_default(result)) {
    return new JulianDate(
      julianDate.dayNumber,
      julianDate.secondsOfDay,
      TimeStandard_default.TAI
    );
  }
  result.dayNumber = julianDate.dayNumber;
  result.secondsOfDay = julianDate.secondsOfDay;
  return result;
};
JulianDate.compare = function(left, right) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("left is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("right is required.");
  }
  const julianDayNumberDifference = left.dayNumber - right.dayNumber;
  if (julianDayNumberDifference !== 0) {
    return julianDayNumberDifference;
  }
  return left.secondsOfDay - right.secondsOfDay;
};
JulianDate.equals = function(left, right) {
  return left === right || defined_default(left) && defined_default(right) && left.dayNumber === right.dayNumber && left.secondsOfDay === right.secondsOfDay;
};
JulianDate.equalsEpsilon = function(left, right, epsilon) {
  epsilon = epsilon ?? 0;
  return left === right || defined_default(left) && defined_default(right) && Math.abs(JulianDate.secondsDifference(left, right)) <= epsilon;
};
JulianDate.totalDays = function(julianDate) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  return julianDate.dayNumber + julianDate.secondsOfDay / TimeConstants_default.SECONDS_PER_DAY;
};
JulianDate.secondsDifference = function(left, right) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("left is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("right is required.");
  }
  const dayDifference = (left.dayNumber - right.dayNumber) * TimeConstants_default.SECONDS_PER_DAY;
  return dayDifference + (left.secondsOfDay - right.secondsOfDay);
};
JulianDate.daysDifference = function(left, right) {
  if (!defined_default(left)) {
    throw new DeveloperError_default("left is required.");
  }
  if (!defined_default(right)) {
    throw new DeveloperError_default("right is required.");
  }
  const dayDifference = left.dayNumber - right.dayNumber;
  const secondDifference = (left.secondsOfDay - right.secondsOfDay) / TimeConstants_default.SECONDS_PER_DAY;
  return dayDifference + secondDifference;
};
JulianDate.computeTaiMinusUtc = function(julianDate) {
  binarySearchScratchLeapSecond.julianDate = julianDate;
  const leapSeconds = JulianDate.leapSeconds;
  let index = binarySearch_default(
    leapSeconds,
    binarySearchScratchLeapSecond,
    compareLeapSecondDates
  );
  if (index < 0) {
    index = ~index;
    --index;
    if (index < 0) {
      index = 0;
    }
  }
  return leapSeconds[index].offset;
};
JulianDate.addSeconds = function(julianDate, seconds, result) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  if (!defined_default(seconds)) {
    throw new DeveloperError_default("seconds is required.");
  }
  if (!defined_default(result)) {
    throw new DeveloperError_default("result is required.");
  }
  return setComponents(
    julianDate.dayNumber,
    julianDate.secondsOfDay + seconds,
    result
  );
};
JulianDate.addMinutes = function(julianDate, minutes, result) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  if (!defined_default(minutes)) {
    throw new DeveloperError_default("minutes is required.");
  }
  if (!defined_default(result)) {
    throw new DeveloperError_default("result is required.");
  }
  const newSecondsOfDay = julianDate.secondsOfDay + minutes * TimeConstants_default.SECONDS_PER_MINUTE;
  return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
};
JulianDate.addHours = function(julianDate, hours, result) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  if (!defined_default(hours)) {
    throw new DeveloperError_default("hours is required.");
  }
  if (!defined_default(result)) {
    throw new DeveloperError_default("result is required.");
  }
  const newSecondsOfDay = julianDate.secondsOfDay + hours * TimeConstants_default.SECONDS_PER_HOUR;
  return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
};
JulianDate.addDays = function(julianDate, days, result) {
  if (!defined_default(julianDate)) {
    throw new DeveloperError_default("julianDate is required.");
  }
  if (!defined_default(days)) {
    throw new DeveloperError_default("days is required.");
  }
  if (!defined_default(result)) {
    throw new DeveloperError_default("result is required.");
  }
  const newJulianDayNumber = julianDate.dayNumber + days;
  return setComponents(newJulianDayNumber, julianDate.secondsOfDay, result);
};
JulianDate.lessThan = function(left, right) {
  return JulianDate.compare(left, right) < 0;
};
JulianDate.lessThanOrEquals = function(left, right) {
  return JulianDate.compare(left, right) <= 0;
};
JulianDate.greaterThan = function(left, right) {
  return JulianDate.compare(left, right) > 0;
};
JulianDate.greaterThanOrEquals = function(left, right) {
  return JulianDate.compare(left, right) >= 0;
};
JulianDate.prototype.clone = function(result) {
  return JulianDate.clone(this, result);
};
JulianDate.prototype.equals = function(right) {
  return JulianDate.equals(this, right);
};
JulianDate.prototype.equalsEpsilon = function(right, epsilon) {
  return JulianDate.equalsEpsilon(this, right, epsilon);
};
JulianDate.prototype.toString = function() {
  return JulianDate.toIso8601(this);
};
JulianDate.leapSeconds = [
  new LeapSecond_default(new JulianDate(2441317, 43210, TimeStandard_default.TAI), 10),
  // January 1, 1972 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2441499, 43211, TimeStandard_default.TAI), 11),
  // July 1, 1972 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2441683, 43212, TimeStandard_default.TAI), 12),
  // January 1, 1973 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2442048, 43213, TimeStandard_default.TAI), 13),
  // January 1, 1974 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2442413, 43214, TimeStandard_default.TAI), 14),
  // January 1, 1975 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2442778, 43215, TimeStandard_default.TAI), 15),
  // January 1, 1976 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2443144, 43216, TimeStandard_default.TAI), 16),
  // January 1, 1977 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2443509, 43217, TimeStandard_default.TAI), 17),
  // January 1, 1978 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2443874, 43218, TimeStandard_default.TAI), 18),
  // January 1, 1979 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2444239, 43219, TimeStandard_default.TAI), 19),
  // January 1, 1980 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2444786, 43220, TimeStandard_default.TAI), 20),
  // July 1, 1981 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2445151, 43221, TimeStandard_default.TAI), 21),
  // July 1, 1982 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2445516, 43222, TimeStandard_default.TAI), 22),
  // July 1, 1983 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2446247, 43223, TimeStandard_default.TAI), 23),
  // July 1, 1985 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2447161, 43224, TimeStandard_default.TAI), 24),
  // January 1, 1988 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2447892, 43225, TimeStandard_default.TAI), 25),
  // January 1, 1990 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2448257, 43226, TimeStandard_default.TAI), 26),
  // January 1, 1991 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2448804, 43227, TimeStandard_default.TAI), 27),
  // July 1, 1992 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2449169, 43228, TimeStandard_default.TAI), 28),
  // July 1, 1993 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2449534, 43229, TimeStandard_default.TAI), 29),
  // July 1, 1994 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2450083, 43230, TimeStandard_default.TAI), 30),
  // January 1, 1996 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2450630, 43231, TimeStandard_default.TAI), 31),
  // July 1, 1997 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2451179, 43232, TimeStandard_default.TAI), 32),
  // January 1, 1999 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2453736, 43233, TimeStandard_default.TAI), 33),
  // January 1, 2006 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2454832, 43234, TimeStandard_default.TAI), 34),
  // January 1, 2009 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2456109, 43235, TimeStandard_default.TAI), 35),
  // July 1, 2012 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2457204, 43236, TimeStandard_default.TAI), 36),
  // July 1, 2015 00:00:00 UTC
  new LeapSecond_default(new JulianDate(2457754, 43237, TimeStandard_default.TAI), 37)
  // January 1, 2017 00:00:00 UTC
];
var JulianDate_default = JulianDate;

// node_modules/@cesium/engine/Source/Core/Event.js
function Event() {
  this._listeners = [];
  this._scopes = [];
  this._toRemove = [];
  this._insideRaiseEvent = false;
}
Object.defineProperties(Event.prototype, {
  /**
   * The number of listeners currently subscribed to the event.
   * @memberof Event.prototype
   * @type {number}
   * @readonly
   */
  numberOfListeners: {
    get: function() {
      return this._listeners.length - this._toRemove.length;
    }
  }
});
Event.prototype.addEventListener = function(listener, scope) {
  Check_default.typeOf.func("listener", listener);
  this._listeners.push(listener);
  this._scopes.push(scope);
  const event = this;
  return function() {
    event.removeEventListener(listener, scope);
  };
};
Event.prototype.removeEventListener = function(listener, scope) {
  Check_default.typeOf.func("listener", listener);
  const listeners = this._listeners;
  const scopes = this._scopes;
  let index = -1;
  for (let i = 0; i < listeners.length; i++) {
    if (listeners[i] === listener && scopes[i] === scope) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    if (this._insideRaiseEvent) {
      this._toRemove.push(index);
      listeners[index] = void 0;
      scopes[index] = void 0;
    } else {
      listeners.splice(index, 1);
      scopes.splice(index, 1);
    }
    return true;
  }
  return false;
};
function compareNumber(a, b) {
  return b - a;
}
Event.prototype.raiseEvent = function() {
  this._insideRaiseEvent = true;
  let i;
  const listeners = this._listeners;
  const scopes = this._scopes;
  let length = listeners.length;
  for (i = 0; i < length; i++) {
    const listener = listeners[i];
    if (defined_default(listener)) {
      listeners[i].apply(scopes[i], arguments);
    }
  }
  const toRemove = this._toRemove;
  length = toRemove.length;
  if (length > 0) {
    toRemove.sort(compareNumber);
    for (i = 0; i < length; i++) {
      const index = toRemove[i];
      listeners.splice(index, 1);
      scopes.splice(index, 1);
    }
    toRemove.length = 0;
  }
  this._insideRaiseEvent = false;
};
var Event_default = Event;

// node_modules/@cesium/engine/Source/DataSources/ConstantProperty.js
function ConstantProperty(value) {
  this._value = void 0;
  this._hasClone = false;
  this._hasEquals = false;
  this._definitionChanged = new Event_default();
  this.setValue(value);
}
Object.defineProperties(ConstantProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.
   * This property always returns <code>true</code>.
   * @memberof ConstantProperty.prototype
   *
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    value: true
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is changed whenever setValue is called with data different
   * than the current value.
   * @memberof ConstantProperty.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  }
});
ConstantProperty.prototype.getValue = function(time, result) {
  return this._hasClone ? this._value.clone(result) : this._value;
};
ConstantProperty.prototype.setValue = function(value) {
  const oldValue = this._value;
  if (oldValue !== value) {
    const isDefined = defined_default(value);
    const hasClone = isDefined && typeof value.clone === "function";
    const hasEquals = isDefined && typeof value.equals === "function";
    const changed = !hasEquals || !value.equals(oldValue);
    if (changed) {
      this._hasClone = hasClone;
      this._hasEquals = hasEquals;
      this._value = !hasClone ? value : value.clone(this._value);
      this._definitionChanged.raiseEvent(this);
    }
  }
};
ConstantProperty.prototype.equals = function(other) {
  return this === other || //
  other instanceof ConstantProperty && //
  (!this._hasEquals && this._value === other._value || //
  this._hasEquals && this._value.equals(other._value));
};
ConstantProperty.prototype.valueOf = function() {
  return this._value;
};
ConstantProperty.prototype.toString = function() {
  return String(this._value);
};
var ConstantProperty_default = ConstantProperty;

// node_modules/@cesium/engine/Source/DataSources/createPropertyDescriptor.js
function createProperty(name, privateName, subscriptionName, configurable, createPropertyCallback) {
  return {
    configurable,
    get: function() {
      return this[privateName];
    },
    set: function(value) {
      const oldValue = this[privateName];
      const subscription = this[subscriptionName];
      if (defined_default(subscription)) {
        subscription();
        this[subscriptionName] = void 0;
      }
      const hasValue = value !== void 0;
      if (hasValue && (!defined_default(value) || !defined_default(value.getValue)) && defined_default(createPropertyCallback)) {
        value = createPropertyCallback(value);
      }
      if (oldValue !== value) {
        this[privateName] = value;
        this._definitionChanged.raiseEvent(this, name, value, oldValue);
      }
      if (defined_default(value) && defined_default(value.definitionChanged)) {
        this[subscriptionName] = value.definitionChanged.addEventListener(
          function() {
            this._definitionChanged.raiseEvent(this, name, value, value);
          },
          this
        );
      }
    }
  };
}
function createConstantProperty(value) {
  return new ConstantProperty_default(value);
}
function createPropertyDescriptor(name, configurable, createPropertyCallback) {
  return createProperty(
    name,
    `_${name.toString()}`,
    `_${name.toString()}Subscription`,
    configurable ?? false,
    createPropertyCallback ?? createConstantProperty
  );
}
var createPropertyDescriptor_default = createPropertyDescriptor;

// node_modules/@cesium/engine/Source/DataSources/Property.js
function Property() {
  DeveloperError_default.throwInstantiationError();
}
Object.defineProperties(Property.prototype, {
  /**
   * Gets a value indicating if this property is constant.  A property is considered
   * constant if getValue always returns the same result for the current definition.
   * @memberof Property.prototype
   *
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: DeveloperError_default.throwInstantiationError
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return
   * a different result for the same time.
   * @memberof Property.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: DeveloperError_default.throwInstantiationError
  }
});
Property.prototype.getValue = DeveloperError_default.throwInstantiationError;
Property.prototype.equals = DeveloperError_default.throwInstantiationError;
Property.equals = function(left, right) {
  return left === right || defined_default(left) && left.equals(right);
};
Property.arrayEquals = function(left, right) {
  if (left === right) {
    return true;
  }
  if (!defined_default(left) || !defined_default(right) || left.length !== right.length) {
    return false;
  }
  const length = left.length;
  for (let i = 0; i < length; i++) {
    if (!Property.equals(left[i], right[i])) {
      return false;
    }
  }
  return true;
};
Property.isConstant = function(property) {
  return !defined_default(property) || property.isConstant;
};
Property.getValueOrUndefined = function(property, time, result) {
  return defined_default(property) ? property.getValue(time, result) : void 0;
};
Property.getValueOrDefault = function(property, time, valueDefault, result) {
  return defined_default(property) ? property.getValue(time, result) ?? valueDefault : valueDefault;
};
Property.getValueOrClonedDefault = function(property, time, valueDefault, result) {
  let value;
  if (defined_default(property)) {
    value = property.getValue(time, result);
  }
  if (!defined_default(value)) {
    value = valueDefault.clone(value);
  }
  return value;
};
var Property_default = Property;

// node_modules/@cesium/engine/Source/DataSources/ColorMaterialProperty.js
function ColorMaterialProperty(color) {
  this._definitionChanged = new Event_default();
  this._color = void 0;
  this._colorSubscription = void 0;
  this.color = color;
}
Object.defineProperties(ColorMaterialProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.  A property is considered
   * constant if getValue always returns the same result for the current definition.
   * @memberof ColorMaterialProperty.prototype
   *
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: function() {
      return Property_default.isConstant(this._color);
    }
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return
   * a different result for the same time.
   * @memberof ColorMaterialProperty.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },
  /**
   * Gets or sets the {@link Color} {@link Property}.
   * @memberof ColorMaterialProperty.prototype
   * @type {Property|undefined}
   * @default Color.WHITE
   */
  color: createPropertyDescriptor_default("color")
});
ColorMaterialProperty.prototype.getType = function(time) {
  return "Color";
};
var timeScratch = new JulianDate_default();
ColorMaterialProperty.prototype.getValue = function(time, result) {
  if (!defined_default(time)) {
    time = JulianDate_default.now(timeScratch);
  }
  if (!defined_default(result)) {
    result = {};
  }
  result.color = Property_default.getValueOrClonedDefault(
    this._color,
    time,
    Color_default.WHITE,
    result.color
  );
  return result;
};
ColorMaterialProperty.prototype.equals = function(other) {
  return this === other || //
  other instanceof ColorMaterialProperty && //
  Property_default.equals(this._color, other._color);
};
var ColorMaterialProperty_default = ColorMaterialProperty;

// node_modules/@cesium/engine/Source/Core/PolygonHierarchy.js
function PolygonHierarchy(positions, holes) {
  this.positions = defined_default(positions) ? positions : [];
  this.holes = defined_default(holes) ? holes : [];
}
var PolygonHierarchy_default = PolygonHierarchy;

// node_modules/@cesium/engine/Source/DataSources/CallbackProperty.js
function CallbackProperty(callback, isConstant) {
  this._callback = void 0;
  this._isConstant = void 0;
  this._definitionChanged = new Event_default();
  this.setCallback(callback, isConstant);
}
Object.defineProperties(CallbackProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.
   * @memberof CallbackProperty.prototype
   *
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: function() {
      return this._isConstant;
    }
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is changed whenever setCallback is called.
   * @memberof CallbackProperty.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  }
});
var timeScratch2 = new JulianDate_default();
CallbackProperty.prototype.getValue = function(time, result) {
  if (!defined_default(time)) {
    time = JulianDate_default.now(timeScratch2);
  }
  return this._callback(time, result);
};
CallbackProperty.prototype.setCallback = function(callback, isConstant) {
  if (!defined_default(callback)) {
    throw new DeveloperError_default("callback is required.");
  }
  if (!defined_default(isConstant)) {
    throw new DeveloperError_default("isConstant is required.");
  }
  const changed = this._callback !== callback || this._isConstant !== isConstant;
  this._callback = callback;
  this._isConstant = isConstant;
  if (changed) {
    this._definitionChanged.raiseEvent(this);
  }
};
CallbackProperty.prototype.equals = function(other) {
  return this === other || other instanceof CallbackProperty && this._callback === other._callback && this._isConstant === other._isConstant;
};
var CallbackProperty_default = CallbackProperty;

// node_modules/@cesium/engine/Source/Core/ScreenSpaceEventType.js
var ScreenSpaceEventType = {
  /**
   * Represents a mouse left button down event.
   *
   * @type {number}
   * @constant
   */
  LEFT_DOWN: 0,
  /**
   * Represents a mouse left button up event.
   *
   * @type {number}
   * @constant
   */
  LEFT_UP: 1,
  /**
   * Represents a mouse left click event.
   *
   * @type {number}
   * @constant
   */
  LEFT_CLICK: 2,
  /**
   * Represents a mouse left double click event.
   *
   * @type {number}
   * @constant
   */
  LEFT_DOUBLE_CLICK: 3,
  /**
   * Represents a mouse left button down event.
   *
   * @type {number}
   * @constant
   */
  RIGHT_DOWN: 5,
  /**
   * Represents a mouse right button up event.
   *
   * @type {number}
   * @constant
   */
  RIGHT_UP: 6,
  /**
   * Represents a mouse right click event.
   *
   * @type {number}
   * @constant
   */
  RIGHT_CLICK: 7,
  /**
   * Represents a mouse middle button down event.
   *
   * @type {number}
   * @constant
   */
  MIDDLE_DOWN: 10,
  /**
   * Represents a mouse middle button up event.
   *
   * @type {number}
   * @constant
   */
  MIDDLE_UP: 11,
  /**
   * Represents a mouse middle click event.
   *
   * @type {number}
   * @constant
   */
  MIDDLE_CLICK: 12,
  /**
   * Represents a mouse move event.
   *
   * @type {number}
   * @constant
   */
  MOUSE_MOVE: 15,
  /**
   * Represents a mouse wheel event.
   *
   * @type {number}
   * @constant
   */
  WHEEL: 16,
  /**
   * Represents the start of a two-finger event on a touch surface.
   *
   * @type {number}
   * @constant
   */
  PINCH_START: 17,
  /**
   * Represents the end of a two-finger event on a touch surface.
   *
   * @type {number}
   * @constant
   */
  PINCH_END: 18,
  /**
   * Represents a change of a two-finger event on a touch surface.
   *
   * @type {number}
   * @constant
   */
  PINCH_MOVE: 19
};
var ScreenSpaceEventType_default = Object.freeze(ScreenSpaceEventType);

// node_modules/@cesium/engine/index.js
globalThis.CESIUM_VERSION = "1.133.1";

// src/RippleMarker/index.ts
function RippleMarker(viewer, {
  lon,
  lat,
  height = 0,
  color = "rgba(0,150,255,0.8)",
  maxRadius = 8e3,
  duration = 1500,
  loops = Infinity,
  pyramidHeight = 1e3,
  baseRadius,
  floatEnabled = true,
  surfaceHeight = 50
}) {
  if (viewer && viewer.scene) {
    viewer.scene.requestRenderMode = false;
    if (viewer.clock) viewer.clock.shouldAnimate = true;
  }
  const entities = [];
  const cesiumColor = Color_default.fromCssColorString(color);
  const baseRadiusMeters = baseRadius ?? pyramidHeight * 0.3;
  const floatAmplitude = pyramidHeight * 0.2;
  const floatPeriodMs = 2e3;
  const baseHeight = height + surfaceHeight;
  const tipPosition = Cartesian3_default.fromDegrees(lon, lat, baseHeight);
  const vertexDegrees = [];
  for (let i = 0; i < 3; i++) {
    const angle = i * 2 * Math.PI / 3;
    const x = lon + baseRadiusMeters * Math.cos(angle) / 111e3;
    const y = lat + baseRadiusMeters * Math.sin(angle) / 111e3;
    vertexDegrees.push({ x, y });
  }
  const numWaves = 3;
  const waveEntities = Array.from({ length: numWaves }, (_, index) => {
    const radiusProperty = new CallbackProperty_default((time) => {
      const safeDuration = Math.max(1, duration);
      const t = time ? JulianDate_default.toDate(time).getTime() : Date.now();
      const elapsed = t % safeDuration / safeDuration;
      const wave = (elapsed + index / numWaves) % 1;
      const r = Math.max(1, (wave || 0) * Math.max(1, maxRadius));
      return r;
    }, false);
    const materialProperty = new ColorMaterialProperty_default(
      new CallbackProperty_default((time) => {
        const safeDuration = Math.max(1, duration);
        const t = time ? JulianDate_default.toDate(time).getTime() : Date.now();
        const elapsed = t % safeDuration / safeDuration;
        const wave = (elapsed + index / numWaves) % 1;
        const alpha = (1 - wave) ** 2 * 0.6;
        return Color_default.fromAlpha(cesiumColor, alpha);
      }, false)
    );
    return viewer.entities.add({
      position: tipPosition,
      ellipse: {
        semiMinorAxis: radiusProperty,
        semiMajorAxis: radiusProperty,
        // 底部波纹保持在固定高度（surfaceHeight），不随三棱锥浮动
        height: baseHeight,
        material: materialProperty
      }
    });
  });
  entities.push(...waveEntities);
  for (let i = 0; i < 3; i++) {
    const v1deg = vertexDegrees[i];
    const v2deg = vertexDegrees[(i + 1) % 3];
    entities.push(
      viewer.entities.add({
        polygon: {
          hierarchy: new CallbackProperty_default((_time) => {
            const t = Date.now();
            const phase = t % floatPeriodMs / floatPeriodMs * 2 * Math.PI;
            const offset = floatEnabled ? Math.sin(phase) * floatAmplitude : 0;
            const tip = Cartesian3_default.fromDegrees(
              lon,
              lat,
              baseHeight + offset
            );
            const v1Local = v1deg ? Cartesian3_default.fromDegrees(
              v1deg.x,
              v1deg.y,
              baseHeight + pyramidHeight + offset
            ) : tip;
            const v2Local = v2deg ? Cartesian3_default.fromDegrees(
              v2deg.x,
              v2deg.y,
              baseHeight + pyramidHeight + offset
            ) : tip;
            return new PolygonHierarchy_default([tip, v1Local, v2Local]);
          }, false),
          // 使用传入颜色作为填充材质，确保颜色应用到面上
          material: new ColorMaterialProperty_default(cesiumColor),
          perPositionHeight: true
        }
      })
    );
  }
  let alive = true;
  const animationHandler = viewer.scene.postRender.addEventListener(() => {
    if (!alive) return;
    if (loops !== Infinity) {
      const elapsedTime = Date.now() - startTime;
      const totalDuration = duration * loops;
      if (elapsedTime >= totalDuration) {
        remove();
      }
    }
  });
  const startTime = Date.now();
  function remove() {
    alive = false;
    entities.forEach((entity) => viewer.entities.remove(entity));
    animationHandler();
  }
  return {
    remove
  };
}

// src/ViewerClick/index.ts
function ViewerClick(viewer, callback) {
  const handler = viewer.screenSpaceEventHandler;
  handler.setInputAction((event) => {
    const pickedPosition = viewer.scene.pickPosition(event.position);
    if (pickedPosition) {
      const cartographic = Cartographic_default.fromCartesian(pickedPosition);
      const lon = Math_default.toDegrees(cartographic.longitude);
      const lat = Math_default.toDegrees(cartographic.latitude);
      callback(lon, lat, event);
    }
  }, ScreenSpaceEventType_default.LEFT_CLICK);
  return () => {
    handler.removeInputAction(ScreenSpaceEventType_default.LEFT_CLICK);
  };
}
export {
  RippleMarker,
  ViewerClick
};
