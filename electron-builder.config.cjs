const {build}=require('./package.json');
// Private test builds stay unsigned. Public signing is intentionally deferred.
module.exports={...build,...(process.platform==='win32'?{electronDist:'node_modules/electron/dist'}:{})};
