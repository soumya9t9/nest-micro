import { Test, TestingModule } from '@nestjs/testing';
import { FranchisorController } from './franchisor.controller';
import { FranchisorService } from './franchisor.service';

describe('FranchisorController', () => {
  let franchisorController: FranchisorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FranchisorController],
      providers: [FranchisorService],
    }).compile();

    franchisorController = app.get<FranchisorController>(FranchisorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(franchisorController.getHello()).toBe('Hello World!');
    });
  });
});
