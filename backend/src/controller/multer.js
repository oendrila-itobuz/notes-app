import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});

const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}