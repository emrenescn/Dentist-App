const express=require("express")
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddlewares')
const adminMiddleware=require('../middlewares/adminMiddleware')
const {getAllPendingDoctors,updateDoctorAproval,applyDoctor,getMyApplication}=require('../controllers/doctorApplicationController')

router.get('/pending-doctors',authMiddleware,adminMiddleware,getAllPendingDoctors)
router.put('/update-doctor-approval',authMiddleware,adminMiddleware,updateDoctorAproval)
router.post('/apply',authMiddleware,applyDoctor)
router.get('/my-application',authMiddleware,getMyApplication)

module.exports=router;