const userProfile = async (req, res) => {
  res.send({ user: req.user });
};

export default userProfile;
