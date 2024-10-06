// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/dbConfig/db";
import PrivateJobModel from "@/models/privateJobModal";
// import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {  await connectDB()
        const {id} = params
      if (!id) {
        return NextResponse.json({ success: false, msg: "Job ID is required" }, { status: 400 });
      }
  
      const job = await PrivateJobModel.findById(id);
  
      if (!job) {
        return NextResponse.json({ success: false, msg: "Job not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, job }, { status: 200 });
    } catch (error) {
      console.log("Error while fetching the job", error);
      return NextResponse.json({ success: false, msg: "Failed to retrieve job" }, { status: 500 });
    }
}

// DELETE a specific private job by ID
export async function DELETE(request: NextRequest,{ params }: { params: { id: string } }) {
  try {  await connectDB()
    const {id}= params


    // const session = await getServerSession(authOptions);
    
    // Check if user is authorized
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, msg: "Not Authorized" },
    //     { status: 401 }
    //   );
    // }
    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Job ID is required" },
        { status: 400 }
      );
    }
    // Find and delete the specific private job by ID
    const deletedJob = await PrivateJobModel.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json(
        { success: false, msg: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, msg: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting the private job", error);
    return NextResponse.json(
      { success: false, msg: "Failed to delete job" },
      { status: 500 }
    );
  }
}