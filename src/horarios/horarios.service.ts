import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { promises } from 'fs';
import { join } from 'path';
import { CriaHorarioDto, Tipo, DiaSemana } from './CriaHorario-dto';
import { DisponivelDto } from './Disponivel-dto';
import { uuid } from 'uuidv4';
import * as moment from 'moment';

export interface Horarios {
  Data?: string | DiaSemana[] | 'Todos os Dias';
  intervalos: [
    {
      start: string;
      end: string;
    },
  ];
  id?: string;
  tipo: Tipo;
}

@Injectable()
export class HorariosService {
  private logger = new Logger('HorarioService');
  private caminho = join(__dirname, '../../');

  private async InitDb() {
    const directory = await promises.readdir(this.caminho);
    if (!directory.includes('database.json'))
      await promises.writeFile('database.json', '[]', 'utf8');
    let database = await promises.readFile('database.json', 'utf-8');
    const data: Horarios[] = JSON.parse(database);
    return data;
  }

  private async Save(data: Horarios[]) {
    let save = JSON.stringify(data, null, 2);
    await promises.writeFile('database.json', save, 'utf8').catch(e => {
      this.logger.error(e);
      throw new Error('Não foi Possivel Salvar');
    });
  }
  /*Apaga a regra do Horário com o id passado pelos Params*/
  async apagaHorarios(id) {
    try {
      let data = await this.InitDb();
      data = data.filter(value => {
        return value.id !== id;
      });
      await this.Save(data);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(error);
    }
  }
  /*Cria regra de Horarios com o body da requisição*/
  async criaHorarios(criaHorarioDto: CriaHorarioDto): Promise<Horarios[]> {
    try {
      const data = await this.InitDb();
      /* Objeto que vai ser salvo no DB */
      const object: Horarios = {
        id: uuid(),
        intervalos: criaHorarioDto.intervalos,
        tipo: criaHorarioDto.tipo,
      };
      /* Checa o Tipo que foi Selecionado */
      switch (criaHorarioDto.tipo) {
        case 'Dia':
          object.Data = moment(criaHorarioDto.data, 'DD/MM/YYYY').format(
            'DD-MM-YYYY',
          );
          break;
        case 'Semana':
          if (typeof criaHorarioDto.data !== 'string') {
            const temp = criaHorarioDto.data;
            object.Data = temp;
          }
          break;
        case 'Todos':
          object.Data = 'Todos os Dias';
          break;
        default:
          break;
      }
      /* Checa A maneira que o intervalo foi escrito */
      criaHorarioDto.intervalos.map(intervalo => {
        /* Garante que não é numero e se for tranforma para string */
        if (
          typeof intervalo.start === 'number' ||
          typeof intervalo.end === 'number'
        ) {
          intervalo.start = `${intervalo.start}`;
          intervalo.end = `${intervalo.end}`;
        }
        /* Formata caso o usuario envie a hora como '16' ou '2' */
        switch (intervalo.start.length) {
          case 2:
            intervalo.start = `${intervalo.start}:00`;
            break;
          case 1:
            intervalo.start = `0${intervalo.start}:00`;
            break;

          default:
            break;
        }
        switch (intervalo.end.length) {
          case 2:
            intervalo.end = `${intervalo.end}:00`;
            break;
          case 1:
            intervalo.end = `0${intervalo.end}:00`;
            break;

          default:
            break;
        }
      });

      const save = data.concat(object);
      await this.Save(save);
      return save;
    } catch (error) {
      this.logger.error(error);
    }
  }
  /* Puxa as regras do db */
  async listaHorarios(): Promise<Horarios[]> {
    try {
      const data = await this.InitDb();
      if (data.length <= 1) {
        throw new Error('Database Vazio');
      }
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(error);
    }
  }
  /* Retorna as regras que estão dentro do periodo de tempo */
  async listaDisponiveis(disponivelDto: DisponivelDto): Promise<Horarios[]> {
    try {
      const data = await this.InitDb();

      /* Checa se as Datas São iguais */
      if (disponivelDto.startDate === disponivelDto.endDate) {
        return data.filter(horario => {
          return horario.Data === disponivelDto.startDate;
        });
      }

      const startDate = moment(disponivelDto.startDate, 'DD-MM-YYYY');
      const endDate = moment(disponivelDto.endDate, 'DD-MM-YYYY');

      let dates: string[] = [];
      let helper = startDate.clone();
      while (helper.isSameOrBefore(endDate)) {
        dates.push(helper.format('DD-MM-YYYY'));
        helper.add(1, 'day');
      }
      var resultado: Horarios[] = [];
      for (const date of dates) {
        data.forEach(regra => {
          if (regra.Data === date) {
            resultado.push(regra);
          }
        });
      }
      return resultado;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
