"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Upload,
  X,
  Plus,
  ImageIcon,
  Palette,
  Building2,
  Mail,
  Phone,
  MapPin,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Copy,
  CheckCircle,
} from "lucide-react";

type Product = {
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
};

type FormData = {
  name: string;
  logoUrl: string;
  description: string;
  type: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  products: Product[];
  primaryColor?: string;
  secondaryColor?: string;
};

export default function CreateBusiness() {
  const router = useRouter();
  const createBusiness = useMutation(api.businesses.create);
  const updateBusiness = useMutation(api.businesses.update);
  const existingBusiness = useQuery(api.businesses.getByUser);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [businessUrl, setBusinessUrl] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);
  const [productForm, setProductForm] = useState<Product>({
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      products: [],
      primaryColor: "#8B5CF6",
      secondaryColor: "#EC4899",
    },
  });

  // Initialize form when existingBusiness loads
  useEffect(() => {
    if (existingBusiness) {
      reset({
        name: existingBusiness.name,
        logoUrl: existingBusiness.logoUrl,
        description: existingBusiness.description,
        type: existingBusiness.type,
        address: existingBusiness.contact.address,
        email: existingBusiness.contact.email,
        phone: existingBusiness.contact.phone,
        website: existingBusiness.contact.website,
        facebook: existingBusiness.socialLinks?.facebook,
        instagram: existingBusiness.socialLinks?.instagram,
        linkedin: existingBusiness.socialLinks?.linkedin,
        twitter: existingBusiness.socialLinks?.twitter,
        youtube: existingBusiness.socialLinks?.youtube,
        products: existingBusiness.products,
        primaryColor: existingBusiness.colors?.primary || "#8B5CF6",
        secondaryColor: existingBusiness.colors?.secondary || "#EC4899",
      });
      setProducts(existingBusiness.products || []);
    }
  }, [existingBusiness, reset]);

  useEffect(() => {
    setValue("products", products);
  }, [products, setValue]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      return url;
    } catch (err) {
      toast.error("Image upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const addProduct = () => {
    if (products.length >= 5) {
      toast.error("Maximum 5 products allowed");
      return;
    }
    if (!productForm.name || !productForm.price) {
      toast.error("Product name and price required");
      return;
    }
    setProducts([...products, productForm]);
    setProductForm({ name: "", price: 0, imageUrl: "", description: "" });
    toast.success("Product added");
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
    toast.success("Product removed");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(businessUrl);
    setUrlCopied(true);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const currentProducts = products;
      const slug = data.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const businessData = {
        name: data.name,
        logoUrl: data.logoUrl,
        description: data.description,
        type: data.type,
        contact: {
          address: data.address,
          email: data.email,
          phone: data.phone,
          website: data.website || "",
        },
        socialLinks: {
          facebook: data.facebook,
          instagram: data.instagram,
          linkedin: data.linkedin,
          twitter: data.twitter,
          youtube: data.youtube,
        },
        colors: {
          primary: data.primaryColor || "#8B5CF6",
          secondary: data.secondaryColor || "#EC4899",
        },
        products: currentProducts,
        slug,
      };

      if (existingBusiness) {
        await updateBusiness({ id: existingBusiness._id, ...businessData });
        toast.success("Business updated successfully!");
        router.push(`/business/${slug}`);
      } else {
        await createBusiness(businessData);
        const fullUrl = `${window.location.origin}/business/${slug}`;
        setBusinessUrl(fullUrl);
        setShowSuccessModal(true);
        toast.success("Business created successfully!");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save business";
      toast.error(errorMessage);
      console.error("Submit error:", err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-4">
              {existingBusiness ? "Edit Your Business" : "Create Your Business"}
            </h1>
            <p className="text-purple-300 text-lg">
              Build your faith-driven business presence in minutes
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Basics */}
            <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Business Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-200 text-base">
                    Business Name *
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                    placeholder="Enter your business name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">
                      Business name is required
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-purple-200 text-base">
                    Business Logo *
                  </Label>
                  <div className="flex items-center gap-4">
                    <label htmlFor="logo" className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-colors bg-purple-950/30 flex flex-col items-center">
                        <Upload className="w-8 h-8 text-purple-300 mb-2" />
                        <span className="text-purple-200">
                          Click to upload logo
                        </span>
                        <span className="text-purple-400 text-sm mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                    </label>
                    <Input
                      id="logo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleImageUpload(file);
                          if (url) setValue("logoUrl", url);
                        }
                      }}
                    />
                    {watch("logoUrl") && (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        src={watch("logoUrl")}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-purple-500/30"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-purple-200 text-base"
                  >
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: true })}
                    className="bg-purple-950/50 border-purple-500/30 text-purple-100 min-h-32"
                    placeholder="Tell us about your business..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm">
                      Description is required
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-purple-200 text-base">
                    Business Type *
                  </Label>
                  <Select
                    onValueChange={(val) => setValue("type", val)}
                    value={watch("type")}
                  >
                    <SelectTrigger className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-950 border-purple-500/30">
                      <SelectItem value="service" className="text-purple-100">
                        Service-Based
                      </SelectItem>
                      <SelectItem value="products" className="text-purple-100">
                        Product-Based
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-red-400 text-sm">
                      Business type is required
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-purple-200">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      {...register("address")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-purple-200">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="hello@business.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-purple-200">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-purple-200">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Website (Optional)
                    </Label>
                    <Input
                      id="website"
                      {...register("website")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="https://yoursite.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
                  <Share2 className="w-6 h-6" />
                  Social Media (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-purple-200">
                      <Facebook className="w-4 h-4 inline mr-2" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      {...register("facebook")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="facebook.com/yourbusiness"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-purple-200">
                      <Instagram className="w-4 h-4 inline mr-2" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      {...register("instagram")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="instagram.com/yourbusiness"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-purple-200">
                      <Linkedin className="w-4 h-4 inline mr-2" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      {...register("linkedin")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="linkedin.com/company/yourbusiness"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-purple-200">
                      <Twitter className="w-4 h-4 inline mr-2" />
                      Twitter/X
                    </Label>
                    <Input
                      id="twitter"
                      {...register("twitter")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="twitter.com/yourbusiness"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="youtube" className="text-purple-200">
                      <Youtube className="w-4 h-4 inline mr-2" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      {...register("youtube")}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      placeholder="youtube.com/@yourbusiness"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Colors */}
            <Card className="bg-purple-900/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-100">
                  <Palette className="w-6 h-6 inline mr-2" />
                  Brand Colors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="text-purple-200">
                      Primary Color
                    </Label>
                    <div className="flex gap-4">
                      <Input
                        id="primaryColor"
                        type="color"
                        {...register("primaryColor")}
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        value={watch("primaryColor")}
                        readOnly
                        className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="text-purple-200">
                      Secondary Color
                    </Label>
                    <div className="flex gap-4">
                      <Input
                        id="secondaryColor"
                        type="color"
                        {...register("secondaryColor")}
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        value={watch("secondaryColor")}
                        readOnly
                        className="bg-purple-950/50 border-purple-500/30 text-purple-100 h-12"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="bg-purple-900/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-100">
                  <ImageIcon className="w-6 h-6 inline mr-2" />
                  Products (Up to 5) - {products.length}/5 added
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {products.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((prod, i) => (
                      <Card
                        key={i}
                        className="bg-purple-950/50 border-purple-500/30 p-4"
                      >
                        <div className="flex gap-4">
                          {prod.imageUrl && (
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-purple-100 font-semibold">
                              {prod.name}
                            </h4>
                            <p className="text-purple-300">${prod.price}</p>
                            {prod.description && (
                              <p className="text-purple-400 text-sm">
                                {prod.description}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(i)}
                            className="text-red-400"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {products.length < 5 && (
                  <div className="bg-purple-950/30 rounded-lg p-6 space-y-4 border border-purple-500/20">
                    <h4 className="text-purple-100 font-semibold">
                      Add New Product
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Product Name"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                        className="bg-purple-950/50 border-purple-500/30 text-purple-100"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={productForm.price || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="bg-purple-950/50 border-purple-500/30 text-purple-100"
                      />
                    </div>
                    <Textarea
                      placeholder="Description (Optional)"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100"
                    />
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="product-image"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-colors bg-purple-950/30 flex items-center justify-center gap-2">
                          <Upload className="w-5 h-5 text-purple-300" />
                          <span className="text-purple-200">
                            Upload Product Image
                          </span>
                        </div>
                      </label>
                      <Input
                        id="product-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file);
                            if (url)
                              setProductForm({ ...productForm, imageUrl: url });
                          }
                        }}
                      />
                      {productForm.imageUrl && (
                        <img
                          src={productForm.imageUrl}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={addProduct}
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {uploading
                ? "Uploading..."
                : existingBusiness
                  ? "Update Business"
                  : "Create Business"}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-purple-100 mb-4">
                Business Created! 🎉
              </h2>
              <p className="text-purple-300 mb-6">
                Your business is now live. Share your unique URL:
              </p>
              <div className="bg-purple-950/50 border border-purple-500/30 rounded-lg p-4 mb-6">
                <p className="text-purple-200 text-sm break-all mb-3">
                  {businessUrl}
                </p>
                <Button
                  onClick={copyToClipboard}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {urlCopied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/feed")}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-200"
                >
                  View All Businesses
                </Button>
                <Button
                  onClick={() =>
                    router.push(businessUrl.replace(window.location.origin, ""))
                  }
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  View My Business
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
