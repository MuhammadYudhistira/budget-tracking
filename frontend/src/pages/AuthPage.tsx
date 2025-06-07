'use client';
import { login, register } from '@/services/auth';
import LoadingSpinnerButton from '@/ui/LoadingSpinnerButton';
import Modal from '@/ui/Modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AuthPage = () => {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [showPassword, SetShowPassword] = useState(false);
  const termsCheckBoxRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    password: '',
  });

  const isLogin = type === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (!termsCheckBoxRef.current?.checked) {
          setErrors({ terms: 'Kamu Harus Mensetujui Terms & Privacy ' });
          return;
        }
        response = await register({
          ...formData,
          number: `+62${formData.number}`,
        });
      }

      console.log(response);
      const token = response?.data?.token;

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8 sm:p-12 min-h-[750px] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {isLogin ? 'Wellcome Back' : "Let's Sign Up To Get Started. !"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left inset-y-0 flex items-center justify-center pl-3 pt-1 text-gray-500 text-sm">
                      +62
                    </div>
                    <input
                      type="text"
                      placeholder="8xxxx"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      className="pl-12 w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="*********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 cursor-pointer"
                  onClick={() => SetShowPassword(!showPassword)}
                  >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm mt-1">{errors.general}</p>
            )}

            {!isLogin && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="size-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  ref={termsCheckBoxRef}
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline ml-1 font-medium"
                    onClick={() => setShowModal(!showModal)}>
                    Terms & Privacy Policy
                  </button>
                </label>
              </div>
            )}
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 text-white font-medium text-sm ${
                !loading
                  ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                  : 'bg-indigo-400 hover:bg-indigo-700 cursor-not-allowed'
              } }`}>
              {loading ? (
                <>
                  <LoadingSpinnerButton />
                  Processing...
                </>
              ) : isLogin ? (
                "Let's Explore"
              ) : (
                'Get Started'
              )}
            </button>

            <p className="mt-6 text-sm text-center text-gray-600">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setType('register')}
                    className="text-indigo-600 hover:underline font-medium cursor-pointer">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setType('login')}
                    className="text-indigo-600 hover:underline font-medium cursor-pointer">
                    Sign In
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        <div className="hidden md:block bg-indigo-600 relative min-h[750px] w-full">
          <Image
            src={'/images/auth-img.png'}
            alt="Auth Images"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {showModal && (
        <Modal
          type="information"
          message="By using this application, you agree to our Terms and Privacy Policy. We may collect usage data to improve your experience. We do not share your data with third parties without your consent. For full details, visit our legal page."
          onOk={() => {
            setShowModal(false);
            if (termsCheckBoxRef.current)
              termsCheckBoxRef.current.checked = true;
          }}
          onCancel={() => {
            setShowModal(false);
            if (termsCheckBoxRef.current)
              termsCheckBoxRef.current.checked = false;
          }}
        />
      )}
    </div>
  );
};

export default AuthPage;
