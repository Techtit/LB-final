import { useState, useRef, useEffect, useCallback } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2, ExternalLink, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConciergeProductCard from "./ConciergeProductCard";
import ConciergeOrderCard from "./ConciergeOrderCard";
import type { ProductResult, OrderResult, TicketResult } from "../../../convex/concierge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ProductResult[];
  orders?: OrderResult[];
  ticket?: TicketResult;
  isError?: boolean;
}

interface ConciergeChatProps {
  /** Current value of the shared search/chat input */
  pendingMessage: string;
  /** Called after the pending message has been consumed */
  onMessageConsumed: () => void;
  /** Called when user navigates to a product (closes the overlay) */
  onNavigate: () => void;
}

// ─── Quick-action chips shown before the first message ───────────────────────

const QUICK_ACTIONS = [
  { label: "✨ Find Jewellery", query: "Show me your best jewellery collections" },
  { label: "👂 Earrings", query: "Show me earrings" },
  { label: "📿 Necklaces", query: "Show me necklaces" },
  { label: "💛 Bangles", query: "Show me bangles and bracelets" },
  { label: "💍 Rings", query: "Show me rings" },
  { label: "🌸 Hair Accessories", query: "Show me hair accessories" },
  { label: "👑 Premium", query: "Show me premium jewellery" },
  { label: "📦 My Orders", query: "Where is my order?" },
];

// ─── Single message bubble component ────────────────────────────────────────

const MessageBubble = ({
  message,
  onNavigate,
}: {
  message: Message;
  onNavigate: () => void;
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        {/* Text bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm font-sans leading-relaxed ${
            isUser
              ? "bg-amber-500 text-black rounded-tr-sm font-medium"
              : message.isError
              ? "bg-red-950/50 text-red-300 border border-red-900/50 rounded-tl-sm"
              : "bg-white/8 text-white/90 border border-white/10 rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Product cards */}
        {message.products && message.products.length > 0 && (
          <div className="w-full flex flex-col gap-2 mt-1">
            {message.products.map((product) => (
              <ConciergeProductCard
                key={product.handle}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        {/* Order cards */}
        {message.orders && message.orders.length > 0 && (
          <div className="w-full flex flex-col gap-2 mt-1">
            {message.orders.map((order) => (
              <ConciergeOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Support ticket card */}
        {message.ticket && (
          <div className="w-full bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 mt-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 font-bold font-sans text-sm">
                🎫 Ticket {message.ticket.ticketRef} raised
              </span>
            </div>
            <p className="text-white/60 text-xs font-sans mb-3">
              Our team will respond within 24 hours. Click below to send the details on WhatsApp for faster resolution.
            </p>
            <a
              href={message.ticket.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center w-full py-2 px-4 bg-green-700/80 hover:bg-green-600 text-white text-sm font-semibold font-sans rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Send on WhatsApp
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Typing indicator ────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex justify-start"
  >
    <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-amber-400/70 rounded-full"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Main ConciergeChat component ────────────────────────────────────────────

const ConciergeChat = ({ pendingMessage, onMessageConsumed, onNavigate }: ConciergeChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const runChat = useAction(api.concierge.chat);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // Build conversation history for the agent (exclude error messages)
        const history = [...messages, userMsg]
          .filter((m) => !m.isError)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await runChat({ messages: history });

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.reply,
          products: response.products,
          orders: response.orders,
          ticket: response.ticket,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("[ConciergeChat] error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              "Something went wrong. Please try again or reach us on WhatsApp at 9211770999.",
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, runChat]
  );

  // Listen for pending messages from the parent's shared input
  useEffect(() => {
    if (pendingMessage) {
      sendMessage(pendingMessage);
      onMessageConsumed();
    }
  }, [pendingMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Welcome state / Quick actions */}
      {isEmpty && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-1 mb-4"
        >
          <p className="text-white/40 text-sm font-sans mb-4 text-center">
            Ask me anything about jewellery, orders, or store policies.
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.query)}
                disabled={isLoading}
                className="text-xs font-sans px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/70 hover:bg-amber-500/15 hover:border-amber-500/40 hover:text-amber-300 transition-all duration-200 disabled:opacity-40"
              >
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Message list */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onNavigate={onNavigate} />
          ))}
        </AnimatePresence>
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConciergeChat;
