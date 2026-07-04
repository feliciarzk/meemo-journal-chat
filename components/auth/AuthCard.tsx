export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#1D1A2B] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="mb-6 flex flex-col gap-1.5 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl italic text-white">
          {title}
        </h1>
        <p className="text-sm text-white/45">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}