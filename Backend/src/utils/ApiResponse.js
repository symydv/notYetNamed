//we dont have an inbuilt class for response so we have to make it ourself.


class ApiResponse {
    constructor (statusCode, data, message = "success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 // for success statuCode should be less than 400, because above 400 codes are for errors, you can search "HTTP response status codes"
    }
}

export {ApiResponse}