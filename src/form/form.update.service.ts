import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';

@Injectable()
export class UpdateFormService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, data: any) {
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

    if (!id) {
      throw new HttpException('Form ID is required', HttpStatus.BAD_REQUEST);
    }

    if (this.prisma.form.findUnique({ where: { id: id } }) === null) {
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
    }

    const updateData: any = {};
    let q: Boolean;
    if (name !== undefined) updateData.name = name;
    if (start !== undefined) updateData.start = start;
    if (temporal !== undefined) updateData.temporal = temporal;
    if (end !== undefined) updateData.end = end;
    if (active !== undefined) updateData.active = active;
    if (description !== undefined) updateData.description = description;
    if (author !== undefined) updateData.author = author;
    if (isPublic !== undefined) updateData.public = isPublic;
    if (questions !== undefined) q = true;

    if (Object.keys(updateData).length === 0 && !q) {
      throw new HttpException('No valid data to update', HttpStatus.BAD_REQUEST);
    }

    if (temporal === true && (!start || !end)) {
      throw new HttpException('Temporal forms require start and end dates', HttpStatus.BAD_REQUEST);
    }

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
      }

      if (startDate > endDate) {
        throw new HttpException('Start date must be before end date', HttpStatus.BAD_REQUEST);
      }
    }

    try {
      const updatedForm = await this.prisma.form.update({
        where: { id: id },
        data: {
          ...updateData,
          lastUpdated: new Date(),
        },
      });

      if (q) {

        if (!Array.isArray(questions) || questions.some(q => !q.question || !q.type || !Array.isArray(q.options) || q.required === undefined)) {
          throw new HttpException('Invalid questions format', HttpStatus.BAD_REQUEST);
        }

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
        throw new HttpException(`Error updating form`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException('Error updating form', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
