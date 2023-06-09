import { Category, Prisma, PrismaClient } from '@prisma/client';
import { CategoriesRepository } from '../categories-repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.CategoryCreateInput): Promise<Category> {
    throw new Error('Method not implemented.');
  }
  async changeAvailability(id: string): Promise<Category> {
    const { isActive } = await this.findOneById(id);

    const category = await this.prisma.category.update({
      where: { id },
      data: { isActive: !isActive },
    });

    return category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories;
  }

  async findOneById(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });

    return category;
  }
}
