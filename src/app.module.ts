import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { StreaksModule } from './streaks/streaks.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    NewslettersModule,
    StreaksModule,
    WebhooksModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/auth/register', '/auth/login') // Excluindo a rota de registro
      .forRoutes('*');
  }
}
