import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitComplaint } from "@workspace/api-client-react";
import { PageHeader, Card } from "@/components/shared";
import { Loader2, ArrowRight, Zap, Info } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListComplaintsQueryKey } from "@workspace/api-client-react";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details (at least 20 characters)"),
});

type FormData = z.infer<typeof schema>;

export default function SubmitComplaint() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const { mutateAsync: submit, isPending } = useSubmitComplaint({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      }
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await submit({ data });
      setLocation(`/complaints/${res.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <PageHeader 
        title="Submit a Complaint" 
        description="Describe your issue below. Our AI system will automatically classify and route it to the correct department."
      />

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-4 text-blue-800">
        <Zap className="w-6 h-6 shrink-0 text-blue-600" />
        <div>
          <h4 className="font-semibold mb-1">Smart Routing Active</h4>
          <p className="text-sm text-blue-700">You don't need to select a category or department. Just describe your issue naturally, and we will handle the rest.</p>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Title
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="E.g., Pothole on Main Street"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-foreground placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              {...register("description")}
              rows={6}
              placeholder="Please provide as much detail as possible. Location, time, and specific issues will help us route this perfectly."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-foreground placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Submit & Route <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
