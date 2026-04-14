'use server';

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { UserRole } from "@/lib/types";
import bcrypt from "bcryptjs";

export async function signupUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || UserRole.BREEDER;
  const companyName = formData.get("companyName") as string || "";
  const phone = formData.get("phone") as string || "";
  const address = formData.get("address") as string || "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await dbConnect();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      profile: {
        companyName,
        phone,
        address,
        verified: role === UserRole.ADMIN ? true : false,
      },
    });

    return { success: true, userId: newUser._id.toString() };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: "Internal server error" };
  }
}

export async function verifyHauler(userId: string) {
  // Admin role check should be added here
  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { "profile.verified": true });
    return { success: true };
  } catch (error) {
    return { error: "Failed to verify hauler" };
  }
}

export async function getAllUsers() {
  await dbConnect();
  return User.find({}).lean();
}
