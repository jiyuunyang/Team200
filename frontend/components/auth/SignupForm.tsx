'use client';

import Condition from '@/components/auth/Condition';
import Input from '@/components/auth/Input';
import { signup } from '@/lib/service/auth';
import { useForm, SubmitHandler } from 'react-hook-form';

export type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string; // 실제 Backend로 가지 않음
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormInputs>({
    mode: 'onChange', // 실시간 검증을 위해 추가
  });
  const password = watch('password', '');

  // 조건 체크 로직 (하나의 폼에서 파생됨)
  const isLongEnough = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    // Next.js API Route에서 accessToken 쿠키를 HttpOnly로 설정
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('회원가입 오류');
    }
  };

  return (
    <div className='space-y-8'>
      {/* 헤더 */}
      <div className='text-center space-y-3'>
        <div className='mx-auto w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center'>
          ⚡
        </div>
        <h1 className='text-2xl font-bold'>배터리 데이터의 혁신</h1>
        <p className='text-sm text-gray-400'>
          실시간 배터리 상태 진단 및 수명 예측 서비스를 시작하세요.
        </p>
      </div>

      {/* 폼 */}
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name', {
            required: '이름은 필수 입력 항목입니다',
          })}
          label='이름'
          placeholder='이름을 입력하세요'
        />
        {errors.name && (
          <p className='text-xs text-red-500 mt-1'>{errors.name.message}</p>
        )}
        <Input
          {...register('email', {
            required: '이메일은 필수 입력 항목입니다',
            pattern: {
              // 일반적인 이메일 형식 검증 패턴
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '유효한 이메일 형식이 아닙니다.',
            },
          })}
          label='이메일'
          placeholder='example@email.com'
        />
        {errors.email && (
          <p className='text-xs text-red-500 mt-1'>{errors.email.message}</p>
        )}
        <Input
          {...register('password', {
            required: '이메일은 필수 입력 항목입니다',
            deps: ['passwordConfirm'],
            validate: () =>
              isLongEnough && hasNumber && hasSpecialChar && hasMixedCase,
          })}
          label='비밀번호'
          type='password'
        />
        {/* 비밀번호 조건 */}
        <div className='grid grid-cols-2 gap-2 text-xs text-gray-400'>
          <Condition checked={isLongEnough} text='8자 이상' />
          <Condition checked={hasNumber} text='숫자 포함' />
          <Condition checked={hasSpecialChar} text='특수문자 포함' />
          <Condition checked={hasMixedCase} text='대소문자 조합' />
        </div>
        {errors.password && (
          <p className='text-xs text-red-500 mt-1'>{errors.password.message}</p>
        )}
        <Input
          {...register('passwordConfirm', {
            required: '비밀번호 확인은 필수 입력 항목입니다.',
            validate: (value) =>
              value === password || '비밀번호가 일치하지 않습니다',
          })}
          label='비밀번호 확인'
          type='password'
        />
        {errors.passwordConfirm && (
          <p className='text-xs text-red-500 mt-1'>
            {errors.passwordConfirm.message}
          </p>
        )}
        <button
          className='w-full rounded-xl bg-green-400 py-4 font-semibold text-black cursor-pointer
          disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed'
          disabled={!isValid}
        >
          가입하기
        </button>
      </form>

      <p className='text-center text-sm text-gray-400'>
        이미 계정이 있으신가요?{' '}
        <a href='/login' className='text-green-400'>
          로그인
        </a>
      </p>
    </div>
  );
}
