import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Package, Search, ExternalLink, IndianRupee } from "lucide-react";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="text-primary w-8 h-8" />
            Gemstone Orders
          </h1>
          <p className="text-muted-foreground mt-1">Manage e-commerce physical shipments and payments.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              className="pl-10 pr-4 py-2 bg-background border border-white/10 rounded-xl focus:outline-none focus:border-primary text-sm w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-white/10 text-sm">
                <th className="p-4 font-semibold text-muted-foreground">Order ID & Date</th>
                <th className="p-4 font-semibold text-muted-foreground">Customer</th>
                <th className="p-4 font-semibold text-muted-foreground">Items</th>
                <th className="p-4 font-semibold text-muted-foreground">Total (₹)</th>
                <th className="p-4 font-semibold text-muted-foreground">Payment</th>
                <th className="p-4 font-semibold text-muted-foreground">Shipping</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No orders have been placed yet.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs font-bold mb-1">#{order.id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-sm">{order.user?.name || "Guest"}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email || order.user?.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {order.items.map(item => (
                          <div key={item.id} className="text-xs bg-white/5 px-2 py-1 rounded inline-flex items-center w-max border border-white/5">
                            <span className="font-bold text-primary mr-2">{item.quantity}x</span> {item.gemName}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-sm">
                      <span className="flex items-center">
                        <IndianRupee className="w-3 h-3 mr-0.5 text-muted-foreground" />
                        {order.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border w-max ${
                          order.paymentStatus === "COMPLETED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          order.paymentStatus === "PENDING" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}>
                          {order.paymentStatus}
                        </span>
                        {order.utrNumber && (
                          <div className="text-[10px] text-muted-foreground mt-1 flex flex-col">
                            <span className="uppercase font-bold tracking-wider opacity-70">UTR Ref:</span>
                            <span className="font-mono">{order.utrNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        order.shippingStatus === "DELIVERED" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        order.shippingStatus === "SHIPPED" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                        "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}>
                        {order.shippingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-primary transition-colors inline-flex">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
