import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { HorariosService, Horarios } from './horarios.service';
import { CriaHorarioDto } from './CriaHorario-dto';
import { DisponivelDto } from './Disponivel-dto';

/** Controlador das Rotas /horarios */
@Controller('horarios')
export class HorariosController {
  constructor(private horariosService: HorariosService) {}
  /** Lista todos as regras de horários
   *
   * Retorna um array de regras de horários
   */
  @Get()
  async ListaHorarios(): Promise<Horarios[]> {
    return await this.horariosService.listaHorarios();
  }
  /** Lista todos as regras de horários dentro do periodo
   *
   * Retorna um array de regras de horários
   */
  @Post('/disponiveis')
  async ListaDisponiveis(
    @Body() disponivelDto: DisponivelDto,
  ): Promise<Horarios[]> {
    return this.horariosService.listaDisponiveis(disponivelDto);
  }
  /** Cria uma nova regra de horarios
   *
   * Retorna um array com todas as regras
   */
  @Post()
  async CriaHorario(
    @Body() criaHorarioDto: CriaHorarioDto,
  ): Promise<Horarios[]> {
    return await this.horariosService.criaHorarios(criaHorarioDto);
  }

  /** Apaga uma regra de horários
   *
   * Retorna void
   */
  @Delete(':id')
  async ApagaHorario(@Param('id') id: string): Promise<void> {
    return await this.horariosService.apagaHorarios(id);
  }
}
