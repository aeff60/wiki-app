import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth.js';
import { useAuthStore } from '../../store/authStore.js';
import { Button } from '../ui/Button.jsx';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError('root', { message: err.response?.data?.error || 'Login failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{errors.root.message}</p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-sm text-center text-gray-600">
        No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </form>
  );
}
