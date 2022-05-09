import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
const cookieSession = require('cookie-session')






@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [],
          autoLoadEntities: true,
        }
      }
    }),
    UsersModule, 
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue:new ValidationPipe({
        whitelist: true
        // this strips off any extra property added to a 
        //request body which is not in line with the dto
      }) 
      // the validation pipe was set up in the app module instead of the 
      //main.ts file so that it can be accessed during e2e testing as these
      // tests do not work with the main.ts file
    }
  ],
})
export class AppModule {
  constructor(
    private configService: ConfigService
  ) {}
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')]
    })).forRoutes('*')
    // the coockie session also was set up in the app module so it can also be accessed
    // by the test files. the forRoutes('*') method is to allow the session to be caled on 
    // all routes.
  }
}
