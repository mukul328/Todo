import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import Task from '../models/taskModel.js';

const router = express.Router();

//create a new task

router.post('/',protect,async(req,res)=> {
    const{title,description,priority,status,duedate}= req.body;
    const task = await Task.create({
        user: req.user._id,
        title,
        description,
        priority,
        status,
        duedate
    })
    res.status(201).json(task)
})
// I want to get all task authenticated 

router.get('/',protect,async (req,res) => {
    const task = await Task.find({user: req.user._id})
    res.json(task)
})

router.put('/:id',protect,async (req,res) => {
    const task = await Task.findById(req.params.id);
    if(!task){
        return res.status(404).json({message:"Task not Found"})
    }
    if(task.user.toString()!==req.user._id.toString()){
        return res.status(404).json({message:"Not authorized to update this task"})
    }
    task.title = req.body.title || task.title;
    task.description =req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.duedate = req.body.duedate || task.duedate

    const updatedTask = await task.save();
    res.json(updatedTask)

})
router.delete('/:id',protect,async (req,res) => {
    const task = await Task.findById(req.params.id);
    if(!task){
        return res.status(404).json({message:"Task not Found"})
    }
    if(task.user.toString()!==req.user._id.toString()){
        return res.status(404).json({message:"Not authorized to update this task"})
    }
    await task.remove();
    res.json({message:'Task Removed'})
})



export default router;