import { Test, TestingModule } from '@nestjs/testing';
import { StreaksController } from './streaks.controller';

describe('StreaksController', () => {
  let controller: StreaksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreaksController],
    }).compile();

    controller = module.get<StreaksController>(StreaksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
