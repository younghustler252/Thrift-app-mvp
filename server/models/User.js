const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your full name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 6,
        select: false // 🚀 password will not be returned in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin',], 
        default: 'user',
    },
    bankInfo: {
        bankName: { type: String },
        accountNumber: {
            type: String,
            match: [/^\d{10}$/, 'Account number must be 10 digits']
        },
        accountName: { type: String }
    },
}, { timestamps: true });


// ✅ Hash password before save
userSchema.pre('save', async function(next) {
   if (!this.isModified('password')) return next(); 

   const salt = await bcrypt.genSalt(12); // 🔒 stronger than 10
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

// ✅ Compare entered password with stored hash
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Ensure password never leaks accidentally
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
