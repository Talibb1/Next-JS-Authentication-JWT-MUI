import RefreshToken from "../../Model/RefreshToken.js";

const blacklistUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await RefreshToken.updateMany({ user: userId }, { blacklisted: true });

    res.status(200).json({ message: "User has been blacklisted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "failed", message: "Something went wrong" });
  }
};

export default blacklistUser;
