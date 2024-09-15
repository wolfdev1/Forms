import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';

@Injectable()
export class CreateFormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { name, temporal, start, end, active, description, author, publicForm, questions } = data;

    if (!name || !temporal || !start || !end || !active || !description || !author || publicForm === undefined || !questions) {
      throw new HttpException('Missing required fields in form creation', HttpStatus.BAD_REQUEST);
    }

    if (!Array.isArray(questions) || questions.some(q => !q.question || !q.type || !Array.isArray(q.options) || q.required === undefined)) {
      throw new HttpException('Invalid questions format', HttpStatus.BAD_REQUEST);
    }

    const formId = new ObjectId().toString();

    try {
      const result = await this.prisma.$transaction(async (prisma) => {

        const form = await prisma.form.create({
          data: {
            id: formId,
            name: name,
            temporal: temporal,
            start: start,
            end: end,
            active: active,
            createdAt: Date.now().toString(),
            description: description,
            author: author,
            lastUpdated: Date.now().toString(),
            public: publicForm,
            questions: {
              create: questions.map((question) => ({
                id: new ObjectId().toString(),
                question: question.question,
                type: question.type,
                options: question.options,
                required: question.required,
              })),
            },
          },
        });

        const questionIds = await prisma.question.findMany({
          where: { formId: formId },
          select: { id: true },
        });

        return {
          formId: form.id,
          questionIds: questionIds.map(q => q.id),
        };
      });

      return result;
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Prisma Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      throw new HttpException('Error creating form and questions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
