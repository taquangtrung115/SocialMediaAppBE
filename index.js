import express from "express";
const app = express();
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import userRoutes from "../SocialMediaApp_BE/roustes/users.js";
import postRoutes from "../SocialMediaApp_BE/roustes/posts.js";
import commentRoutes from "../SocialMediaApp_BE/roustes/comments.js";
import authRoutes from "../SocialMediaApp_BE/roustes/auth.js";
import likeRoutes from "../SocialMediaApp_BE/roustes/likes.js";

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", true);
    next();
})
app.use(express.json());
app.use(cors({
    origin: true, credentials: true
}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../SocialMediaApp_FE/public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
})

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth", authRoutes);

app.listen(8800, () => {
    console.log("is Working");
});