
import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai/newform')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Get()
    async newAiForm(
        @Query('subject') subject: string,
        @Query('q') questions: any,
        @Query('lang') lang: string)
        {

        return await this.service.getAiForm(subject, questions, lang);
    }
}
