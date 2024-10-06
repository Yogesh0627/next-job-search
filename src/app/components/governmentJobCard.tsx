import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GovernmentJob } from "@/models/governmentJobModel";
import { PrivateJob } from "@/models/privateJobModal";
import { X } from "lucide-react";
interface governmentJobCardProps {
  onEdit?: (job: GovernmentJob) => void;
  onDelete?: (job: GovernmentJob) => void;
  setJob?: (job: PrivateJob | GovernmentJob | null) => void;
  job: GovernmentJob;
  onCopy : (job: GovernmentJob)=>void
}
const GovernmentJobCard = ({
  job,
  onEdit,
  onDelete,
  setJob,
  onCopy
}: governmentJobCardProps) => {
  return (
    <div>
      <div className="flex flex-row-reverse px-3 mt-5">
        <div title="Close" className="w-fit ">
        {setJob && (
          <div title="Close" className="w-fit ">
          <X
          onClick={() => setJob(null)}
          className="w-20 h-10 hover:cursor-pointer"
        />
      </div>
  )}
        </div>
      </div>
      <div>
        <Card className="p-4 mb-4">
          {/* Header Section */}
          <CardHeader>
            <CardTitle>{job?.nameOfDepartment}</CardTitle>
            <CardDescription>{job?.jobTitle}</CardDescription>
          </CardHeader>

          {/* Content Section */}
          <CardContent>
            <p>
              <strong>Vacancies:</strong> {job?.vacancyCount}
            </p>
            <p>
              <strong>Job Type:</strong> {job?.jobType}
            </p>
            <p>
              <strong>Application Start Date:</strong>{" "}
              {job.applicationStartingDate
                ? new Date(job.applicationStartingDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Application End Date:</strong>{" "}
              {job.applicationEndDate
                ? new Date(job.applicationEndDate).toLocaleDateString()
                : "N/A"}
            </p>

            <p>
              <strong>Eligibility:</strong>
              {Array.isArray(job?.eligibility) && job.eligibility.length > 0
                ? job.eligibility.join(", ")
                : "N/A"}
            </p>

            <p>
              <strong>Education Required:</strong> {job?.education}
            </p>
            <p>
              <strong>Application Fees :</strong>
              {Array.isArray(job?.applicationFee) &&
              job.applicationFee.length > 0
                ? job.applicationFee.join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Experience:</strong>
              {Array.isArray(job?.experience) && job.experience.length > 0
                ? job.experience.join(", ")
                : "N/A"}
            </p>

            <p>
              <strong>Salary Range:</strong> {job?.salaryRange}
            </p>
            <p>
              <strong>Job Location:</strong>
              {Array.isArray(job?.jobLocation) && job.jobLocation.length > 0
                ? job.jobLocation.join(", ")
                : "N/A"}
            </p>

            <p>
              <strong>Application Link:</strong>{" "}
              <a
                href={job?.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {job?.applicationLink}
              </a>
            </p>
            <p>
              <strong>Contact Email:</strong>{" "}
              <a href={`mailto:${job?.contactEmail}`}>{job?.contactEmail}</a>
            </p>
            <p>
              <strong>Contact Phone:</strong> {job?.contactPhone}
            </p>
            <p>
              <strong>Source:</strong>{" "}
              <a
                href={job?.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {job?.source}
              </a>
            </p>
            <p>
              <strong>Information Link:</strong>{" "}
              <a
                href={job?.informationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {job?.informationLink}
              </a>
            </p>
            <p>
              <strong>Job Category:</strong> {job?.jobCategory}
            </p>
          </CardContent>

          {/* Footer Section with Action Buttons */}
          <CardFooter className="flex justify-end space-x-2">
            {onEdit && (
              <Button onClick={() => onEdit(job)} variant="outline">
                Edit
              </Button>
            )}
            {onDelete && (
              <Button onClick={() => onDelete(job)} variant="destructive">
                Delete
              </Button>
            )}
            {onCopy && (
              <Button onClick={() => onCopy(job)} variant="link">
                Copy link to share
              </Button>
            )}
          </CardFooter>
          </Card>
      </div>
    </div>
  );
};

export default GovernmentJobCard;
