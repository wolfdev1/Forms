import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { generateForm } from './ai';
import { isValidLanguageCode } from '../util/iso';
import { CreateFormService } from '../form/form.create.service';

@Injectable()
export class AiService {
  constructor(private readonly service: CreateFormService) {}

  async getAiForm(s: string, n: number, l: string) {

    if (!s || !l || !n) {
        throw new HttpException(
            !s ? 'AI Form Creation requires a subject.' :
            !l ? 'AI Form Creation requires a valid language.' :
            'AI Form Creation requires a valid number of questions (1-15).',
            HttpStatus.BAD_REQUEST
        );
    }

    const isNumber = !isNaN(Number(n));
    if (isNumber === false) {
        throw new HttpException(
            `AI Form Creation requires a valid number of questions (1-15).`,
            HttpStatus.BAD_REQUEST
        );
    }

    if (n > 15) {
        throw new HttpException(
            `AI Form Creation only allows a max. of 15 questions (req. ${n})`,
            HttpStatus.BAD_REQUEST
        );
    }

    if (n < 1) {
        throw new HttpException(
            `AI Form Creation requires at least 1 question (req. ${n})`,
            HttpStatus.BAD_REQUEST
        );
    }

    if (s.length < 7 ) {
        throw new HttpException(
            `The subject of your AI Form requires at least 7 characters (req. ${s})`,
            HttpStatus.BAD_REQUEST
        );
    }

    if (await isValidLanguageCode(l) === false) {
        throw new HttpException(
            `AI Form requires a valid language in ISO format, ex. ES, EN, (req. ${l})`,
            HttpStatus.BAD_REQUEST
        )
    }

    const form = await generateForm(s, n, l);
    return await this.service.create(JSON.parse(form));
    
  }
}
