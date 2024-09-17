import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';
import validQuestionTypes from '../consts/questions';

@Injectable()
export class CreateFormService {

  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { 
      name,
      temporal,
      start,
      end,
      active,
      description,
      author,
      isPublic,
      questions
    } = data;

    // Validación de campos requeridos
    if (!name || temporal === undefined || active === undefined || !description || !author || isPublic === undefined || !questions) {
      throw new HttpException('Missing required fields in form creation', HttpStatus.BAD_REQUEST);
    }

    // Validar el formato de las preguntas
    if (!Array.isArray(questions) || questions.some(q => !q.question || !q.type || !Array.isArray(q.options) || q.required === undefined)) {
      throw new HttpException('Invalid questions format', HttpStatus.BAD_REQUEST);
    }

    // Validar tipos de preguntas
    const invalid = questions.filter(q => !validQuestionTypes.includes(q.type));
    if (invalid.length > 0) {
      throw new HttpException(`Invalid question types found: ${invalid.map(q => q.type).join(', ')}`, HttpStatus.BAD_REQUEST);
    }

    // Validar fechas si es un formulario temporal
    if (temporal === true) {
      if (!start || !end) {
        throw new HttpException('Temporal forms require start and end dates', HttpStatus.BAD_REQUEST);
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
      }

      if (startDate > endDate) {
        throw new HttpException('Start date must be before end date', HttpStatus.BAD_REQUEST);
      }
    }

    const formId = new ObjectId().toString();

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const q = questions.map((question) => ({
          id: new ObjectId().toString(),
          question: question.question,
          type: question.type,
          options: question.options,
          required: question.required,
        }));

        const form = await prisma.form.create({
          data: {
            id: formId,
            name: name,
            temporal: temporal,
            start: temporal ? new Date(start) : null,
            end: temporal ? new Date(end) : null,
            active: active,
            createdAt: new Date(),
            description: description,
            author: author,
            lastUpdated: new Date(),
            public: isPublic,
            questions: {
              create: q,
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
        throw new HttpException(`Error creating form and questions`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      throw new HttpException('Error creating form and questions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
