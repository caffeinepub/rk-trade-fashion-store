import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type {
  Category,
  Order,
  OrderStatus,
  Product,
  ProductEditDTO,
} from "../backend";
import {
  formatPrice,
  useAddProduct,
  useAllOrders,
  useDeleteProduct,
  useProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  sizes: string;
  imageUrl: string;
  featured: boolean;
}

const defaultForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "men",
  sizes: "S,M,L,XL",
  imageUrl: "",
  featured: false,
};

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductFormData>(defaultForm);

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: allOrders, isLoading: ordersLoading } = useAllOrders();
  const { mutate: addProduct, isPending: isAdding } = useAddProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Math.round(Number.parseFloat(form.price) * 100);
    const stock = Number.parseInt(form.stock);
    if (Number.isNaN(price) || Number.isNaN(stock)) {
      toast.error("Invalid price or stock");
      return;
    }
    const imageBlob = ExternalBlob.fromURL(
      form.imageUrl || "/assets/generated/product-denim.dim_400x500.jpg",
    );
    const productData: ProductEditDTO = {
      name: form.name,
      description: form.description,
      price: BigInt(price),
      stock: BigInt(stock),
      category: form.category as Category,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      image: imageBlob,
      thumbnail: imageBlob,
    };

    if (editingProduct) {
      updateProduct(
        { id: editingProduct.id, data: productData },
        {
          onSuccess: () => {
            toast.success("Product updated");
            setShowForm(false);
            setEditingProduct(null);
            setForm(defaultForm);
          },
          onError: (err) => toast.error(`Failed: ${err.message}`),
        },
      );
    } else {
      addProduct(productData, {
        onSuccess: () => {
          toast.success("Product added");
          setShowForm(false);
          setForm(defaultForm);
        },
        onError: (err) => toast.error(`Failed: ${err.message}`),
      });
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toFixed(2),
      stock: product.stock.toString(),
      category: product.category as string,
      sizes: product.sizes.join(","),
      imageUrl: product.image.getDirectURL(),
      featured: product.featured,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => toast.success("Product deleted"),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-8 z-50 bg-white overflow-hidden flex flex-col"
            data-ocid="admin.modal"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="font-display text-xl font-semibold text-nearblack">
                Admin Panel
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#7A7A7A] hover:text-nearblack transition-colors"
                data-ocid="admin.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="products">
                <TabsList className="mb-6">
                  <TabsTrigger value="products" data-ocid="admin.products.tab">
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="orders" data-ocid="admin.orders.tab">
                    Orders
                  </TabsTrigger>
                </TabsList>

                {/* Products Tab */}
                <TabsContent value="products">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-nearblack">
                      All Products ({products?.length ?? 0})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(true);
                        setEditingProduct(null);
                        setForm(defaultForm);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gold text-white font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-[#9A7F45] transition-colors"
                      data-ocid="admin.products.open_modal_button"
                    >
                      <Plus className="w-4 h-4" />
                      ADD PRODUCT
                    </button>
                  </div>

                  {/* Product Form */}
                  <AnimatePresence>
                    {showForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[#F7F6F2] p-6 mb-6"
                        data-ocid="admin.product_form.panel"
                      >
                        <h4 className="font-sans text-sm font-semibold uppercase tracking-widest text-nearblack mb-4">
                          {editingProduct ? "Edit Product" : "New Product"}
                        </h4>
                        <form
                          onSubmit={handleSubmit}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div>
                            <label
                              htmlFor="prod-name"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Name
                            </label>
                            <input
                              id="prod-name"
                              type="text"
                              value={form.name}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, name: e.target.value }))
                              }
                              required
                              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
                              data-ocid="admin.product.name.input"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="prod-price"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Price ($)
                            </label>
                            <input
                              id="prod-price"
                              type="number"
                              step="0.01"
                              value={form.price}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  price: e.target.value,
                                }))
                              }
                              required
                              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
                              data-ocid="admin.product.price.input"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="prod-category"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Category
                            </label>
                            <div className="relative">
                              <select
                                id="prod-category"
                                value={form.category}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    category: e.target.value,
                                  }))
                                }
                                className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white appearance-none"
                                data-ocid="admin.product.category.select"
                              >
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                                <option value="newArrivals">
                                  New Arrivals
                                </option>
                                <option value="sale">Sale</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A7A] pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="prod-stock"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Stock
                            </label>
                            <input
                              id="prod-stock"
                              type="number"
                              value={form.stock}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  stock: e.target.value,
                                }))
                              }
                              required
                              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
                              data-ocid="admin.product.stock.input"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label
                              htmlFor="prod-desc"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Description
                            </label>
                            <textarea
                              id="prod-desc"
                              value={form.description}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white resize-none"
                              data-ocid="admin.product.description.textarea"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="prod-sizes"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Sizes (comma-separated)
                            </label>
                            <input
                              id="prod-sizes"
                              type="text"
                              value={form.sizes}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  sizes: e.target.value,
                                }))
                              }
                              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
                              data-ocid="admin.product.sizes.input"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="prod-image"
                              className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
                            >
                              Image URL
                            </label>
                            <input
                              id="prod-image"
                              type="url"
                              value={form.imageUrl}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  imageUrl: e.target.value,
                                }))
                              }
                              placeholder="https://..."
                              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
                              data-ocid="admin.product.image.input"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="prod-featured"
                              checked={form.featured}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  featured: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 accent-gold"
                              data-ocid="admin.product.featured.checkbox"
                            />
                            <label
                              htmlFor="prod-featured"
                              className="font-sans text-xs font-medium text-nearblack uppercase tracking-wider"
                            >
                              Featured
                            </label>
                          </div>
                          <div className="md:col-span-2 flex gap-3 pt-2">
                            <button
                              type="submit"
                              disabled={isAdding || isUpdating}
                              className="flex items-center gap-2 px-6 py-2.5 bg-nearblack text-white font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-charcoal-light transition-colors disabled:opacity-60"
                              data-ocid="admin.product.submit_button"
                            >
                              {(isAdding || isUpdating) && (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              )}
                              {editingProduct ? "SAVE CHANGES" : "ADD PRODUCT"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowForm(false);
                                setEditingProduct(null);
                                setForm(defaultForm);
                              }}
                              className="px-6 py-2.5 border border-[#E5E5E5] text-[#7A7A7A] font-sans text-[11px] font-semibold uppercase tracking-widest hover:border-nearblack hover:text-nearblack transition-colors"
                              data-ocid="admin.product.cancel_button"
                            >
                              CANCEL
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Products List */}
                  {productsLoading ? (
                    <div
                      className="flex justify-center py-12"
                      data-ocid="admin.products.loading_state"
                    >
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  ) : !products || products.length === 0 ? (
                    <div
                      className="text-center py-12 bg-[#F7F6F2]"
                      data-ocid="admin.products.empty_state"
                    >
                      <p className="font-sans text-sm text-[#7A7A7A]">
                        No products yet. Add your first product above.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="overflow-x-auto"
                      data-ocid="admin.products.table"
                    >
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E5E5E5]">
                            {[
                              "Name",
                              "Price",
                              "Category",
                              "Stock",
                              "Featured",
                              "Actions",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#7A7A7A]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, i) => (
                            <tr
                              key={product.id}
                              className="border-b border-[#E5E5E5] hover:bg-[#F7F6F2] transition-colors"
                              data-ocid={`admin.products.row.${i + 1}`}
                            >
                              <td className="px-3 py-3 font-sans text-sm text-nearblack">
                                {product.name}
                              </td>
                              <td className="px-3 py-3 font-sans text-sm text-gold font-semibold">
                                {formatPrice(product.price)}
                              </td>
                              <td className="px-3 py-3">
                                <span className="font-sans text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#F0EFE9] text-nearblack">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-3 py-3 font-sans text-sm text-nearblack">
                                {product.stock.toString()}
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`font-sans text-[10px] font-semibold uppercase ${product.featured ? "text-gold" : "text-[#7A7A7A]"}`}
                                >
                                  {product.featured ? "Yes" : "No"}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEdit(product)}
                                    className="p-1.5 text-[#7A7A7A] hover:text-gold transition-colors"
                                    data-ocid={`admin.products.row.${i + 1}.edit_button`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(product.id)}
                                    disabled={isDeleting}
                                    className="p-1.5 text-[#7A7A7A] hover:text-red-500 transition-colors"
                                    data-ocid={`admin.products.row.${i + 1}.delete_button`}
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-nearblack mb-4">
                    All Orders
                  </h3>
                  {ordersLoading ? (
                    <div
                      className="flex justify-center py-12"
                      data-ocid="admin.orders.loading_state"
                    >
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  ) : !allOrders || allOrders.length === 0 ? (
                    <div
                      className="text-center py-12 bg-[#F7F6F2]"
                      data-ocid="admin.orders.empty_state"
                    >
                      <p className="font-sans text-sm text-[#7A7A7A]">
                        No orders yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4" data-ocid="admin.orders.list">
                      {allOrders.flatMap(
                        (
                          [principal, orders]: [
                            import("@icp-sdk/core/principal").Principal,
                            Order[],
                          ],
                          pi: number,
                        ) =>
                          orders.map((order, oi) => (
                            <div
                              key={order.id}
                              className="border border-[#E5E5E5] p-4"
                              data-ocid={`admin.orders.item.${pi * 100 + oi + 1}`}
                            >
                              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                                <div>
                                  <p className="font-sans text-[11px] font-semibold text-nearblack">
                                    #{order.id.slice(0, 12)}
                                  </p>
                                  <p className="font-sans text-[10px] text-[#7A7A7A] mt-0.5">
                                    {principal.toString().slice(0, 20)}...
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-sans text-sm font-semibold text-gold">
                                    {formatPrice(order.total)}
                                  </span>
                                  <div className="relative">
                                    <select
                                      value={order.status}
                                      onChange={(e) =>
                                        updateOrderStatus({
                                          userId: principal,
                                          orderId: order.id,
                                          status: e.target.value as OrderStatus,
                                        })
                                      }
                                      className="border border-[#E5E5E5] px-2 py-1 font-sans text-[11px] text-nearblack outline-none focus:border-gold transition-colors appearance-none pr-6 bg-white"
                                      data-ocid={`admin.orders.item.${pi * 100 + oi + 1}.select`}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">
                                        Delivered
                                      </option>
                                      <option value="cancelled">
                                        Cancelled
                                      </option>
                                    </select>
                                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A7A7A] pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                {order.items.map((item) => (
                                  <div
                                    key={`${item.id}-${item.size}`}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="font-sans text-[#3A3A3A]">
                                      {item.id} — Size: {item.size} ×{" "}
                                      {item.quantity.toString()}
                                    </span>
                                    <span className="font-sans font-medium text-nearblack">
                                      {formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )),
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
