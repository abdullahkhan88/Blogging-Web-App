const userModel = require("../../models/adminModel/admin_userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const adminInsert = async (req, res) => {
    try {
        let { name, username, password, role, status } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).send({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let adminData = new userModel({
            name,
            username,
            password: hashedPassword,
            role,
            status
        });

        await adminData.save();
        res.status(200).send(
            {
                status: 1,
                message: "Data Save Successfully",
                data: adminData
            });
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: "error while saveing Data",
            error: err.message
        });
    }

}

// login Api

const adminLogin = async (req, res) => {
    try {
        let { username, password } = req.body;
        const adminUser = await userModel.findOne({ username });

        // check the user is exists
        if (!adminUser) {
            return res.status(404).send({
                status: 0,
                message: 'User Not Found'
            })

        }
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(404).send({
                status: 0,
                message: "Invalid Credentials ",
            })
        }
        const token = jwt.sign({ id: adminUser._id, username: adminUser.username }, process.env.adminSecretKey, {
            expiresIn: '1h',
        })
        res.status(200).send({
            status: 1,
            message: "Login Successfull",
            token: token
        })
    }
    catch (error) {
        res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

// Get Admin Register List 

const adminList = async (req, res) => {
    try {
        const adminRegList = await userModel.find();
        res.status(200).json({
            status: 1,
            message: "Admin Register List",
            data: adminRegList
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Failed to fetch admin data",
            error: error.message
        });
    }
};

// Delete admin Registration Data

const adminDelete = async (req, res) => {
    try {
        let adminId = req.params.id;
        let ResDelete = await userModel.deleteOne({ _id: adminId });
        if (ResDelete.deletedCount === 0) {
            return res.status(404).send({ status: 0, message: "Admin Not Found" })
        }
        res.send({ message: "Data Deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ status: 0, message: "Internal Server Error" });
    }

};

// Get Single Data to Update
const getSingleList = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userModel.findById(userId);

        if (!result) {
            return res.status(404).send({
                status: 0,
                message: "Admin Not Found",
                result: null
            });
        }

        res.status(200).send({
            status: 1,
            message: "Admin Found Successfully",
            result
        });
    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Update Data Into the Admin List

const updateAdminList = async (req, res) => {
    try {
        let id = req.params.id;
        let { name, username, password, role, status } = req.body;
        let obj = {
            name,
            username,
            password,
            role,
            status
        };
        let UpdateRes = await userModel.updateOne({ _id: id }, obj);
        res.status(200).send({ status: 1, message: "Data Updated Successfully", UpdateRes })
    } catch (error) {
        res.status(500).send({ status: 0, message: "Some Internal Error" });
    };
};

// Admin User Count

const getUserCount = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        res.status(200).json({ success: true, count: totalUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error getting user count" });
    }
};


module.exports = {
    adminInsert,
    adminLogin,
    adminList,
    adminDelete,
    getSingleList,
    updateAdminList,
    getUserCount
};