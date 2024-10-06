import { GoogleGenerativeAI } from "@google/generative-ai";

export const generativeJob = async (jobData: string,jobCategoryType:string) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    I have the following job data provided as a string:
    
    "${jobData}"
    
    ### Instructions
    1. Analyze the \`jobData\` string provided. The string may contain details for either a government job or a private job.
    2. Determine whether the job is a government job or a private job based on specific keywords:
       - For government jobs, look for keywords such as "Department," "government type," or "official."
       - For private jobs, look for keywords like "Company," "industry," or "corporate."
    3. Extract the relevant fields to create a JSON object that matches the appropriate schema below.
    
    ### Government Job Schema
    {
        "nameOfDepartment": "string",
        "jobTitle": "string",
        "vacancyCount": "number",
        "jobType": "string",
        "applicationStartingDate": "date (optional)",
        "applicationEndDate": "date (optional)",
        "eligibility": "array of strings (optional)",
        "education": "string",
        "experience": "array of strings (optional)",
        "ageLimit": "string",
        "reservationCategory": "array of strings (optional)",
        "applicationFee": "array of strings (optional)",
        "selectionProcess": "array of strings (optional)",
        "examDate": "date (optional)",
        "informationLink": "string URL",
        "getAdmitCardDate": "date (optional)",
        "getAdmitCardLastDate": "date (optional)",
        "applicationLink": "string URL (optional)",
        "governmentType": "string",
        "payGradeRange": "string (optional)",
        "salaryRange": "string (optional)",
        "jobLocation": "array of strings (optional)",
        "address": "string (optional)",
        "group": "string (optional)",
        "resultDate": "date (optional)",
        "interviewDate": "date (optional)",
        "contactEmail": "string email (optional)",
        "contactPhone": "string (optional)",
        "source": "string (optional)",
        "jobCategory": "string"
    }
    
    ### Private Job Schema
    {
        "companyName": "string",
        "jobTitle": "string",
        "vacancyCount": "number (optional)",
        "jobType": "string",
        "applicationStartingDate": "date (optional)",
        "applicationEndDate": "date (optional)",
        "eligibility": "array of strings (optional)",
        "education": "string",
        "experience": "array of strings (optional)",
        "skillsRequired": "array of strings (optional)",
        "salaryRange": "string (optional)",
        "jobLocation": "array of strings (optional)",
        "applicationLink": "string URL (optional)",
        "companyWebsite": "string URL (optional)",
        "contactEmail": "string email (optional)",
        "contactPhone": "string (optional)",
        "industry": "string (optional)",
        "source": "string (optional)",
        "informationLink": "string URL",
        "jobCategory": "string"
    }
    
    ### Expected Output
    - Do not add the _id field as it is creating a new object.
    - Set the jobCategory field to "${jobCategoryType}".
    - Include all details according to the provided job data; if some details are not provided, add the empty fields in the object as per the schema.
    - Provide only the JSON object structured according to the appropriate job schema (government or private), without any additional text or formatting.
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
};




