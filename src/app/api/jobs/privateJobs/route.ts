/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { privateJobValidation } from "@/inputValidations/privateJobValidation";
import PrivateJobModel, { PrivateJob } from "@/models/privateJobModal";
import { connectDB } from "@/dbConfig/db";


// Define the Zod schema to validate the entire body

const privateJobSchema = privateJobValidation;

// POST: Create a new private job
export async function POST(request: NextRequest) {
  await connectDB()
  try {
    const body: Partial<PrivateJob> = await request.json(); // Use Partial<PrivateJob> to make all fields optional

    // const session = await getServerSession(authOptions);
    // console.log("Session", session); // Log session info

    // Convert application dates to Date objects
    const { applicationStartingDate, applicationEndDate, ...rest } = body;
    const startDate = applicationStartingDate ? new Date(applicationStartingDate) : undefined;
    const endDate = applicationEndDate ? new Date(applicationEndDate) : undefined;

    // Optional: Validate date conversion
    if (startDate && isNaN(startDate.getTime()) || endDate && isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, msg: "Invalid date format for application dates." },
        { status: 400 }
      );
    }

    // Validate the body using the Zod schema (now using converted dates)
    const validationResult = privateJobSchema.safeParse({
      ...rest,
      applicationStartingDate: startDate,
      applicationEndDate: endDate,
    });

    if (!validationResult.success) {
      console.log("Validation Error", validationResult.error.errors); // Log validation errors
      return NextResponse.json(
        { success: false, msg: "Details are not as per format", error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { companyName, jobTitle, vacancyCount } = validationResult.data;

    // Check if the private job already exists
    const isPrivateJobExist = await PrivateJobModel.findOne({
      companyName,
      jobTitle,
      vacancyCount,
    });
    console.log("Job Existence Check", isPrivateJobExist); // Log existence check
    if (isPrivateJobExist) {
      return NextResponse.json(
        { success: false, msg: "Job already exists" },
        { status: 409 }
      );
    }

    // Create the new private job entry with converted dates
    const privateJob = await PrivateJobModel.create({
      ...validationResult.data,
    });
    console.log("Created Job", privateJob); // Log created job

    return NextResponse.json(
      { success: true, msg: "Job created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.log("An error occurred while creating Private job", error); // Log error message
    return NextResponse.json(
      { success: false, msg: "Failed to create job" },
      { status: 500 }
    );
  }
}
// DELETE: Delete all private jobs
export async function DELETE(request: NextRequest,{ params }: { params: { id: string } }) {
  try {  await connectDB()
    // Check if user is authorized
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User  
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, msg: "Not Authorized" },
        { status: 401 }
      );
    }

    // Optionally, add role-based authorization here

    // Delete all jobs from the collection
    const result = await PrivateJobModel.deleteMany({});

    return NextResponse.json(
      { success: true, msg: `All jobs deleted successfully. Deleted count: ${result.deletedCount}` },
      { status: 200 }
    );

  } catch (error) {
    console.log("An error occurred while deleting all private jobs", error);
    return NextResponse.json(
      { success: false, msg: "Failed to delete jobs" },
      { status: 500 }
    );
  }
}
// GET: Get all private jobs
export async function GET(request: NextRequest) {
  try {  
      await connectDB();

      // Parse the URL parameters to get the location if provided
      const { searchParams } = new URL(request.url);
      const location = searchParams.get("location"); // Extract location from query params

      let jobs;

      // If location is provided, filter jobs by location and sort by creation date
      if (location) {
          jobs = await PrivateJobModel.find({ jobLocation: location })
                                      .sort({ updatedAt: -1, createdAt: -1 }); // Sort by createdAt in descending order
      } else {
          // Fetch all jobs and sort by creation date
          jobs = await PrivateJobModel.find().sort({ updatedAt: -1, createdAt: -1 });
      }

      return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
      console.log("Error while fetching all private jobs", error);
      return NextResponse.json({ success: false, msg: "Failed to retrieve jobs" }, { status: 500 });
  }
}

  

// PUT: Update a private job by ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // const session = await getServerSession(authOptions);
    // const user: User = session?.user as User;  

    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { success: false, msg: "Not Authorized" },
    //     { status: 401 }
    //   );
    // }

    const { _id, applicationStartingDate, applicationEndDate, ...rest } = body;

    // Convert application dates to Date objects
    const startDate = applicationStartingDate ? new Date(applicationStartingDate) : undefined;
    const endDate = applicationEndDate ? new Date(applicationEndDate) : undefined;

    // Validate date conversion
    if (startDate && isNaN(startDate.getTime()) || endDate && isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, msg: "Invalid date format for application dates." },
        { status: 400 }
      );
    }

    // Validate the body using the Zod schema with converted dates
    const validationResult = privateJobSchema.safeParse({
      ...rest,
      applicationStartingDate: startDate,
      applicationEndDate: endDate,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, msg: "Details are not as per format", errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Find the job by ID and update it
    const updatedJob = await PrivateJobModel.findByIdAndUpdate(_id, validationResult.data, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return NextResponse.json({ success: false, msg: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, msg: "Job updated successfully", job: updatedJob },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error while updating the job", error);
    return NextResponse.json(
      { success: false, msg: "Failed to update job" },
      { status: 500 }
    );
  }
}