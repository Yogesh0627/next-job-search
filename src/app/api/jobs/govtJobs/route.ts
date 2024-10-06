/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { governmentJobValidation } from "@/inputValidations/governmentJobValidation";
import GovernmentJobModel from "@/models/governmentJobModel";
import { connectDB } from "@/dbConfig/db";

// Define the Zod schema to validate the entire body

const governmentJobSchema = governmentJobValidation;

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const body = await request.json();

    // Uncomment if authentication is needed
    /*
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, msg: "Not Authorized" },
        { status: 401 }
      );
    }
    */

    // Preprocess the body to convert date strings to Date objects
    if (body.applicationStartingDate) {
      body.applicationStartingDate = new Date(body.applicationStartingDate);
    }
    if (body.applicationEndDate) {
      body.applicationEndDate = new Date(body.applicationEndDate);
    }
    if (body.examDate) {
      body.examDate = new Date(body.examDate);
    }
    if (body.getAdmitCardDate) {
      body.getAdmitCardDate = new Date(body.getAdmitCardDate);
    }
    if (body.getAdmitCardLastDate) {
      body.getAdmitCardLastDate = new Date(body.getAdmitCardLastDate);
    }
    if (body.resultDate) {
      body.resultDate = new Date(body.resultDate);
    }
    if (body.interviewDate) {
      body.interviewDate = new Date(body.interviewDate);
    }

    // Validate the body using the Zod schema
    const validationResult = governmentJobValidation.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, msg: "Details are not in the correct format", error: validationResult.error.errors },
        { status: 400 }
      );
    }

    // If the validation succeeds, destructure the validated data
    const {
      nameOfDepartment,
      jobTitle,
      vacancyCount,
      jobType,
      applicationStartingDate,
      applicationEndDate,
      eligibility,
      education,
      experience,
      ageLimit,
      reservationCategory,
      applicationFee,
      selectionProcess,
      examDate,
      informationLink,
      getAdmitCardDate,
      getAdmitCardLastDate,
      applicationLink,
      governmentType,
      payGradeRange,
      salaryRange,
      jobLocation,
      address,
      group,
      resultDate,
      interviewDate,
      contactEmail,
      contactPhone,
      source,
      jobCategory,
    } = validationResult.data;

    // Check if the government job already exists
    const isGovernmentJobExist = await GovernmentJobModel.findOne({
      nameOfDepartment,
      jobTitle,
      vacancyCount,
    });

    if (isGovernmentJobExist) {
      return NextResponse.json(
        { success: false, msg: "Job already exists" },
        { status: 409 } // Conflict
      );
    }

    // Create the new government job entry
    const governmentJob = await GovernmentJobModel.create({
      nameOfDepartment,
      jobTitle,
      vacancyCount,
      jobType,
      applicationStartingDate,
      applicationEndDate,
      eligibility,
      education,
      experience,
      ageLimit,
      reservationCategory,
      applicationFee,
      selectionProcess,
      examDate,
      informationLink,
      getAdmitCardDate,
      getAdmitCardLastDate,
      applicationLink,
      governmentType,
      payGradeRange,
      salaryRange,
      jobLocation,
      address,
      group,
      resultDate,
      interviewDate,
      contactEmail,
      contactPhone,
      source,
      jobCategory,
    });

    return NextResponse.json(
      { success: true, msg: "Job created successfully", data: governmentJob },
      { status: 201 } // Created
    );

  } catch (error) {
    console.error("An error occurred while creating the government job", error);
    return NextResponse.json(
      { success: false, msg: "Failed to create job" },
      { status: 500 }
    );
  }
}


// Define the DELETE function to remove all government jobs
export async function DELETE(request: NextRequest) {
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
      // if (session.user.role !== 'admin') {
      //     return NextResponse.json({ success: false, msg: "Insufficient permissions" }, { status: 403 });
      // }
  
      // Delete all jobs from the collection
      const result = await GovernmentJobModel.deleteMany({});
  
      return NextResponse.json(
        { success: true, msg: `All jobs deleted successfully. Deleted count: ${result.deletedCount}` },
        { status: 200 }
      );
  
    } catch (error) {
      console.log("An error occurred while deleting all jobs", error);
      return NextResponse.json(
        { success: false, msg: "Failed to delete jobs" },
        { status: 500 }
      );
    }
}


// GET: Get all government jobs
export async function GET(request: NextRequest) {
  try {  await connectDB()
    // Parse the URL parameters to get the location if provided
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location"); // Extract location from query params

    let jobs;

    // If location is provided, filter jobs by location, otherwise return all jobs
    if (location) {
      jobs = await GovernmentJobModel.find({ jobLocation: location })
                                     .sort({ updatedAt: -1, createdAt: -1 }); // Sort by updatedAt first, then createdAt
    } else {
      // Fetch all jobs and sort by updatedAt or createdAt
      jobs = await GovernmentJobModel.find()
                                     .sort({ updatedAt: -1, createdAt: -1 }); // Sort by updatedAt first, then createdAt
    }

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.log("Error while fetching all private jobs", error);
    return NextResponse.json({ success: false, msg: "Failed to retrieve jobs" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...rest } = body;

    // Define all the fields that should be dates
    const dateFields = [
      'applicationStartingDate',
      'applicationEndDate',
      'examDate',
      'getAdmitCardDate',
      'getAdmitCardLastDate',
      'resultDate',
      'interviewDate',
    ];

    // Convert date fields in the request body to Date objects
    const convertedDates = dateFields.reduce((acc, field) => {
      if (rest[field]) {
        const date = new Date(rest[field]);
        if (!isNaN(date.getTime())) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          acc[field] = date;
        } else {
          return NextResponse.json(
            { success: false, msg: `Invalid date format for ${field}` },
            { status: 400 }
          );
        }
      }
      return acc;
    }, {});

    // Merge the converted date fields back into the request body
    const updatedBody = { ...rest, ...convertedDates };

    // Validate the body using the Zod schema with converted dates
    const validationResult = governmentJobSchema.safeParse(updatedBody);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, msg: "Details are not as per format", errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Find the job by ID and update it
    const updatedJob = await GovernmentJobModel.findByIdAndUpdate(_id, validationResult.data, {
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


