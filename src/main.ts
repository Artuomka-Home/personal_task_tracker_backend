import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiLimiter } from './middlewares/express-rete-limit-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

 // Apply the rate limiting middleware to API calls only
app.use('/user', apiLimiter)
}
bootstrap();
