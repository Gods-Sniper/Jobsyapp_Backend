const jobProviderMiddleware = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  if (req.user.role !== "jobprovider") {
    return res
      .status(403)
      .json({ message: "Forbidden: JobProvider access only" });
  }

  next();
};

const jobSeekerMiddleware = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  if (req.user.role !== "jobseeker") {
    return res
      .status(403)
      .json({ message: "Forbidden: JobSeeker access only" });
  }

  next();
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Forbidden: Only ${allowedRoles.join(", ")} allowed`,
        });
    }

    next();
  };
};
module.exports = {
  jobProviderMiddleware,
  jobSeekerMiddleware,
  roleMiddleware,
};
