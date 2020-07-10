import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [HorariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
