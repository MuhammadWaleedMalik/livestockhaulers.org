'use server';

import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import Interest from "@/models/Interest";
import { LoadStatus, InterestStatus, UserRole } from "@/lib/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function postLoad(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== UserRole.BREEDER) {
    return { error: "Only Breeders can post loads" };
  }

  const title = formData.get("title") as string;
  const animalType = formData.get("animalType") as string;
  const quantity = Number(formData.get("quantity"));
  const pickupLocation = formData.get("pickupLocation") as string;
  const deliveryLocation = formData.get("deliveryLocation") as string;

  if (!title || !animalType || !quantity || !pickupLocation || !deliveryLocation) {
    return { error: "All fields are required" };
  }

  try {
    await dbConnect();
    await Load.create({
      breederId: session.user.id,
      title,
      animalType,
      quantity,
      pickupLocation,
      deliveryLocation,
      status: LoadStatus.ACTIVE,
    });

    return { success: true };
  } catch (error) {
    console.error("Post load error:", error);
    return { error: "Failed to post load" };
  }
}

export async function getAvailableLoads() {
  await dbConnect();
  // Fetch active loads and populate breeder info
  return Load.find({ status: LoadStatus.ACTIVE }).populate('breederId', 'profile.companyName').sort({ createdAt: -1 }).lean();
}

export async function getMyLoads() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  await dbConnect();
  
  // Use Mongoose to fetch loads and count interests for each
  const loads = await Load.find({ breederId: session.user.id }).sort({ createdAt: -1 }).lean();
  
  const loadsWithInterestCount = await Promise.all(loads.map(async (load) => {
    const interestCount = await Interest.countDocuments({ loadId: load._id });
    return { ...load, interestCount };
  }));

  return JSON.parse(JSON.stringify(loadsWithInterestCount));
}

export async function toggleLoadStatus(loadId: string, status: LoadStatus) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Authentication required" };

  try {
    await dbConnect();
    await Load.findByIdAndUpdate(loadId, { status });
    return { success: true };
  } catch (error) {
    return { error: "Failed to update load status" };
  }
}

export async function deleteLoad(loadId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Authentication required" };

  try {
    await dbConnect();
    await Load.findByIdAndDelete(loadId);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete load" };
  }
}

export async function submitInterest(loadId: string, message: string = "") {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== UserRole.HAULER) {
    return { error: "Only Haulers can mark interest" };
  }

  try {
    await dbConnect();
    
    // Check if interest already exists
    const existing = await Interest.findOne({ loadId, haulerId: session.user.id });
    if (existing) return { error: "Already marked as interested" };

    await Interest.create({
      loadId,
      haulerId: session.user.id,
      status: InterestStatus.PENDING,
      message,
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to submit interest" };
  }
}

export async function getAllLoadsAdmin() {
    await dbConnect();
    return Load.find({}).populate('breederId', 'email profile.companyName').lean();
}
