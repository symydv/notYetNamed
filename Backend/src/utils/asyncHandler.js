// in this file we are making a wrapper function to use at many other places. (or as a middleware)


//doing it with Promise.
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((error) => next(error))   //.catch(next)  BOTH SAME
    }
}


export {asyncHandler}



//const asyncHandler = (func) => () => {}  //this types of syntax is used for higher order functions it is used when we give a funcion as a parameter to our function, to understand it better it can be written like:
//const asyncHandler = (func) => {() => {}}


//this below is try catch method to do the same above code.

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }