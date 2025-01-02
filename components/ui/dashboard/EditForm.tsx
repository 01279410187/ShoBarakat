"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { editProduct } from "@/app/actions";
import { productSchemas } from "@/app/lib/zodSchemas";
import { Button } from "../button";
import { ChevronLeft, XIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Label } from "../label";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Switch } from "../switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { categories } from "@/app/lib/categories";
import Image from "next/image";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { SubmitButton } from "../SubmitButton";
import { type $Enums } from "@prisma/client";

interface iAppProps {
  data: {
    image: string[];
    name: string;
    id: string;
    price: number;
    description: string;
    status: $Enums.ProductStatus;
    category: $Enums.ProductCategory;
    isFeatured: boolean;
  };
}
export function EditForm({ data }: iAppProps) {
  const [images, setImages] = useState<string[]>(data.image);

  const [lastResult, action] = useActionState(editProduct, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchemas });
    },
    shouldRevalidate: "onInput",
    shouldValidate: "onBlur",
  });

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <Input type="hidden" name="productId" value={data.id} />
      <div className="flex  items-center gap-5">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <p className="font-semibold text-xl tracking-tight">Edit Product</p>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Edit Product Details</CardTitle>
          <CardDescription>In this form you can Edit product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input
                key={fields.name.key}
                name={fields.name.name}
                defaultValue={data.name}
                type="text"
                placeholder="Enter product name"
              />
              <p className="text-red-500">{fields.name.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                defaultValue={data.description}
                placeholder="Enter product Product Description....."
              />
              <p className="text-red-500">{fields.description.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="Enter Product Price"
                key={fields.price.key}
                name={fields.price.name}
                defaultValue={data.price}
              />
              <p className="text-red-500">{fields.price.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Featured Product</Label>
              <Switch
                key={fields.isFeatured.key}
                name={fields.isFeatured.name}
               defaultChecked ={data.isFeatured}
              />
            </div>
            <p className="text-red-500">{fields.isFeatured.errors}</p>
            <div className="flex flex-col gap-3">
              <Label>Select Status</Label>
              <Select
                key={fields.status.key}
                defaultValue={data.status}
                name={fields.status.name}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Featured Value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500">{fields.status.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Select
                key={fields.category.key}
                name={fields.category.name}
                defaultValue={data.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-500">{fields.category.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Product Images</Label>
              <Input
                className="hidden"
                name={fields.image.name}
                value={images}
                key={fields.image.key}
                defaultValue={fields.image.initialValue as string}
              />
              {images.length > 0 ? (
                <div className="flex gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <Image
                        alt="Product Image"
                        src={image}
                        height={100}
                        width={100}
                        className="rounded-lg w-full h-full border object-cover"
                      />
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-white rounded-lg -top-3 absolute -right-3 bg-red-500 p-2"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      setImages(res.map((r) => r.url));
                    }}
                    onUploadError={() => {
                      alert("Something went wrong");
                    }}
                  />
                  <p className="text-red-500">{fields.image.errors}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Edit Product"/>
        </CardFooter>
      </Card>
    </form>
  );
}
