import { Category } from "../backend.d";

export interface SampleProduct {
  id: string;
  name: string;
  price: bigint;
  category: Category;
  sizes: string[];
  image: string;
  thumbnail: string;
  description: string;
  featured: boolean;
  stock: bigint;
}

export const sampleProducts: SampleProduct[] = [
  {
    id: "sample-1",
    name: "Denim Jacket",
    price: BigInt(4999),
    category: Category.men,
    sizes: ["S", "M", "L", "XL"],
    image: "/assets/generated/product-denim.dim_400x500.jpg",
    thumbnail: "/assets/generated/product-denim.dim_400x500.jpg",
    description:
      "A timeless denim jacket with a modern fit. Perfect for layering in any season. Features double chest pockets and adjustable cuffs.",
    featured: true,
    stock: BigInt(50),
  },
  {
    id: "sample-2",
    name: "Floral Summer Dress",
    price: BigInt(3999),
    category: Category.women,
    sizes: ["XS", "S", "M", "L"],
    image: "/assets/generated/product-dress.dim_400x500.jpg",
    thumbnail: "/assets/generated/product-dress.dim_400x500.jpg",
    description:
      "Lightweight floral summer dress in a breathable fabric blend. An effortless choice for warm-weather occasions.",
    featured: true,
    stock: BigInt(30),
  },
  {
    id: "sample-3",
    name: "Cozy Knit Sweater",
    price: BigInt(3499),
    category: Category.women,
    sizes: ["S", "M", "L", "XL"],
    image: "/assets/generated/product-sweater.dim_400x500.jpg",
    thumbnail: "/assets/generated/product-sweater.dim_400x500.jpg",
    description:
      "Soft merino-blend knit sweater in a relaxed silhouette. Stay warm in refined comfort throughout the cooler months.",
    featured: true,
    stock: BigInt(40),
  },
  {
    id: "sample-4",
    name: "Linen Shirt",
    price: BigInt(2999),
    category: Category.men,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/assets/generated/product-shirt.dim_400x500.jpg",
    thumbnail: "/assets/generated/product-shirt.dim_400x500.jpg",
    description:
      "Classic linen shirt with a relaxed fit and breathable construction. Ideal for warm days and casual evenings.",
    featured: false,
    stock: BigInt(60),
  },
  {
    id: "sample-5",
    name: "Kids Printed Tee",
    price: BigInt(1999),
    category: Category.kids,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    image: "/assets/generated/product-kids-tee.dim_400x500.jpg",
    thumbnail: "/assets/generated/product-kids-tee.dim_400x500.jpg",
    description:
      "Fun and vibrant printed tee for active kids. Made from 100% soft cotton with reinforced stitching for durability.",
    featured: false,
    stock: BigInt(80),
  },
  {
    id: "sample-6",
    name: "High-Waist Trousers",
    price: BigInt(4499),
    category: Category.women,
    sizes: ["XS", "S", "M", "L"],
    image: "/assets/generated/product-trousers.dim_400x500.jpg",
    thumbnail: "/assets/generated/product-trousers.dim_400x500.jpg",
    description:
      "Elegant high-waist trousers in a tailored cut. Versatile enough for the office or a sophisticated weekend look.",
    featured: true,
    stock: BigInt(35),
  },
];
