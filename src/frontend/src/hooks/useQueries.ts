import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Cart,
  Category,
  Order,
  OrderStatus,
  Product,
  ProductEditDTO,
} from "../backend";
import { useActor } from "./useActor";

// Helper to format price (bigint cents -> dollar string)
export function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return `$${dollars.toFixed(2)}`;
}

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useProductsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.listProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 60_000,
  });
}

export function useSearchProducts(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor || !term.trim()) return [];
      return actor.searchProductsByName(term);
    },
    enabled: !!actor && !isFetching && term.trim().length >= 2,
    staleTime: 30_000,
  });
}

export function useCart() {
  const { actor, isFetching } = useActor();
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return { id: "", items: [] };
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useOrderHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orderHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.viewOrderHistory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<[Principal, Order[]][]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      size,
      quantity,
    }: { id: string; size: string; quantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addItemToCart(id, size, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      size,
    }: { productId: string; size: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeItemFromCart(productId, size);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      size,
      quantity,
    }: { productId: string; size: string; quantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCartItemQuantity(productId, size, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orderHistory"] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: ProductEditDTO) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductEditDTO }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      orderId,
      status,
    }: {
      userId: Principal;
      orderId: string;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(userId, orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}
