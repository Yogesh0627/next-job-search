import { connectDB } from "@/dbConfig/db";
import GovernmentJobModel from "@/models/governmentJobModel";
import PrivateJobModel from "@/models/privateJobModal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    try {
        await connectDB();
        const { id } = params;  // Destructure the ID

        if (!id) {
            return NextResponse.json({ success: false, msg: "Job ID not provided" }, { status: 400 });
        }

        // Check if the job exists in PrivateJobModel first
        const ifPrivate = await PrivateJobModel.findById(id);
        if (ifPrivate) {            
            return NextResponse.json({ success: true, msg: ifPrivate }, { status: 200 });
        }                                                                                                            
        // If not found in PrivateJobModel, check in GovernmentJobModel
        const ifGovernment = await GovernmentJobModel.findById(id);
        if (ifGovernment) {
            return NextResponse.json({ success: true, msg: ifGovernment }, { status: 200 });
        }

        // If neither found, return a not found response

        return NextResponse.json({ success: false, msg: "Job not found" }, { status: 404 });

    } catch (error) {
        console.error("Error occurred while fetching job:", error);
        return NextResponse.json({ success: false, msg: "Server error while fetching job" }, { status: 500 });
    }
}
