const adminAuthData = (req, res, next) => {
    console.log('Admin Auth is getting checked.');
    const token = "xyz";
    const isAdminAuthorised = token === "xyz";
    if(!isAdminAuthorised) {
        res.status(401).send('Admin not authorised')
    } else {
        next();
    }
}

module.exports = {
    adminAuthData,
}