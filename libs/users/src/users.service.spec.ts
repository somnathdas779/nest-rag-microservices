import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@app/users';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const userData = { email: 'test@example.com' } as Partial<User>;
      const createdUser = { id: '1', ...userData } as User;

      repo.create.mockReturnValue(createdUser);
      repo.save.mockResolvedValue(createdUser);

      const result = await service.create(userData);
      expect(repo.create).toHaveBeenCalledWith(userData);
      expect(repo.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated users without search', async () => {
      repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        [{ id: '1', email: 'test@example.com' }],
        1,
      ]);

      const result = await service.findAll(1, 10, '', 'currentUserId');

      expect(mockQueryBuilder.select).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.id != :id',
        { id: 'currentUserId' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.soft_delete = :softDelete',
        { softDelete: false },
      );
      expect(result).toEqual({
        data: [{ id: '1', email: 'test@example.com' }],
        total: 1,
        page: 1,
        limit: 10,
      });
    });

    it('should apply search filter when search term provided', async () => {
      repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(1, 10, 'john', 'currentUserId');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.email ILIKE :search)',
        { search: '%john%' },
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      repo.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update user role', async () => {
      const updateResult = { affected: 1 };
      repo.update.mockResolvedValue(updateResult as any);

      const result = await service.update('1', UserRole.ADMIN);
      expect(repo.update).toHaveBeenCalledWith({ id: '1' }, { role: UserRole.ADMIN });
      expect(result).toEqual(updateResult);
    });
  });

  describe('softDelete', () => {
    it('should soft delete user', async () => {
      const deleteResult = { affected: 1 };
      repo.delete.mockResolvedValue(deleteResult as any);

      const result = await service.softDelete(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
