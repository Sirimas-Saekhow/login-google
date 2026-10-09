import { z } from "zod";

export const CATEGORIES = ["Electronics", "Accessories", "Gadgets", "General"] as const;
export const SORT_FIELDS = ["name", "title", "price", "stock"] as const;

export const ProductDraftSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.coerce.number().min(0, "ราคาต้องไม่ติดลบ"),
  description: z.string().optional().default(""),
  stock: z.coerce.number().min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
});

export type ProductDraft = z.infer<typeof ProductDraftSchema>;

export type Product = {
  id: number | string;
  name?: string;
  title?: string;
  price: number;
  description?: string;
  stock: number;
  category?: string;
};

export const SearchQuerySchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export type ProductList = {
  products: Product[];
  total: number;
};

export const defaultQuery: SearchQuery = {
  keyword: "",
  category: "",
  sortBy: "title",
  sortOrder: "asc",
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    title: "Mechanical Keyboard",
    price: 2590,
    description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม",
    stock: 15,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    title: "Wireless Mouse",
    price: 1290,
    description: "เมาส์ไร้สาย น้ำหนักเบา จับถนัดมือ",
    stock: 20,
    category: "Electronics",
  },
  {
    id: 3,
    name: "USB-C Hub",
    title: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub พร้อม HDMI และ Card Reader",
    stock: 10,
    category: "Accessories",
  },
];

declare global {
  // eslint-disable-next-line no-var
  var demoProducts: Product[] | undefined;
}

const products = globalThis.demoProducts ?? structuredClone(initialProducts);

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = products;
}

export function getProducts() {
  return products;
}

export function getProduct(id: number | string) {
  return products.find((product) => product.id === id || String(product.id) === String(id));
}

export async function fetchProducts(query?: SearchQuery): Promise<ProductList> {
  let filtered = [...products];
  if (query?.keyword) {
    const kw = query.keyword.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(kw)) ||
        (p.title && p.title.toLowerCase().includes(kw)) ||
        (p.description && p.description.toLowerCase().includes(kw))
    );
  }
  if (query?.category) {
    filtered = filtered.filter((p) => p.category === query.category);
  }
  return {
    products: filtered,
    total: filtered.length,
  };
}

export function updateProduct(
  id: number | string,
  values: Partial<ProductDraft>
) {
  const product = getProduct(id);
  if (!product) {
    throw new Error("Product not found");
  }
  Object.assign(product, values);
}

export function deleteProduct(id: number | string) {
  const index = products.findIndex((product) => product.id === id || String(product.id) === String(id));
  if (index === -1) {
    throw new Error("Product not found");
  }
  products.splice(index, 1);
}