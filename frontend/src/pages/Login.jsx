import {useState} from 'react';
import {useNavigate } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const {login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); 
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (mode === 'register' && !values.name.trim()) next.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email';
    if (values.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try{
      if(mode === 'login') {
        await login(values.email, values.password);
      }else {
        await register(values.name, values.email, values.password);
      }



      navigate('/tasks');
    } catch(err){
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally{
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-xl rounded-3xl border border-stone-800 bg-stone-900/85 p-8 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-lg font-bold text-stone-950 shadow-md shadow-amber-950/2000">✓</div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-100 mb-2">Welcome to TaskFlow</h1>
        <p className="text-sm text-stone-400 mb-6">
          {mode === 'login' ? 'Log in to manage your tasks' : 'Create an account to get started'}
        </p>

        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-950/40 p-5">
          <p className="text-base font-semibold text-stone-200">Plan less. Finish more.</p>
          <p className="mt-1 text-sm leading-6 text-stone-500">
            Keep your next step in sight and turn everyday tasks into steady progress.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input
              id="name"
              label="Name"
              value={values.name}
              error={errors.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={values.password}
            error={errors.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />

          {apiError && <p className="text-sm text-red-600 mb-4">{apiError}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </Button>
        </form>

        <button
          type="button"
          className="text-sm text-brand-600 hover:underline mt-4"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}