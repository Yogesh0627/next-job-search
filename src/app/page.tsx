/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PrivateJob } from "@/models/privateJobModal";
import { GovernmentJob } from "@/models/governmentJobModel";
import JobCardGovernment from "./components/JobCardGovernment";
import JobCardPrivate from "./components/JobCardPrivate";
import { PrivateJobCard } from "./components/privateJobCard";
import GovernmentJobCard from "./components/governmentJobCard";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function Home() {
  const [activeJobType, setActiveJobType] = useState<
    "private" | "government" | "it" | null
  >(null);
  const [job, setJob] = useState<PrivateJob | GovernmentJob | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [privateJobs, setPrivateJobs] = useState<PrivateJob[]>([]);
  const [governmentJobs, setGovernmentJobs] = useState<GovernmentJob[]>([]);
  const [itJobs, setItJobs] = useState<PrivateJob[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchedJobsResult, setSearchedJobResult] = useState<(PrivateJob | GovernmentJob)[]>([])
  const { toast } = useToast();

  const getPrivateJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/jobs/privateJobs");
      const it = "IT";
      const itLowerCase = it.toLowerCase();

      const filteredItJobs = response.data.jobs.filter(
        (job: PrivateJob) =>
          job.industry?.toLowerCase() === itLowerCase ||
          job.departmentName?.toLowerCase() === itLowerCase
      );

      setPrivateJobs(response.data.jobs);
      setItJobs(filteredItJobs);
    } catch (err) {
      console.error("Failed to fetch private jobs:", err);
      setError("Failed to fetch private jobs");
    } finally {
      setLoading(false);
    }
  };

  const getGovtJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/jobs/govtJobs");
      setGovernmentJobs(response.data.jobs);
    } catch (err) {
      console.error("Failed to fetch government jobs:", err);
      setError("Failed to fetch government jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (job: PrivateJob | GovernmentJob) => {
    const id = job._id;
    try {
      // Check if the job has an ID
      if (!id) {
        toast({
          title: "Not Copied",
          description: "Job link could not be copied as ID is missing.",
          variant: "destructive",
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
        variant: "default",
      });

      // Optional: Redirect the user to the URL after copying (if needed)
      // window.location.href = url;
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast({
        title: "Error",
        description: "Failed to copy the link.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getGovtJobs();
    getPrivateJobs();
  }, [activeJobType]);
  useEffect(() => {
    if (searchInput) {
        handleSearch(searchInput,searchLocation);
    } else {
        setSearchedJobResult([]); // Reset if input is empty
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchInput,searchLocation]);
  function isPrivateJob(job: PrivateJob | GovernmentJob): job is PrivateJob {
    return (job as PrivateJob).companyName !== undefined;
  }

  function isGovernmentJob(
    job: PrivateJob | GovernmentJob
  ): job is GovernmentJob {
    return (job as GovernmentJob).nameOfDepartment !== undefined;
  }

  const handleButtonClick = (type: "private" | "government" | "it") => {
    setActiveJobType((prevType) => (prevType === type ? null : type));
  };

  const renderContent = () => {
    // Check if search input exists and has length
    if (searchInput && searchInput.length > 0) {
      if (searchedJobsResult.length > 0) {
        return (
          <div>
            <h3>Search Results Found ...</h3>
            {searchedJobsResult.map((job) => {
              if (isPrivateJob(job)) {
                return (
                  <JobCardPrivate
                    key={job._id as string}
                    job={job}
                    handleViewJob={handleViewJob}
                    handleCopy={handleCopy}
                  />
                );
              } else if (isGovernmentJob(job)) {
                return (
                  <JobCardGovernment
                    key={job._id as string}
                    job={job}
                    handleViewJob={handleViewJob}
                    handleCopy={handleCopy}
                  />
                );
              }
              return null;
            })}
          </div>
        );
      } else {
        return <p>No Search Result Found</p>;
      }
    } else {
      return (
        <>
          <h2>Select a job type to view.</h2>
          <div className="flex gap-4 justify-center mt-4">
            <Button onClick={() => handleButtonClick("private")}>
              {activeJobType === "private"
                ? "Hide Private Jobs"
                : "View Private Jobs"}
            </Button>
            <Button onClick={() => handleButtonClick("government")}>
              {activeJobType === "government"
                ? "Hide Government Jobs"
                : "View Government Jobs"}
            </Button>
            <Button onClick={() => handleButtonClick("it")}>
              {activeJobType === "it" ? "Hide IT Jobs" : "View IT Jobs"}
            </Button>
          </div>

          {activeJobType === "private" ? (
            <div>
              <h2>Private Jobs ({privateJobs.length})</h2>
              {privateJobs.map((job: PrivateJob) => (
                <JobCardPrivate
                  key={job._id as string}
                  job={job}
                  handleViewJob={handleViewJob}
                  handleCopy={handleCopy}
                />
              ))}
            </div>
          ) : activeJobType === "government" ? (
            <div>
              <h2>Government Jobs ({governmentJobs.length})</h2>
              {governmentJobs.map((job: GovernmentJob) => (
                <JobCardGovernment
                  key={job._id as string}
                  job={job}
                  handleViewJob={handleViewJob}
                  handleCopy={handleCopy}
                />
              ))}
            </div>
          ) : activeJobType === "it" ? (
            <div>
              <h2>IT Jobs ({itJobs.length})</h2>
              {itJobs.map((job: PrivateJob) => (
                <JobCardPrivate
                  key={job._id as string}
                  job={job}
                  handleViewJob={handleViewJob}
                  handleCopy={handleCopy}
                />
              ))}
            </div>
          ) : null}
        </>
      );
    }
  };
  const handleViewJob = async (Job: PrivateJob | GovernmentJob | null) => {
    let job;
    if (Job?.jobCategory === "Private") {
      // Find the job in privateJobs array
      job = privateJobs.find((privateJob) => privateJob._id === Job._id);
      if (job) {
        setJob(job as PrivateJob);
      } else {
        console.warn("Job not found in privateJobs:", Job._id);
      }
    } else {
      // Find the job in governmentJobs array
      job = governmentJobs.find(
        (governmentJob) => governmentJob._id === Job?._id
      );
      if (job) {
        setJob(job as GovernmentJob);
      } else {
        console.warn("Job not found in governmentJobs:", Job?._id);
      }
    }
  };

  const handleSearch = async (searchInput: string, searchLocation: string) => {
    const combinedJobs: (PrivateJob | GovernmentJob)[] = [...privateJobs, ...governmentJobs, ...itJobs];

    const results = combinedJobs.filter((job) => {
        const normalizedSearchInput = searchInput.toLowerCase();
        const normalizedSearchLocation = searchLocation.toLowerCase();

        // Determine if the job is private or government
        const isPrivate = (job as PrivateJob).companyName !== undefined;

        // Check if search input matches job fields
        const matchesSearchInput = isPrivate
            ? ((job as PrivateJob).companyName?.toLowerCase().includes(normalizedSearchInput) ||
               (job as PrivateJob).industry?.toLowerCase().includes(normalizedSearchInput) ||
               (job as PrivateJob).jobTitle?.toLowerCase().includes(normalizedSearchInput) ||
               (job as PrivateJob).jobType?.toLowerCase().includes(normalizedSearchInput) ||
               (job as PrivateJob).eligibility?.some((item) => item.toLowerCase().includes(normalizedSearchInput)) ||
               (job as PrivateJob).skillsRequired?.some((item) => item.toLowerCase().includes(normalizedSearchInput)))
            : ((job as GovernmentJob).nameOfDepartment?.toLowerCase().includes(normalizedSearchInput) ||
               (job as GovernmentJob).eligibility?.some((item) => item.toLowerCase().includes(normalizedSearchInput)) ||
               (job as GovernmentJob).jobTitle?.toLowerCase().includes(normalizedSearchInput) ||
               (job as GovernmentJob).experience?.some((item) => item.toLowerCase().includes(normalizedSearchInput)));

        // Check if search location matches job location
        const matchesLocation =
            searchLocation === '' || 
            (job.jobLocation && job.jobLocation.some((loc: string) => loc.toLowerCase() === normalizedSearchLocation));

        // Return true if both conditions are met
        return matchesSearchInput && matchesLocation;
    });

    setSearchedJobResult(results);
};

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearch(searchInput,searchLocation); // Run the search logic on Enter key press
    }
};
  return (
<div className="flex items-center justify-center">
<div className="w-full m-auto">
      <div className="flex w-11/12 m-auto justify-around items-center  mt-10" >
        <div className="flex items-center justify-center w-3/4 ">
          <Input className="w-11/12" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} placeholder="Search By  Skills, Company Name, Job Role, Department Name ..." onKeyDown={handleKeyDown}/>
          <X className={`${searchInput.length ? 'visible' : 'hidden'} m-auto `} onClick={() => setSearchInput("")} />
        </div>
        <div className="flex items-center justify-center">
          <Input className="w-full"  onChange={(e)=>setSearchLocation(e.target.value)} value={searchLocation} placeholder="Search By Location ..." onKeyDown={handleKeyDown}/>
          <X className={`${searchLocation.length ? 'visible' : 'hidden'}`} onClick={() => setSearchLocation("")} />
        </div>
      </div>
      {renderContent()}

      <div>
        {job &&
          (job.jobCategory === "Private" ? (
            <PrivateJobCard
              job={job as PrivateJob}
              setJob={setJob}
              onCopy={handleCopy}
            />
          ) : (
            <GovernmentJobCard
              job={job as GovernmentJob}
              setJob={setJob}
              onCopy={handleCopy}
            />
          ))}
      </div>
    </div>
</div>
  );
}
