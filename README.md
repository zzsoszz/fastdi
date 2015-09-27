# fastdi
Performance focused JavaScript dependency injection

## Install

```shell
npm install fastdi
```

## Usage

```javascript
var di = require('fastdi');

di.register('User', { name: 'Bob' });

di.invoke(function (User) {
  console.log(User.name);
});
```
