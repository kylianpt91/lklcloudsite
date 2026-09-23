interface BackgroundGradientProps {
  className?: string
}

export default function BackgroundGradient({
  className = '',
}: BackgroundGradientProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Orange circle */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'rgb(248, 129, 79)',
          top: '-10%',
          right: '-5%',
          animation: 'bg-float-1 20s ease-in-out infinite',
        }}
      />

      {/* Rose pale circle */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'rgb(220, 213, 215)',
          bottom: '-15%',
          left: '-10%',
          animation: 'bg-float-2 25s ease-in-out infinite',
        }}
      />

      {/* Green pale circle */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'rgb(243, 255, 219)',
          top: '40%',
          left: '30%',
          animation: 'bg-float-3 30s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes bg-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes bg-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes bg-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 20px) scale(1.03); }
          66% { transform: translate(-30px, -30px) scale(0.96); }
        }
      `}</style>
    </div>
  )
}
