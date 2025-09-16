import React, { useState } from 'react';
import './Login.css'; // make sure the filename matches

function Login() {
  const [mode, setMode] = useState('login'); // login, register, otp, profile

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [otp, setOtp] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      try {
        const res = await fetch('https://product-report-bk.onrender.com/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,   // ✅ match backend
            email: formData.email,
            phone: formData.phone,     // ✅ match backend
            password: formData.password,
          }),
        });

        const data = await res.json();
        alert(data.msg);
        if (res.ok) {
          setMode('otp');
        }
      } catch {
        alert('Signup failed.');
      }
    } else if (mode === 'login') {
      try {
        const res = await fetch('https://product-report-bk.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          alert('Login successful');
          setMode('profile');
        } else {
          alert(data.msg || 'Login failed');
        }
      } catch {
        alert('Login failed.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://product-report-bk.onrender.com/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();
      alert(data.msg);
      if (res.ok) {
        setMode('login');
        setFormData({ fullName: '', email: '', phone: '', password: '' });
        setOtp('');
      }
    } catch {
      alert('OTP verification failed.');
    }
  };

  return (
    <div className='loginpage-container'>
      <div className="loginpage-box">
        {mode === 'profile' ? (
          <div className="loginpage-profile">
            <h2>Welcome, {formData.email}!</h2>
            <p>You are now logged in to your profile.</p>
            <button onClick={() => setMode('login')}>Logout</button>
          </div>
        ) : (
          <>
            <h2>
              {mode === 'login'
                ? 'Login'
                : mode === 'signup'
                ? 'Signup'
                : 'Verify OTP'}
            </h2>

            {mode !== 'otp' ? (
              <form onSubmit={handleSubmit} className="loginpage-form">
                {mode === 'signup' && (
                  <>
                    <input
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="submit">
                  {mode === 'signup' ? 'Signup' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="loginpage-form">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button type="submit">Verify OTP</button>
              </form>
            )}

            {mode !== 'otp' && (
              <p className="loginpage-toggle">
                {mode === 'signup'
                  ? 'Already have an account?'
                  : "Don't have an account?"}{' '}
                <button
                  className="loginpage-link-button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                  }}
                >
                  {mode === 'signup' ? 'Login' : 'Signup'}
                </button>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
