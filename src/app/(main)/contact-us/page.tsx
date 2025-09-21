"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Heart,
  Users,
  Shield,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [lastSubmission, setLastSubmission] = useState<number | null>(null);

  // Load form data from localStorage on component mount
  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem("contactFormData");
      const lastSubmissionTime = localStorage.getItem("lastContactSubmission");

      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      }

      if (lastSubmissionTime) {
        setLastSubmission(parseInt(lastSubmissionTime));
      }
    } catch (error) {
      console.warn("Failed to load saved form data:", error);
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("contactFormData", JSON.stringify(formData));
    } catch (error) {
      console.warn("Failed to save form data:", error);
    }
  }, [formData]);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 5)
          return "Subject must be at least 5 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        if (value.trim().length > 1000)
          return "Message must be less than 1000 characters";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting - prevent submission if less than 1 minute has passed
    const now = Date.now();
    if (lastSubmission && now - lastSubmission < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastSubmission)) / 1000);
      toast.error("Please wait before submitting again", {
        description: `You can submit another message in ${remainingTime} seconds.`,
        duration: 4000,
      });
      return;
    }

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Please fix the errors below", {
        description: "All fields must be filled correctly.",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with random failure for demo
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 10% chance of failure for demo purposes
          if (Math.random() < 0.1) {
            reject(new Error("Network error"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      const submissionTime = Date.now();
      setLastSubmission(submissionTime);
      localStorage.setItem("lastContactSubmission", submissionTime.toString());

      toast.success("Message sent successfully!", {
        description: "We&apos;ll get back to you within 24 hours.",
        duration: 5000,
      });

      // Clear form and localStorage
      const emptyForm = {
        name: "",
        email: "",
        subject: "",
        message: "",
      };
      setFormData(emptyForm);
      setErrors(emptyForm);
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false,
      });
      localStorage.removeItem("contactFormData");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message", {
        description: "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime!",
      value: "mukesh0702rawat@gmail.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm",
      value: "+91 8267091327",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value:
        "Sivashish Colony Manpur, Pashchim Dahriya, Rampur Road, Haldwani, Nainital, Uttarakhand",
    },
    {
      icon: Clock,
      title: "Working Hours",
      description: "Our team is here to help",
      value: "Mon-Fri: 8AM-5PM PST",
    },
  ];

  const features = [
    {
      icon: Heart,
      title: "Personalized Matching",
      description:
        "Our advanced algorithm finds your perfect match based on compatibility.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "Your privacy and safety are our top priorities with advanced security.",
    },
    {
      icon: Users,
      title: "Verified Profiles",
      description:
        "Connect with real people through our verified profile system.",
    },
    {
      icon: Star,
      title: "Success Stories",
      description:
        "Join thousands of happy couples who found love through Soulara.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6 font-playfair">
                Get in Touch
              </h1>
              <p className="text-xl text-primary-700 leading-relaxed mb-8">
                Have questions about finding your perfect match? We&apos;re here to
                help you every step of the way on your journey to love and
                meaningful connections.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chat
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-300 text-primary-700 hover:bg-primary-100 px-8"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Schedule Call
                </Button>
              </div>
            </div>

            <div className="flex-1 max-w-md lg:max-w-lg mx-auto">
              <div className="relative">
                <Image
                  src="/assets/contact-us.png"
                  alt="Contact us illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto drop-shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-full opacity-20"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-300 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4 font-playfair">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Choose the most convenient way to get in touch with our support
              team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-primary-200 hover:shadow-lg transition-all duration-300 text-center group hover:border-primary-400"
              >
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors">
                  <info.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-800 mb-3 font-playfair">
                  {info.title}
                </h3>
                <p className="text-foreground mb-4 text-nd">
                  {info.description}
                </p>
                <p className="font-semibold text-primary-700 text-sm leading-relaxed">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4 font-playfair">
              Send us a Message
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible. All fields marked with * are required.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            <Card className="shadow-lg border border-primary-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-primary-800 font-playfair">
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-foreground text-lg">
                  Fill out the form below and we&apos;ll get back to you as soon as
                  possible. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-primary-800 font-medium"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Your full name"
                        required
                        className={`focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                          errors.name && touched.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-primary-800 font-medium"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="your.email@example.com"
                        required
                        className={`focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                          errors.email && touched.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-primary-800 font-medium"
                    >
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="What's this about?"
                      required
                      className={`focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.subject && touched.subject
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {errors.subject && touched.subject && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-primary-800 font-medium"
                    >
                      Message *
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        required
                        className={`focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors ${
                          errors.message && touched.message
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {formData.message.length}/1000
                      </div>
                    </div>
                    {errors.message && touched.message && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform ${
                      isSubmitting ? "scale-95" : "hover:scale-105"
                    }`}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    * Required fields. We&apos;ll respond within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h3 className="text-4xl font-bold text-primary-800 mb-6 font-playfair">
                  Why Choose Soulara?
                </h3>
                <p className="text-xl text-foreground mb-8 leading-relaxed">
                  We&apos;re committed to helping you find meaningful connections in
                  a safe, supportive environment through advanced personality
                  matching.
                </p>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000"
                  alt="Happy couple"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-2xl font-semibold mb-2 font-playfair">
                    Find Your Perfect Match
                  </h4>
                  <p className="text-primary-100">
                    Join thousands of success stories
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-primary-200 hover:border-primary-400 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-primary-800 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-500">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">
              Ready to Find Your Soulmate?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join Soulara today and start your journey to finding meaningful
              connections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-500 hover:bg-primary-50 hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-primary hover:bg-white hover:text-primary-500 px-8 py-4 text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUsPage;
