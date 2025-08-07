import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findAll(page: number, limit: number, search: string) {
    const query = this.userRepo
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.role', 'user.CreatedAt'])
      .where('user.soft_delete = :softDelete', { softDelete: false });

    // Optional search filter
    if (search && search !== '') {
      query.andWhere('(user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Count total for pagination metadata
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    console.log('--->', data);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  update(id: number, data: Partial<User>) {
    return this.userRepo.update(id, data);
  }

  softDelete(id: number) {
    return this.userRepo.delete(id);
  }
}
