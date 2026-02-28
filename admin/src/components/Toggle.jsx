// admin/src/components/Toggle.jsx
// Reusable toggle switch component

export default function Toggle({ value, onChange, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '44px',
          height: '24px',
          background: value ? '#C9A227' : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          padding: 0,
        }}
      >
        <div style={{
          width: '18px',
          height: '18px',
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: '3px',
          left: value ? '23px' : '3px',
          transition: 'left 0.2s',
        }} />
      </button>
      <span style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Arial, sans-serif',
      }}>
        {label}
      </span>
    </div>
  )
}
