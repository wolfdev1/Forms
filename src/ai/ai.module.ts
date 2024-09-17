import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { CreateFormService } from '../form/form.create.service';


@Module({
  imports: [],
  controllers: [
    AiController
  ],
  providers: [
    AiService,
    CreateFormService,
    PrismaService
  ],
})

export class AiModule {}