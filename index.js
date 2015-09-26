'use strict';

const FN_ARGS = /^(function)?\s*\*?\s*[^\(]*\(\s*([^\)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

const cache = {};
const dependencies = {};

function getParameters(fn) {
  const fnText = fn.toString();
  if (!cache[fnText]) {
    const inject = [];
    const argDecl = fnText.replace(STRIP_COMMENTS, '').match(FN_ARGS);
    argDecl[2].split(FN_ARG_SPLIT).forEach(function (arg) {
      arg.replace(FN_ARG, function (all, underscore, name) {
        inject.push(name);
      });
    });

    cache[fnText] = inject;
  }

  return cache[fnText];
}

exports.register = function (name, value) {
  if (typeof name === 'object') {
    Object.keys(name).forEach(function (k) {
      exports.register(k, name[k]);
    });
  } else {
    dependencies[name] = value;
  }
  return module.exports;
};

exports.invoke = function (that, func, localDependencies) {
  if (!localDependencies) {
    localDependencies = {};
  }
  const parameters = getParameters(func).map(function (p) {
    return localDependencies[p] || dependencies[p];
  });
  switch (parameters.length) {
    case 0: return func.call(that);
    case 1: return func.call(that, parameters[0]);
    case 2: return func.call(that, parameters[0], parameters[1]);
    case 3: return func.call(that, parameters[0], parameters[1], parameters[2]);
    case 4: return func.call(that, parameters[0], parameters[1], parameters[2], parameters[3]);
    case 5: return func.call(that, parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
    case 6: return func.call(that, parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5]);
    case 7: return func.call(that, parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6]);
    case 8: return func.call(that, parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7]);
    case 9: return func.call(that, parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8]);
  }
  return func.apply(that, parameters);
};

exports.compose = function (middleware) {
  return function *(next) {
    if (!next) {
      next = noop();
    }

    let i = middleware.length;

    while (i--) {
      next = exports.invoke(this, middleware[i], { next });
    }

    return yield* next;
  }
}

function *noop () {}
