import { Clock, Loader2, LogIn, LogOut, Package, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { formatPrice, useOrderHistory } from "../hooks/useQueries";

interface AccountPanelProps {
  open: boolean;
  onClose: () => void;
  onAdminOpen: () => void;
  isAdmin: boolean;
}

export default function AccountPanel({
  open,
  onClose,
  onAdminOpen,
  isAdmin,
}: AccountPanelProps) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: orders, isLoading: ordersLoading } = useOrderHistory();

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-5)}`
    : "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[380px] bg-white shadow-drawer flex flex-col"
            data-ocid="account.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
              <h2 className="font-display text-xl font-semibold text-nearblack">
                My Account
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#7A7A7A] hover:text-nearblack transition-colors"
                data-ocid="account.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {isInitializing ? (
                <div
                  className="flex justify-center py-10"
                  data-ocid="account.loading_state"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-gold" />
                </div>
              ) : !identity ? (
                <div className="flex flex-col items-center gap-5 py-10">
                  <div className="text-5xl">🔒</div>
                  <div className="text-center">
                    <p className="font-display text-lg text-nearblack mb-1">
                      Sign In
                    </p>
                    <p className="font-sans text-sm text-[#7A7A7A]">
                      Log in to view your orders and profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="flex items-center gap-2 px-8 py-3 bg-nearblack text-white font-sans text-[12px] font-semibold uppercase tracking-widest hover:bg-charcoal-light transition-colors disabled:opacity-60"
                    data-ocid="account.primary_button"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    LOG IN
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile info */}
                  <div className="bg-[#F7F6F2] p-4">
                    <p className="font-sans text-[11px] text-gold font-semibold uppercase tracking-widest mb-1">
                      Principal ID
                    </p>
                    <p className="font-sans text-xs text-nearblack font-mono break-all">
                      {shortPrincipal}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-gold text-white font-sans text-[10px] font-semibold uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Admin link */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        onAdminOpen();
                        onClose();
                      }}
                      className="w-full py-3 border border-nearblack text-nearblack font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-nearblack hover:text-white transition-colors"
                      data-ocid="account.admin.button"
                    >
                      ADMIN PANEL
                    </button>
                  )}

                  {/* Order history */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-gold" />
                      <h3 className="font-sans text-[12px] font-semibold uppercase tracking-widest text-nearblack">
                        Order History
                      </h3>
                    </div>

                    {ordersLoading ? (
                      <div
                        className="flex justify-center py-6"
                        data-ocid="orders.loading_state"
                      >
                        <Loader2 className="w-5 h-5 animate-spin text-gold" />
                      </div>
                    ) : !orders || orders.length === 0 ? (
                      <div
                        className="text-center py-6 bg-[#F7F6F2]"
                        data-ocid="orders.empty_state"
                      >
                        <p className="font-sans text-sm text-[#7A7A7A]">
                          No orders yet
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-3" data-ocid="orders.list">
                        {orders.map((order, i) => (
                          <li
                            key={order.id}
                            className="border border-[#E5E5E5] p-4"
                            data-ocid={`orders.item.${i + 1}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-sans text-[11px] font-medium text-nearblack">
                                #{order.id.slice(0, 8)}
                              </span>
                              <span
                                className={`font-sans text-[10px] font-semibold uppercase px-2 py-0.5 ${
                                  order.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : order.status === "shipped"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[#7A7A7A]">
                              <span className="font-sans text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(
                                  Number(order.timestamp) / 1_000_000,
                                ).toLocaleDateString()}
                              </span>
                              <span className="font-sans text-xs font-semibold text-nearblack">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full py-3 border border-[#E5E5E5] text-[#7A7A7A] font-sans text-[11px] font-semibold uppercase tracking-widest hover:border-nearblack hover:text-nearblack transition-colors flex items-center justify-center gap-2"
                    data-ocid="account.secondary_button"
                  >
                    <LogOut className="w-4 h-4" />
                    LOG OUT
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
