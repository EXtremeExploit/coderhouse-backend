import multer from 'multer';


const storageDocs = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./src/public/img/docs`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});
const storageProds = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./src/public/img/products`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    }
});
const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./src/public/img/profiles`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

export const uploadDocs = multer({ storage: storageDocs });
export const uploadProds = multer({ storage: storageProds });
export const uploadProfiles = multer({ storage: storageProfiles });


