import { Router } from "express";
import communicator from "../../communicator/index.mjs";

const authRouter =  Router();


authRouter.post('/signin', async (req,res)=> {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).send('Missing fields');
    }
    try {
        const response = await communicator.signIn(email, password);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`});
        
    }
})

authRouter.post('/signup', async (req,res)=> {
    const { password, email, name, role} = req.body;
    if( !password || !email || !name){
        return res.status(400).send('Missing fields');
    }
    try {
        const user = await communicator.signUp( password, email, name, role);
        if(!user) throw new Error("User not created");
        const message = await communicator.sendNotification(user.user_id, "Multi-Vendor-Platform Account Created Successfully",`Hello ${user.name},\n\nThank you for signing up on our platform. We are excited to have you on board and look forward to providing you with the best service possible.\n\nBest regards,\nThe Multi-Vendor-Platform Team`
        );
        return res.status(200).send(user);
        
    } catch (error) {
        return res.status(500).send({msg: `Error: ${error.message}`});
    }
})
export default authRouter
