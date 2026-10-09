"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateProduct, deleteProduct } from "@/lib/products";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireUser();

  const title = String(formData.get("name") ?? formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!title || !description) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  updateProduct(id, {
    title,
    description,
    price,
  });

  revalidatePath("/");
  redirect("/");
}

export async function deleteProductAction(id: string) {
  await requireUser();
  deleteProduct(id);
  revalidatePath("/");
  redirect("/");
}