# auth_server

## post /api/user/register
### production
- checks to see if input is validated. changed in validation.js
- checks the DB if the email exists
- hashes the password if the email is unique
- commits the new user to the db
#### example request body
```
{
    "first_name": "Sebastian",
    "last_name": "Loret de Mola",
    "email": "email@gmail.com",
    "password":"password"
}
```
## post /api/user/login
### production
- checks to see if the input is valid
- finds the user in DB by email
- decrypts and compares the passwords
- generate and issue refresh and access tokens
- commits new token to user's db document
#### example request body
```
{
    "email": "email@gmail.com",
    "password":"password"
}
```

## post /api/user/refresh
### production
- finds the user by token in body
- checks to see if the token exists in the db
- verifies the token and issues a new access token
#### example request body
```
{
    "email": "email@gmail.com"
}
```

## get /api/user/test
### production
- checks to see if the route can be accessed with/without access token
- can not be accessed with refresh token
- finds the user in db using email send by json body
- returns user details
#### example request body
```
{
    "email": "email@gmail.com"
}
```

## delete /api/user/logout
### production
- finds user in db using email
- updates token to "logged out" thus invalidating the refresh token
- sends a status and message
#### example request body
```
{
    "email": "email@gmail.com"
}
```

## use *
### production
- catch all that displays a 404 missing page
- used to notify user of broken route
