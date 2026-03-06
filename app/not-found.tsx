import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#060810] flex flex-col items-center justify-center text-center px-4">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40 mb-8">
                    <Zap className="h-8 w-8 text-white" />
                </div>

                <h1
                    className="text-8xl font-black text-white leading-none tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    404
                </h1>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Page not found
                </h2>

                <p className="text-white/50 text-base max-w-md mx-auto mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-white text-indigo-900 font-bold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10 transition-all"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
