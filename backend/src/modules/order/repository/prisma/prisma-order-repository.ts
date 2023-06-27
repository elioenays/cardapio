import { Order, Prisma, PrismaClient } from '@prisma/client';
import { OrderRepository } from '../order-repository';
import { CreateOrderDto } from '../../dto/create-order-dto';
import { UpdateOrderDto } from '../../dto/update-order-dto';

const prisma = new PrismaClient();

export class PrismaOrderRepository implements OrderRepository {
  async create(data: CreateOrderDto) {
    const { products, ...orderProps } = data;

    const order = await prisma.order.create({
      data: {
        ...orderProps,
      },
    });

    const productsOnOrder = await prisma.productsOnOrders.createMany({
      data: products.map((products) => ({
        orderId: order.id,
        productId: products.id,
        quantity: products.quantity,
        note: products.note,
      })),
    });

    return { order, productsOnOrder };
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id } });
  }

  async findAll(): Promise<Order[]> {
    const orders = await prisma.order.findMany();

    return orders;
  }

  async findOneByClientId(clientId: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: {
        clientId,
      },
    });

    return order;
  }

  async findOneById(id: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: {
        id,
      },
    });

    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    const { products, ...orderProps } = data;

    const order = await prisma.order.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        ...orderProps,
      },
    });

    for (const product of products) {
      const productOnOrder = await prisma.productsOnOrders.findFirst({
        where: {
          orderId: id,
          productId: product.id,
        },
      });

      if (productOnOrder) {
        await prisma.productsOnOrders.update({
          where: {
            id: productOnOrder.id,
          },
          data: {
            quantity: product.quantity,
            note: product.note,
          },
        });
      } else {
        await prisma.productsOnOrders.create({
          data: {
            orderId: id,
            productId: product.id,
            quantity: product.quantity,
            note: product.note,
          },
        });
      }
    }
    return order;
  }

  async changeStatus(
    id: string,
    status: Prisma.EnumStatusOrderFieldUpdateOperationsInput,
  ): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        status: status.set,
      },
    });

    return order;
  }
}
