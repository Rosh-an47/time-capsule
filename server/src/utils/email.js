import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendCapsuleNotification = async (recipientEmail, capsuleData) => {
    try {
        const unlockDate = new Date(capsuleData.unlockDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: "A Time Capsule Has Been Sealed For You!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #6c63ff;">Someone sent you a Time Capsule!</h2>
                    <p>Someone created a time capsule and included you as a recipient.</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Caption:</strong> ${capsuleData.caption}</p>
                        <p><strong>Unlocks On:</strong> ${unlockDate}</p>
                    </div>
                    <p>The contents will be revealed on the unlock date. We'll notify you when it's time!</p>
                    <p style="color: #888; font-size: 12px; margin-top: 30px;">
                        This is an automated message from Time Capsule.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error.message);
    }
};

const sendUnlockNotification = async (recipientEmail, capsuleData) => {
    try {
        const mailOptions = {
            from: `"Time Capsule" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: "A Time Capsule Has Been Unlocked!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Time Capsule Unlocked!</h1>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">A memory from the past is ready!</h2>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            A time capsule sealed long ago has just unlocked. The contents are now waiting for you.
                        </p>
                        
                        <div style="background: #f5f3ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #6c63ff;">
                            <p style="margin: 5px 0; color: #333;"><strong>📝 Caption:</strong> ${capsuleData.caption}</p>
                            <p style="margin: 5px 0; color: #333;"><strong>👤 From:</strong> ${capsuleData.creatorName}</p>
                        </div>
                        
                        <p style="color: #777; font-size: 14px; line-height: 1.5;">
                            The memory you've been waiting for is finally here. Log in or check your dashboard to see what's inside.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                            This is an automated message from Time Capsule.
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Unlock email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send unlock email to ${recipientEmail}:`, error.message);
    }
};


export {sendCapsuleNotification, sendUnlockNotification};