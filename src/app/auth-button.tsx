import { signIn, signOut } from "@/auth";

export type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          👤 {userName ?? "ผู้ใช้งาน"}
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs rounded-xl transition"
          >
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
      >
        Sign in with Google
      </button>
    </form>
  );
}

export default AuthButtons;