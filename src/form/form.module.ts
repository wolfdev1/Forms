import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { CreateFormService } from './form.create.service';
import { PrismaService } from '../prisma.service';
import { UpdateFormService } from './form.update.service';
import { DeleteFormService } from './form.delete.service';


@Module({
  imports: [],
  controllers: [
    FormController
  ],
  providers: [
    PrismaService,
    CreateFormService,
    DeleteFormService,
    UpdateFormService
  ],
})

export class FormModule {}