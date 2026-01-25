"use client";

import Condition from "@/components/auth/Condition";
import Input from "@/components/auth/Input";
import { useForm, SubmitHandler } from "react-hook-form";

export type SignupFormInputs = {
	name: string;
	email: string;
	password: string;
};

export default function SignupForm() {
	const { register, handleSubmit } = useForm<SignupFormInputs>();

	const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
		// Next.js API Route에서 accessToken 쿠키를 HttpOnly로 설정
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const result = await res.json();
			if (result.success) {
				alert("회원가입 성공! 로그인 페이지로 이동합니다.");
				window.location.href = "/login";
			} else {
				alert(result.message);
			}
		} catch (err) {
			console.error(err);
			alert("회원가입 오류");
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
					{...register("name")}
					label='이름'
					placeholder='이름을 입력하세요'
				/>
				<Input
					{...register("email")}
					label='이메일'
					placeholder='example@email.com'
				/>
				<Input {...register("password")} label='비밀번호' type='password' />

				{/* 비밀번호 조건 */}
				<div className='grid grid-cols-2 gap-2 text-xs text-gray-400'>
					<Condition checked text='8자 이상' />
					<Condition text='숫자 포함' />
					<Condition text='특수문자 포함' />
					<Condition text='대소문자 조합' />
				</div>

				<button className='w-full rounded-xl bg-green-400 py-4 font-semibold text-black'>
					가입하기
				</button>
			</form>

			<p className='text-center text-sm text-gray-400'>
				이미 계정이 있으신가요?{" "}
				<a href='/login' className='text-green-400'>
					로그인
				</a>
			</p>
		</div>
	);
}
