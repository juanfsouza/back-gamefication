import { Test, TestingModule } from '@nestjs/testing';
import { StreaksService } from './streaks.service';

describe('StreaksService', () => {
  let service: StreaksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreaksService],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
