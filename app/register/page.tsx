import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#13111C] px-4">
      <AuthCard
        title="Buat Meemo kamu"
        subtitle="Mulai nulis jurnal privat kamu hari ini."
      >
        <AuthForm type="register" />
      </AuthCard>
    </main>
  );
}