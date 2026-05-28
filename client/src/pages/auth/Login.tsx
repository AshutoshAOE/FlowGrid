import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api/auth';
import { useAuthStore } from '../../store/authStore';
import { Truck, Route, Shield } from 'lucide-react';

/* ── inline keyframes injected once ── */
const animationStyles = `
@keyframes gridPulse {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.07; }
}
@keyframes floatParticle {
  0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-900px) translateX(60px); opacity: 0; }
}
@keyframes drawRoute {
  to { stroke-dashoffset: 0; }
}
@keyframes glowPulse {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(220,38,38,0.4)); }
  50%      { filter: drop-shadow(0 0 28px rgba(220,38,38,0.8)); }
}
@keyframes fadeSlideUp {
  0%   { opacity: 0; transform: translateY(32px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes scanLine {
  0%   { top: -4px; }
  100% { top: 100%; }
}
@keyframes borderGlow {
  0%, 100% { border-color: rgba(220,38,38,0.15); }
  50%      { border-color: rgba(220,38,38,0.45); }
}
@keyframes truckDrive {
  0%   { transform: translateX(-40px); opacity: 0; }
  15%  { opacity: 1; }
  100% { transform: translateX(280px); opacity: 0; }
}
@keyframes nodeBeacon {
  0%, 100% { r: 3; opacity: 0.6; }
  50%      { r: 6; opacity: 1; }
}
`;

