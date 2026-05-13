'use server'

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

type SignUpEmailData = {
    email: string;
    password: string;
    fullName: string;
    country: string;
    investmentGoal: string;
    riskTolerance: string;
    preferredIndustry: string;
};

export const signUpWithEmail = async ({email, password, fullName, country, investmentGoal, riskTolerance, preferredIndustry}: SignUpEmailData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName  }
        })

        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoal,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }

        return { success: true, data: response };
    } catch (e) {
        console.log('Error signing up:', e);
        return { success: false, error: 'Failed to sign up. Please try again.' };
    }
}

export const signInWithEmail = async ({email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: { email, password }
        })

        return { success: true, data: response };
    } catch (e) {
        console.log('Error signing in:', e);
        return { success: false, error: 'Failed to sign in. Please try again.' };
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({headers: await headers()})
    } catch (e) {
        console.log('Sign out failed', e)
        return {success: false, error: 'Sign out failed'}
    }
}