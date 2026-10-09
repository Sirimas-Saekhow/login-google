"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductDraft, ProductDraftSchema, Product } from "@/lib/products";

interface ProductFormProps {
  editing?: Product | null;
  onSave: (values: ProductDraft) => void;
  onCancel?: () => void;
}

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<any>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title || editing.name || "",
          price: editing.price,
          stock: editing.stock,
          category: editing.category || "",
          description: editing.description || "",
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
          category: "",
          description: "",
        },
  });

  function saveProduct(values: any) {
    onSave(values as ProductDraft);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(saveProduct)}
      noValidate
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8"
    >
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            editing ? "bg-amber-500" : "bg-emerald-500"
          }`}
        ></span>
        {editing ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            ชื่อสินค้า
          </label>
          <input
            {...register("title")}
            type="text"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="เช่น Mechanical Keyboard"
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1">{String(errors.title.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            หมวดหมู่
          </label>
          <input
            {...register("category")}
            type="text"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="เช่น Electronics"
          />
          {errors.category && (
            <p className="text-xs text-rose-500 mt-1">{String(errors.category.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            ราคา (บาท)
          </label>
          <input
            {...register("price")}
            type="number"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
          {errors.price && (
            <p className="text-xs text-rose-500 mt-1">{String(errors.price.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            จำนวนคงเหลือ
          </label>
          <input
            {...register("stock")}
            type="number"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-xs text-rose-500 mt-1">{String(errors.stock.message)}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            ยกเลิก
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
      </div>
    </form>
  );
}