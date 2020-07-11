import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CriaHorarioDto {
  data: string | DiaSemana[];
  @IsNotEmpty()
  intervalos: [
    {
      start: string;
      end: string;
    },
  ];
  @IsNotEmpty()
  tipo: Tipo;
}

export type Tipo = 'Dia' | 'Semana' | 'Todos';
export type DiaSemana =
  | 'Segunda'
  | 'Terça'
  | 'Quarta'
  | 'Quinta'
  | 'Sexta'
  | 'Sabado'
  | 'Domingo';
