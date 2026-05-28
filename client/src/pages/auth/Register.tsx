import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api/auth';
import { useAuthStore } from '../../store/authStore';
import { Activity, Building2, Users, Shield, Mail, Lock, ArrowRight, User } from 'lucide-react';

/* ─── animated network‑node background (SVG) ─── */
function NetworkGrid() {
  const [nodes] = useState(() => {
    const pts: { x: number; y: number; delay: number; size: number }[] = [];
    for (let i = 0; i < 28; i++) {
      pts.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        size: 2 + Math.random() * 3,
      });
    }
    return pts;
  });

  const [edges] = useState(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          lines.push({
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
            delay: Math.random() * 4,
          });
        }
      }
    }
    return lines;
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* edges */}
      {edges.map((e, i) => (
        <line
          key={`e-${i}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke="#ef4444"
          strokeWidth="0.15"
          strokeOpacity="0.25"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.08;0.35;0.08"
            dur={`${3 + e.delay}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* nodes */}
      {nodes.map((n, i) => (
        <g key={`n-${i}`}>
          <circle cx={n.x} cy={n.y} r={n.size * 1.8} fill="url(#nodeGlow)" opacity="0.25">
            <animate
              attributeName="opacity"
              values="0.1;0.35;0.1"
              dur={`${3 + n.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={n.x} cy={n.y} r={n.size * 0.45} fill="#ef4444">
            <animate
              attributeName="r"
              values={`${n.size * 0.35};${n.size * 0.55};${n.size * 0.35}`}
              dur={`${3 + n.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur={`${3 + n.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ─── hexagonal grid overlay ─── */
function HexGrid() {
  const hexagons: { cx: number; cy: number; delay: number }[] = [];
  const size = 14;
  const h = size * Math.sqrt(3);
  for (let row = -1; row < 8; row++) {
    for (let col = -1; col < 6; col++) {
      const x = col * size * 1.5;
      const y = row * h + (col % 2 === 1 ? h / 2 : 0);
      hexagons.push({ cx: x, cy: y, delay: Math.random() * 6 });
    }
  }

  const hexPath = (cx: number, cy: number) => {
    const r = size * 0.48;
    const pts = [];
    for (let a = 0; a < 6; a++) {
      const angle = (Math.PI / 3) * a - Math.PI / 6;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return `M${pts.join('L')}Z`;
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      viewBox="-10 -10 90 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {hexagons.map((h, i) => (
        <path
          key={i}
          d={hexPath(h.cx, h.cy)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.3"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.2;0.8;0.2"
            dur={`${4 + h.delay}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}

/* ─── floating stat badge ─── */
function StatBadge({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-black/40 backdrop-blur-md px-4 py-3
                 animate-[fadeSlideUp_0.8s_ease-out_both]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20">
        <Icon className="w-4 h-4 text-red-400" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-red-400/70">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REGISTER PAGE
   ═══════════════════════════════════════════════════ */
export function Register() {
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      setAuth(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* entrance animation flag */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* ─── inline keyframes (injected once) ─── */
  useEffect(() => {
    const id = 'fg-register-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 15px 0 rgba(239,68,68,0.15); }
        50%      { box-shadow: 0 0 30px 4px rgba(239,68,68,0.25); }
      }
      @keyframes scanLine {
        0%   { top: -4px; }
        100% { top: 100%; }
      }
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50%      { transform: translateY(-18px) scale(1.08); }
      }
      @keyframes spinSlow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const inputBase =
    'block w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 ' +
    'transition-all duration-300 ' +
    'focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 focus:bg-white/[0.06]';

  return (
    <div className="min-h-screen flex bg-[#070709] text-white overflow-hidden">
      {/* ═══ LEFT PANEL ═══ */}
      <div
        className={`hidden lg:flex lg:w-[48%] relative flex-col justify-between p-10 overflow-hidden
                    transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0a10] via-[#0f0812] to-[#12080a]" />
        <HexGrid />
        <NetworkGrid />

        {/* scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
            style={{ animation: 'scanLine 6s linear infinite' }}
          />
        </div>

        {/* radial red flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/[0.04] blur-[120px] pointer-events-none" />

        {/* top — logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30"
              style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Flow<span className="text-red-500">Grid</span>
            </span>
          </div>
        </div>

        {/* centre — tagline */}
        <div className="relative z-10 flex flex-col items-start gap-6 -mt-8">
          <div
            className="animate-[fadeSlideUp_0.9s_ease-out_both]"
            style={{ animationDelay: '0.2s' }}
          >
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              Build Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
                Fleet Empire
              </span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-400 max-w-sm">
              Register your organisation and unlock real-time fleet
              intelligence, route optimisation, and enterprise logistics
              controls — all in one command centre.
            </p>
          </div>

          {/* stat badges */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <StatBadge icon={Building2} label="Companies" value="2,400+ Onboarded" delay="0.5s" />
            <StatBadge icon={Users} label="Fleet Operators" value="18,000+ Active" delay="0.7s" />
            <StatBadge icon={Shield} label="Uptime SLA" value="99.97% Guaranteed" delay="0.9s" />
          </div>
        </div>

        {/* bottom — decorative orb */}
        <div className="relative z-10 flex items-center gap-3 text-[11px] text-gray-600 uppercase tracking-widest">
          <div
            className="w-2 h-2 rounded-full bg-red-500"
            style={{ animation: 'orbFloat 4s ease-in-out infinite' }}
          />
          Enterprise-Grade Logistics Platform
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10 relative">
        {/* faint grid bg */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* floating orb */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-red-500/[0.06] blur-[100px] pointer-events-none"
          style={{ animation: 'orbFloat 7s ease-in-out infinite' }}
        />

        <div
          className={`relative z-10 w-full max-w-md transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Flow<span className="text-red-500">Grid</span>
            </span>
          </div>

          {/* header text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Register your company and start managing your fleet today
            </p>
          </div>

          {/* ─── glassmorphic card ─── */}
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl"
            style={{ animation: 'pulseGlow 4s ease-in-out infinite' }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* error */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Company Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    name="companyName"
                    type="text"
                    required
                    placeholder="Acme Logistics Inc."
                    value={formData.companyName}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Admin Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="admin@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-2 rounded-xl
                           bg-gradient-to-r from-red-600 to-red-500 px-6 py-3.5 text-sm font-semibold text-white
                           shadow-lg shadow-red-500/25
                           transition-all duration-300
                           hover:shadow-red-500/40 hover:scale-[1.01]
                           active:scale-[0.99]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Company Account
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}

                {/* button shine sweep */}
                <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <span
                    className="absolute top-0 -left-[75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]
                               transition-all duration-700 group-hover:left-[125%]"
                  />
                </span>
              </button>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-gray-600 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* link to login */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* footer note */}
          <p className="mt-6 text-center text-[11px] text-gray-600">
            By registering you agree to our{' '}
            <span className="text-gray-400 hover:text-red-400 cursor-pointer transition-colors">Terms</span> &{' '}
            <span className="text-gray-400 hover:text-red-400 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
