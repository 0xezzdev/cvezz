import sgMail from '@sendgrid/mail';



export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        console.log('Starting to send email...');
        console.log('To:', to);
        console.log('Subject:', subject);
        
        const msg = {
            to,
            from: 'ezzeldeen20052018@gmail.com', // This needs to be verified in SendGrid
            subject,
            text,
        };

        console.log('Sending mail with options:', msg);

        const response = await sgMail.send(msg);
        console.log('Email sent successfully!');
        console.log('SendGrid Response:', response);
    } catch (error: any) {
        console.error('Failed to send email. Full error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
}; 