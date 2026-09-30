"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function saveProduct(draft: ProductDraft) {
    if (editingItem) {
      setProducts(
        products.map((item) =>
          item.id === editingItem.id ? { ...draft, id: editingItem.id } : item
        )
      );
      setEditingItem(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">📦 Product Explorer</h1>
          <p className="text-xs text-slate-500 mt-1">ค้นหาเเละเลือกดูรายการสินค้า</p>
        </div>
        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-sm transition disabled:opacity-50"
        >
          {status === "loading" ? "🔄 กำลังโหลด..." : "🔄 รีโหลดข้อมูล"}
        </button>
      </div>

      <ProductSearchForm onSearch={loadProducts} />

      <ProductForm
        key={editingItem ? editingItem.id : "new"}
        editing={editingItem}
        onSave={saveProduct}
        onCancel={() => setEditingItem(null)}
      />

      {/* Content Area */}
      <section aria-live="polite" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {status === "loading" && (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
            ⏳ กำลังดึงข้อมูลสินค้าจาก API...
          </div>
        )}

        {status === "error" && (
          <div className="p-8 text-center text-rose-500 bg-rose-50/50 text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {status === "ready" && products.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-sm">
            🛒 ไม่พบสินค้าที่ตรงกับเงื่อนไข
          </div>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">ชื่อสินค้า</th>
                  <th className="py-3.5 px-4">ราคา ($)</th>
                  <th className="py-3.5 px-4">คงเหลือ</th>
                  <th className="py-3.5 px-4">หมวดหมู่</th>
                  <th className="py-3.5 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{item.title}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">${item.price}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {item.stock} ชิ้น
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-500">{item.category}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button 
                        type="button" 
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                      >
                        แก้ไข
                      </button>
                      <button 
                        type="button" 
                        onClick={() => removeProduct(item.id)}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}