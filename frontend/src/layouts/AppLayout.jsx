import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const AppLayout = () => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/resumes/') && location.pathname !== '/resumes/new';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isEditor ? (
          <div
            style={{
              padding: '16px 24px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '1920px',
              margin: '0 auto',
            }}
          >
            <Outlet />
          </div>
        ) : (
          <div
            className="container"
            style={{
              paddingTop: '28px',
              paddingBottom: '40px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </div>
        )}
      </main>
      {!isEditor && <Footer />}
    </div>
  );
};
