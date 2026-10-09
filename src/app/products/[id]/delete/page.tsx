import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({ params }: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
          🗑️
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">ยืนยันการลบสินค้า</h1>
        <p className="text-sm text-slate-500 mb-6">
          คุณต้องการลบสินค้า <span className="font-semibold text-slate-800">"{product.name}"</span> หรือไม่?
        </p>

        <div className="flex gap-2 justify-center">
          <Link
            href="/"
            className="px-4 py-2 border border-slate-200 text-slate-600 font-medium text-xs rounded-lg hover:bg-slate-50 transition"
          >
            ยกเลิก
          </Link>
          <form action={deleteAction}>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg shadow-sm transition"
            >
              ยืนยันการลบ
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}