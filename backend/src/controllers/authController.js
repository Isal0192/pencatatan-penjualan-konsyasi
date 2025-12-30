import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['penitip', 'penjual'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Tolak registrasi untuk peran 'penjual'
    if (role === 'penjual') {
      return res.status(403).json({ message: 'maaf register sebagai penjual di tolak silahkan hubungi 083879865505' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = await User.create(name, email, password, phone, address, role);
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const result = await User.authenticate(email, password);
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.getAll(role);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getPenitips = async (req, res) => {
  try {
    const users = await User.getAll('penitip');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching penitips', error: error.message });
  }
};

export const getPenjuals = async (req, res) => {
  try {
    const users = await User.getAll('penjual');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching penjuals', error: error.message });
  }
};
