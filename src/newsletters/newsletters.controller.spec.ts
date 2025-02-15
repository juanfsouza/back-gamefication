import { Test, TestingModule } from '@nestjs/testing';
import { NewslettersController } from './newsletters.controller';

describe('NewslettersController', () => {
  let controller: NewslettersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewslettersController],
    }).compile();

    controller = module.get<NewslettersController>(NewslettersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
