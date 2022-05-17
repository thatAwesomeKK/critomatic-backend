const scopedRatings = async (user, rating) => {
    if (user.role === 'isAdmin') {
        return rating
    }
   let gotRating = await rating.filter(rate => JSON.stringify(rate.userID) === JSON.stringify(user._id))
   return gotRating
   
}
module.exports = scopedRatings