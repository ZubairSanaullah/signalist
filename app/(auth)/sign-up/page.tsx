'use client'

import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { signInWithEmail, signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    country: string;
    investmentGoal: string;
    riskTolerance: string;
    preferredIndustry: string;
};

const SignUp = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoal: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology',
        },
        mode: 'onBlur'
    }, );

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if(result.success) router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Sign up failed', {
                description: e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.'
            })
        }
    }

  return (
    <>
        <h1 className='form-title'>Sign Up & Personalize</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <InputField
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                register={register}
                error={errors.fullName}
                validation={{ required: 'Full Name is required', minLength: 2 }}
            />

            <InputField
                name="email"
                label="Email"
                placeholder="example@example.com"
                type="email"
                register={register}
                error={errors.email}
                validation={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
            />

            <InputField
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
                register={register}
                error={errors.password}
                validation={{ required: 'Password is required', minLength: 6 }}
            />

            <CountrySelectField
                name="country"
                label="Country"
                control={control}
                error={errors.country}
                required
            />

            <SelectField
                name='investmentGoal'
                label='Investment Goals'
                placeholder='Select your investment goals'
                options={INVESTMENT_GOALS}
                control={control}
                error={errors.investmentGoal}
                required
            />

            <SelectField
                name='riskTolerance'
                label='Risk Tolerance'
                placeholder='Select your risk tolerance'
                options={RISK_TOLERANCE_OPTIONS}
                control={control}
                error={errors.riskTolerance}
                required
            />

            <SelectField
                name='preferredIndustry'
                label='Preferred Industry'
                placeholder='Select your preferred industry'
                options={PREFERRED_INDUSTRIES}
                control={control}
                error={errors.preferredIndustry}
                required
            />

            <Button type="submit" disabled={isSubmitting} className='yellow-btn w-full mt-5'>
                {isSubmitting ? 'Creating Account...' : 'Start Your Trading Journey'}
            </Button>

            <FooterLink
                text="Already have an account?"
                linkText="Sign in"
                href="/sign-in"
            />
        </form>
    </>
  )
}

export default SignUp