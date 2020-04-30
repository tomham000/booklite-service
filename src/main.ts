import { NestFactory } from '@nestjs/core';
import { resolve } from 'path';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  if(process.platform === "win32") {
    process.env.NODE_ENV = 'dev'
  } else {
    process.env.NODE_ENV = 'prod'
  }
  const configPath = resolve(`./config/properties/${process.env.NODE_ENV}.env`);
  const configResult = config({path: configPath});
  if (configResult.error) {
    Logger.error(`Could not load config from ${configPath}: ${JSON.stringify(configResult.error)}`);
  } else {
    Logger.log(`Config successfully loaded froom ${configPath}: ${JSON.stringify(configResult.parsed)}`)
  }

  const appModule = require('./app.module');
  const app = await NestFactory.create(appModule.AppModule);
  if(process.env.NODE_ENV === 'dev') {
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      methods: process.env.CORS_METHODS,
      allowedHeaders: process.env.CORS_HEADERS,
      credentials: Boolean(process.env.CORS_CREDENTIALS)
  })
}
  console.log(process.env);
  await app.listen(process.env.PORT);
}

bootstrap();
