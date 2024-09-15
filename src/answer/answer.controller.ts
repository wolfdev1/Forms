
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from '../dto/answer';
import { AnswersService } from './answers.service';

@Controller('form/:formId/answers')
export class AnswersController {
  constructor(private readonly answer: AnswerService, private readonly answers: AnswersService) {}

  @Post() 
  async create(
    @Param('formId') formId: string,
    @Body() answer: Answer,
  ) {
    return this.answer.create(formId, answer);
  }

  @Get()
    async getFormResponses(@Param('formId') formId: string) {
        return this.answers.getFormResponses(formId);
    }
}
