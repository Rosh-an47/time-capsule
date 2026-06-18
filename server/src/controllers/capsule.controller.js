import Capsule from "../models/capsule.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Recipient from "../models/recipient.model.js";
import User from "../models/user.model.js";


const createCapsule = async(req, res) =>{
    try {
        const userId = req.user?._id;
        if(!userId){
            return res.status(401).json({ message: "You must be logged in!" });
        }
    
        const {contentType, caption, description, unlockDate, recipients} = req.body;
    
        if(!contentType){
            console.log("You must specify Content Type");
            return res.status(400).json({
                message: "Content Type is Required!"
            })
        }

        const allowedTypes = ["text", "photo", "video", "voice"];
        if(!allowedTypes.includes(contentType)){
            return res.status(400).json({ 
                message: "Invalid content type!" 
            });
        }

        if(!caption){
            console.log("Caption is required!!!");
            return res.status(400).json({
                message: "Caption is required!"
            });
        }
        if(!unlockDate){
            console.log("Unlock Date is required!!!");
            return res.status(400).json({
                message: "Unlock Date is required!"
            });
        }

        if(new Date(unlockDate) < new Date()){
            console.log("Unlock Date Must be in future!!");
            return res.status(400).json({
                message: "Unlock Date Must be in future!!"
            });
        }

        if(!recipients){
            console.log("Atleast 1 recipient is Required!!");
            return res.status(400).json({
                message: "Atleast 1 recipient is Required!!"
            });
        }

        let recipientArray;
        try {
            recipientArray = JSON.parse(recipients);
        } catch (error) {
            return res.status(400).json({ 
                message: "Invalid recipients format!" 
            });
        }

        if(!Array.isArray(recipientArray) || recipientArray.length == 0){
            return res.status(400).json({
                message: "There must be atleast 1 recipient!"
            });
        }

        for(let recipient of recipientArray){
            if(!recipient.email || !recipient.email.includes('@')){
                return res.status(400).json({
                    message: "Recipeints must have a email Id"
                });
            }
        }

        let finalContent;

        if(contentType.toLowerCase() == "text"){
            if(!description){
               return res.status(400).json({
                message: "For a text capsule you must provide description!!"
               }); 
            }

            finalContent = description;
        } else{
            const mediaLocalPath = req.files?.media?.[0]?.path;
            
            if(!mediaLocalPath){
                return res.status(400).json({ 
                    message: `Media file is required for ${contentType} capsules!`
                });
            }

            const uploadedMedia = await uploadOnCloudinary(mediaLocalPath);

            if (!uploadedMedia || !uploadedMedia.url){
                return res.status(500).json({ 
                    message: "Failed to upload media to cloud!" 
                });
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

        if(!capsule){
            return res.status(500).json({ 
                message: "Failed to create capsule!" 
            });
        }


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
        }

        const populatedCapsule = await Capsule.findById(capsule._id)
            .populate("creator", "username displayName profilePicture")
            .lean();

        return res.status(201).json({
            message: "Capsule created and sealed!",
            data:{
                capsule: populatedCapsule,
                recipients: createdRecipients,
            },
        });


    } catch (error){
        console.log("createCapsule Error", error);
        return res.status(500).json({
            message: "Capsule Creation Failed!!!"
        });
    }
}


export {createCapsule};