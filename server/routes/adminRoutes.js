const express=require("express")
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddlewares')
const adminMiddleware=require('../middlewares/adminMiddleware')
const {getAllPendingDoctors,updateDoctorAproval}=require('../controllers/adminController')

router.get('/pending-doctors',authMiddleware,adminMiddleware,getAllPendingDoctors)
router.post('/update-doctor-approval',authMiddleware,adminMiddleware,updateDoctorAproval)

module.exports=router;