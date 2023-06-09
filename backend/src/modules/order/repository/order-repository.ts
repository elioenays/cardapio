import { Order, Prisma } from '@prisma/client';
import { UpdateOrderDto } from '../dto/update-order-dto';

export interface FindAllOrdersParams {
  tableAccountId?: string;
  clientId: string;
}

export interface OrderRepository {
  create(data: Prisma.OrderUncheckedCreateInput);

  update(id: string, data: UpdateOrderDto);

  changeStatus(id: string, data: Prisma.OrderUpdateInput): Promise<Order>;

  delete(id: string): Promise<void>;

  findOneById(id: string): Promise<Order | null>;

  findOneByClientId(clientId: string): Promise<Order | null>;

  findAll(params?: FindAllOrdersParams): Promise<Order[]>;
}
