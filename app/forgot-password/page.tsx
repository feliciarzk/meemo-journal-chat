import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#13111C] px-4">
      <AuthCard
        title="Reset kata sandi"
        subtitle="Masukin email kamu, kita kirim link buat bikin kata sandi baru."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </main>
  );
}