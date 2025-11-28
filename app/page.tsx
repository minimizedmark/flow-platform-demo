'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://msgndopmirveeglrqzju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZ25kb3BtaXJ2ZWVnbHJxemp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzIzMDcsImV4cCI6MjA3OTg0ODMwN30.LP48XJM7NiJCArYi7DhwmhqSIbXN8WAIjo7rvQT0iE0';
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/00w3cv1xId2fc115QpeME02';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function LandingPage() {
  const [spotsRemaining, setSpotsRemaining] = useState(50);
  const [spotsFilled, setSpotsFilled] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [reserving, setReserving] = useState(false);

  const updateCounter = async () => {
    try {
      const { data, error } = await supabase
        .from('spot_counter')
        .select('current_count, max_count')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      setSpotsFilled(data.current_count);
      setSpotsRemaining(data.max_count - data.current_count);
      setLoading(false);
    } catch (error) {
      console.error('Error loading counter:', error);
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    const email = prompt('Enter your email:');
    if (!email || !email.includes('@')) {
      setMessage('❌ Valid email required.');
      return;
    }
    
    const name = prompt('Enter your full name:');
    if (!name || name.trim().length < 2) {
      setMessage('❌ Valid name required.');
      return;
    }
    
    const company = prompt('Company name (optional - press OK to skip):') || '';
    const phone = prompt('Phone number (optional - press OK to skip):') || '';
    
    setReserving(true);
    setMessage('🔄 Reserving your spot...');
    
    try {
      const { data, error } = await supabase.rpc('reserve_next_spot', {
        p_email: email.trim().toLowerCase(),
        p_name: name.trim(),
        p_company: company.trim() || null,
        p_phone: phone.trim() || null
      });
      
      if (error) throw error;
      
      const result = data[0];
      
      if (!result.success) {
        setMessage(`❌ ${result.message}`);
        setReserving(false);
        await updateCounter();
        return;
      }
      
      const memberNumber = result.member_number;
      setMessage(`✅ SUCCESS! You are Founding Member #${memberNumber} of 50. Redirecting to payment...`);
      
      setTimeout(() => {
        window.location.href = `${STRIPE_PAYMENT_LINK}?client_reference_id=${memberNumber}&prefilled_email=${encodeURIComponent(email)}`;
      }, 2000);
      
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}. Please text (587) 402-8264`);
      setReserving(false);
    }
  };

  useEffect(() => {
    updateCounter();
    const interval = setInterval(updateCounter, 15000);
    
    const channel = supabase
      .channel('spot_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'spot_counter' },
        () => updateCounter()
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ margin: 0, fontFamily: "'Segoe UI', sans-serif", background: '#0a192f', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        
        <header style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '48px', margin: 0, color: '#00d4ff', fontWeight: 900 }}>HVACflow</h1>
          <p style={{ fontSize: '22px', color: '#94a3b8', margin: '20px 0' }}>
            Only 50 Alberta contractors will EVER lock in $1,495/year for life
          </p>
          <p style={{ fontSize: '18px', maxWidth: '700px', margin: '20px auto' }}>
            Built by Mark – Former Alberta HVAC tech who got sick of hearing his boss complain about $600/month software that didn't work for small shops.
          </p>
        </header>

        <h2 style={{ color: '#00d4ff', textAlign: 'center', marginTop: '60px' }}>
          🔴 LIVE DEMO (Updates Every 3 Seconds)
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '20px' }}>
          Click "GPS Tracking" in the sidebar to see real-time trucks on actual Edmonton streets
        </p>
        <div style={{ width: '100%', height: '700px', border: '3px solid #00d4ff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,212,255,0.3)', margin: '40px 0' }}>
          <iframe src="/demo" style={{ width: '100%', height: '100%', border: 'none' }} />
        </div>

        <div style={{ background: '#001528', padding: '40px', borderRadius: '16px', border: '2px solid #00d4ff', margin: '40px 0' }}>
          <h2 style={{ color: '#00d4ff', textAlign: 'center', marginTop: 0 }}>✅ Live Today (Working Demo Above)</h2>
          <ul style={{ maxWidth: '600px', margin: '20px auto', lineHeight: 2 }}>
            <li><strong>Real-time GPS tracking</strong> on actual Edmonton streets</li>
            <li><strong>Magic-link login</strong> – no passwords, works with greasy gloves</li>
            <li><strong>Smart AI scheduling</strong> & route optimization</li>
            <li><strong>Automatic invoice generation</strong> from tech notes</li>
            <li><strong>Refrigerant tracking</strong> + one-click EPA reports</li>
            <li><strong>Customer management</strong> with full history</li>
          </ul>
          
          <h2 style={{ color: '#00d4ff', textAlign: 'center', marginTop: '40px' }}>🚀 Launching April 2026</h2>
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>(4 months after we hit 50 founding members)</p>
          <ul style={{ maxWidth: '600px', margin: '20px auto', lineHeight: 2 }}>
            <li><strong>AI diagnostics</strong> from equipment photos (saves 20-30 min/call)</li>
            <li><strong>Mobile apps</strong> (iOS & Android native)</li>
            <li><strong>Advanced reporting</strong> & analytics</li>
            <li><strong>QuickBooks integration</strong></li>
          </ul>
        </div>

        <div style={{ background: '#001528', padding: '40px', borderRadius: '16px', border: '2px solid #00d4ff', margin: '40px 0' }}>
          <h2 style={{ color: '#00d4ff', textAlign: 'center', marginTop: 0 }}>🏆 Founding Member Benefits (First 50 Only)</h2>
          <ul style={{ maxWidth: '600px', margin: '20px auto', lineHeight: 2 }}>
            <li><strong>Locked pricing forever:</strong> $1,495/year (max 7% annual increase)</li>
            <li><strong>AI diagnostics included FREE</strong> (worth $500/year)</li>
            <li><strong>Annual founder's dinner</strong> at BUILDEX Calgary (starting Oct 2027)</li>
            <li><strong>Alberta contractor network</strong> (50 members helping each other)</li>
            <li><strong>Private Slack channel</strong> + monthly video calls</li>
            <li><strong>Direct SMS line to founder:</strong> (587) 402-8264</li>
            <li><strong>Priority feature requests</strong> (you shape what gets built)</li>
            <li><strong>Beta access</strong> 2 weeks before launch</li>
            <li><strong>Founding member badge</strong> (digital + physical)</li>
          </ul>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #001528 0%, #002040 100%)', padding: '50px', borderRadius: '16px', border: '3px solid #00d4ff', textAlign: 'center', margin: '40px 0', boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}>
          <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Founding Member Price – Only 50 Spots Ever</h2>
          <p style={{ fontSize: '62px', color: '#00d4ff', fontWeight: 900, margin: '10px 0' }}>$1,495/year</p>
          <p style={{ fontSize: '24px', color: '#94a3b8', marginTop: '10px' }}>locked for life (max 7% annual increase)</p>
          <p style={{ fontSize: '20px', margin: '20px 0' }}>
            Regular price after these 50 → <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '28px' }}>$2,990/year</span>
          </p>
          
          <p style={{ fontSize: '28px', color: '#ff4757', fontWeight: 'bold', margin: '30px 0' }}>
            {loading ? (
              <span style={{ color: '#00d4ff' }}>Loading spots...</span>
            ) : spotsRemaining > 0 ? (
              <>
                <strong>{spotsRemaining} of 50 spots remaining</strong>
                <br />
                <span style={{ fontSize: '20px', color: '#94a3b8' }}>({spotsFilled} already claimed)</span>
              </>
            ) : (
              <>
                <span style={{ color: '#ff4757' }}>ALL 50 SPOTS FILLED!</span>
                <br />
                <span style={{ fontSize: '20px', color: '#64748b' }}>Regular pricing: $2,990/year</span>
              </>
            )}
          </p>
          
          <p style={{ color: '#94a3b8', fontSize: '18px', margin: '30px 0' }}>
            Your savings: <strong style={{ color: '#00d4ff' }}>$1,495/year, every year, forever</strong>
          </p>
          
          <button
            onClick={handleReserve}
            disabled={spotsRemaining === 0 || reserving}
            style={{
              background: spotsRemaining === 0 || reserving ? '#64748b' : '#00d4ff',
              color: '#0a192f',
              fontWeight: 'bold',
              fontSize: '24px',
              padding: '18px 50px',
              borderRadius: '12px',
              border: 'none',
              cursor: spotsRemaining === 0 || reserving ? 'not-allowed' : 'pointer',
              margin: '20px 0',
              transition: 'all 0.3s'
            }}
          >
            {spotsRemaining === 0 ? 'ALL SPOTS FILLED' : reserving ? 'Reserving...' : 'Reserve My Spot – $1,495/year'}
          </button>
          
          {message && (
            <div style={{ marginTop: '20px', fontSize: '18px', minHeight: '30px', color: message.includes('✅') ? '#00d4ff' : '#ff4757' }}>
              {message}
            </div>
          )}
          
          <p style={{ marginTop: '30px', fontSize: '18px', color: '#94a3b8' }}>Built for 1-5 truck Alberta HVAC operations</p>
          <p style={{ marginTop: '30px', fontSize: '16px', color: '#64748b' }}><strong>Guarantee:</strong> Full refund if not live in 6 months</p>
        </div>

        <div style={{ background: '#001528', padding: '40px', borderRadius: '16px', border: '2px solid #00d4ff', textAlign: 'center', margin: '40px 0' }}>
          <h2 style={{ color: '#00d4ff', marginTop: 0 }}>I'm Not Here for Free Advice</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.8, maxWidth: '700px', margin: '20px auto' }}>
            I'm not some guy looking for free advice or feedback just so I can gouge the shit out of you later.
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.8, maxWidth: '700px', margin: '20px auto' }}>
            That's the Silicon Valley playbook: <em>"Help us build it! By the way, it's $400/month now."</em>
          </p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#00d4ff', margin: '30px auto' }}>Screw that.</p>
          <p style={{ fontSize: '18px', lineHeight: 1.8, maxWidth: '700px', margin: '20px auto' }}>
            Here's my deal: <strong>$1,495/year locked</strong> if you're in the first 50. <strong>$2,990/year</strong> for everyone else.
          </p>
          <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff4757', margin: '30px auto' }}>
            After 50 spots are gone, the $1,495/year price is gone forever.
          </p>
        </div>

        <footer style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Questions?</p>
          <p style={{ fontSize: '20px' }}>
            <strong>Text:</strong> <a href="sms:+15874028264" style={{ color: '#00d4ff', textDecoration: 'none' }}>(587) 402-8264</a>
          </p>
          <p style={{ fontSize: '20px' }}>
            <strong>Email:</strong> <a href="mailto:mark@smartbizai.store" style={{ color: '#00d4ff', textDecoration: 'none' }}>mark@smartbizai.store</a>
          </p>
          <p style={{ marginTop: '30px', fontSize: '14px' }}>HVACflow © 2025 | Alberta, Canada</p>
        </footer>

      </div>
    </div>
  );
}
