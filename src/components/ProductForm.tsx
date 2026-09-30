"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : { title: "", price: undefined, stock: undefined, category: "" },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <form 
      onSubmit={handleSubmit(saveProduct)} 
      noValidate 
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8"
    >
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${editing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        {editing ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-500 mb-1">ชื่อสินค้า</label>
          <input
            id="title"
            required
            {...register("title")}
            placeholder="เช่น iPhone 15 Pro"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {errors.title && <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.title?.message}</span>}
        </div>

        <div>
          <label htmlFor="price" className="block text-xs font-semibold text-slate-500 mb-1">ราคา ($)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            required
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {errors.price && <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.price?.message}</span>}
        </div>

        <div>
          <label htmlFor="stock" className="block text-xs font-semibold text-slate-500 mb-1">จำนวนคงเหลือ</label>
          <input
            id="stock"
            type="number"
            required
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {errors.stock && <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.stock?.message}</span>}
        </div>

        <div>
          <label htmlFor="category" className="block text-xs font-semibold text-slate-500 mb-1">หมวดหมู่</label>
          <select
            id="category"
            required
            {...register("category")}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition capitalize"
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.category && <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.category?.message}</span>}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {editing && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-50 transition"
          >
            ยกเลิก
          </button>
        )}
        <button 
          type="submit" 
          disabled={!isDirty || !isValid}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition disabled:opacity-40"
        >
          {editing ? "บันทึกการแก้ไข" : "+ เพิ่มสินค้า"}
        </button>
      </div>
    </form>
  );
}