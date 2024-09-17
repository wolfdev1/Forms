import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from './form/form.module';
import { AnswerModule } from './answer/answer.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FormModule,
    AnswerModule,
    AiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
