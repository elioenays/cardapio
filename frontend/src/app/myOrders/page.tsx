"use client";
import { useCheckInContext } from "@/components/contexts/CheckInContext";
import { useOrderContext } from "@/components/contexts/OrderContext";
import api from "@/service/api";
import { Order } from "@/shared/entities/Order";
import { ProductOnOrders } from "@/shared/entities/ProductOnOrders";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  const { client, tableAccount, table } = useCheckInContext();

  useEffect(() => {
    api
      .get("/order", {
        params: { clientId: client?.id, tableAccountId: tableAccount?.id },
      })
      .then(({ data }) => {
        setOrders(data);
      });
  }, [client?.id, tableAccount?.id]);

  return (
    <div className="w-full flex-auto justify-center">
      <div className="ml-auto mr-auto flex max-w-4xl flex-col justify-center gap-8 p-6">
        <header className="flex items-center justify-between">
          <button
            onClick={() => {
              router.back();
            }}
          >
            <ChevronLeftIcon width={37} height={37} />
          </button>
          <div className="flex h-[2.313rem] w-[2.313rem] items-center justify-center rounded-full bg-orange-400">
            <span className="text-xl font-bold text-white">
              {table?.number}
            </span>
          </div>
        </header>

        <button className="flex h-[6.375rem] flex-col items-center justify-center gap-1 rounded-lg bg-orange-100 p-3">
          <span className="text-sm">Total dos meus pedidos</span>
          <span className="text-3xl font-bold">
            R$ {tableAccount ? tableAccount.totalTableAccount : undefined}
          </span>
          <span className="text-sm">
            Clique para visualizar o total da mesa
          </span>
        </button>

        <div>
          <span className="font-bold">Pedidos</span>
        </div>

        <div className="flex flex-col gap-8 pb-10">
          {orders.map((item) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <p className="text-base font-bold">
                {new Date(item?.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-row justify-between rounded-lg border border-solid border-gray-300 p-3">
                <div className="flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {new Date(item?.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2" key={item.id}>
                    <span className="text-sm font-normal">
                      R$ {item.totalOrder}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {item.status === "Waiting" ? (
                    <EllipsisHorizontalCircleIcon className="h-5 w-5 text-orange-500" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
