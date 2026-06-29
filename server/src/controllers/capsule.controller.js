import Capsule from "../models/capsule.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Recipient from "../models/recipient.model.js";
import User from "../models/user.model.js";
import { sendCapsuleNotification } from "../utils/email.js";

const createCapsule = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "You must be logged in!" });
        }

        const { contentType, caption, description, unlockDate, recipients } = req.body;

        if (!contentType) {
            return res.status(400).json({ message: "Content Type is Required!" });
        }

        const allowedTypes = ["text", "photo", "video", "voice"];
        if (!allowedTypes.includes(contentType)) {
            return res.status(400).json({ message: "Invalid content type!" });
        }

        if (!caption) {
            return res.status(400).json({ message: "Caption is required!" });
        }

        if (!unlockDate) {
            return res.status(400).json({ message: "Unlock Date is required!" });
        }

        if (new Date(unlockDate) < new Date()) {
            return res.status(400).json({ message: "Unlock Date Must be in future!" });
        }

        if (!recipients) {
            return res.status(400).json({ message: "At least 1 recipient is Required!" });
        }

        let recipientArray;
        try {
            recipientArray = JSON.parse(recipients);
        } catch (error) {
            return res.status(400).json({ message: "Invalid recipients format!" });
        }

        if (!Array.isArray(recipientArray) || recipientArray.length == 0) {
            return res.status(400).json({ message: "There must be at least 1 recipient!" });
        }

        for (let recipient of recipientArray) {
            if (!recipient.email || !recipient.email.includes("@")) {
                return res.status(400).json({ message: "Recipients must have a valid email!" });
            }
        }

        let finalContent;

        if (contentType.toLowerCase() == "text") {
            if (!description) {
                return res.status(400).json({ message: "For a text capsule you must provide a message!" });
            }
            finalContent = description;
        } else {
            const mediaLocalPath = req.files?.media?.[0]?.path;

            if (!mediaLocalPath) {
                return res.status(400).json({ message: `Media file is required for ${contentType} capsules!` });
            }

            const uploadedMedia = await uploadOnCloudinary(mediaLocalPath);

            if (!uploadedMedia || !uploadedMedia.url) {
                return res.status(500).json({ message: "Failed to upload media to cloud!" });
            }

            finalContent = uploadedMedia.url;
        }

        const capsule = await Capsule.create({
            creator: userId,
            contentType,
            content: finalContent,
            caption: caption.trim(),
            description: description?.trim() || "",
            unlockDate: new Date(unlockDate),
        });

        if (!capsule) {
            return res.status(500).json({ message: "Failed to create capsule!" });
        }

        // Create recipients and send emails
        const createdRecipients = [];
        for (let recipientData of recipientArray) {
            const existingUser = await User.findOne({
                email: recipientData.email.toLowerCase()
            });

            const recipient = await Recipient.create({
                capsule: capsule._id,
                user: existingUser ? existingUser._id : null,
                email: recipientData.email.toLowerCase().trim(),
            });

            createdRecipients.push(recipient);

            // 📧 SEND EMAIL NOTIFICATION
            await sendCapsuleNotification(recipientData.email, {
                caption: capsule.caption,
                unlockDate: capsule.unlockDate,
                contentType: capsule.contentType,
            });
        }

        const populatedCapsule = await Capsule.findById(capsule._id)
            .populate("creator", "username displayName profilePicture")
            .lean();

        return res.status(201).json({
            message: "Capsule created and sealed!",
            data: {
                capsule: populatedCapsule,
                recipients: createdRecipients,
            },
        });

    } catch (error) {
        console.log("createCapsule Error:", error);
        return res.status(500).json({ message: "Capsule Creation Failed!" });
    }
};

const getCapsuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const capsule = await Capsule.findById(id)
            .populate("creator", "username displayName profilePicture")
            .lean();

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found!" });
        }

        const isCreator = capsule.creator._id.toString() === userId.toString();
        const isRecipient = await Recipient.findOne({
            capsule: id,
            $or: [
                { user: userId },
                { email: req.user?.email }
            ]
        });

        if (!isCreator && !isRecipient) {
            return res.status(403).json({ message: "You don't have access to this capsule!" });
        }

        const isUnlocked = new Date(capsule.unlockDate) <= new Date();

        if (!isUnlocked && !isCreator) {
            capsule.content = null;
        }

        return res.status(200).json({
            message: "Capsule fetched!",
            data: { capsule, isUnlocked, isCreator }
        });

    } catch (error) {
        console.log("getCapsuleById Error:", error);
        return res.status(500).json({ message: "Failed to fetch capsule!" });
    }
};

const getMyCapsules = async (req, res) => {
    try {
        const userId = req.user._id;

        const createdCapsules = await Capsule.find({ creator: userId })
            .populate("creator", "username displayName")
            .sort({ createdAt: -1 })
            .lean();

        const receivedRecipients = await Recipient.find({
            $or: [
                { user: userId },
                { email: req.user.email }
            ]
        }).populate({
            path: "capsule",
            populate: { path: "creator", select: "username displayName" }
        }).sort({ createdAt: -1 }).lean();

        const receivedCapsules = receivedRecipients.map(r => ({
            ...r.capsule,
            isUnlocked: new Date(r.capsule.unlockDate) <= new Date(),
            hasViewed: r.hasViewed,
        }));

        return res.status(200).json({
            message: "Capsules fetched!",
            data: { created: createdCapsules, received: receivedCapsules }
        });

    } catch (error) {
        console.log("getMyCapsules Error:", error);
        return res.status(500).json({ message: "Failed to fetch capsules!" });
    }
};

export { createCapsule, getCapsuleById, getMyCapsules };