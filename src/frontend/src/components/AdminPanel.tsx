import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  ImageIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
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
  open?: boolean;
  onClose?: () => void;
  fullPage?: boolean;
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

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  shipped: "bg-blue-50 text-blue-700 border border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const CATEGORY_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  newArrivals: "New Arrivals",
  sale: "Sale",
};

function SummaryCard({
  icon,
  label,
  value,
  sub,
  ocid,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  ocid: string;
}) {
  return (
    <div
      className="bg-white border border-[#E5E5E5] p-5 flex items-start gap-4"
      data-ocid={ocid}
    >
      <div className="w-10 h-10 rounded-none bg-[#F7F6F2] flex items-center justify-center text-gold flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#7A7A7A] mb-0.5">
          {label}
        </p>
        <p className="font-display text-2xl font-bold text-nearblack leading-none">
          {value}
        </p>
        {sub && (
          <p className="font-sans text-[11px] text-[#7A7A7A] mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  editingProduct,
  onCancel,
  onSuccess,
}: {
  editingProduct: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<ProductFormData>(
    editingProduct
      ? {
          name: editingProduct.name,
          description: editingProduct.description,
          price: (Number(editingProduct.price) / 100).toFixed(2),
          stock: editingProduct.stock.toString(),
          category: editingProduct.category as string,
          sizes: editingProduct.sizes.join(","),
          imageUrl: editingProduct.image.getDirectURL(),
          featured: editingProduct.featured,
        }
      : defaultForm,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editingProduct ? editingProduct.image.getDirectURL() : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: addProduct, isPending: isAdding } = useAddProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Math.round(Number.parseFloat(form.price) * 100);
    const stock = Number.parseInt(form.stock);
    if (Number.isNaN(price) || Number.isNaN(stock)) {
      toast.error("Invalid price or stock");
      return;
    }

    // File upload takes priority over URL
    const imageSource = imagePreview
      ? imagePreview
      : form.imageUrl || "/assets/generated/product-denim.dim_400x500.jpg";
    const imageBlob = ExternalBlob.fromURL(imageSource);

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
            onSuccess();
          },
          onError: (err) => toast.error(`Failed: ${err.message}`),
        },
      );
    } else {
      addProduct(productData, {
        onSuccess: () => {
          toast.success("Product added");
          onSuccess();
        },
        onError: (err) => toast.error(`Failed: ${err.message}`),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#F7F6F2] border border-[#E5E5E5] p-6 mb-6"
      data-ocid="admin.product_form.panel"
    >
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-sans text-sm font-semibold uppercase tracking-widest text-nearblack">
          {editingProduct ? "Edit Product" : "New Product"}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-[#7A7A7A] hover:text-nearblack transition-colors"
          data-ocid="admin.product.cancel_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Image upload section */}
        <div className="md:col-span-2 lg:col-span-1 lg:row-span-3">
          <label
            htmlFor="prod-file-upload"
            className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-2"
          >
            Product Image
          </label>
          <button
            type="button"
            className="relative border-2 border-dashed border-[#D5D4CE] bg-white aspect-square w-full flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors group"
            onClick={() => fileInputRef.current?.click()}
            data-ocid="admin.product.dropzone"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="font-sans text-xs text-white font-medium uppercase tracking-wider">
                    Change Image
                  </p>
                </div>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-[#C5C4BE] mb-2" />
                <p className="font-sans text-xs text-[#7A7A7A] text-center px-4">
                  Click to upload image
                </p>
                <p className="font-sans text-[10px] text-[#A5A5A0] mt-1">
                  JPG, PNG, WEBP
                </p>
              </>
            )}
          </button>
          <input
            id="prod-file-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            data-ocid="admin.product.upload_button"
          />
          {!imageFile && (
            <div className="mt-3">
              <label
                htmlFor="prod-image-url"
                className="font-sans text-[10px] font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
              >
                Or paste image URL
              </label>
              <input
                id="prod-image-url"
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-xs text-nearblack outline-none focus:border-gold transition-colors bg-white"
                data-ocid="admin.product.image.input"
              />
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="prod-name"
            className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
          >
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            id="prod-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="e.g. Classic Denim Jacket"
            className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
            data-ocid="admin.product.name.input"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="prod-price"
            className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
          >
            Price (USD) <span className="text-red-400">*</span>
          </label>
          <input
            id="prod-price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
            placeholder="0.00"
            className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
            data-ocid="admin.product.price.input"
          />
        </div>

        {/* Category */}
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
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white appearance-none"
              data-ocid="admin.product.category.select"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="newArrivals">New Arrivals</option>
              <option value="sale">Sale</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A7A] pointer-events-none" />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label
            htmlFor="prod-stock"
            className="font-sans text-xs font-medium text-[#7A7A7A] uppercase tracking-wider block mb-1"
          >
            Stock Qty <span className="text-red-400">*</span>
          </label>
          <input
            id="prod-stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            required
            placeholder="0"
            className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
            data-ocid="admin.product.stock.input"
          />
        </div>

        {/* Sizes */}
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
            onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
            placeholder="S,M,L,XL"
            className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white"
            data-ocid="admin.product.sizes.input"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="prod-featured"
            checked={form.featured}
            onChange={(e) =>
              setForm((f) => ({ ...f, featured: e.target.checked }))
            }
            className="w-4 h-4 accent-gold"
            data-ocid="admin.product.featured.checkbox"
          />
          <label
            htmlFor="prod-featured"
            className="font-sans text-sm font-medium text-nearblack cursor-pointer select-none"
          >
            Featured product
          </label>
        </div>

        {/* Description */}
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
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            placeholder="Describe the product..."
            className="w-full border border-[#E5E5E5] px-3 py-2 font-sans text-sm text-nearblack outline-none focus:border-gold transition-colors bg-white resize-none"
            data-ocid="admin.product.description.textarea"
          />
        </div>

        {/* Actions */}
        <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-2 border-t border-[#E5E5E5]">
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
            onClick={onCancel}
            className="px-6 py-2.5 border border-[#E5E5E5] text-[#7A7A7A] font-sans text-[11px] font-semibold uppercase tracking-widest hover:border-nearblack hover:text-nearblack transition-colors"
            data-ocid="admin.product.cancel_button"
          >
            CANCEL
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function AdminContent({ onClose }: { onClose?: () => void }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const queryClient = useQueryClient();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: allOrders, isLoading: ordersLoading } = useAllOrders();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const isRefreshing = productsLoading || ordersLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  // Summary stats
  const totalProducts = products?.length ?? 0;
  const allOrdersList = allOrders?.flatMap(([, orders]) => orders) ?? [];
  const totalOrders = allOrdersList.length;
  const pendingOrders = allOrdersList.filter(
    (o) => (o.status as string) === "pending",
  ).length;
  const totalRevenue = allOrdersList
    .filter(
      (o) =>
        (o.status as string) === "delivered" ||
        (o.status as string) === "shipped",
    )
    .reduce((sum, o) => sum + Number(o.total), 0);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Product deleted");
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete product");
        setDeleteTarget(null);
      },
    });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Build a product id -> name lookup map
  const productNameMap = new Map<string, string>(
    (products ?? []).map((p) => [p.id, p.name]),
  );

  return (
    <div className="min-h-screen bg-offwhite" data-ocid="admin.section">
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="admin.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-nearblack">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              data-ocid="admin.delete.confirm_button"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dashboard Header */}
      <div className="bg-nearblack text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-sans text-[11px] font-semibold uppercase tracking-widest group"
                data-ocid="admin.back.button"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Store
              </button>
            )}
            <div className="w-px h-6 bg-white/20" />
            <div>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-gold">
                RK TRADE
              </span>
              <h1 className="font-display text-xl font-bold text-white leading-tight">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh data"
              className="p-2 text-white/60 hover:text-white transition-colors rounded"
              data-ocid="admin.refresh.button"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <div className="flex items-center gap-2 text-white/50">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-sans text-[11px] font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SummaryCard
            icon={<Package className="w-5 h-5" />}
            label="Total Products"
            value={totalProducts}
            sub="In catalog"
            ocid="admin.summary.products.card"
          />
          <SummaryCard
            icon={<ShoppingBag className="w-5 h-5" />}
            label="Total Orders"
            value={totalOrders}
            sub="All time"
            ocid="admin.summary.orders.card"
          />
          <SummaryCard
            icon={<Star className="w-5 h-5" />}
            label="Pending Orders"
            value={pendingOrders}
            sub="Awaiting fulfillment"
            ocid="admin.summary.pending.card"
          />
          <SummaryCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Revenue"
            value={`$${(totalRevenue / 100).toFixed(0)}`}
            sub="Shipped + delivered"
            ocid="admin.summary.revenue.card"
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6 bg-white border border-[#E5E5E5] rounded-none p-0 h-auto gap-0">
            <TabsTrigger
              value="products"
              className="rounded-none px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-widest data-[state=active]:bg-gold data-[state=active]:text-white data-[state=active]:shadow-none border-r border-[#E5E5E5]"
              data-ocid="admin.products.tab"
            >
              Products ({totalProducts})
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-widest data-[state=active]:bg-gold data-[state=active]:text-white data-[state=active]:shadow-none"
              data-ocid="admin.orders.tab"
            >
              Orders ({totalOrders})
            </TabsTrigger>
          </TabsList>

          {/* ────── Products Tab ────── */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-nearblack">
                Product Catalog
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
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
                <ProductForm
                  editingProduct={editingProduct}
                  onCancel={handleFormCancel}
                  onSuccess={handleFormSuccess}
                />
              )}
            </AnimatePresence>

            {/* Products Table */}
            {productsLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="admin.products.loading_state"
              >
                <Loader2 className="w-7 h-7 animate-spin text-gold" />
              </div>
            ) : !products || products.length === 0 ? (
              <div
                className="text-center py-16 bg-white border border-dashed border-[#D5D4CE]"
                data-ocid="admin.products.empty_state"
              >
                <Package className="w-10 h-10 text-[#C5C4BE] mx-auto mb-3" />
                <p className="font-sans text-sm font-medium text-[#7A7A7A]">
                  No products yet
                </p>
                <p className="font-sans text-xs text-[#A5A5A0] mt-1 max-w-xs mx-auto">
                  Start by clicking &ldquo;Add Product&rdquo; above to add your
                  first clothing item to the store.
                </p>
              </div>
            ) : (
              <div
                className="bg-white border border-[#E5E5E5] overflow-x-auto"
                data-ocid="admin.products.table"
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-[#F7F6F2]">
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Image
                      </th>
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Stock
                      </th>
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Featured
                      </th>
                      <th className="text-left px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8] transition-colors"
                        data-ocid={`admin.products.row.${i + 1}`}
                      >
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-[#F0EFE9] overflow-hidden flex-shrink-0">
                            <img
                              src={product.thumbnail.getDirectURL()}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/assets/generated/product-denim.dim_400x500.jpg";
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-sans text-sm font-medium text-nearblack line-clamp-1">
                            {product.name}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-sans text-sm text-gold font-semibold">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-sans text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#F0EFE9] text-nearblack">
                            {CATEGORY_LABELS[product.category as string] ??
                              product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-sans text-xs font-semibold ${
                              Number(product.stock) <= 5
                                ? "text-red-500"
                                : "text-nearblack"
                            }`}
                          >
                            {product.stock.toString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {product.featured ? (
                            <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-gold">
                              <Star className="w-3 h-3 fill-gold" />
                              Yes
                            </span>
                          ) : (
                            <span className="font-sans text-[10px] text-[#A5A5A0]">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(product)}
                              className="p-2 text-[#7A7A7A] hover:text-gold hover:bg-[#F7F6F2] transition-colors"
                              title="Edit product"
                              data-ocid={`admin.products.item.${i + 1}.edit_button`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className="p-2 text-[#7A7A7A] hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete product"
                              data-ocid={`admin.products.item.${i + 1}.delete_button`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* ────── Orders Tab ────── */}
          <TabsContent value="orders">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-nearblack">
                Customer Orders
              </h2>
              <span className="font-sans text-xs text-[#7A7A7A]">
                {totalOrders} total — {pendingOrders} pending
              </span>
            </div>

            {ordersLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="admin.orders.loading_state"
              >
                <Loader2 className="w-7 h-7 animate-spin text-gold" />
              </div>
            ) : !allOrders || allOrders.length === 0 ? (
              <div
                className="text-center py-16 bg-white border border-dashed border-[#D5D4CE]"
                data-ocid="admin.orders.empty_state"
              >
                <ShoppingBag className="w-10 h-10 text-[#C5C4BE] mx-auto mb-3" />
                <p className="font-sans text-sm font-medium text-[#7A7A7A]">
                  No orders yet
                </p>
                <p className="font-sans text-xs text-[#A5A5A0] mt-1 max-w-xs mx-auto">
                  Once customers place orders, they&apos;ll appear here. Share
                  your store link to get your first orders.
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="admin.orders.list">
                {allOrders.flatMap(
                  (
                    [principal, orders]: [
                      import("@icp-sdk/core/principal").Principal,
                      Order[],
                    ],
                    pi: number,
                  ) =>
                    orders.map((order: Order, oi: number) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: oi * 0.05 }}
                        className="bg-white border border-[#E5E5E5] overflow-hidden"
                        data-ocid={`admin.orders.item.${pi * 100 + oi + 1}`}
                      >
                        {/* Order header */}
                        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-[#F0EFE9]">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-sans text-xs font-bold text-nearblack">
                                #{order.id.slice(0, 12).toUpperCase()}
                              </p>
                              <p className="font-sans text-[10px] text-[#7A7A7A] mt-0.5 font-mono">
                                {principal.toString().slice(0, 24)}...
                              </p>
                            </div>
                            <span
                              className={`font-sans text-[10px] font-semibold uppercase px-2.5 py-1 ${
                                STATUS_STYLES[
                                  order.status as unknown as string
                                ] ?? ""
                              }`}
                            >
                              {order.status as unknown as string}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-display text-lg font-bold text-gold">
                              {formatPrice(order.total)}
                            </span>
                            <div className="relative">
                              <select
                                value={order.status as unknown as string}
                                onChange={(e) =>
                                  updateOrderStatus({
                                    userId: principal,
                                    orderId: order.id,
                                    status: e.target.value as OrderStatus,
                                  })
                                }
                                className="border border-[#E5E5E5] px-3 py-1.5 font-sans text-[11px] text-nearblack outline-none focus:border-gold transition-colors appearance-none pr-7 bg-white font-medium"
                                data-ocid={`admin.orders.item.${pi * 100 + oi + 1}.select`}
                              >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A7A7A] pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="px-5 py-3 space-y-2">
                          {order.items.map((item) => {
                            const productName =
                              productNameMap.get(item.id) ?? item.id;
                            return (
                              <div
                                key={`${item.id}-${item.size}`}
                                className="flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                  <span className="font-sans text-[#3A3A3A] font-medium">
                                    {productName}
                                  </span>
                                  <span className="font-sans text-[#7A7A7A]">
                                    — Size: {item.size}
                                  </span>
                                  <span className="font-sans text-[#7A7A7A]">
                                    ×{item.quantity.toString()}
                                  </span>
                                </div>
                                <span className="font-sans font-semibold text-nearblack">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )),
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPanel({
  open = false,
  onClose,
  fullPage = false,
}: AdminPanelProps) {
  // Full-page mode: render inline (used when view=="admin" in App.tsx)
  if (fullPage) {
    return <AdminContent onClose={onClose} />;
  }

  // Modal / overlay mode (legacy backward compat)
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
            className="fixed inset-2 md:inset-6 z-50 bg-offwhite overflow-hidden flex flex-col"
            data-ocid="admin.modal"
          >
            <div className="flex-1 overflow-y-auto">
              <AdminContent onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
