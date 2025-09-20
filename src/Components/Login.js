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

    if (mode === 'register') {
      try {
        const res = await fetch('https://product-backend-1-xfps.onrender.com/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullname: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phone,
            password: formData.password,
          }),
        });

        const data = await res.json();
        alert(data.message);
        if (data.message === 'the registration successful') {
          setMode('otp');
        }
      } catch {
        alert('Registration failed.');
      }
    } else if (mode === 'login') {
      try {
        const res = await fetch('https://product-backend-1-xfps.onrender.com/login', {
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
          alert(data.message || 'Login failed');
        }
      } catch {
        alert('Login failed.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://product-backend-1-xfps.onrender.com/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();
      alert(data.message);
      if (data.success) {
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
                : mode === 'register'
                ? 'Register'
                : 'Verify OTP'}
            </h2>

            {mode !== 'otp' ? (
              <form onSubmit={handleSubmit} className="loginpage-form">
                {mode === 'register' && (
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
                  {mode === 'register' ? 'Register' : 'Login'}
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
                {mode === 'register'
                  ? 'Already have an account?'
                  : "Don't have an account?"}{' '}
                <button
                  className="loginpage-link-button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                  }}
                >
                  {mode === 'register' ? 'Login' : 'Register'}
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
