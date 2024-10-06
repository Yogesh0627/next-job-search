import { NextRequest, NextResponse } from "next/server";
import { generativeJob } from "../ḥelper/geminiRequest/geminiGenerate";

export async function POST (request : NextRequest){

    try {
        const {jobData,jobCategoryType} = await request.json()
    if(!jobData){
        return NextResponse.json({success:false,msg:"jobData Not Found"},{status:402})
    }
    if(!jobCategoryType){
        return NextResponse.json({success:false,msg:"Job Category Not Found"},{status:402})
    }

    const response = await generativeJob(jobData,jobCategoryType)
    const extractJsonObject = (str:string) => {
        // Use regex to match the JSON object part of the string
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const match = str.match(/({.*?})/s);
        if (match) {
            return JSON.parse(match[0]); // Parse the extracted JSON string
        } else {
            throw new Error("No valid JSON found in the input string.");
        }
    };

    if(response){
        const jobObject = extractJsonObject(response)
        return NextResponse.json({success:true,msg:jobObject},{status:200})
    }
    else{
        return NextResponse.json({success:false,msg:"Not able to generate the job from gemini"},{status:402})
    }
    } catch (error) {
        console.log("An error occured while generating Job through AI ")
        return NextResponse.json({success:false,msg:"Server Error"},{status:500})
    }


}