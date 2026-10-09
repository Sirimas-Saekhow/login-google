import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
          ✏️ แก้ไขสินค้า
        </h1>

        <form action={updateAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-1">
              ชื่อสินค้า
            </label>
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-slate-600 mb-1">
              ราคา (บาท)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.price}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-600 mb-1">
              รายละเอียด
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              required
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3">
            <Link
              href="/"
              className="px-4 py-2 border border-slate-200 text-slate-600 font-medium text-xs rounded-lg hover:bg-slate-50 transition"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-sm transition"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}