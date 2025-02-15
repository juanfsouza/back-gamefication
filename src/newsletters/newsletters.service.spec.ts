import { Test, TestingModule } from '@nestjs/testing';
import { NewslettersService } from './newsletters.service';

describe('NewslettersService', () => {
  let service: NewslettersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewslettersService],
    }).compile();

    service = module.get<NewslettersService>(NewslettersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
