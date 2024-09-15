import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';

@Injectable()
export class UpdateFormService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, data: any) {
    const { name, start, end, timestamp, active, description, author, publicForm, questions } = data;

    if (!id) {
      throw new HttpException('Form ID is required', HttpStatus.BAD_REQUEST);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (start !== undefined) updateData.start = start;
    if (end !== undefined) updateData.end = end;
    if (timestamp !== undefined) updateData.timestamp = timestamp;
    if (active !== undefined) updateData.active = active;
    if (description !== undefined) updateData.description = description;
    if (author !== undefined) updateData.author = author;
    if (publicForm !== undefined) updateData.public = publicForm;

    try {
      const updatedForm = await this.prisma.form.update({
        where: { id: id },
        data: {
          ...updateData,
          lastUpdated: Date.now().toString(),
        },
      });

      if (questions) {
        await this.prisma.question.deleteMany({
          where: { formId: id },
        });

        await this.prisma.question.createMany({
          data: questions.map((question) => ({
            id: new ObjectId().toString(),
            question: question.question,
            type: question.type,
            options: question.options,
            required: question.required,
            formId: id,
          })),
        });
      }

      const questionIds = questions ? await this.prisma.question.findMany({
        where: { formId: id },
        select: { id: true },
      }) : [];

      return {
        message: 'Form and its questions successfully updated',
        formId: updatedForm.id,
        questionIds: questionIds.map(q => q.id),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Prisma Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException('Error updating form', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
