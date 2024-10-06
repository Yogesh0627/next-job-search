import mongoose, { Schema, Document } from 'mongoose';

export interface GovernmentJob extends Document {
  nameOfDepartment: string;
  jobTitle: string;
  vacancyCount: number;
  jobType: string;
  applicationStartingDate?: Date; // Changed to Date
  applicationEndDate?: Date; // Changed to Date
  eligibility?: string[]; // Changed to an array of strings
  education: string;
  experience?: string[]; // Changed to an array of strings
  ageLimit: string; // Assuming this is a string based on your validation
  reservationCategory?: string[]; // Changed to an array of strings
  applicationFee?: string[]; // Changed to an array of strings
  selectionProcess?: string[]; // Changed to an array of strings
  examDate?: Date; // Changed to Date
  informationLink: string;
  getAdmitCardDate?: Date; // Changed to Date
  getAdmitCardLastDate?: Date; // Changed to Date
  applicationLink?: string; // Optional application link as a valid URL
  governmentType: string;
  payGradeRange?: string; // Optional
  salaryRange?: string; // Optional
  jobLocation?: string[]; // Changed to an array of strings
  address?: string; // Optional
  group?: string;
  resultDate?: Date; // Changed to Date
  interviewDate?: Date; // Changed to Date
  contactEmail?: string; // Optional
  contactPhone?: string; // Optional
  source?: string; // Optional
  jobCategory: string; // To differentiate between government and private jobs
}

const governmentJobSchema: Schema = new Schema({
  nameOfDepartment: { type: String, required: true },
  jobTitle: { type: String, required: true },
  vacancyCount: { type: Number, required: true },
  jobType: { type: String, required: true },
  applicationStartingDate: { type: Date }, // Changed to Date
  applicationEndDate: { type: Date }, // Changed to Date
  eligibility: { type: [String], required: false }, // Changed to an array of strings
  education: { type: String, required: true },
  experience: { type: [String], required: false }, // Changed to an array of strings
  ageLimit: { type: String, required: true }, // Assuming ageLimit is a string
  reservationCategory: { type: [String], required: false }, // Changed to an array of strings
  applicationFee: { type: [String], required: false }, // Changed to an array of strings
  selectionProcess: { type: [String], required: false }, // Changed to an array of strings
  examDate: { type: Date, required: false }, // Changed to Date
  informationLink: { type: String, required: true },
  getAdmitCardDate: { type: Date, required: false }, // Changed to Date
  getAdmitCardLastDate: { type: Date, required: false }, // Changed to Date
  applicationLink: { type: String, required: false }, // Optional
  governmentType: { type: String, required: true },
  payGradeRange: { type: String, required: false }, // Optional
  salaryRange: { type: String, required: false }, // Optional
  jobLocation: { type: [String], required: false }, // Changed to an array of strings
  address: { type: String, required: false }, // Optional
  group: { type: String, required: true },
  resultDate: { type: Date, required: false }, // Changed to Date
  interviewDate: { type: Date, required: false }, // Changed to Date
  contactEmail: { type: String, required: false }, // Optional
  contactPhone: { type: String, required: false }, // Optional
  source: { type: String, required: false }, // Optional
  jobCategory: { type: String, required: true }, // 'government' or 'private'
}, {
  timestamps: true
});

const GovernmentJobModel = mongoose.models.governmentJobs as mongoose.Model<GovernmentJob> || mongoose.model<GovernmentJob>("governmentJobs", governmentJobSchema);

export default GovernmentJobModel;
