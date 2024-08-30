import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasuresModule } from './measures/measures.module';
import { Measure } from './measures/entities/measure.entity';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: ':memory:',
    //   entities: [Measure],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      
        type: 'postgres',
        host: process.env.DB_HOST || 'database',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'mydatabase',
        entities: [Measure],
        // migrations: [__dirname + '/migrations/*.ts'],
        synchronize: true,
      
    }),
    MeasuresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
