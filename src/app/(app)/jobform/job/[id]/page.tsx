'use client'
import GovernmentJobCard from '@/app/components/governmentJobCard'
import { PrivateJobCard } from '@/app/components/privateJobCard'
import { useToast } from '@/hooks/use-toast'
import { GovernmentJob } from '@/models/governmentJobModel'
import { PrivateJob } from '@/models/privateJobModal'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const GetJob = ({ params }: { params: { id: string } }) => {
  const [job, setJob] = useState<PrivateJob | GovernmentJob | null>(null) // Allow initial state to be null
  const [loading, setLoading] = useState<boolean>(true) // Loading state
  const {toast} = useToast()
  const getJob = async (id: string) => {
    try {
      const response = await axios.get(`/api/jobs/common/${id}`)
      setJob(response.data.msg) // Assuming response.data.msg is the job object
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false) // Always stop loading when request finishes
    }
  }

  useEffect(() => {
    getJob(params.id) // Correctly pass the params.id here
  }, [params.id]) // Use params.id as dependency to rerun when it changes

  const handleCopy = async (job: PrivateJob | GovernmentJob) => {
    const id = job._id;
    
    try {
      // Check if the job has an ID
      if (!id) {
        toast({
          title: "Not Copied",
          description: "Job link could not be copied as ID is missing.",
          variant: 'destructive'
        });
        return;
      }
  
      // Construct the URL you want to copy (based on the job id)
      const url = `${window.location.origin}/jobform/job/${id}`;
  
      // Copy the URL to the clipboard
      await navigator.clipboard.writeText(url);
  
      // Show success message
      toast({
        title: "Copied",
        description: "Job link copied successfully.",
        variant: 'default'
      });
  
      // Optional: Redirect the user to the URL after copying (if needed)
      // window.location.href = url;
  
    } catch (error) {
      console.error('Failed to copy: ', error);
      toast({
        title: "Error",
        description: "Failed to copy the link.",
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <p>Loading job details...</p> // Add a loading state
  }

  if (!job) {
    return <p>Job details not found.</p>
  }

  return (
    <div>
        {job && job.jobCategory === 'Private'? <PrivateJobCard job={job as PrivateJob} onCopy={handleCopy}/>:<GovernmentJobCard job={job as GovernmentJob} onCopy={handleCopy}/>}
    </div>
  )
}

export default GetJob
