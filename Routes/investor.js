const express = require("express");
const router = express.Router();
const Project = require("../Models/Projects");
const Order = require("../Models/OrderSchema");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const Review = require('../Models/Review');
const Razorpay = require("razorpay");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../Middleware/fetchuser");
require('dotenv').config()

//Fetching Projects
router.get("/fetch-projects", fetchuser, async (req, res) => {
  try {
    let projects = await Project.find({ isVerified: true });
    if (projects.length === 0) {
      return res.status(404).json({ success: false, error: "Could not find any projects right now" });
    }
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

//Fetching Project's Data
router.post("/fetch-project", async (req, res) => {
  try {
    const { project_id } = req.body;
    let projectsData = await Project.findById(project_id);
    if (!projectsData) {
      return res.status(404).json({ success: false, error: "Could not find any projects right now" });
    }
    return res.status(200).json({ success: true, data: projectsData });
  }
  catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
})

//Fetching User's Project's Data
router.get('/fetchuserProjects', fetchuser, async (req, res) => {
  try {
    let user_id = req.user.id;
    let data = await Project.find({ Founder_id: user_id });
    if (data.length === 0) {
      return res.status(404).json({ success: false, msg: "No Project Found for the User" })
    }
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
})

// Creation of Project
router.post(
  "/create-project",
  [
    [
      body("Name", "Enter a valid name").isLength({ min: 3 }),
      body("Description", "description must be atleast 15 characters").isLength(
        {
          min: 15,
        }
      ),
      body("Website", "Enter a valid website").isLength({
        min: 10,
      }),
      body("Category", "Enter a valid category").exists(),
      body("Vision", "description must be atleast 15 characters").isLength({
        min: 15,
      }),
      body(
        "Problemstatement",
        "problemstatement must be atleast 15 characters"
      ).isLength({
        min: 15,
      }),
      body("Solution", "solution must be atleast 15 characters").isLength({
        min: 15,
      }),
    ],
  ],
  fetchuser,
  async (req, res) => {
    let Founder_id = req.user.id;
    try {
      const {
        Name,
        Description,
        Website,
        Email,
        Instagram,
        LinkedIn,
        LogoUrl,
        Category,
        Vision,
        Problemstatement,
        Solution,
        Ask,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      let existed = await Project.findOne({ Name });
      let project = Project({
        Founder_id,
        Name,
        Description,
        Website,
        Email,
        Instagram,
        LinkedIn,
        LogoUrl,
        Category,
        Vision,
        Problemstatement,
        Solution,
        Ask,
        isVerified : true
      });
      if (existed) {
        return res.status(400).json({ success: false, msg: "Please Enter a unique name" });
      }
      let savedProject = await project.save();
      return res.json({ success: true, msg: "Congratulations!! Your registration has been successfully Submitted." })

    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);


router.get("/get-razorpay-key", fetchuser, (req, res) => {
  return res.json({ success: true, key: process.env.RAZORPAY_KEY_ID })
})

router.post("/create-order", fetchuser, async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (!order) {
      return res.status(500).json({ success: false, msg: "Some error occured" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.post('/pay-order', async (req, res) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature, investor_id, project_id } =
      req.body;
    const newOrder = Order({
      isPaid: true,
      amount: amount,
      investor_id,
      project_id,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });
    let project = await Project.findById(project_id);
    await Project.findByIdAndUpdate(project_id, { Current: project.Current + amount, Backers: project.Backers + 1 });
    await newOrder.save();
    res.json({
      success: true,
      msg: 'Payment was successfull',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: error.message });
  }
});

// Fetching the Transaction of Investor

router.get("/getTransactions", fetchuser, async (req, res) => {
  try {
    let userOrders = await Order.find({ investor_id: req.user.id });
    if (userOrders.length === 0) {
      return res.status(404).json({ success: false, msg: "No transactions yet" });
    }
    return res.json({ success: true, data: userOrders });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
})

// Storing Investor's Review

router.post("/review", fetchuser, async (req, res) => {
  try {
    let { ideaRating, approachRating, websiteRating, instagramRating, Project_id, overallRating } = req.body;
    let review = Review({
      Project_id,
      ideaRating,
      approachRating,
      websiteRating,
      instagramRating,
      overallRating
    });
    let userReview = await review.save();
    if (!userReview) {
      return res.status(500).json({ success: false, msg: "Cannot Save the file" });
    }
    return res.json({ success: true, msg: "Successfully Submitted" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
})

// Get Project's Review
router.post("/fetchprojectReview", async (req, res) => {
  try {
    const { project_id } = req.body;
    const data = await Review.find({
      Project_id: project_id
    });
    if (data.length === 0) {
      return res.json({ success: false, msg: "No Project Available" })
    }
    else {
      let avOverall = 0;
      data.forEach(element => {
        let a = element.overallRating;
        avOverall = avOverall + a;
      });
      return res.json({ success: true, ReviewData: { rating: Math.floor(avOverall / data.length) , totalReview: data.length } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
})

// Get Project's Transactions
router.post('/getProjectsTransactions', async (req,res)=>{
  try{
    let {project_id} = req.body;
    let transactions = await Order.find({
      project_id
      });
    if(transactions.length === 0){
      return res.json({success:false, msg:"No Transactions Found"});
    }
    return res.json({success:true, data: transactions});
  }
  catch(error){
    return res.status(500).json({ success: false, msg: error.message });
  }
})

// Getting User's Data
router.post('/getUsersName',fetchuser, async (req,res)=>{
  try {
    let {userId} = req.body;
    let user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({success:false,msg:"No user found"});
    }
    return res.json({success:true, data:user.name})
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
})


//Changing User's Data 
router.post("/changePassword", fetchuser, async (req, res) => {
  try {
    let { currentPassword, newPassword } = req.body;
    let user = await User.findById(req.user.id);
    const passwordCompare = await bcrypt.compare(currentPassword, user.password);
    let salt = await bcrypt.genSaltSync(10);
    let secured = await bcrypt.hashSync(newPassword, salt);
    if (!passwordCompare) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Incorrect credentials",
        });
    }
    await User.findByIdAndUpdate(user._id, { password: secured }).then(() => {
      return res.json({ success: true, msg: "Changed Password Successfully!" })
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
})

module.exports = router;
