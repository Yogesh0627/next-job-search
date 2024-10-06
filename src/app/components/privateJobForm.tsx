
import { Button } from '@/components/ui/button'
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input,  } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { privateJobValidation } from '@/inputValidations/privateJobValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, PlusCircle, Trash, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { PrivateJob } from '@/models/privateJobModal'

interface JobProps {
    setEditPrivateJob:(job: PrivateJob | null) => void;
    editPrivateJob: PrivateJob;
    handleAddJob:  (jobType:'private'| null) => void;
    privateJobs: PrivateJob[];
    setPrivateJobs: (jobs: PrivateJob[]) => void;
    insertionPrivateFormattedJob : string
}
const PrivateJobForm: React.FC<JobProps>=({setEditPrivateJob,editPrivateJob,handleAddJob,privateJobs,setPrivateJobs,insertionPrivateFormattedJob}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const privateForm = useForm<z.infer<typeof privateJobValidation>>({
        resolver: zodResolver(privateJobValidation),
        defaultValues: {
            _id:"",
            companyName: "",    
            departmentName:"",       
            jobTitle: "",              
            vacancyCount: 0,   
            jobType: "",               
            applicationStartingDate:  new Date(), 
            applicationEndDate: new Date(),    
            eligibility: [],           
            education: "",             
            experience: [],            
            skillsRequired: [],  // Array of skills         
            salaryRange: "",           
            jobLocation: [],                    
            applicationLink: "",       
            companyWebsite: "",        
            contactEmail: "",          
            contactPhone: "",          
            industry: "",              
            source: "",                
            informationLink: "",       
            jobCategory: "Private",           
        },
    });
  // Populate form with job data if in edit mode
  useEffect(() => {
    if (editPrivateJob) {
      privateForm.reset({
        _id: editPrivateJob._id as string || '',
        companyName: editPrivateJob.companyName || '',
        departmentName: editPrivateJob.departmentName || '',
        jobTitle: editPrivateJob.jobTitle || '',
        vacancyCount: editPrivateJob.vacancyCount || 0,
        jobType: editPrivateJob.jobType || '',
        applicationStartingDate:editPrivateJob.applicationStartingDate 
        ? new Date(editPrivateJob.applicationStartingDate) 
        : undefined,
        applicationEndDate: editPrivateJob.applicationEndDate 
        ? new Date(editPrivateJob.applicationEndDate) 
        : undefined,
        eligibility: editPrivateJob.eligibility || [],
        education: editPrivateJob.education || '',
        experience: editPrivateJob.experience || [],
        skillsRequired: editPrivateJob.skillsRequired || [],
        salaryRange: editPrivateJob.salaryRange || '',
        jobLocation: editPrivateJob.jobLocation || [],
        applicationLink: editPrivateJob.applicationLink || '',
        companyWebsite: editPrivateJob.companyWebsite || '',
        contactEmail: editPrivateJob.contactEmail || '',
        contactPhone: editPrivateJob.contactPhone || '',
        industry: editPrivateJob.industry || '',
        source: editPrivateJob.source || '',
        informationLink: editPrivateJob.informationLink || '',
        jobCategory: editPrivateJob.jobCategory || 'Private',
      });
    }
  }, [editPrivateJob, privateForm]);

  useEffect(() => {
    if (insertionPrivateFormattedJob) {
      let formattedJob;
  
      // Ensure that it's parsed if it's a string
      try {
        formattedJob = typeof insertionPrivateFormattedJob === 'string' ? JSON.parse(insertionPrivateFormattedJob) : insertionPrivateFormattedJob;
      } catch (e) {
        console.error("Invalid JSON format for insertionFormattedJob:", e);
        return;
      }
  
      // Reset the form with parsed data
      privateForm.reset({
        _id: formattedJob._id || '',
        companyName: formattedJob.companyName || '',
        departmentName:formattedJob.departmentName || '',
        jobTitle: formattedJob.jobTitle || '',
        vacancyCount: formattedJob.vacancyCount || 0,
        jobType: formattedJob.jobType || '',
        applicationStartingDate: formattedJob.applicationStartingDate
          ? new Date(formattedJob.applicationStartingDate)
          : undefined,
        applicationEndDate: formattedJob.applicationEndDate
          ? new Date(formattedJob.applicationEndDate)
          : undefined,
        eligibility: formattedJob.eligibility || [],
        education: formattedJob.education || '',
        experience: formattedJob.experience || [],
        skillsRequired: formattedJob.skillsRequired || [],
        salaryRange: formattedJob.salaryRange || '',
        jobLocation: formattedJob.jobLocation || [],
        applicationLink: formattedJob.applicationLink || '',
        companyWebsite: formattedJob.companyWebsite || '',
        contactEmail: formattedJob.contactEmail || '',
        contactPhone: formattedJob.contactPhone || '',
        industry: formattedJob.industry || '',
        source: formattedJob.source || '',
        informationLink: formattedJob.informationLink || '',
        jobCategory: formattedJob.jobCategory || 'Private',
      });
    }
  }, [insertionPrivateFormattedJob, privateForm]);
  
    const formClose = ()=>{
        privateForm.reset()
        setEditPrivateJob(null)
        handleAddJob(null)
    }
    // Use useFieldArray to manage skills as an array of input fields
    const { fields:skillsRequiredFields, append:appendSkillsRequired, remove:removeSkillsRequired } = useFieldArray({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        name: 'skillsRequired',
        control: privateForm.control
    });
    const { fields:eligibilityFields, append:appendEligibility, remove:removeEligibility } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'eligibility',
        control: privateForm.control
    });
    const { fields:experienceFields, append:appendExperience, remove:removeExperience } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'experience',
        control: privateForm.control
    });
    const { fields:jobLocationFields, append:appendJobLocation, remove:removeJobLocation } = useFieldArray({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        name: 'jobLocation',
        control: privateForm.control
    });

    const onSubmit = async (data: z.infer<typeof privateJobValidation>) => {
        setIsSubmitting(true)
        try {
            if(editPrivateJob){
                const response = await axios.put(`/api/jobs/privateJobs`,data)
                const updatedJob = response.data.job;

                // Update the privateJobs array
                const updatedPrivateJobs = privateJobs.map((job:PrivateJob) => 
                    job._id === updatedJob._id ? updatedJob : job
                );
                
                // Update the state to immediately reflect the changes in UI
                setPrivateJobs(updatedPrivateJobs);
                toast({ title: "Job updated successfully!", description: response.data.message })
            }
            else{
            const response = await axios.post(`/api/jobs/privateJobs`, data)
            toast({ title: "Job Added successfully!", description: response.data.message })}
        } catch (error) {
            toast({ title: 'Error', description: 'Something went wrong' })
        } finally {
            privateForm.reset()
            formClose()
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <div title="Close" className="w-fit ">
                <X
                    onClick={() => formClose()}
                    className="w-16 h-10 hover:cursor-pointer"
                />
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-400">
                <div className="w-full mt-5 max-w-md p-8 space-y-8 bg-black rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Welcome Admin</h1>
                        <p className="mb-4">Private Job Form</p>
                    </div>
                { privateForm.formState.errors.eligibility && (
                <span>{privateForm.formState.errors.eligibility.message}</span>
                )}
                    <Form {...privateForm}>
                        <form onSubmit={privateForm.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Company Name */}
                            <FormField
                                control={privateForm.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Company Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Department Name */}
                            <FormField
                                control={privateForm.control}
                                name="departmentName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Department Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Job Title */}
                            <FormField
                                control={privateForm.control}
                                name="jobTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Job Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Vacancy Count */}
                            <FormField
                                control={privateForm.control}
                                name="vacancyCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vacancy Count</FormLabel>
                                        <FormControl>
                                            <Input 
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            placeholder="Enter Vacancy Count" 
                                            {...field} 
                                            onChange={(event) => {
                                                const input = event.target.value.trim(); // Remove leading/trailing spaces
                                                const isValidNumber = /^\d*$/.test(input); // Check if input contains only digits or is empty
                                                if (isValidNumber) {
                                                    field.onChange(input === "" ? "" : +input); // Convert valid input to number or keep it empty
                                                }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Job Type */}
                            <FormField
                                control={privateForm.control}
                                name="jobType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Job Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a Job Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="apprentice/internship">Apprentice / InternShip</SelectItem>
                                        <SelectItem value="partTime">Part Time</SelectItem>
                                        <SelectItem value="fullTime">Full Time</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                        <SelectItem value="contractual">Contractual</SelectItem>
                                        <SelectItem value="partTimeRemote">Part Time Remote</SelectItem>
                                        <SelectItem value="fulllTimeRemote">Full Time Remote</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    {/* <FormDescription>
                                    You can manage email addresses in your{" "}
                                    <Link href="/examples/forms">email settings</Link>.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {/* Application Start Date */}
                            <FormField
                                control={privateForm.control}
                                name="applicationStartingDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Application Start Date
                                    </FormLabel>
                                    <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                            format(field.value, "PPP")
                                            ) : (
                                            <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            field.onChange(date); // Ensure field value is set here
                                        }}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        //   initialFocus
                                        />
                                    </PopoverContent>
                                    </Popover>
                                    {/* <FormDescription>
                                    Your date of birth is used to calculate your age.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {/* Application End Date */}
                            <FormField
                                control={privateForm.control}
                                name="applicationEndDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Application End Date
                                    </FormLabel>
                                    <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                            format(field.value, "PPP")
                                            ) : (
                                            <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        //   initialFocus
                                        />
                                    </PopoverContent>
                                    </Popover>
                                    {/* <FormDescription>
                                    Your date of birth is used to calculate your age.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {/* Eligibility Fields */}
                            <div>
                            <FormLabel>Eligibility Criteria</FormLabel>
                            {eligibilityFields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-4">
                                <FormField
                                    control={privateForm.control}
                                    name={`eligibility.${index}`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                        <Input
                                            placeholder={`Eligibility Criteria ${index + 1}`}
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeEligibility(index)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => appendEligibility("")}
                                className="mt-4"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Eligibility Criteria
                            </Button>
                            </div>
                            {/* Education */}
                            <FormField
                                control={privateForm.control}
                                name="education"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Education</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Required Education" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        {/* Experience  Fields */}
                        <div>
                        <FormLabel>Add Required Experience :- </FormLabel>
                        {experienceFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4">
                            <FormField
                                control={privateForm.control}
                                name={`experience.${index}`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input
                                        placeholder={`Experience Required ${index + 1}`}
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeExperience(index)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => appendExperience("")}
                            className="mt-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Experience Required
                        </Button>
                        </div>

                        {/* Skills Required  Fields */}
                        <div>
                        <FormLabel>Add Required Skills :- </FormLabel>
                        {skillsRequiredFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4">
                            <FormField
                                control={privateForm.control}
                                name={`skillsRequired.${index}`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input
                                        placeholder={`Skills Required ${index + 1}`}
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeSkillsRequired(index)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => appendSkillsRequired("")}
                            className="mt-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Skills Required
                        </Button>
                        </div>
                        <FormField
                                control={privateForm.control}
                                name="salaryRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salary :- </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Salary Range" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        {/* Job Location  Fields */}
                        <div>
                        <FormLabel>Job Locations :- </FormLabel>
                        {jobLocationFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4">
                            <FormField
                                control={privateForm.control}
                                name={`jobLocation.${index}`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input
                                        placeholder={`Job Location ${index + 1}`}
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeJobLocation(index)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => appendJobLocation("")}
                            className="mt-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Job Location
                        </Button>
                        </div>
                            {/* Application Link */}
                            <FormField
                                control={privateForm.control}
                                name="applicationLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Application Link" type="url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Company Website */}
                            <FormField
                                control={privateForm.control}
                                name="companyWebsite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Website</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Company Website" type="url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Contact Email */}
                            <FormField
                                control={privateForm.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Contact Email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Contact Phone */}
                            <FormField
                                control={privateForm.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Contact Phone" type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Source  */}
                            <FormField
                                control={privateForm.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Source of Job"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Industry */}
                            <FormField
                                control={privateForm.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Industry"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Information Link */}
                            <FormField
                                control={privateForm.control}
                                name="informationLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Information Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Information Link"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Job Category */}
                            {/* <FormField
                                control={privateForm.control}
                                name="jobCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Job Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Job Category"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            {/* Submit Button */}
                            <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait</>):"Submit"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default PrivateJobForm
