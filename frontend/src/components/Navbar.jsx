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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-brand-700 text-lg">TaskFlow</span>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user.name}</span>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