/* ── floating particle data ── */
const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 14,
  duration: Math.random() * 10 + 12,
  opacity: Math.random() * 0.5 + 0.2,
}));

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      setAuth(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* inject keyframes */}
      <style>{animationStyles}</style>

      <div className="min-h-screen flex bg-[#070709] text-white overflow-hidden relative">

        {/* ──────────────────── GRID / NOISE BACKGROUND ──────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            animation: 'gridPulse 6s ease-in-out infinite',
          }}
        />
        {/* noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ──────────────────── LEFT PANEL ──────────────────── */}
        <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center px-12 overflow-hidden">

          {/* radial glow behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/[0.06] blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-red-500/[0.10] blur-[80px] pointer-events-none" />

          {/* floating particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-red-500"
              style={{
                left: `${p.left}%`,
                bottom: '-10px',
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animation: `floatParticle ${p.duration}s ${p.delay}s linear infinite`,
              }}
            />
          ))}

          {/* ── animated route SVG ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 700 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'glowPulse 4s ease-in-out infinite' }}
          >
            {/* route path 1 */}
            <path
              d="M 80 580 Q 200 500 260 380 T 420 220 T 600 120"
              stroke="rgba(220,38,38,0.3)"
              strokeWidth="1.5"
              strokeDasharray="1200"
              strokeDashoffset="1200"
              strokeLinecap="round"
              style={{ animation: 'drawRoute 4s 0.5s ease-out forwards' }}
            />
            {/* route path 2 */}
            <path
              d="M 50 400 Q 150 350 280 320 T 500 280 T 650 200"
              stroke="rgba(220,38,38,0.2)"
              strokeWidth="1"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              strokeLinecap="round"
              style={{ animation: 'drawRoute 5s 1s ease-out forwards' }}
            />
            {/* route path 3 */}
            <path
              d="M 100 650 Q 300 550 350 420 T 550 300 T 620 80"
              stroke="rgba(220,38,38,0.15)"
              strokeWidth="1"
              strokeDasharray="1100"
              strokeDashoffset="1100"
              strokeLinecap="round"
              style={{ animation: 'drawRoute 5.5s 1.5s ease-out forwards' }}
            />
            {/* node beacons */}
            {[
              [80, 580], [260, 380], [420, 220], [600, 120],
              [280, 320], [500, 280], [350, 420], [550, 300],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={3}
                fill="#dc2626"
                opacity={0.7}
                style={{ animation: `nodeBeacon 2.5s ${i * 0.3}s ease-in-out infinite` }}
              />
            ))}
          </svg>

          {/* ── animated truck silhouette ── */}
          <div className="absolute bottom-36 left-0 w-full pointer-events-none overflow-hidden">
            <div style={{ animation: 'truckDrive 8s 2s ease-in-out infinite' }}>
              <Truck className="w-8 h-8 text-red-500/60" />
            </div>
          </div>

          {/* ── LOGO + TAGLINE ── */}
          <div
            className="relative z-10 flex flex-col items-center text-center"
            style={{ animation: 'fadeSlideUp 1s 0.3s ease-out both' }}
          >
            {/* logo mark */}
            <div className="relative mb-8">
              <div className="absolute -inset-6 rounded-full bg-red-600/20 blur-2xl animate-pulse" />
              <div
                className="relative w-24 h-24 rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-600/20 to-transparent flex items-center justify-center backdrop-blur-sm"
                style={{ animation: 'borderGlow 3s ease-in-out infinite' }}
              >
                <Route className="w-12 h-12 text-red-500" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-red-400 bg-clip-text text-transparent">
                Flow
              </span>
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                Grid
              </span>
            </h1>

            <div className="mt-5 flex items-center gap-2 text-red-500/70">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-red-500/50" />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase">
                Logistics Command
              </span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-red-500/50" />
            </div>

            <p className="mt-8 text-2xl font-bold tracking-wide text-white/90">
              Command Your Logistics
            </p>
            <p className="mt-3 text-sm text-white/40 max-w-xs leading-relaxed">
              Real-time fleet intelligence · Route optimization · End-to-end supply chain visibility
            </p>

            {/* stat pills */}
            <div className="mt-10 flex gap-4">
              {[
                { icon: Truck, label: 'Fleet Tracking' },
                { icon: Route, label: 'Route Engine' },
                { icon: Shield, label: 'Secure Access' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm text-xs text-white/50"
                >
                  <Icon className="w-3.5 h-3.5 text-red-500/70" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* scanning line effect */}
          <div
            className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none"
            style={{ animation: 'scanLine 6s linear infinite' }}
          />
        </div>

        {/* ──────────────────── RIGHT PANEL — LOGIN FORM ──────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div
            className="w-full max-w-md"
            style={{ animation: 'fadeSlideUp 1s 0.6s ease-out both' }}
          >
            {/* mobile logo (shown on < lg) */}
            <div className="lg:hidden flex flex-col items-center mb-10">
              <div className="relative mb-4">
                <div className="absolute -inset-4 rounded-full bg-red-600/20 blur-xl animate-pulse" />
                <Route className="relative w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-white">Flow</span>
                <span className="text-red-500">Grid</span>
              </h1>
            </div>

            {/* ── glass card ── */}
            <div
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
              style={{ animation: 'borderGlow 4s ease-in-out infinite' }}
            >
              {/* top accent bar */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

              <div className="p-8 sm:p-10">
                {/* header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Sign In
                  </h2>
                  <p className="mt-1.5 text-sm text-white/40">
                    Access your logistics command center
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* error banner */}
                  {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-lg">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  {/* email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@flowgrid.io"
                        className="block w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 transition-all duration-300 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1),0_0_20px_rgba(220,38,38,0.05)]"
                      />
                    </div>
                  </div>

                  {/* password */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="block w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 transition-all duration-300 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1),0_0_20px_rgba(220,38,38,0.05)]"
                      />
                    </div>
                  </div>

                  {/* submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-600/30 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {/* shimmer on hover */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Secure Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* divider */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[11px] text-white/25 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* register link */}
                <p className="mt-6 text-center text-sm text-white/40">
                  New to FlowGrid?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-red-400 hover:text-red-300 transition-colors duration-200 underline underline-offset-4 decoration-red-500/30 hover:decoration-red-400/60"
                  >
                    Register your company
                  </Link>
                </p>
              </div>
            </div>

            {/* footer */}
            <p className="mt-8 text-center text-[11px] text-white/20 tracking-wide">
              © 2026 FlowGrid · Enterprise Logistics Platform
            </p>
          </div>
        </div>

        {/* vertical divider accent */}
        <div className="hidden lg:block absolute left-[55%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent z-10" />
      </div>
    </>
  );
}
