import { GovernmentJob } from '@/models/governmentJobModel';
import React from 'react';

interface JobDetailsProps {
  job: GovernmentJob;
  handleEditJob?: (job: GovernmentJob) => void;
  handleDeleteJob?: (job: GovernmentJob) => void;
  handleViewJob?: (job: GovernmentJob) => void;
  handleCopy?: (job: GovernmentJob) => void;
}

const JobCardGovernment: React.FC<JobDetailsProps> = ({ job, handleEditJob, handleDeleteJob, handleViewJob, handleCopy }) => {
  return (
    <div key={job._id as string} className="job-card p-4 border border-gray-300 rounded-lg mb-4 shadow-lg">
      <h1 className="text-xl font-bold mb-2">
        <strong>Department Name: </strong>{job.nameOfDepartment}
      </h1>
      <h3 className="text-lg mb-2">
        <strong>Job Title: </strong>{job.jobTitle}
      </h3>
      <p><strong>Vacancies:</strong> {job.vacancyCount}</p>
      <p><strong>Job Type:</strong> {job.jobType}</p>
      <p>
        <strong>Application Start Date:</strong> {job.applicationStartingDate ? new Date(job.applicationStartingDate).toLocaleDateString() : 'N/A'}
      </p>
      <p>
        <strong>Application End Date:</strong> {job.applicationEndDate ? new Date(job.applicationEndDate).toLocaleDateString() : 'N/A'}
      </p>
      <p>
        <strong>Eligibility:</strong> {Array.isArray(job?.eligibility) && job.eligibility.length > 0 ? job.eligibility.join(', ') : 'N/A'}
      </p>
      <p><strong>Education:</strong> {job.education}</p>
      <p>
        <strong>Experience:</strong> {Array.isArray(job?.experience) && job.experience.length > 0 ? job.experience.join(', ') : 'N/A'}
      </p>
      <p>
        <strong>Job Location:</strong> {Array.isArray(job?.jobLocation) && job.jobLocation.length > 0 ? job.jobLocation.join(', ') : 'N/A'}
      </p>
      <p>
        <strong>Information Link:</strong> <a href={job.informationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{job.informationLink}</a>
      </p>

      {/* Optional Additional Fields */}
      {job.payGradeRange && <p><strong>Pay Grade Range:</strong> {job.payGradeRange}</p>}
      {job.salaryRange && <p><strong>Salary Range:</strong> {job.salaryRange}</p>}
      {job.resultDate && <p><strong>Result Date:</strong> {new Date(job.resultDate).toLocaleDateString()}</p>}
      {job.interviewDate && <p><strong>Interview Date:</strong> {new Date(job.interviewDate).toLocaleDateString()}</p>}

      {/* Conditionally Render Action Buttons */}
      <div className="mt-4">
        {handleEditJob && (
          <button onClick={() => handleEditJob(job)} className="mr-2 bg-blue-500 text-white hover:bg-blue-600 p-2 rounded">
            Edit
          </button>
        )}
        {handleDeleteJob && (
          <button onClick={() => handleDeleteJob(job)} className="mr-2 bg-red-500 text-white hover:bg-red-600 p-2 rounded">
            Delete
          </button>
        )}
        {handleViewJob && (
          <button onClick={() => handleViewJob(job)} className="mr-2 bg-green-500 text-white hover:bg-green-600 p-2 rounded">
            View
          </button>
        )}
        {handleCopy && (
          <button onClick={() => handleCopy(job)} className="mr-2 bg-pink-500 text-white hover:bg-pink-600 p-2 rounded">
            Copy link to share
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCardGovernment;
