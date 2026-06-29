import Capsule from "../models/capsule.model.js";
import Recipient from "../models/recipient.model.js";
import {sendUnlockNotification} from "./email.js";

const checkAndUnlockCapsules = async () => {
    try {
        console.log("Checking for capsules to unlock..");
        
        const now = new Date();

        const capsulesToUnlock = await Capsule.find({
            unlockDate: { $lte: now },
            isUnlocked: false,
        });

        if (capsulesToUnlock.length === 0) {
            console.log("No capsules to unlock.");
            return;
        }

        console.log(`Found ${capsulesToUnlock.length} capsule(s) to unlock.`);

        for (let capsule of capsulesToUnlock) {
            // Mark as unlocked
            capsule.isUnlocked = true;
            capsule.notified = true;
            await capsule.save();

            const creator = await capsule.populate("creator", "username displayName");

            const recipients = await Recipient.find({ capsule: capsule._id });

            for (let recipient of recipients) {
                await sendUnlockNotification(recipient.email, {
                    caption: capsule.caption,
                    creatorName: creator.creator?.displayName || creator.creator?.username || "Someone",
                });
            }

            console.log(`Capsule "${capsule.caption}" unlocked and recipients notified.`);
        }

    } catch (error) {
        console.error("Error checking capsules:", error);
    }
};

export default checkAndUnlockCapsules;