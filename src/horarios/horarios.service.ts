import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

export interface Horarios {
  id: string;
  data: string;
  intervalos: [
    {
      start: string;
      end: string;
    },
  ];
}

@Injectable()
export class HorariosService {
  private logger = new Logger('HorarioService');
  apagaHorarios() {
    throw new Error('Method not implemented.');
  }
  async criaHorarios() {
    try {
      const caminho = path.join(__dirname, '/../');
      this.logger.log(caminho);

      const file = await fs.promises.readFile(__dirname, {
        encoding: 'utf8',
      });
      console.log(file);

      if (!file) {
        console.log('opa');

        fs.writeFile('../database.json', { encoding: 'utf8' }, err => {
          if (err) {
            throw new Error('Não foi possivel Criar arquivo');
          }
        });
      }
    } catch (error) {}
  }
  listaDisponiveis() {
    throw new Error('Method not implemented.');
  }
  listaHorarios(): Horarios[] {
    try {
      const file = fs.readFileSync('../database.json', { encoding: 'utf8' });
      if (file) {
        const data: Horarios[] = JSON.parse(file);
        return data;
      }
      throw new NotFoundException('Não existe database');
    } catch (error) {}
  }
}
