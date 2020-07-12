import { Module } from '@nestjs/common';
import { HorariosModule } from './horarios/horarios.module';

/** Importa o modulo de Horarios */
@Module({
  imports: [HorariosModule],
})
export class AppModule {}
