import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a PrivateJob document
export interface PrivateJob extends Document {
    companyName: string;
    departmentName?: string;
    jobTitle: string;
    vacancyCount?: number; // Optional for private jobs
    jobType: string; // e.g., full-time, part-time, contract
    applicationStartingDate?: Date; // Use Date type for dates
    applicationEndDate?: Date; // Use Date type for dates
    eligibility?: string[]; // Optional array for eligibility requirements
    education: string;
    experience?: string[]; // Optional array for experience
    skillsRequired?: string[]; // Optional array for required skills
    salaryRange?: string; // Optional salary range
    jobLocation: string[]; // Required array for job locations
    applicationLink?: string; // Optional URL for the application link
    companyWebsite?: string; // Optional URL for company’s website
    contactEmail?: string; // Optional email
    contactPhone?: string; // Optional phone
    industry?: string; // Optional industry of the job
    source?: string; // Optional source of the job post
    informationLink: string; // Information link must be provided
    jobCategory: string; // Job category is required
}

// Define the schema for PrivateJob
const privateJobSchema: Schema<PrivateJob> = new Schema({
    companyName: { type: String, required: true },
    departmentName: { type: String }, // Optional
    jobTitle: { type: String, required: true },
    vacancyCount: { type: Number }, // Optional
    jobType: { type: String, required: true }, // e.g., full-time, part-time, contract
    applicationStartingDate: { type: Date }, // Optional Date type
    applicationEndDate: { type: Date }, // Optional Date type
    eligibility: { type: [String] }, // Optional array for eligibility requirements
    education: { type: String, required: true },
    experience: { type: [String] }, // Optional array for experience
    skillsRequired: { type: [String] }, // Optional array for required skills
    salaryRange: { type: String }, // Optional salary range
    jobLocation: { type: [String], required: true }, // Required array for job locations
    applicationLink: { 
        type: String, 
        validate: {
            validator: (v: string) => /^https?:\/\//.test(v),
            message: (props: { value: string }) => `${props.value} is not a valid URL!`
        }, 
        required: false 
    },
    companyWebsite: { 
        type: String, 
        validate: {
            validator: (v: string) => /^https?:\/\//.test(v),
            message: (props: { value: string }) => `${props.value} is not a valid URL!`
        }, 
        required: false 
    },
    contactEmail: { 
        type: String, 
        validate: {
            validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
            message: (props: { value: string }) => `${props.value} is not a valid email!`
        }, 
        required: false 
    },
    contactPhone: { type: String }, // Optional phone
    industry: { type: String }, // Optional industry of the job
    source: { type: String }, // Optional source of the job post
    informationLink: { type: String, required: true }, // Required information link
    jobCategory: { type: String, required: true }, // Job category is required
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Ensure model creation, preventing duplicate model definition
const PrivateJobModel = mongoose.models.PrivateJob as mongoose.Model<PrivateJob> || mongoose.model<PrivateJob>("PrivateJob", privateJobSchema);

export default PrivateJobModel;
