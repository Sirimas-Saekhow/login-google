import Link from "next/link";
import { auth } from "@/auth";
import { getProducts } from "@/lib/products";
import { AuthButtons } from "./auth-buttons";

export default async function HomePage() {
  const session = await auth();
  const products = getProducts();
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">📦 รายการสินค้า</h1>
            <p className="text-xs text-slate-500 mt-0.5">Google OAuth Authentication Demo</p>
          </div>
          <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
        </header>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <article
              key={product.id}
              data-testid="product"
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h2 className="text-base font-bold text-slate-800">{product.name}</h2>
                  <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    ฿{product.price.toLocaleString("th-TH")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{product.description}</p>
              </div>

              {isLoggedIn && (
                <div className="flex gap-2 justify-end pt-3 border-t border-slate-50">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg transition"
                  >
                    ✏️ แก้ไข
                  </Link>
                  <Link
                    href={`/products/${product.id}/delete`}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg transition"
                  >
                    🗑️ ลบ
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-100 text-sm">
            🛒 ไม่มีสินค้าในระบบ
          </div>
        )}
      </div>
    </main>
  );
}