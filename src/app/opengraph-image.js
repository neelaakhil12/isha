import { ImageResponse } from 'next/og';

export const alt = 'Isha Software Solutions | Premium Email Marketing & SMTP Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #0f172a, #1e1b4b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '50px 80px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Logo / Brand Name */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              background: 'linear-gradient(to right, #a78bfa, #f472b6)',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            Isha Software Solutions
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#cbd5e1',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: '1.4',
              marginBottom: '40px',
            }}
          >
            Premium Email Marketing & SMTP Delivery Platform
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '15px' }}>
            {['SMTP Relay', 'Bulk Campaigns', 'Transactional API', 'Lead Extractor'].map((badge) => (
              <div
                key={badge}
                style={{
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '12px',
                  padding: '8px 20px',
                  color: '#e9d5ff',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
