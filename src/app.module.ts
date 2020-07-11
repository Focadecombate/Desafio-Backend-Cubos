import { Module } from '@nestjs/common';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [HorariosModule],
})
export class AppModule {}
