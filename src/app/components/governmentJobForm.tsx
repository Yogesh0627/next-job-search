import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { governmentJobValidation } from '@/inputValidations/governmentJobValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, PlusCircle, Trash, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { CalendarIcon } from '@radix-ui/react-icons'
  import { Calendar } from '@/components/ui/calendar'
  import { cn } from '@/lib/utils'
import { GovernmentJob } from '@/models/governmentJobModel'

interface JobProps {
    setEditGovernmentJob:(job: GovernmentJob | null) => void;
    editGovernmentJob: GovernmentJob;
    handleAddJob:  (jobType:'government'| null) => void;
    governmentJobs: GovernmentJob[];
    setGovernmentJobs: (jobs: GovernmentJob[]) => void;
    insertionGovernmentFormattedJob: string
}

const GovernmentJobForm: React.FC<JobProps> = ({
    setEditGovernmentJob,
    editGovernmentJob,
    handleAddJob,
    governmentJobs,
    setGovernmentJobs,
    insertionGovernmentFormattedJob
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const governmentForm = useForm<z.infer<typeof governmentJobValidation>>({
        resolver: zodResolver(governmentJobValidation),
        defaultValues: {
            _id : "",
            nameOfDepartment: "",
            jobTitle: "",
            vacancyCount: 1,
            jobType: "",
            applicationStartingDate: new Date(),
            applicationEndDate: new Date(),
            eligibility: [""],
            education: "",
            experience: [""],
            ageLimit: "",
            reservationCategory: [""],
            applicationFee: [""],
            selectionProcess: [""],
            examDate: new Date(),
            informationLink: "",
            getAdmitCardDate: new Date(),
            getAdmitCardLastDate: new Date(),
            applicationLink: "",
            governmentType: "",
            payGradeRange: "",
            salaryRange: "",
            jobLocation: [""],
            address: "",
            group: "",
            resultDate: new Date(),
            interviewDate: new Date(),
            contactEmail: "",
            contactPhone: "",
            source: "",
            jobCategory: "government", 
        },
    });

    const onSubmit = async (data: z.infer<typeof governmentJobValidation>) => {
        setIsSubmitting(true);
        try {
            if (editGovernmentJob) {
                const response = await axios.put(`/api/jobs/govtJobs`, data);
                const updatedJob = response.data.job;
    
                // Update the governmentJobs array
                const updatedGovernmentJobs = governmentJobs.map((job: GovernmentJob) => 
                    job._id === updatedJob._id ? updatedJob : job
                );
                
                // Update the state to immediately reflect the changes in UI
                setGovernmentJobs(updatedGovernmentJobs);
                toast({ title: "Job updated successfully!", description: response.data.message,variant:'default' });
            } else {
                const response = await axios.post(`/api/jobs/govtJobs`, data);
                toast({ title: 'Job Added successfully!', description: response.data.message });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Something went wrong' });
        } finally {
            setIsSubmitting(false);
            governmentForm.reset() // Uncomment if you want to reset the form after submission
            formClose()
        }
    };
    
    useEffect(() => {
        if (editGovernmentJob) {
            governmentForm.reset({
                _id: editGovernmentJob._id as string || '', // Keep _id for tracking
                nameOfDepartment: editGovernmentJob.nameOfDepartment || '',
                jobTitle: editGovernmentJob.jobTitle || '',
                vacancyCount: editGovernmentJob.vacancyCount || 0,
                jobType: editGovernmentJob.jobType || '',
                applicationStartingDate: editGovernmentJob.applicationStartingDate 
                    ? new Date(editGovernmentJob.applicationStartingDate) 
                    : undefined,
                applicationEndDate: editGovernmentJob.applicationEndDate 
                    ? new Date(editGovernmentJob.applicationEndDate) 
                    : undefined,
                eligibility: editGovernmentJob.eligibility || [],
                education: editGovernmentJob.education || '',
                experience: editGovernmentJob.experience || [],
                ageLimit: editGovernmentJob.ageLimit , // Defaulting to 18 if not provided
                reservationCategory: editGovernmentJob.reservationCategory || [],
                applicationFee: editGovernmentJob.applicationFee || [],
                selectionProcess: editGovernmentJob.selectionProcess || [],
                examDate: editGovernmentJob.examDate 
                    ? new Date(editGovernmentJob.examDate) 
                    : undefined,
                informationLink: editGovernmentJob.informationLink || '',
                getAdmitCardDate: editGovernmentJob.getAdmitCardDate 
                    ? new Date(editGovernmentJob.getAdmitCardDate) 
                    : undefined,
                getAdmitCardLastDate: editGovernmentJob.getAdmitCardLastDate 
                    ? new Date(editGovernmentJob.getAdmitCardLastDate) 
                    : undefined,
                applicationLink: editGovernmentJob.applicationLink || '',
                governmentType: editGovernmentJob.governmentType || '',
                payGradeRange: editGovernmentJob.payGradeRange || '',
                salaryRange: editGovernmentJob.salaryRange || '',
                jobLocation: editGovernmentJob.jobLocation || [],
                address: editGovernmentJob.address || '',
                group: editGovernmentJob.group || '',
                resultDate: editGovernmentJob.resultDate 
                    ? new Date(editGovernmentJob.resultDate) 
                    : undefined,
                interviewDate: editGovernmentJob.interviewDate 
                    ? new Date(editGovernmentJob.interviewDate) 
                    : undefined,
                contactEmail: editGovernmentJob.contactEmail || '',
                contactPhone: editGovernmentJob.contactPhone || '',
                source: editGovernmentJob.source || '',
                jobCategory: editGovernmentJob.jobCategory || 'Government', // Default to Government
            });
        }
    }, [editGovernmentJob, governmentForm]);
    useEffect(() => {
        if (insertionGovernmentFormattedJob) {
          let formattedJob;
      
          // Ensure that it's parsed if it's a string
          try {
            formattedJob = typeof insertionGovernmentFormattedJob === 'string' ? JSON.parse(insertionGovernmentFormattedJob) : insertionGovernmentFormattedJob;
          } catch (e) {
            console.error("Invalid JSON format for insertionFormattedJob:", e);
            return;
          }
      
          // Reset the form with parsed data
          governmentForm.reset({
            _id: formattedJob._id as string || '', // Keep _id for tracking
            nameOfDepartment: formattedJob.nameOfDepartment || '',
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
            ageLimit: formattedJob.ageLimit , // Defaulting to 18 if not provided
            reservationCategory: formattedJob.reservationCategory || [],
            applicationFee: formattedJob.applicationFee || [],
            selectionProcess: formattedJob.selectionProcess || [],
            examDate: formattedJob.examDate 
                ? new Date(formattedJob.examDate) 
                : undefined,
            informationLink: formattedJob.informationLink || '',
            getAdmitCardDate: formattedJob.getAdmitCardDate 
                ? new Date(formattedJob.getAdmitCardDate) 
                : undefined,
            getAdmitCardLastDate: formattedJob.getAdmitCardLastDate 
                ? new Date(formattedJob.getAdmitCardLastDate) 
                : undefined,
            applicationLink: formattedJob.applicationLink || '',
            governmentType: formattedJob.governmentType || '',
            payGradeRange: formattedJob.payGradeRange || '',
            salaryRange: formattedJob.salaryRange || '',
            jobLocation: formattedJob.jobLocation || [],
            address: formattedJob.address || '',
            group: formattedJob.group || '',
            resultDate: formattedJob.resultDate 
                ? new Date(formattedJob.resultDate) 
                : undefined,
            interviewDate: formattedJob.interviewDate 
                ? new Date(formattedJob.interviewDate) 
                : undefined,
            contactEmail: formattedJob.contactEmail || '',
            contactPhone: formattedJob.contactPhone || '',
            source: formattedJob.source || '',
            jobCategory: formattedJob.jobCategory || 'Government', // Default to Government
        });
        }
      }, [insertionGovernmentFormattedJob, governmentForm]);
    const addTestData = ()=>{
        governmentForm.reset({
            "_id": "",
            "nameOfDepartment": "Ministry of commerce",
            "jobTitle": "sdfsfd",
            "vacancyCount": 1,
            "jobType": "partTime",
            "applicationStartingDate": new Date(),
            "applicationEndDate": new Date(),
            "eligibility": [],
            "education": "sd",
            "experience": [],
            "ageLimit": "23",
            "reservationCategory": [],
            "applicationFee": [],
            "selectionProcess": [],
            "examDate": new Date(),
            "informationLink": "https://ui.shadcn.com/docs/components/calendar#installation",
            "getAdmitCardDate": new Date(),
            "getAdmitCardLastDate": new Date(),
            "applicationLink": "http://localhost:3000/jobform",
            "governmentType": "State Government",
            "payGradeRange": "34334",
            "salaryRange": "dfgdfgdfg dfgdfg",
            "jobLocation": [],
            "address": "A-90  GALI NUMBER 6",
            "group": "Group A",
            "resultDate": new Date(),
            "interviewDate": new Date(),
            "contactEmail": "ashishkhushwaha92@gmail.com",
            "contactPhone": "09540395601",
            "source": "https://ui.shadcn.com/docs/components/calendar#installation",
            "jobCategory": "government"
        })
    }
    const formClose = ()=>{
        governmentForm.reset()
        setEditGovernmentJob(null)
        handleAddJob(null)
    }

    const { fields:eligibilityFields, append:appendEligibility, remove:removeEligibility } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        name: 'eligibility',
        control: governmentForm.control
    });
    const { fields:experienceFields, append:appendExperience, remove:removeExperience } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'experience',
        control: governmentForm.control
    });
    const { fields:jobLocationFields, append:appendJobLocation, remove:removeJobLocation } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'jobLocation',
        control: governmentForm.control
    });
    const { fields:reservationFields, append:appendReservation, remove:removeReservation } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'reservationCategory',
        control: governmentForm.control
    });
    const { fields:applicationFeeFields, append:appendApplicationFees, remove:removeApplicationFees } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'applicationFee',
        control: governmentForm.control
    });
    const { fields:selectionProcessFields, append:appendSelectionProcess, remove:removeSelectionProcess } = useFieldArray({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'selectionProcess',
        control: governmentForm.control
    });
    return (
        <div>
            <div title="Close" className="w-fit ">
                <X
                    onClick={() => formClose()}
                    className="w-20 h-10 hover:cursor-pointer"
                />
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full mt-5 max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Welcome Admin</h1>
                        <p className="mb-4">Private Job Form</p>
                    </div>
                { governmentForm.formState.errors.eligibility && (
                <span>{governmentForm.formState.errors.eligibility.message}</span>
                )}
                    <Form {...governmentForm}>
                        <form onSubmit={governmentForm.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Company Name */}
                            <FormField
                                control={governmentForm.control}
                                name="nameOfDepartment"
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
                                control={governmentForm.control}
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
                                control={governmentForm.control}
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
                                control={governmentForm.control}
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
                                        {/* <SelectItem value="remote">Remote</SelectItem> */}
                                        <SelectItem value="contractual">Contractual</SelectItem>
                                        {/* <SelectItem value="partTimeRemote">Part Time Remote</SelectItem> */}
                                        {/* <SelectItem value="fulllTimeRemote">Full Time Remote</SelectItem> */}
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
                                control={governmentForm.control}
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
                                control={governmentForm.control}
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
                                    control={governmentForm.control}
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
                                control={governmentForm.control}
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
                                control={governmentForm.control}
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
                            {/* Age Limit */}
                            <FormField
                                control={governmentForm.control}
                                name="ageLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Age limit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Maximum Age Limit" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        {/* Reservation Category  Fields */}
                        <div>
                        <FormLabel>Reservation Category :- </FormLabel>
                        {reservationFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4">
                            <FormField
                                control={governmentForm.control}
                                name={`reservationCategory.${index}`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input
                                        placeholder={`Reservation Category ${index + 1}`}
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
                                onClick={() => removeReservation(index)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => appendReservation("")}
                            className="mt-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Reservation Category
                        </Button>
                        </div>

                        {/* Application Fee  Fields */}
                        <div>
                        <FormLabel>Application Fee :- </FormLabel>
                        {applicationFeeFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4">
                            <FormField
                                control={governmentForm.control}
                                name={`applicationFee.${index}`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input
                                        placeholder={`Application Fees ${index + 1}`}
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
                                onClick={() => removeApplicationFees(index)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => appendApplicationFees("")}
                            className="mt-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Application Fee
                        </Button>
                        </div>

                        {/* Selection Process  Fields */}
                        <div>
                        <FormLabel>Selection Process :- </FormLabel>
                        {selectionProcessFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-4">
                            <FormField
                                control={governmentForm.control}
                                name={`selectionProcess.${index}`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input
                                        placeholder={`Selection Process ${index + 1}`}
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
                                onClick={() => removeSelectionProcess(index)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => appendSelectionProcess("")}
                            className="mt-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Selection Process
                        </Button>
                        </div>

                        {/* Exam Date*/}
                        <FormField
                                control={governmentForm.control}
                                name="examDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Exam Date
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

                        {/* Admit Card Start Date*/}
                        <FormField
                                control={governmentForm.control}
                                name="getAdmitCardDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Admit Card Available Date
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

                           {/* Admit Card Last Date*/}
                            <FormField
                                control={governmentForm.control}
                                name="getAdmitCardLastDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Admit Card Last Date
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
                            {/* Application Link */}
                            <FormField
                                control={governmentForm.control}
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
                            {/* Government Type */}
                            <FormField
                                control={governmentForm.control}
                                name="governmentType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Government Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a Government Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="State Government">State Government</SelectItem>
                                        <SelectItem value="Central Government">Central Government</SelectItem>
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
                            {/* PayGrade Range */}
                            <FormField
                                control={governmentForm.control}
                                name="payGradeRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pay Grade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter PayGrade"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Salary Range */}
                            <FormField
                                control={governmentForm.control}
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
                                control={governmentForm.control}
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

                        {/* Government Type */}
                         <FormField
                                control={governmentForm.control}
                                name="group"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Group</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a Group" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Group A">Group A</SelectItem>
                                        <SelectItem value="Group B">Group B</SelectItem>
                                        <SelectItem value="Group C">Group C</SelectItem>
                                        <SelectItem value="Group D">Group D</SelectItem>
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
                            {/* Address */}
                            <FormField
                                control={governmentForm.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter  Address"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Contact Phone */}
                            <FormField
                                control={governmentForm.control}
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
                                control={governmentForm.control}
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
                            {/* Contact Email */}
                            <FormField
                                control={governmentForm.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Contact Email" type='mail'  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Information Link */}
                            <FormField
                                control={governmentForm.control}
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
                        {/* Result Date*/}
                        <FormField
                                control={governmentForm.control}
                                name="resultDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Result Date
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
                        {/* Interview Date*/}
                        <FormField
                                control={governmentForm.control}
                                name="interviewDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Interview Date
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
                            {/* Submit Button */}
                            <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait</>):"Submit"}
                            </Button>
                            <Button type="button" onClick={()=>addTestData()} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add Test DATA'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default GovernmentJobForm;
