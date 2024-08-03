


const userProfile = async (req, res) => {
  try {
    // Assuming you have a middleware that populates req.user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.send({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default userProfile;
