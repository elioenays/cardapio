import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  FindAllProductsParams,
  ProductsRepository,
} from '../products-repository';
import { Prisma, Product } from '@prisma/client';

export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(data: Product) {
    await this.prisma.product.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { name },
    });

    return product;
  }

  async findOneById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        Category: { select: { name: true } },
      },
    });

    return product;
  }

  async findAll({ categoryId }: FindAllProductsParams) {
    const product = await this.prisma.product.findMany({
      where: {
        categoryId: categoryId ? categoryId : undefined,
      },
      orderBy: { name: 'asc' },
    });

    return product;
  }

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data,
    });

    return newProduct;
  }

  async findManyByIds(ids: string[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });

    return products;
  }

  async update(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    const productUpdated = await this.prisma.product.update({
      where: { id },
      data,
    });

    return productUpdated;
  }

  async changeAvailability(id: string): Promise<Product> {
    const { isActive } = await this.findOneById(id);

    const product: Product = await this.prisma.product.update({
      where: { id },
      data: { isActive: !isActive },
    });

    return product;
  }
}
