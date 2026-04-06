import { Loader2, Minus, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  formatPrice,
  useCart,
  usePlaceOrder,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../hooks/useQueries";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onLoginRequest: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  onLoginRequest,
}: CartDrawerProps) {
  const { data: cart, isLoading } = useCart();
  const { identity } = useInternetIdentity();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartQuantity();
  const { mutate: placeOrder, isPending: isPlacing } = usePlaceOrder();

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    BigInt(0),
  );

  const handlePlaceOrder = () => {
    if (!identity) {
      onLoginRequest();
      return;
    }
    placeOrder(undefined, {
      onSuccess: () => {
        toast.success("Order placed successfully!");
        onClose();
      },
      onError: () => toast.error("Failed to place order. Please try again."),
    });
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
            data-ocid="cart.modal"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-drawer flex flex-col"
            data-ocid="cart.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
              <h2 className="font-display text-xl font-semibold text-nearblack">
                Shopping Bag
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#7A7A7A] hover:text-nearblack transition-colors"
                aria-label="Close cart"
                data-ocid="cart.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div
              className="flex-1 overflow-y-auto px-6 py-4"
              data-ocid="cart.list"
            >
              {isLoading ? (
                <div
                  className="flex items-center justify-center py-16"
                  data-ocid="cart.loading_state"
                >
                  <Loader2 className="w-7 h-7 animate-spin text-gold" />
                </div>
              ) : items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-ocid="cart.empty_state"
                >
                  <div className="text-5xl mb-4">🛍️</div>
                  <p className="font-display text-lg text-nearblack mb-2">
                    Your bag is empty
                  </p>
                  <p className="font-sans text-sm text-[#7A7A7A]">
                    Add some items to get started
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item, i) => (
                    <li
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4"
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <div className="w-20 h-24 bg-[#F7F6F2] flex-shrink-0">
                        <div className="w-full h-full bg-[#E5E5E5]" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-sans text-[13px] font-medium text-nearblack leading-tight">
                              {item.id}
                            </p>
                            <p className="font-sans text-[11px] text-[#7A7A7A] mt-0.5">
                              Size: {item.size}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem({
                                productId: item.id,
                                size: item.size,
                              })
                            }
                            disabled={isRemoving}
                            className="p-1 text-[#7A7A7A] hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                            data-ocid={`cart.item.${i + 1}.delete_button`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = item.quantity - BigInt(1);
                                if (newQty <= 0) {
                                  removeItem({
                                    productId: item.id,
                                    size: item.size,
                                  });
                                } else {
                                  updateQty({
                                    productId: item.id,
                                    size: item.size,
                                    quantity: newQty,
                                  });
                                }
                              }}
                              disabled={isUpdating}
                              className="w-6 h-6 flex items-center justify-center border border-[#E5E5E5] text-nearblack hover:border-nearblack transition-colors"
                              data-ocid={`cart.item.${i + 1}.decrease.button`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-sans text-[13px] font-medium text-nearblack w-5 text-center">
                              {Number(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty({
                                  productId: item.id,
                                  size: item.size,
                                  quantity: item.quantity + BigInt(1),
                                })
                              }
                              disabled={isUpdating}
                              className="w-6 h-6 flex items-center justify-center border border-[#E5E5E5] text-nearblack hover:border-nearblack transition-colors"
                              data-ocid={`cart.item.${i + 1}.increase.button`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-sans text-[13px] font-semibold text-gold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#E5E5E5] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-[#7A7A7A] uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-display text-xl font-semibold text-nearblack">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#7A7A7A]">
                  Shipping & taxes calculated at checkout
                </p>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="w-full py-3.5 bg-gold text-white font-sans text-[12px] font-semibold uppercase tracking-widest hover:bg-[#9A7F45] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  data-ocid="cart.confirm_button"
                >
                  {isPlacing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  PLACE ORDER
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
