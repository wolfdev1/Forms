import { Controller, Put, Body, Res, HttpStatus, Query, Delete } from '@nestjs/common';
import { Response } from 'express';
import { CreateFormService } from './form.create.service';
import { UpdateFormService } from './form.update.service';
import { DeleteFormService } from './form.delete.service';

@Controller('form')
export class FormController {
  constructor(private readonly createForm: CreateFormService, private readonly updateForm: UpdateFormService, private readonly deleteForm: DeleteFormService) {}

  @Put('create')
  async create(@Body() body: any, @Res() res: Response) {
    const form = await this.createForm.create(body);
    const s = HttpStatus.CREATED;

    res.status(s).json({ message: "Form succesfully created", form: form, status: s });
  }

  @Put('update')
    async update(@Body() body: any, @Res() res: Response, @Query('id') id: string) {

    const f = await this.updateForm.update(id, body);
    const s = HttpStatus.CREATED;

    res.status(s).json({ f, status: s });
  }  

  @Delete('delete')
    async delete(@Res() res: Response, @Query('id') id: string) {
        const f = await this.deleteForm.delete(id);
        const s = HttpStatus.OK;
    
        res.status(s).json({ f, status: s });
    }
}


