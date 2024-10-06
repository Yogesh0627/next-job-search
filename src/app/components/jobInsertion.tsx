"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertDataValidation } from "@/inputValidations/insertionDataValidation";

interface jobInsertionProps {
    setJobInsert:(a:boolean)=> void,
    setInsertionPrivateFormattedJob:(value:string)=> void,
    setInsertionGovernmentFormattedJob:(value:string)=> void
    setJobToAdd: (a: 'private' | 'government' | null) => void
}
const JobInsertion: React.FC<jobInsertionProps> =({
  setJobInsert,
  setInsertionPrivateFormattedJob,
  setInsertionGovernmentFormattedJob,
  setJobToAdd,
}) => {
  const [isSubmitting,setIsSubmitting] = useState<boolean>(false)
  const [formattedData, setFormattedData] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertDataValidation>>({
    resolver: zodResolver(insertDataValidation),
    defaultValues: {
      roughJobData: "",
      jobCategoryType: "Private",
    },
  });
  
  const handleClosure = async () => {
    setJobInsert(false);
    setFormattedData("");
    form.reset()
  };

  const insertTextToForm = () => {
    if (formattedData.includes("Private")) {
      setInsertionPrivateFormattedJob(formattedData);
      handleClosure();
      setJobToAdd("private");
      toast({title:"Data Inserted",description:"Data inserted in private form",variant:'default'})
    } else {
      setInsertionGovernmentFormattedJob(formattedData);
      handleClosure();
      setJobToAdd("government");
      toast({title:"Data Inserted",description:"Data inserted in add government form",variant:'default'})
    }
  };

  async function onSubmit(values: z.infer<typeof insertDataValidation>) {
    try {
      setIsSubmitting(true)
      const response = await axios.post(`/api/geminiHelper`, { jobData:values.roughJobData,jobCategoryType : values.jobCategoryType });
      if (response.data.success && response.data.msg) {
        setIsSubmitting(false)
        toast({
          title: "Job Formatted Successsfully",
          description: "Successfully formatted through AI",
          variant: "default",
        });
        setFormattedData(JSON.stringify(response.data.msg, null, 2));
      }
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error fetching job data:", error);
      toast({
        title: "Unsuccessfull",
        description: "Not done",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
        <div>
        <Form {...form}>
     <X className= "hover:cursor-pointer" onClick={()=>handleClosure()}/>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="roughJobData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Rough Job Data :- </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter Job Data"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Job Category Type */}
        <FormField
          control={form.control}
          name="jobCategoryType"
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
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Government">
                    Government
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait</>):"Submit"}
        </Button>
      </form>
    </Form>
        </div>
          <div>
               <div>
                 <X className={`${formattedData.length ? 'visible' : 'hidden'} hover:cursor-pointer`} onClick={()=>setFormattedData("")}/>
                  <pre>{formattedData}</pre>
               </div>
                <div>
                    <Button className={`${formattedData.length ? 'visible' : 'hidden'} hover:cursor-pointer`} disabled={!Object.keys(formattedData).length} onClick={insertTextToForm}>{formattedData.includes('Private')?'Insert Job Data To Private Form':'Insert Job Data To Government Form'}</Button>
                </div>
          </div>
    </div>
  );
};

export default JobInsertion;
