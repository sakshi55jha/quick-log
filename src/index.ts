import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { contentModel, linkModel, userModel } from "./db";
import { userMiddleware } from "./middleware";
import cors from "cors";
// const JWT_SECRET = "iamsecret"
import { JWT_SECRET_USER } from "./config";
import { random } from "./utilis";


const app = express()
app.use(express.json());
app.use(cors());



app.post("/api/v1/signup", async (req,res)=>{

const details = z.object({
email: z.string().email(),
password: z.string().min(3).max(50).regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/,"Password must contain at least one special character"),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50)
})

const parsedData = details.safeParse(req.body);
if(!parsedData.success){
   return res.json({
        msg:"invalid format"
    })
}

const {email, password, firstName, lastName} = parsedData.data;
const hashedPassword = await bcrypt.hash(password, 5);

 await userModel.create({
    email: email,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName
 })
res.json({
    mes:"signup Successfully"
})
})

app.post("/api/v1/login", async (req,res)=>{
const {email, password} = req.body

const user = await userModel.findOne({
    email: email
})
if(!user){
 return res.json({
    message : "user does not exists"
 })
}
const hashedPassword = await bcrypt.compare(password, user.password)

if(hashedPassword){
   const token = jwt.sign({
   id: user._id
   },JWT_SECRET_USER)
    res.json({
    msg:"Login Successfully",
    token: token
   })
}else{
     res.json({
        msg:"Wrong Password"
     })
   }

})

app.post("/api/v1/content", userMiddleware, async (req,res)=>{
   const title = req.body.title
 const link = req.body.link;
 const type = req.body.type;
//  const type = req.body.type;
const content = await contentModel.create({
   link,
   type,
   title,
   tags: [],
    //@ts-ignore
   userId: req.id,
   
 })
 res.json({
   message: " Content Added",
   contentId: content._id 
 })
})

app.put("/api/v1/edit-content", userMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.id;

    const { link, type, title, tags, contentId } = req.body;

    // ✅ 1. Validate required fields
    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    // ✅ 2. Check if contentId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: "Invalid Content ID format" });
    }

    // ✅ 3. Build update object only with provided fields
    const updateFields: any = {};
    if (link !== undefined) updateFields.link = link;
    if (type !== undefined) updateFields.type = type;
    if (title !== undefined) updateFields.title = title;
    if (tags !== undefined) updateFields.tags = tags;

    // ✅ 4. Update content
    const updatedContent = await contentModel.findOneAndUpdate(
      { _id: contentId, userId }, // ensure content belongs to user
      updateFields,
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found or not owned by user" });
    }

    res.json({
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/v1/content", userMiddleware, async(req,res)=>{
   //@ts-ignore
const userId = req.id
const content = await contentModel.find({
   userId: userId
}).populate("userId","firstName")
res.json({
   content
})
})

app.delete("/api/v1/content", userMiddleware, async(req, res)=>{
const contentId = req.body.contentId;
try{
const content = await contentModel.deleteMany({
   _id: contentId,
   //@ts-ignore
   userId: req.id
})
res.json({ 
   message: "Deleted Successfully",
   content
});
  } catch (error) {
    res.status(500).json({ message: "Error deleting content", error });
  }
})


app.post("/api/v1/manager/share", userMiddleware, async(req,res)=>{
const share = req.body.share
if(share){
   const existingLink = await linkModel.findOne({
      //@ts-ignore
      userId: req.id
   })
   if(existingLink){
      res.json({
         hash: existingLink.hash
      })
      return;
   }
   const hash = random(10);
   await linkModel.create({
      // @ts-ignore
       userId: req.id,
       hash: hash
   })
   res.json({
      message: hash
   })
}
else{
   await linkModel.deleteOne({
      //@ts-ignore
      userId: req.id
   })
   res.json({
   message: "removed link"
})
}
})

app.get("/api/v1/manager/:shareLink", async(req,res)=>{
const hash = req.params.shareLink;

const link = await linkModel.findOne({
   hash
})

if(!link){
   res.status(411).json({
      message:"Sorry incorrect input" 
   })
   return
}
//userID
const content = await contentModel.find({
     userId: link.userId 
})

const user = await userModel.findOne({
   _id: link.userId
})

if(!user){
res.status(411).json({
   message: "user not found"
})
return;
}

res.json({
   name: user.firstName,
   content: content
})
})


async function main(){
await mongoose.connect(process.env.MONGO_URL!);
app.listen(3000);
console.log("connected to app")
}

main();