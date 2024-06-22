import multer from "multer";
import __dirname from './dirname.js'
import {v4 as uuidv4} from 'uuid'
import moment from "moment";

const storage = multer.diskStorage({
    destination: function(req, file, cb){

        switch(file.fieldname){
            case 'avatar':
                cb(null,  __dirname + `/../public/img/profiles`);
                break;
            case 'document':
                cb(null,  __dirname + `/../public/img/documents`);
                break;
            case 'thumbnail':
                cb(null,  __dirname + `/../public/img/products`);
                break;
            default:
                cb(null,  __dirname + `/../public/img/Err`);
        }
    },
    filename: function (req, file, cb){
        const date = moment().format('DD-MM-YYYY')
        cb(null, uuidv4() + '_' + file.originalname)
    }
})

export const uploader = multer({storage: storage})