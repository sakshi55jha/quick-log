"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
// const JWT_SECRET = "iamsecret"
const config_1 = require("./config");
const utilis_1 = require("./utilis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const details = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(3).max(50).regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        firstName: zod_1.z.string().min(3).max(50),
        lastName: zod_1.z.string().min(3).max(50)
    });
    const parsedData = details.safeParse(req.body);
    if (!parsedData.success) {
        return res.json({
            msg: "invalid format"
        });
    }
    const { email, password, firstName, lastName } = parsedData.data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 5);
    yield db_1.userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    });
    res.json({
        mes: "signup Successfully"
    });
}));
app.post("/api/v1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_1.userModel.findOne({
        email: email
    });
    if (!user) {
        return res.json({
            message: "user does not exists"
        });
    }
    const hashedPassword = yield bcrypt_1.default.compare(password, user.password);
    if (hashedPassword) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, config_1.JWT_SECRET_USER);
        res.json({
            msg: "Login Successfully",
            token: token
        });
    }
    else {
        res.json({
            msg: "Wrong Password"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    //  const type = req.body.type;
    const content = yield db_1.contentModel.create({
        link,
        type,
        title,
        tags: [],
        //@ts-ignore
        userId: req.id,
    });
    res.json({
        message: " Content Added",
        contentId: content._id
    });
}));
app.put("/api/v1/edit-content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.id;
        const { link, type, title, tags, contentId } = req.body;
        // ✅ 1. Validate required fields
        if (!contentId) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        // ✅ 2. Check if contentId is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ message: "Invalid Content ID format" });
        }
        // ✅ 3. Build update object only with provided fields
        const updateFields = {};
        if (link !== undefined)
            updateFields.link = link;
        if (type !== undefined)
            updateFields.type = type;
        if (title !== undefined)
            updateFields.title = title;
        if (tags !== undefined)
            updateFields.tags = tags;
        // ✅ 4. Update content
        const updatedContent = yield db_1.contentModel.findOneAndUpdate({ _id: contentId, userId }, // ensure content belongs to user
        updateFields, { new: true });
        if (!updatedContent) {
            return res.status(404).json({ message: "Content not found or not owned by user" });
        }
        res.json({
            message: "Content updated successfully",
            data: updatedContent,
        });
    }
    catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    const content = yield db_1.contentModel.find({
        userId: userId
    }).populate("userId", "firstName");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    try {
        const content = yield db_1.contentModel.deleteMany({
            _id: contentId,
            //@ts-ignore
            userId: req.id
        });
        res.json({
            message: "Deleted Successfully",
            content
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting content", error });
    }
}));
app.post("/api/v1/manager/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.linkModel.findOne({
            //@ts-ignore
            userId: req.id
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utilis_1.random)(10);
        yield db_1.linkModel.create({
            // @ts-ignore
            userId: req.id,
            hash: hash
        });
        res.json({
            message: hash
        });
    }
    else {
        yield db_1.linkModel.deleteOne({
            //@ts-ignore
            userId: req.id
        });
        res.json({
            message: "removed link"
        });
    }
}));
app.get("/api/v1/manager/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.linkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    //userID
    const content = yield db_1.contentModel.find({
        userId: link.userId
    });
    const user = yield db_1.userModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found"
        });
        return;
    }
    res.json({
        name: user.firstName,
        content: content
    });
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        app.listen(3000);
        console.log("connected to app");
    });
}
main();
