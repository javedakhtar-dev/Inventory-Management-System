const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { signupInput, loginInput } = require("../validations/auth.validation");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const signupPayload = req.body;
  const parsedPayload = signupInput.safeParse(signupPayload);

  if (!parsedPayload.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid Inputs",
      errors: parsedPayload.error.issues,
    });
  }

  try {
    const { name, email, password } = parsedPayload.data;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    const token = await generateToken(userResponse.id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const profile = async (req, res) => {
  return res.json({
    success: true,
    data: { user: req.user },
  });
};

const login = async (req, res) => {
  const loginPayload = req.body;
  const parsedPayload = loginInput.safeParse(loginPayload);

  if (!parsedPayload.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsedPayload.error.issues,
    });
  }

  try {
    const { email, password } = parsedPayload.data;
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = await generateToken(userResponse.id);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  login,
  profile,
};
