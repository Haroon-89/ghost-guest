import User from '../models/User.js';

export const setLegacyContact = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { legacyContact: { name, email } },
      { new: true, select: '-password' }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
