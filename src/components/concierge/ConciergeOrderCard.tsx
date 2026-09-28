import { ExternalLink, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import type { OrderResult } from "../../../convex/concierge";

interface ConciergeOrderCardProps {
  order: OrderResult;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  FULFILLED: {
    label: "Delivered",
    color: "text-green-400 bg-green-400/10 border-green-400/30",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  PARTIAL: {
    label: "Partially Shipped",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  IN_PROGRESS: {
    label: "In Transit",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  UNFULFILLED: {
    label: "Processing",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-400 bg-red-400/10 border-red-400/30",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  PAID: { label: "Paid", color: "text-green-400" },
  PENDING: { label: "Pending", color: "text-yellow-400" },
  REFUNDED: { label: "Refunded", color: "text-blue-400" },
  PARTIALLY_REFUNDED: { label: "Partially Refunded", color: "text-blue-400" },
  VOIDED: { label: "Voided", color: "text-red-400" },
};

const ConciergeOrderCard = ({ order }: ConciergeOrderCardProps) => {
  const fulfillStatus = statusConfig[order.fulfillmentStatus?.toUpperCase()] ?? {
    label: order.fulfillmentStatus ?? "Processing",
    color: "text-white/50 bg-white/5 border-white/10",
    icon: <Package className="w-3.5 h-3.5" />,
  };
  const payStatus = paymentConfig[order.financialStatus?.toUpperCase()] ?? {
    label: order.financialStatus ?? "",
    color: "text-white/40",
  };

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div>
          <span className="text-amber-400 font-bold font-sans text-sm">{order.name}</span>
          {orderDate && (
            <span className="text-white/30 text-xs font-sans ml-2">{orderDate}</span>
          )}
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold font-sans px-2 py-0.5 rounded-full border ${fulfillStatus.color}`}>
          {fulfillStatus.icon}
          {fulfillStatus.label}
        </div>
      </div>

      {/* Line items */}
      {order.lineItems && order.lineItems.length > 0 && (
        <div className="mb-2.5 space-y-0.5">
          {order.lineItems.map((item, i) => (
            <p key={i} className="text-white/70 text-xs font-sans">
              {item.quantity}× {item.title}
            </p>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold font-sans text-sm">
            ₹{parseFloat(order.totalPrice).toLocaleString("en-IN")}
          </span>
          <span className={`text-xs font-sans ${payStatus.color}`}>
            · {payStatus.label}
          </span>
        </div>

        {/* Tracking button */}
        {order.trackingUrl ? (
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-semibold font-sans px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/30 transition-all duration-200"
          >
            <Truck className="w-3 h-3" />
            Track Order
          </a>
        ) : order.trackingNumber ? (
          <span className="text-xs font-sans text-white/40">
            Tracking: {order.trackingNumber}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ConciergeOrderCard;
