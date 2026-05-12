import {inngest} from '@/lib/inngest/client';
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from '@/lib/inngest/Prompts';

export const sendSignUpEmail = inngest.createFunction(
    {id: 'sign-up-email', triggers: [{ event: 'app/user.created' }] },

    async({event, step}: {event: any, step: any}) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}    
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({model: 'gemini-2.5-flash-lite'}),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {text: prompt}
                        ]
                    }
                ]
            }
        })

        await step.run('send-welcome-email', async() => {
            const part = response.candidates?.[0]?.content?.parts?.[0]
            const introText = (part && 'text' in part? part.text: null) || 'Welcome to Signalist! We are thrilled to have you on board. Our platform is designed to help you achieve your investment goals with personalized insights and recommendations. If you have any questions or need assistance, feel free to reach out to our support team. Happy investing!'

            //Email sending logic here, using introText as the email body
        })

        return {
            success: true, 
            message: 'Welcome email sent successfully'
        }
    }
)