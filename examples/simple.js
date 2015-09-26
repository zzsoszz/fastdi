var di = require('..');

di.register('User', { name: 'Bob' });

di.invoke(null, function (User) {
  console.log(User.name);
});
