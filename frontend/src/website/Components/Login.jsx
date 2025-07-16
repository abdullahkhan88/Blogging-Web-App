import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/Authentication/AuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaRegUserCircle} from 'react-icons/fa';


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, username } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (username) {
      navigate("/");
    }
  }, [username, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
        <div className="w-full max-w-md rounded-2xl bg-blue-50 p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto h-12 w-12">
             <FaRegUserCircle size={55} className='text-blue-300'/>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-blue-500 mt-2">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder='Enter Your Email'
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-indigo-500 focus:ring-indigo-700 outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder='******'
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-indigo-500 focus:ring-indigo-700 outline-none"
              />
            </div>

            <div className="text-right text-sm">
              <Link to="#" className="text-indigo-600 hover:underline">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?
            <Link to="/Register" className="ml-1 font-medium text-indigo-600 hover:underline">
              Create One
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
