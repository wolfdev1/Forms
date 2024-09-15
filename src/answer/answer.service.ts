import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Answer } from "../dto/answer";
import { ObjectId } from "bson";

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async create(fid: any, d: Answer) {
    const { questionId, answer, userId } = d;

    if (!fid || !questionId || !answer || !userId) {
      throw new BadRequestException(
        `${!fid ? 'Form ID' : !questionId ? 'Question ID' : !answer ? 'Answer' : 'User ID'} is required`
      );
    }

    if (!ObjectId.isValid(questionId)) {
      throw new BadRequestException(`Invalid question identifier: ${questionId}. Must be a valid ID.`);
    }

    if (!ObjectId.isValid(fid)) {
      throw new BadRequestException(`Invalid form identifier: ${fid}. Must be a valid ID.`);
    }

    const form = await this.prisma.form.findUnique({ where: { id: fid } });
    if (!form) {
      throw new BadRequestException(`Form with ID ${fid} not found`);
    }

    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new BadRequestException(`Question with ID ${questionId} not found`);
    }

    const formHasQuestion = await this.prisma.form.findFirst({
      where: { id: fid, questions: { some: { id: questionId } } },
    });
    if (!formHasQuestion) {
      throw new BadRequestException(`Question with ID ${questionId} not found in form with ID ${fid}`);
    }


    return this.prisma.answer.create({
      data: {
        formId: fid,
        questionId,
        answer,
        userId,
        answeredAt: Date.now().toString(), 
      },
    });
  }
}
