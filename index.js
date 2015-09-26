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
    Object.keys(name).forEach(function (k, v) {
      exports.register(k, v);
    });
  } else {
    dependencies[name] = value;
  }
};

exports.invoke = function (that, func, localDependencies) {
  if (!localDependencies) {
    localDependencies = {};
  }
  const parameters = getParameters(func).map(function (p) {
    return localDependencies[p] || dependencies[p];
  });
  return func.apply(that, parameters);
};
