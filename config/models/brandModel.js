const mongoose = require ('mongoose')

const brandSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true , 'Brand name required'],
        unique:true,
        minlength:[2,'Too short brand name'],
        maxlength:[32,'Too long brand name'],
        trim:true
    },

    image:{
        type : String
    },
    slug:{
        type:String,
        lowercase:true
    }
},{timestamps:true}
)



const brandModel = mongoose.model('Brand' ,brandSchema )

module.exports = brandModel