import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { promises } from 'fs';
import { join } from 'path';
import { CriaHorarioDto, Tipo, DiaSemana } from './CriaHorario-dto';
import { DisponivelDto } from './Disponivel-dto';
import { uuid } from 'uuidv4';
import * as moment from 'moment';

/** Interface das regras de Horarios */
export interface Horarios {
  /** Data
   *
   * Podendo ser uma data no formato string
   *
   * Uma Array de dias da Semana
   *
   * Ou "Todos os dias"
   *  */
  Data?: string | DiaSemana[] | 'Todos os Dias';
  /** Array de intervalos */
  intervalos: [
    {
      start: string;
      end: string;
    },
  ];
  /** Id que será gerado ao salvar o objeto pelo uuid */
  id?: string;
  /** O tipo da regra */
  tipo: Tipo;
}
/** Serviços das Rotas /horarios */
@Injectable()
export class HorariosService {
  /** Cria um Logger */
  private logger = new Logger('HorarioService');
  /** caminho onde o arquivo database.json será criado */
  private caminho = join(__dirname, '../../');

  /** Inicia o banco de dados Json e retorna os dados */
  private async InitDb(): Promise<Horarios[]> {
    const directory = await promises.readdir(this.caminho);
    /** Checa se o db.json já foi criado caso contrario cria */

    if (!directory.includes('database.json')) {
      this.logger.log('Arquivo database.json não encontrado, Criando um novo!');
      await promises.writeFile('database.json', '[]', 'utf8');
    }
    /** Agora que garantimos que ele existe é lido e retornado como um objeto */

    let database = await promises.readFile('database.json', 'utf-8');

    this.logger.log('Database Lida');
    const data: Horarios[] = JSON.parse(database);
    return data;
  }
  /** Salva no banco de dados */
  private async Save(data: Horarios[]): Promise<void> {
    let save = JSON.stringify(data, null, 2);
    await promises.writeFile('database.json', save, 'utf8').catch(e => {
      this.logger.error(e);
      throw new Error('Não foi Possivel Salvar');
    });
    this.logger.log('Database Salva!');
  }
  /**
   * Apaga a regra do Horário com o id passado pelos Params
   */
  async apagaHorarios(id): Promise<void> {
    try {
      /** Recebe o conteudo do arquivo e filtra o id se o id não for encontrado retorna NotFound */
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
  /** Cria regra de Horarios com o body da requisição */
  async criaHorarios(criaHorarioDto: CriaHorarioDto): Promise<Horarios[]> {
    try {
      const regras = await this.InitDb();
      /** Objeto que vai ser salvo no DB */
      const regra: Horarios = {
        id: uuid(),
        intervalos: criaHorarioDto.intervalos,
        tipo: criaHorarioDto.tipo,
      };
      /** Checa o Tipo que foi Selecionado */
      switch (criaHorarioDto.tipo) {
        case 'Dia':
          regra.Data = moment(criaHorarioDto.data, 'DD/MM/YYYY').format(
            'DD-MM-YYYY',
          );
          break;
        case 'Semana':
          if (typeof criaHorarioDto.data !== 'string') {
            const temp = criaHorarioDto.data;
            regra.Data = temp;
          }
          break;
        case 'Todos':
          regra.Data = 'Todos os Dias';
          break;
        default:
          break;
      }
      /** Checa A maneira que o intervalo foi escrito */
      criaHorarioDto.intervalos.map(intervalo => {
        /**  Garante que não é numero e se for tranforma para string */
        if (
          typeof intervalo.start === 'number' ||
          typeof intervalo.end === 'number'
        ) {
          intervalo.start = `${intervalo.start}`;
          intervalo.end = `${intervalo.end}`;
        }
        /** Formata caso o usuario envie a hora como '16' ou '2' */
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
      /** Salva no db  */
      const save = regras.concat(regra);
      await this.Save(save);
      return save;
    } catch (error) {
      this.logger.error(error);
    }
  }
  /** Puxa as regras do db */
  async listaHorarios(): Promise<Horarios[]> {
    try {
      const regras = await this.InitDb();
      if (regras.length <= 1) {
        throw new Error('Database Vazio');
      }
      return regras;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(error);
    }
  }
  /**  Retorna as regras que estão dentro do periodo de tempo */
  async listaDisponiveis(disponivelDto: DisponivelDto): Promise<Horarios[]> {
    try {
      const regras = await this.InitDb();

      /** Checa se as Datas São iguais */
      if (disponivelDto.startDate === disponivelDto.endDate) {
        return regras.filter(horario => {
          return horario.Data === disponivelDto.startDate;
        });
      }

      /** Cria os objetos moment que possibilitam uma melhor comparação entre datas */
      const startDate = moment(disponivelDto.startDate, 'DD-MM-YYYY');
      const endDate = moment(disponivelDto.endDate, 'DD-MM-YYYY');

      /** Preenche uma array com as datas do periodo recebido */
      let dates: string[] = [];
      let helper = startDate.clone();
      while (helper.isSameOrBefore(endDate)) {
        dates.push(helper.format('DD-MM-YYYY'));
        helper.add(1, 'day');
      }

      /** Separa as regras que batem com o periodo e retornam essa array */
      var resultado: Horarios[] = [];
      for (const date of dates) {
        regras.forEach(regra => {
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
