import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-stone-800 bg-stone-950/75 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-bold text-stone-100 text-lg tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500 text-sm text-stone-950 shadow-sm shadow-amber-950/50">✓</span>
          TaskFlow
        </span>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-400 hidden sm:inline">Hi, {user.name}</span>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}