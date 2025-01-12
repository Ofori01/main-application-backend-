import { Router } from "express";
import communicator from "../../communicator/index.mjs";
import authorization from "../auth/controllers/authController.mjs";



const userRouter = Router();


userRouter.get('/users',authorization(['admin']), async (req,res)=> {
    try {
        const users = await communicator.getUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
    }
})

userRouter.get('/user/:id', async (req,res)=> {
    const {id} = req.params;
    if(!id) res.status(400).send('Missing fields'); 
    try {
        const user = await communicator.getUser(id);
        res.status(200).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: `Error: ${error.message}`})
    }
})

userRouter.patch('/user/update',authorization(['admin','user','seller']), async (req,res)=> {
    try {
        const user_id = req.user.role === "admin" ? req.body.user_id : req.user.userID;
        let user = {}
        Object.keys(req.body).forEach(key => {
            if(key !== 'user_id') user[key] = req.body[key]
        });
        if(!user_id || !user) res.status(400).send('Missing fields');
        const updatedUser = await communicator.updateUser(user_id,user);
        if(updatedUser){
            const message = await communicator.sendNotification(updatedUser.user_id, "Account Information Updated",  `Hello, ${updatedUser.name}\n\nYour account was successfully updated\n\nIf this wasn't you, please contact us immediately.\n\nBest regards,\nThe Multi-Vendor-Platform Team`)
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

userRouter.delete('/user/delete',authorization(['admin','user','seller']), async (req,res)=> {
    try {
        const role = req.user.role
        const user_id = role === "admin" ? req.body.user_id : req.user.userID;
        if(!user_id) res.status(400).send('Missing fields');
        const deletedUser = await communicator.deleteUser(user_id, role);
        res.status(200).send(deletedUser);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

export default userRouter