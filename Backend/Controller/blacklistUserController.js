// import blacklistUser from "../Utils/blacklistUser.js";


// const blacklistUserController = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     await blacklistUser(userId);
//     res.status(200).json({ message: "User blacklisted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export default blacklistUserController;
