import { z } from "zod";

export const privateJobValidation = z.object({
  _id : z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  departmentName :z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  vacancyCount: z.number().optional(), // Optional
  jobType: z.string().min(1, "Job type is required"), // e.g., full-time, part-time, contract
  applicationStartingDate: z.date().optional(), // Optional
  applicationEndDate: z.date().optional(), // Optional
  eligibility: z.array(z.string()).optional(), // Optional
  education: z.string().min(1, "Education is required"),
  experience: z.array(z.string()).optional(), // Optional
  skillsRequired: z.array(z.string()).optional(), // Optional array for required skills
  salaryRange: z.string().optional(), // Optional
  jobLocation: z.array(z.string()).optional(),
  applicationLink: z.string().url().optional(), // Optional URL for the application link
  companyWebsite: z.string().url().optional(), // Optional URL for company website
  contactEmail: z.string().email().optional(), // Optional email validation
  contactPhone: z.string().optional(), // Optional contact phone
  industry: z.string().optional(), // Optional industry of the job
  source: z.string().optional(), // Optional source of the job post
  informationLink: z.string().url("Information link must be a valid URL").min(1, "Information link is required"),
  jobCategory: z.string().min(1, "Job category is required")
});
