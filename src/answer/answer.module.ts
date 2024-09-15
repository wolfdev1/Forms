import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnswersController } from './answer.controller';
import { AnswerService } from './answer.service';
import { AnswersService } from './answers.service';



@Module({
  imports: [],
  controllers: [
    AnswersController
  ],
  providers: [
    PrismaService,
    AnswerService,
    AnswersService
  ],
})

export class AnswerModule {}