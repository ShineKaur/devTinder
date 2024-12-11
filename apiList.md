# DevTinder

## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
PATCH /profile/view
PATCH /profile/edit
PATCH /profile/changepassword
PATCH /profile/forgotpassword

## connectionRequestRouter
POST /request/send/:status/:toUserId
POSt /request/send/interested/:toUserId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## userRouter
GET /user/connections
GET /user/requests
GET /user/feed - Gets profiles of the other users on platform


Status: ignored, interested, accepted, rejected