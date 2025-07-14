const CategoryModel = require('../../models/adminModel/admin_CategoryModel');

// insert Category Data
const createCategory = async (req, res) => {
    try {
        let { category, status } = req.body;
        let categoryData = new CategoryModel({
            category,
            status
        });
        await categoryData.save();
        res.status(201).send({
            status: 1,
            message: "Category Created Successfully",
        });
    } catch (error) {
        res.status(500).send(
            {
                status: 0,
                message: "Error While Creating Data",
                error: error.message
            }
        );
    };
};
// show Category List Data

const showCategory = async (req, res) =>{
    try{
        let Category = await CategoryModel.find();
        res.status(200).send({status:1,message:"Get Data Successfully",data:Category});
        
    }catch(error){
        res.status(404).send({status:0,message:"Unable to Fetch Data",error:error.message});
    }
};

// Deleted Category
const deleteCategory = async (req, res) =>{
    try{
        let id = req.params.id;
        let deleteRes = await CategoryModel.deleteOne({_id:id});
        if(deleteRes.deletedCount == 0){
            return res.status(404).send({status:0,message:"Category Not Found"})
        }
        res.status(200).send({status:1,message:"Category Deleted Successfully"})
    }catch(error){
        res.status(500).send({status:0,message:"Unable to Deleted category"})
    }

};

// update Category 

const getSingleCategory = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await CategoryModel.findById(userId);
      
      if (!result) {
        return res.status(404).send({
          status: 0,
          message: "Category Not Found",
          result: null
        });
      }
  
      res.status(200).send({
        status: 1,
        message: "Category Found Successfully",
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

// update Category
const updateCategory = async (req, res)=>{
    try{
        let id = req.params.id;
        let {category,status} = req.body;
        let obj = {
            category,
            status
        };
        let UpdateRes = await CategoryModel.updateOne({_id:id},obj);
        res.status(200).send({status:1,message:"Category Updated Successfully",data:UpdateRes})
    }catch(error){
        res.status(500).send({status:0,message:"Some Internal Error"});
    };
};

module.exports = {
    createCategory,
    showCategory,
    deleteCategory,
    getSingleCategory,
    updateCategory
}
