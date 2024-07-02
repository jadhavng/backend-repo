const asyncHandler = (fn) => async (req, res, next)=> {
    try{
        await fn(req, res, next);
    }catch(error){
        res.status(error.code || 500).json({
            success : false,
            message : error.message
        })
    }
}

export {asyncHandler}

// using promise 
// const asyncHandler1 = (requestHandler)=>{
//      (req, res, next)=>{
//         Promise
//         .resolve(requestHandler(req, res, next))
//         .catch((error)=>{ next(error);})
//      }
// }

//(fn) => {async ()=> {}}