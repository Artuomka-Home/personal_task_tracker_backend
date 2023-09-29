import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiLimiter } from './middlewares/express-rete-limit-config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './helpers/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Personal Task Tracker')
    .setDescription('The Personal Task Tracker API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.listen(3000);

  // Apply the rate limiting middleware to API calls only
  app.use('/user', apiLimiter);
}
bootstrap();
