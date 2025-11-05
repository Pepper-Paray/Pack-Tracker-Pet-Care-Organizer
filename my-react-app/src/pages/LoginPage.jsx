import { useState } from 'react';
import { supabase } from '../config/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const LoginPage = () => {
  const [session, setSession] = useState(null);

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      setSession(session);
      // Save user details to local storage
      localStorage.setItem('user', JSON.stringify(session.user));
    } else if (event === 'SIGNED_OUT') {
      setSession(null);
      localStorage.removeItem('user');
    }
  });

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              {!session ? (
                <Auth
                  supabaseClient={supabase}
                  appearance={{ theme: ThemeSupa }}
                  providers={['google', 'github']}
                />
              ) : (
                <div className="text-center">
                  <p>Welcome, {session.user.email}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;