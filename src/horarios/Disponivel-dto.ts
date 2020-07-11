import { Matches } from 'class-validator';

const checkData = /^([0-2][0-9]|(3)[0-1])(\-)(((0)[0-9])|((1)[0-2]))(\-)\d{4}$/;

export class DisponivelDto {
  @Matches(checkData, { message: 'Por favor usar o formato "DD-MM-YYYY"' })
  startDate: string;
  @Matches(checkData, { message: 'Por favor usar o formato "DD-MM-YYYY"' })
  endDate: string;
}
