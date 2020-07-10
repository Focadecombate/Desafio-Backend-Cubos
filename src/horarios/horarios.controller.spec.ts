import { Test, TestingModule } from '@nestjs/testing';
import { HorariosController } from './horarios.controller';

describe('Horarios Controller', () => {
  let controller: HorariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorariosController],
    }).compile();

    controller = module.get<HorariosController>(HorariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
