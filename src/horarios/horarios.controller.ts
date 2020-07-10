import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private horariosService: HorariosService) {}
  @Get()
  ListaHorarios() {
    return this.horariosService.listaHorarios();
  }

  @Get('/disponiveis')
  ListaDisponiveis() {
    return this.horariosService.listaDisponiveis();
  }

  @Post()
  CriaHorario() {
    return this.horariosService.criaHorarios();
  }

  @Delete()
  ApagaHorario(@Param('dia') Dia:string) {
    return this.horariosService.apagaHorarios();
  }
}
