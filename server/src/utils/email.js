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

export {sendCapsuleNotification};