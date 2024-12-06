# DevTinder

## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
PATCH /profile/view
PATCH /profile/edit
PATCH /profile/password

## connectionRequestRouter
POST /request/send/ignored/:userId
POSt /request/send/interested/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## userRouter
GET /user/connections
GET /user/requests
GET /user/feed - Gets profiles of the other users on platform


Status: ignored, interested, accepted, rejected