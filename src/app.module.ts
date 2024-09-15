import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FormModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
