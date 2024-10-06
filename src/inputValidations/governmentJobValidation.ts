import { z } from "zod";


export const governmentJobValidation =  z.object({
    _id: z.string().optional(),
    nameOfDepartment: z.string().min(1, { message: "Name of department is required" }),
    jobTitle: z.string().min(1, { message: "Job title is required" }),
    vacancyCount: z.number().min(1, { message: "Vacancy count must be at least 1" }),
    jobType: z.string().min(1, { message: "Job type is required" }), // E.g., "full-time", "part-time"
    applicationStartingDate:z.date().optional(),
    applicationEndDate: z.date().optional(),
    eligibility: z.array(z.string()).optional(),
    education: z.string().min(1, { message: "Education details are required" }),
    experience: z.array(z.string()).optional(), // Optional experience field
    ageLimit: z.string(), // You can adjust the minimum value based on your requirement
    reservationCategory: z.array(z.string()).optional(),
    applicationFee: z.array(z.string()).optional(),
    selectionProcess: z.array(z.string()).optional(),
    examDate: z.date().optional(),
    informationLink: z.string().url({ message: "Information link must be a valid URL" }),
    getAdmitCardDate:  z.date().optional(), // Optional admit card date
    getAdmitCardLastDate:  z.date().optional(), // Optional admit card last date
    applicationLink: z.string().url().optional(), // Optional application link as a valid URL
    governmentType: z.string().min(1, { message: "Government type is required" }),
    payGradeRange: z.string().optional(), // Optional pay grade range
    salaryRange: z.string().optional(), // Optional salary range
    jobLocation: z.array(z.string()).optional(),
    address: z.string().optional(), // Optional address
    group: z.string().optional(), // Group like "A", "B", "C"
    resultDate: z.date().optional(), // Optional result date
    interviewDate: z.date().optional(), // Optional interview date
    contactEmail: z.string().email({ message: "Contact email must be valid" }).optional(), // Optional contact email
    contactPhone: z.string().optional(), // Optional contact phone
    source: z.string().optional(), // Optional source field
    jobCategory: z.string().min(1, "Job category is required") // +
});
  