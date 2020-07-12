import { Matches } from 'class-validator';

/** Regex que checa se as datas estão no formato "DD-MM-YYYY" */
const checkData = /^([0-2][0-9]|(3)[0-1])(\-)(((0)[0-9])|((1)[0-2]))(\-)\d{4}$/;

/** Data transfer object que recebe o periodo da requisição
 * 
 * Tem que ser no formato "DD-MM-YYYY"
 */
export class DisponivelDto {
  /** Data de inicio do periodo 
   * 
   * Obrigatoriamente tem que estar formatada
   */
  @Matches(checkData, { message: 'Por favor usar o formato "DD-MM-YYYY"' })
  startDate: string;
    /** Data de fim do periodo 
   * 
   * Obrigatoriamente tem que estar formatada
   */
  @Matches(checkData, { message: 'Por favor usar o formato "DD-MM-YYYY"' })
  endDate: string;
}
