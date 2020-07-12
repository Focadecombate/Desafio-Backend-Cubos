import { IsString, IsNotEmpty, Matches } from 'class-validator';

/** Data transfer Object para receber do body as regras de horario */
export class CriaHorarioDto {
   /** Data da regra 
   * 
   * Pode ser uma string que recebe a data para um dia especifico("Dia"),
   * 
   * Pode ser um array de strings que são dias da semana("Semana"),
   * 
   * Ou não receber nada("Todos")
   */
  data: string | DiaSemana[];
    /** Intervalos que vão ser salvos no dia 
   * 
   * Obrigatoriamente tem que ser enviado
   */
  @IsNotEmpty()
  intervalos: [
    {
      start: string;
      end: string;
    },
  ];
    /** Tipo da requisição
   * 
   * Tem que ser um valor que seja valido pelo type Tipo
   */
  @IsNotEmpty()
  tipo: Tipo;
}
/** Tipos validos de Regras */
export type Tipo = 'Dia' | 'Semana' | 'Todos';
/** Dias da Semana */
export type DiaSemana =
  | 'Segunda'
  | 'Terça'
  | 'Quarta'
  | 'Quinta'
  | 'Sexta'
  | 'Sabado'
  | 'Domingo';
