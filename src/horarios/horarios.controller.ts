import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { HorariosService, Horarios } from './horarios.service';
import { CriaHorarioDto } from './CriaHorario-dto';
import { DisponivelDto } from './Disponivel-dto';

@Controller('horarios')
export class HorariosController {
  constructor(private horariosService: HorariosService) {}
  @Get()
  async ListaHorarios(): Promise<Horarios[]> {
    return await this.horariosService.listaHorarios();
  }

  @Post('/disponiveis')
  async ListaDisponiveis(@Body() disponivelDto: DisponivelDto) {
    return this.horariosService.listaDisponiveis(disponivelDto);
  }

  @Post()
  async CriaHorario(
    @Body() criaHorarioDto: CriaHorarioDto,
  ): Promise<Horarios[]> {
    return await this.horariosService.criaHorarios(criaHorarioDto);
  }

  @Delete(':id')
  async ApagaHorario(@Param('id') id: string) {
    return await this.horariosService.apagaHorarios(id);
  }
}
