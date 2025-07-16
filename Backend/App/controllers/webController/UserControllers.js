const userModel = require("../../models/webModel/registerModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// User Registration
let userInsert = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validate inputs
        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required." });
        }
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save user directly without hashing (Insecure for production)
        const userData = new userModel({ username, email, password: hashedPassword });
        await userData.save();
        res.status(201).send({ message: "User registered successfully." });

    } catch (err) {
        res.status(500).send({ message: "Error while saving user data.", error: err.message });
    }
};

// User Login
let userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate inputs
        if (!email || !password) {
            return res.status(400).send({ message: "All fields are required." });
        }

        // Find user by email aur email mein password bhi aa raha hai Ex user.password
        const user = await userModel.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).send({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.userSecretKey, {
            expiresIn: '1h',
        });

        res.status(200).send({ message: "Login successful...", token: token });

    } catch (err) {
        console.error('Error in bcrypt compare problems')
        res.status(500).send({ message: "Error during login.", error: err.message });
    }
};

// show profile existing user login 

const showProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await userModel.findById(userId).select('-password');
        if (!result) {
            return res.send({
                status: 0,
                message: "Profile Data Not Found"
            });
        }
        res.status(200).send({
            status: 1,
            message: "Get Data Successfully",
            result: result
        })
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            error: err.message,
        })
    }
}

const UpdateProfile = async (req, res) => {
    const userId = req.user.id;
    const updatedData = req.body;
    if (req.file) {
        updatedData.profile = req.file.path; // ya koi aur field name
    }
    // iska matalb iss fild ko update nhi karna hai
    delete updatedData.email;
    delete updatedData.password;
    
    try {
        const user = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user)
            return res.status(404).send({ status: 0, message: "User Not Found" });

        res.status(200).send({ message: "Profile  Update successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server Error' });
    }

};

const ChangePassword = async (req,res) =>{
    const userId = req.user.id;
    const {oldPassword,newPassword} = req.body;
    try{
        const user = await userModel.findById(userId);
        const isMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).send({message:"Old password is incorrect",});
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);
        user.password = hashedPassword;
        await user.save();
        res.send({message:"Password Changed Successfully"});

    }catch(error){
         res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    userInsert,
    userLogin,
    showProfile,
    UpdateProfile,
    ChangePassword
};
