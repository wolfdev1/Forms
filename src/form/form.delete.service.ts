import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeleteFormService {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string) {
    if (!id) {
      throw new HttpException('Form ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.question.deleteMany({
        where: { formId: id },
      });

      await this.prisma.form.delete({
        where: { id: id },
      });

      return { message: 'Form and its questions successfully deleted' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Error deleting form with id ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      console.log(error);
      throw new HttpException('Error deleting form', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
