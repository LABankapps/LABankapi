// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    phone: request.profile.phone,
    gender: request.profile.gender,
    email: request.email,
    role: request.role
  };

  return getUserInfo;
};
