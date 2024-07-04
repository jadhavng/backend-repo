import multer from "multer";


//setup storage engine 
const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "./public/temp") //Specify the destination directory
    },
    filename : (req, file, cb)=>{
         // Check some condition that might cause an error
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            // Pass an error object to indicate an invalid file type
            return cb(new Error('Invalid file type'), null);
        }

        cb(null, Date.now()+"-" + file.originalname); // Generate a unique filename, When there is no error, pass null as the first argument to indicate success.
    }
})


// Create an instance of multer with the storage engine
export const upload = multer({ storage: storage });