var di = require('..');

di.register('User', { name: 'Bob' });
di.register('Age', 17);

di.invoke(null, function (User) {
  console.log(User.name);
});

di.compose([
  function* (User, next) {
    yield next;
    return 'Bob1';
  },
  function* (next, Age) {
    yield next;
    return 'Bob2';
  },
  function* (Age, next, User) {
    yield next;
    return 'Bob3';
  },
  function* (next, Age) {
    yield next;

    return 'Bob4';
  },
]);
