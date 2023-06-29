import { PrismaOrderRepository } from '../repository/prisma/prisma-order-repository';
import { FindAllOrdersUseCase } from '../use-cases/find-all-orders';

export function makeFindAllOrdersUseCase() {
  const orderRepository = new PrismaOrderRepository();

  return new FindAllOrdersUseCase(orderRepository);
}
