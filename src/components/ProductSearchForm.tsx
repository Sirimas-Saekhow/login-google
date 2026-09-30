"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form 
      onSubmit={handleSubmit(onSearch)} 
      noValidate 
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4 items-end"
    >
      <div className="flex-1 min-w-[180px]">
        <label htmlFor="q" className="block text-xs font-semibold text-slate-600 mb-1">คำค้นหา</label>
        <input 
          id="q" 
          {...register("q")} 
          placeholder="เช่น phone, laptop..." 
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />
      </div>

      <div className="w-28">
        <label htmlFor="limit" className="block text-xs font-semibold text-slate-600 mb-1">จำนวนรายการ</label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />
        {errors.limit && (
          <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.limit?.message}</span>
        )}
      </div>

      <div className="w-36">
        <label htmlFor="sortBy" className="block text-xs font-semibold text-slate-600 mb-1">เรียงตาม</label>
        <select 
          id="sortBy" 
          {...register("sortBy")}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition disabled:opacity-50"
      >
        {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}