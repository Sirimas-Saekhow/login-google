import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct, updateProduct } from "@/lib/products";

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

  async function handleSubmit(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));

    updateProduct(id, { title, price });
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
          ✏️ แก้ไขสินค้า
        </h1>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-600 mb-1">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={product.title ?? product.name}
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-slate-600 mb-1">
              ราคา
            </label>
            <input
              type="number"
              id="price"
              name="price"
              defaultValue={product.price}
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}