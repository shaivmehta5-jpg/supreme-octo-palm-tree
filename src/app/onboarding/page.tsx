"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, GraduationCap, Settings2 } from "lucide-react";

// ---------- Validation Schema ----------
const FormSchema = z
  .object({
    track: z.enum(["11", "12", "btech"], { message: "Select your current year or BTech." }),
    btechYear: z.enum(["1", "2", "3", "4"]).optional(),
    stream: z.enum(["Mechanical", "CSE", "Electronics"]).optional(),
    interests: z.array(z.string()).min(0),
    extraInterests: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.track === "btech") {
      if (!val.btechYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choose your BTech year.",
          path: ["btechYear"],
        });
      }
      if (!val.stream) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choose your stream.",
          path: ["stream"],
        });
      }
    }
  });

type FormValues = z.infer<typeof FormSchema>;

// ---------- Constants ----------
const SCHOOL_OPTIONS = [
  { id: "11", label: "11th" },
  { id: "12", label: "12th" },
];
const BTECH_YEARS = [
  { id: "1", label: "1st Year" },
  { id: "2", label: "2nd Year" },
  { id: "3", label: "3rd Year" },
  { id: "4", label: "4th Year" },
];
const BTECH_STREAMS = ["Mechanical", "CSE", "Electronics"] as const;
const INTERESTS_SCHOOL = [
  { id: "JEE", label: "JEE" },
  { id: "Coding", label: "Coding" },
];
const INTERESTS_BTECH = [
  { id: "GATE", label: "GATE" },
  { id: "Parallel degree", label: "Parallel degree" },
];

// ---------- Component ----------
export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      track: undefined as unknown as FormValues["track"],
      btechYear: undefined,
      stream: undefined,
      interests: [],
      extraInterests: "",
    },
    mode: "onChange",
  });

  const watchTrack = form.watch("track");

  // Load session + profile
  React.useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
      // No session? Kick off Google OAuth directly.
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return;
    }
      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!error && data) {
        if (data.completed_onboarding) {
          router.replace("/home");
          return;
        }

        const isBtech = data.education_level === "btech";
        form.reset({
          track: isBtech ? "btech" : (data.school_year as "11" | "12") ?? undefined,
          btechYear: (data.btech_year as "1" | "2" | "3" | "4") ?? undefined,
          stream: (data.stream as FormValues["stream"]) ?? undefined,
          interests: Array.isArray(data.interests) ? data.interests : [],
          extraInterests: data.extra_interests ?? "",
        });
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: FormValues) {
    if (!userId) return;
    setSaving(true);

    const extra = values.extraInterests
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

    const payload = {
      user_id: userId,
      education_level: values.track === "btech" ? "btech" : "school",
      school_year: values.track === "11" || values.track === "12" ? values.track : null,
      btech_year: values.track === "btech" ? values.btechYear ?? null : null,
      stream: values.track === "btech" ? values.stream ?? null : null,
      interests: [...values.interests, ...extra],
      extra_interests: values.extraInterests ?? "",
      completed_onboarding: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_profile")
      .upsert(payload, { onConflict: "user_id" })
      .single();

    setSaving(false);

    if (error) {
      console.error(error);
      toast.error("Couldn't save your preferences. Please try again.");
      return;
    }

    toast.success("Saved! You're all set.");
    router.replace("/home");
  }

  const interestOptions = watchTrack === "btech" ? INTERESTS_BTECH : INTERESTS_SCHOOL;

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background to-muted/30 grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl"
      >
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-primary/10">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Tell us about your journey</CardTitle>
                <CardDescription>
                  Choose your current year, stream (if BTech), and interests. You can change these later in Settings.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Track: 11th / 12th / BTech */}
              <section className="space-y-3">
                <Label className="text-base">Your current stage</Label>
                <RadioGroup
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  value={form.watch("track")}
                  onValueChange={(val) => form.setValue("track", val as FormValues["track"], { shouldValidate: true })}
                >
                  {[...SCHOOL_OPTIONS, { id: "btech", label: "BTech" }].map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2 rounded-2xl border p-3">
                      <RadioGroupItem id={`track-${opt.id}`} value={opt.id} />
                      <Label htmlFor={`track-${opt.id}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.formState.errors.track && (
                  <p className="text-sm text-destructive">{form.formState.errors.track.message as string}</p>
                )}
              </section>

              {/* If BTech, ask year + stream */}
              {watchTrack === "btech" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>BTech year</Label>
                    <Select
                      value={form.watch("btechYear")}
                      onValueChange={(v) => form.setValue("btechYear", v as FormValues["btechYear"], { shouldValidate: true })}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {BTECH_YEARS.map((y) => (
                          <SelectItem key={y.id} value={y.id}>{y.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.btechYear && (
                      <p className="text-sm text-destructive">{form.formState.errors.btechYear.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Stream</Label>
                    <Select
                      value={form.watch("stream")}
                      onValueChange={(v) => form.setValue("stream", v as FormValues["stream"], { shouldValidate: true })}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {BTECH_STREAMS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.stream && (
                      <p className="text-sm text-destructive">{form.formState.errors.stream.message as string}</p>
                    )}
                  </div>
                </section>
              )}

              {/* Interests */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  <Label className="text-base">Interests</Label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interestOptions.map((i) => (
                    <label key={i.id} className="flex items-center gap-3 border rounded-2xl p-3">
                      <Checkbox
                        checked={form.watch("interests").includes(i.id)}
                        onCheckedChange={(checked) => {
                          const current = new Set(form.getValues("interests"));
                          if (checked) current.add(i.id);
                          else current.delete(i.id);
                          form.setValue("interests", Array.from(current));
                        }}
                      />
                      <span>{i.label}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Anything else? (comma-separated)</Label>
                  <Input
                    placeholder={watchTrack === "btech" ? "Ex: AI, Startups" : "Ex: Olympiads, App dev"}
                    value={form.watch("extraInterests")}
                    onChange={(e) => form.setValue("extraInterests", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
              </section>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3">
              <Button type="button" variant="secondary" className="rounded-2xl" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit" className="rounded-2xl" disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving</span>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
