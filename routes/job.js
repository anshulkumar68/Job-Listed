const express = require("express");
const router = express.Router();
const Job = require("../schema/job.schema");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth");
dotenv.config();

router.get("/", async (req, res) => {
  const { limit, offset, salary, companyName, name } = req.query;
  const query = {};
  if(salary){
    query.salary = {$gte : salary, $lte : salary}
  }
  if(name){
    query.companyName = {$regex : name, $options : "i"}
  }
  const jobs = await Job.find(query).skip(offset || 0).limit(limit || 50);
  res.status(200).json(jobs)
  // const jobs = await Job.find();
  // res.status(200).json(jobs);
  // const {limit, offset, salary, companyName} = req.query;

  // way to get only 6 job and also assigning default value for limit
  // const limit = parseInt(req.query.limit) || 6;
  // const jobs = await Job.find().limit(limit);

  // get the job based on salary
  // const jobs = await Job.find({salary :{$gte:200, $lte : 11000}}).limit(limit).skip(offset)
  // const jobs = await Job.find({salary :{$gte:15000}}).limit(limit).skip(offset)

  // get the job which includes company name = companyname and salary = salary
  // try {
   
  //   const jobs = await Job.find({companyName : "Honeywell" || "", salary:13000 || ""})
  //     .limit(limit || 10)
  //     .skip(offset || 0);
  //   res.status(200).json(jobs);
  // } catch (err) {
  //   console.log(err);
  // }

  // make it so that it can search by company name and job position and  salary and job type
//   try{
//       const {limit, offset, salary, companyName, jobPosition} = req.query;
//       const jobs = await Job.find({companyName:"Paytm", jobPosition:"full-time", salary: 10000}).limit(limit).skip(offset);
//       res.status(200).json(jobs);
//   }
//   catch(err){
//       console.log(err);
//   }

  // make it so that it can search by company name or job position or  salary or job type
//   try {
//     const { limit, offset, salary, companyName } = req.query;
//     const jobs = await Job.find({$or:[{companyName : "Honeywell"}, {salary:13000}, {jobType:"full-time"}]})
//       .limit(limit)
//       .skip(offset);
//     res.status(200).json(jobs);
//   } catch (err) {
//     console.log(err);
//   }

  // get company with specific name
  //  try{
  //     const {limit, offset, salary, companyName} = req.query;
  //     const jobs = await Job.find({companyName: {$regex : "anth", $options : "i"}}).limit(limit).skip(offset)
  //     res.status(200).json(jobs);
  // }
  // catch(err){
  //     console.log(err)
  // }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  if (!job) {
    return res.status(400).json({ message: "Job not found" });
  }
  res.status(200).json(job);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  const userId = req.user.id;
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  if (userId !== job.user.toString()) {
    // check if the user is the owner of the job
    return res
      .status(401)
      .json({ message: "You are not authorized to delete this job" });
  }
  await Job.deleteOne({ _id: id });
  res.status(200).json({ message: "Job deleted" });
});

router.post("/", authMiddleware, async (req, res) => {
  const { companyName, jobPosition, salary, jobType } = req.body;
  if (!companyName || !jobPosition || !salary || !jobType) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const user = req.user;
    const job = await Job.create({
      companyName,
      jobPosition,
      salary,
      jobType,
      user: user.id,
    });
    res.status(200).json(job);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in creating job" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { companyName, jobPosition, salary, jobType } = req.body;
  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  if (job.user.toString() !== req.user.id) {
    // check if the user is the owner of the job
    return res
      .status(401)
      .json({ message: "You are not authorized to update this job" });
  }
  try {
    await Job.findByIdAndUpdate(id, {
      companyName,
      jobPosition,
      salary,
      jobType,
    });
    res.status(200).json({ message: "Job updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in updating job" });
  }
});

module.exports = router;
