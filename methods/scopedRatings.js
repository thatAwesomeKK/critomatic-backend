const scopedRatings = async (user, rating) => {
   let gotRating = await rating.filter(rate => JSON.stringify(rate.userID) === JSON.stringify(user._id))
   return gotRating
   
}
module.exports = scopedRatings