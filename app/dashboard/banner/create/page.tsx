"use client";

import { createBanner } from "@/app/actions";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { bannerSchemas } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function CreateBanner() {
  const [image, setImages] = useState<string | undefined>(undefined);

  const [lastResult, action] = useActionState(createBanner, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bannerSchemas });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center justify-start gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/banner">
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className="font-semibold text-xl tracking-tight">New Banner</h1>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>Create Your Banner Right Now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Create Banner Title"
                key={fields.title.name}
                name={fields.title.name}
                defaultValue={fields.title.initialValue}
              />
              <p className="text-red-500">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <Input
                type="hidden"
                name={fields.imageBanner.name}
                value={image}
                defaultValue={fields.imageBanner.initialValue}
                key={fields.imageBanner.key}
              />

              {image !== undefined ? (
                <Image
                  src={image}
                  alt="Product Image"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] object-cover border rounded-lg"
                />
              ) : (
                <UploadDropzone
                  endpoint="bannerUploader"
                  onClientUploadComplete={(res) => {
                    setImages(res[0].url);
                  }}
                  onUploadError={() => {
                    alert("something Went Wrong");
                  }}
                />
              )}
               <p className="text-red-500">{fields.imageBanner.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create Banner" />
        </CardFooter>
      </Card>
    </form>
  );
}
