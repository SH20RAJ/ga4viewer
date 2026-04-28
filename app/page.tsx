import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/auth/SignInButton";
import { BarChart3, Globe, Zap, Shield } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-blue-400" />
          <span className="text-xl font-bold text-white">Simple GA Viewer</span>
        </div>
        <SignInButton />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Your GA4 Analytics,{" "}
            <span className="text-blue-400">Simplified</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Connect your Google Analytics 4 property and get a clean, fast dashboard with AI-powered insights.
          </p>
          <SignInButton large />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {[
            { icon: Globe, title: "Real-time Data", desc: "See your analytics data updated in real-time from GA4." },
            { icon: Zap, title: "AI Insights", desc: "Get actionable insights powered by AI analysis of your data." },
            { icon: Shield, title: "Secure & Private", desc: "Read-only access. Your data never leaves your account." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-left">
              <Icon className="h-8 w-8 text-blue-400 mb-3" />
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
