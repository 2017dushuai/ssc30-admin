const path = require('path');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
//const multer = require('multer');
const SwaggerExpress = require('swagger-express-mw');

const app = express();
app.use(compression());
// 反向代理中间件需要在body-parser之前处理请求，否则会导致请求hang up
// 需求修改了，请求需要跨域，所以取消反向代理
//app.use(require('./server/routes/aliyun')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//var upload = multer(); // for parsing multipart/form-data

app.use('/', express.static(path.join(__dirname + '/client')));
app.use('/swagger/basedoc.yaml',
  express.static(path.join(__dirname, 'src', 'swagger', 'basedoc.yaml')));

app.use(require('./server/routes/fakeApiArch')());
app.use(require('./server/routes/fakeApiRole')());
app.use(require('./server/routes/fakeApiPermission')());
app.use(require('./server/routes/fakeApiArchSetting')());
app.use(require('./server/routes/fakeApiNCSync')());

// Create a mock API with swagger

// 基础档案
const swaggerConfig = {
  // Runner props
  //swagger: 'src/swagger/swagger.yaml', // 全部API
  swagger: 'src/swagger/basedoc.yaml', // 仅有基础档案API
  // config props
  appRoot: __dirname,  // required config
  configDir: 'src/swagger', // TODO: should move to src/api/swagger
  mockControllersDirs: 'src/api/mocks' // TODO: config not work for swagger-node-runner
};

// 参照
const referSwaggerConfig = {
  swagger: 'src/swagger/refer.yaml',
  appRoot: __dirname,
  configDir: 'src/swagger',
  mockControllersDirs: 'src/api/mocks'
};

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

SwaggerExpress.create(referSwaggerConfig, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

const port = process.env.PORT || 3009;
const ip = process.env.IP || '127.0.0.1';

app.listen(port, ip, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Development backend server is listening at http://%s:%s', ip, port);
});
