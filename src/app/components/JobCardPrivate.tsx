import { Button } from '@/components/ui/button';
import { PrivateJob } from '@/models/privateJobModal';
import React from 'react';

interface JobDetailsProps {
  job: PrivateJob;
  handleEditJob?: (job: PrivateJob) => void;
  handleDeleteJob?: (job: PrivateJob) => void;
  handleViewJob?: (job: PrivateJob) => void;
  handleCopy?: (job: PrivateJob) => void;
}

const JobCardPrivate: React.FC<JobDetailsProps> = ({ job, handleDeleteJob, handleEditJob, handleViewJob, handleCopy }) => {
  return (
    <>
      <div key={job._id as string} className="job-card p-4 border border-gray-300 rounded-lg mb-4">
        <h1 className="text-xl font-bold"><strong>Company Name: </strong>{job.companyName}</h1>
        <h3 className="text-lg"><strong>Job Title: </strong>{job.jobTitle}</h3>
        <p><strong>Vacancies:</strong> {job.vacancyCount}</p>
        <p><strong>Job Type:</strong> {job.jobType}</p>
        <p><strong>Application Start Date:</strong> {job.applicationStartingDate ? new Date(job.applicationStartingDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Application End Date:</strong> {job.applicationEndDate ? new Date(job.applicationEndDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Job Location:</strong> {job.jobLocation.length > 0 ? job.jobLocation.join(', ') : 'N/A'}</p>
        <p><strong>Company Website:</strong> <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500">{job.companyWebsite}</a></p>
        <p><strong>Industry:</strong> {job.industry}</p>
      </div>

      <div className="mt-4">
        {handleEditJob && (
          <Button onClick={() => handleEditJob(job)} className="mr-2 bg-blue-500 text-white hover:bg-blue-600">
            Edit
          </Button>
        )}
        {handleDeleteJob && (
          <Button onClick={() => handleDeleteJob(job)} className="mr-2 bg-red-500 text-white hover:bg-red-600">
            Delete
          </Button>
        )}
        {handleViewJob && (
          <Button onClick={() => handleViewJob(job)} className="mr-2 bg-green-500 text-white hover:bg-green-600">
            View
          </Button>
        )}
        {handleCopy && (
          <Button onClick={() => handleCopy(job)} className="mr-2 bg-pink-500 text-white hover:bg-pink-600">
            Copy link to share
          </Button>
        )}
      </div>
    </>
  );
};

export default JobCardPrivate;
