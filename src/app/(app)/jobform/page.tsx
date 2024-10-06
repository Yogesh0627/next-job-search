"use client";
import PrivateJobForm from "@/app/components/privateJobForm";
import GovernmentJobForm from "@/app/components/governmentJobForm"; // Uncomment if you have a GovernmentJobForm component
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { PrivateJob } from "@/models/privateJobModal";
import { PrivateJobCard } from "@/app/components/privateJobCard";
import { GovernmentJob } from "@/models/governmentJobModel";
import GovernmentJobCard from "@/app/components/governmentJobCard";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import JobCardPrivate from "@/app/components/JobCardPrivate";
import JobCardGovernment from "@/app/components/JobCardGovernment";
import JobInsertion from "@/app/components/jobInsertion";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashBoard() {
    const [jobToAdd, setJobToAdd] = useState<'private'| 'government' | null>(null);
    const [activeJobType, setActiveJobType] = useState<'private' | 'government' | null>(null);
    const [privateJobs, setPrivateJobs] = useState<PrivateJob[]>([]); // Use a more specific type based on your job structure
    const [governmentJobs, setGovernmentJobs] = useState<GovernmentJob[]>([]); // Use a more specific type based on your job structure
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState<string>("")
    const [editPrivateJob, setEditPrivateJob] = useState<PrivateJob | null>(null)
    const [editGovernmentJob, setEditGovernmentJob] = useState<GovernmentJob | null>(null)
    const [job, setJob] = useState<PrivateJob | GovernmentJob | null>(null)
    const [searchedJobsResult, setSearchedJobResult] = useState<(PrivateJob | GovernmentJob)[]>([])
    const [jobInsert, setJobInsert] = useState<boolean>(false)
    const [insertionPrivateFormattedJob,setInsertionPrivateFormattedJob] = useState<string>("")
    const [insertionGovernmentFormattedJob,setInsertionGovernmentFormattedJob] = useState<string>("")
    const [searchLocation, setSearchLocation] = useState<string>("");

    const {toast} = useToast()
    const handleAddJob = (type: 'private' | 'government' | null) => {
        setJobToAdd(type);
        setActiveJobType(null)
    };

    const getPrivateJobs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/jobs/privateJobs");
            setPrivateJobs(response.data.jobs);
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

    const handleEditJob =(Job : PrivateJob | GovernmentJob | null)=>{
        if(Job?.jobCategory === 'Private'){
            setEditPrivateJob(Job as PrivateJob)
            handleAddJob('private')
            setJob(null)
        }
        else{
            setEditGovernmentJob(Job as GovernmentJob)
            handleAddJob('government')
            setJob(null)
        }
    }

    const handleDeleteJob = async (Job :  PrivateJob | GovernmentJob | null)=>{
        if(Job?.jobCategory === 'Private'){
            const afterDeletePrivateJobs = privateJobs.filter(job => job._id !== Job?._id )
            const response = await axios.delete(`/api/jobs/privateJobs/${Job?._id}`)
            if(response.data){
                setPrivateJobs(afterDeletePrivateJobs)
                setJob(null)
                toast({title:"Deleted Successfully", description:"Job deleted successfully",variant:'default'})
            }

        }
        else{
            const afterDeleteGovernmentJobs = governmentJobs.filter(job => job._id !== Job?._id )
            const response = await axios.delete(`/api/jobs/govtJobs/${Job?._id}`)
            if(response.data){
                setGovernmentJobs(afterDeleteGovernmentJobs)
                setJob(null)
                toast({title:"Deleted Successfully", description:"Job deleted successfully",variant:'default'})
            }
        }
    }
    const handleViewJob = async (Job: PrivateJob | GovernmentJob | null) => {

            let job;
            if (Job?.jobCategory === 'Private') {
                // Find the job in privateJobs array
                job = privateJobs.find(privateJob => privateJob._id === Job._id);
                if (job) {
                    setJob(job as PrivateJob);
                    setEditPrivateJob(null);
                } else {
                    console.warn("Job not found in privateJobs:", Job._id);
                }
            } else{
                // Find the job in governmentJobs array
                job = governmentJobs.find(governmentJob => governmentJob._id === Job?._id);
                if (job) {
                    setJob(job as GovernmentJob);
                    setEditGovernmentJob(null);
                } else {
                    console.warn("Job not found in governmentJobs:", Job?._id);
                }
            }
        
    };
    
    useEffect(() => {
        // if(activeJobType === 'private'){
            getPrivateJobs(); // Fetch private jobs on component mount
        // }
        // else if(activeJobType === 'government'){
            getGovtJobs(); // Fetch government jobs on component mount
        // }
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
    
    function isGovernmentJob(job: PrivateJob | GovernmentJob): job is GovernmentJob {
        return (job as GovernmentJob).nameOfDepartment !== undefined;
    }
    const handleSearch = async (searchInput: string, searchLocation: string) => {
        // Combine all job arrays for searching, including itJobs
        const combinedJobs: (PrivateJob | GovernmentJob)[] = [...privateJobs, ...governmentJobs];
      
        const results = combinedJobs.filter((job) => {
          // Normalize the search input and location to lowercase for case-insensitive matching
          const normalizedSearchInput = searchInput?.toLowerCase();
          const normalizedSearchLocation = searchLocation?.toLowerCase();
      
          

          // Check if search input matches job fields
          const matchesSearchInput =
            (job as PrivateJob).companyName?.toLowerCase().includes(normalizedSearchInput) ||
            (job as PrivateJob).industry?.toLowerCase().includes(normalizedSearchInput) ||
            (job as PrivateJob).jobTitle?.toLowerCase().includes(normalizedSearchInput) ||
            (job as PrivateJob).jobType?.toLowerCase().includes(normalizedSearchInput) ||
            (job as PrivateJob).eligibility?.some((item) => item.toLowerCase().includes(normalizedSearchInput)) ||
            (job as PrivateJob).skillsRequired?.some((item) => item.toLowerCase().includes(normalizedSearchInput)) ||
            (job as GovernmentJob).nameOfDepartment?.toLowerCase().includes(normalizedSearchInput) ||
            (job as GovernmentJob).jobTitle?.toLowerCase().includes(normalizedSearchInput) ||
            (job as GovernmentJob).experience?.some((item) => item.toLowerCase().includes(normalizedSearchInput));
      
          // Check if search location matches job location
          const matchesLocation =
            searchLocation === '' ||
            (job.jobLocation && job.jobLocation.some((loc) => loc.toLowerCase() === normalizedSearchLocation));
      
          // Return true if both conditions are met
          return matchesSearchInput && matchesLocation;
        });
        
      
        // Update the searchedJobsResult with the matched results
        console.log("RESULTS",results)
        setSearchedJobResult(results);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(searchInput,searchLocation); // Run the search logic on Enter key press
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
              variant: 'destructive'
            });
            return;
          }
      
          // Construct the URL you want to copy (based on the job id)
          const url = `${window.location.origin}/jobform/job/${id}`;
      
          console.log("🚀 ~ handleCopy ~ url:", url)
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
      

    const renderContent = () => {
        // Check if search input exists and has length
        if (searchInput && searchInput.length > 0) {
            // Check if there are search results
            if (searchedJobsResult.length > 0) {
                return (
                    <div>
                        <h3>Search Results Found ...</h3>
                        {searchedJobsResult.map((job) => {
                            // Determine the job type and render the appropriate component
                            if (isPrivateJob(job)) {
                                return (
                                    <JobCardPrivate
                                        key={job._id as string}
                                        job={job}
                                        handleEditJob={handleEditJob}
                                        handleViewJob={handleViewJob}
                                        handleDeleteJob={handleDeleteJob}
                                        handleCopy={handleCopy}
                                    />
                                );
                            } else if (isGovernmentJob(job)) {
                                return (
                                    <JobCardGovernment
                                        key={job._id as string}
                                        job={job}
                                        handleEditJob={handleEditJob}
                                        handleViewJob={handleViewJob}
                                        handleDeleteJob={handleDeleteJob}
                                        handleCopy={handleCopy}
                                    />
                                );
                            }
                            return null; // Return null if job type is unrecognized
                        })}
                    </div>
                );
            } else {
                return <p>No Search Result Found</p>; // Return a paragraph element for consistency
            }
        } else {
            return (
                    <div className={`${jobToAdd === 'private' || jobToAdd === 'government' ? 'hidden' : 'visible'}`}>
                        <h2>Select a job type to view.</h2>
                    <Button
                        onClick={() => setActiveJobType(activeJobType === 'private' ? null : 'private')}
                    >
                        {activeJobType === 'private' ? 'Hide Private Jobs' : 'View Private Jobs'}
                    </Button>
                    <Button
                        onClick={() => setActiveJobType(activeJobType === 'government' ? null : 'government')}
                    >
                        {activeJobType === 'government' ? 'Hide Government Jobs' : 'View Government Jobs'}
                    </Button>
                    
                    {activeJobType === 'private' ? (
                        <div>
                            <h2>Private Jobs ({privateJobs.length})</h2>
                            {privateJobs.map((job: PrivateJob) => (
                                <JobCardPrivate
                                    key={job._id as string}
                                    job={job}
                                    handleEditJob={handleEditJob}
                                    handleViewJob={handleViewJob}
                                    handleDeleteJob={handleDeleteJob}
                                    handleCopy={handleCopy}
                                />
                            ))}
                        </div>
                    ) : activeJobType === 'government' ? (
                        <div>
                            <h2>Government Jobs ({governmentJobs.length})</h2>
                            {governmentJobs.map((job: GovernmentJob) => (
                                <JobCardGovernment
                                    key={job._id as string}
                                    job={job}
                                    handleEditJob={handleEditJob}
                                    handleViewJob={handleViewJob}
                                    handleDeleteJob={handleDeleteJob}
                                    handleCopy={handleCopy}
                                />
                            ))}
                        </div>
                    ) : null} {/* Render nothing if no job type is selected */}
                </div>
            );
        }
    };
    return (
        <>
            <div>

                <div>
                    <div>
                        <Input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} placeholder="Search here by Location, Department, Company, Skills ..." onKeyDown={handleKeyDown}/>
                        <X className={`${searchInput.length ? 'visible' : 'hidden'}`} onClick={() => setSearchInput("")} />
                    </div>
                    {/* <div><Search onClick={() => setJob(null)} className="w-20 h-10 hover:cursor-pointer"/></div> */}
                    <div>
                    <Input onChange={(e)=>setSearchLocation(e.target.value)} value={searchLocation} placeholder="Search By Location ..." onKeyDown={handleKeyDown}/>
                    <X className={`${searchLocation.length ? 'visible' : 'hidden'}`} onClick={() => setSearchLocation("")} />
                    </div>
                </div>



                <div>
                    <div className="flex flex-row-reverse">
                        <Button onClick={() => handleAddJob('private')}>Add Private Job</Button>
                        <Button onClick={() => handleAddJob('government')}>Add Government Job</Button>
                        {jobToAdd === 'private' && <PrivateJobForm setEditPrivateJob={setEditPrivateJob} editPrivateJob = {editPrivateJob as PrivateJob} handleAddJob={handleAddJob} privateJobs={privateJobs} setPrivateJobs = {setPrivateJobs} insertionPrivateFormattedJob={insertionPrivateFormattedJob}/>}
                        {jobToAdd === 'government' && <GovernmentJobForm setEditGovernmentJob={setEditGovernmentJob} editGovernmentJob = {editGovernmentJob as GovernmentJob} handleAddJob={handleAddJob} governmentJobs={governmentJobs} setGovernmentJobs = {setGovernmentJobs} insertionGovernmentFormattedJob={insertionGovernmentFormattedJob} />}
                    </div>
                </div>
                    <div>
                        {loading && <p>Loading jobs...</p>}
                        {error && <p>{error}</p>}
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                <p>Total Number Of Jobs Posted :- {`${privateJobs.length + governmentJobs.length}`} </p>
            
                <div>
                    {job && (
                        job.jobCategory === 'Private' ? (
                            <PrivateJobCard job={job as PrivateJob} onDelete={handleDeleteJob} onEdit={handleEditJob} setJob={setJob} onCopy={handleCopy}/>
                        ) : (
                            <GovernmentJobCard job={job as GovernmentJob} onDelete={handleDeleteJob} onEdit={handleEditJob} setJob={setJob} onCopy={handleCopy}/>
                        )
                    )}
                </div>
                <div>
                    <div>
                        <Button className={`${jobInsert? 'hidden':'visible'}`} onClick={()=>setJobInsert(true)}>Formatted Job From AI</Button>
                    </div>
                    {jobInsert && <JobInsertion setJobInsert={setJobInsert} setInsertionPrivateFormattedJob={setInsertionPrivateFormattedJob} setInsertionGovernmentFormattedJob={setInsertionGovernmentFormattedJob} setJobToAdd={setJobToAdd}/>}
            
                </div>
          
            </div>
        </>
    );
}
