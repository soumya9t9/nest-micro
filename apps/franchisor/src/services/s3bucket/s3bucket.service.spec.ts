import { Test, TestingModule } from '@nestjs/testing';
import { S3bucketService } from './s3bucket.service';

describe('S3bucketService', () => {
  let service: S3bucketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3bucketService],
    }).compile();

    service = module.get<S3bucketService>(S3bucketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
