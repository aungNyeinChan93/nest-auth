/* eslint-disable prettier/prettier */


export interface WelcomeEmailInterface {
    from?: string;  // 'Your App <onboarding@resend.dev>'
    to: string;
    subject: string;
    html: string,
}