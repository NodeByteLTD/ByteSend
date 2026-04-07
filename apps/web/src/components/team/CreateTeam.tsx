"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@bytesend/ui/src/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@bytesend/ui/src/form";
import { Input } from "@bytesend/ui/src/input";
import { Spinner } from "@bytesend/ui/src/spinner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "@bytesend/ui/src/toaster";
import JoinTeam from "./JoinTeam";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
});

export default function CreateTeam() {
  const createTeam = api.team.createTeam.useMutation();
  const utils = api.useUtils();

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createTeam.mutate(data, {
      onSuccess: () => {
        utils.team.invalidate();
        router.replace("/dashboard");
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-120 w-180 rounded-full bg-primary/8 blur-[120px]" />
      <div className="relative w-[400px] flex flex-col gap-8">
        <JoinTeam showCreateTeam />
        <div>
          <h1 className="font-semibold text-center text-lg">Create Team</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Set up your workspace to start sending</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex flex-col gap-8 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, formState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Team name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  {formState.errors.name ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Request admin to join existing team
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending ? (
                <Spinner className="w-5 h-5" />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
