import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#13111C] px-4">
      <AuthCard
        title="Selamat datang lagi 👋"
        subtitle="Lanjut nulis isi kepala kamu."
      >
        <AuthForm type="login" />
      </AuthCard>
    </main>
  );
}