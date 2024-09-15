import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  async getFormResponses(formId: string) {
    try {

      const formWithResponses = await this.prisma.form.findUnique({
        where: { id: formId },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });

      if (!formWithResponses) {
        throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
      }

      const formattedResponse = formWithResponses.questions.map(question => ({
        question: question.question,
        type: question.type,
        options: question.options,
        required: question.required,
        answers: question.answers.map(answer => ({
          answer: answer.answer,
          userId: answer.userId,
          answeredAt: answer.answeredAt,
        })),
      }));

      return formattedResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Error fetching form responses`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException('Error fetching form responses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
