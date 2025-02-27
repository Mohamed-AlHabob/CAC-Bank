import { supabase } from '@/lib/supabase';

const Login = () => {
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google', // or any other provider
    });
    if (error) console.error(error);
    else console.log('Logged in:', data);
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;