"use client";

import Image from "next/image";
import { useState } from "react";

interface FormErrors {
  customerName: string;
  city: string;
  contactNumber: string;
  email: string;
  feedback: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    customerName: "",
    city: "",
    contactNumber: "",
    email: "",
    feedback: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    customerName: "",
    city: "",
    contactNumber: "",
    email: "",
    feedback: "",
  });

  const [touched, setTouched] = useState({
    customerName: false,
    city: false,
    contactNumber: false,
    email: false,
    feedback: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateCustomerName = (name: string): string => {
    if (!name.trim()) {
      return "Customer name is required";
    }
    if (name.trim().length < 2) {
      return "Customer name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Customer name should only contain letters and spaces";
    }
    return "";
  };

  const validateCity = (city: string): string => {
    if (!city.trim()) {
      return "City is required";
    }
    if (city.trim().length < 2) {
      return "City must be at least 2 characters";
    }
    return "";
  };

  const validateContactNumber = (number: string): string => {
    if (!number.trim()) {
      return "Contact number is required";
    }
    // Allow numbers, +, -, spaces, parentheses
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(number.trim())) {
      return "Please enter a valid contact number";
    }
    if (number.trim().replace(/[\s\-\(\)\+]/g, "").length < 7) {
      return "Contact number must be at least 7 digits";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateFeedback = (feedback: string): string => {
    if (!feedback.trim()) {
      return "Feedback/Complaint is required";
    }
    if (feedback.trim().length < 10) {
      return "Feedback must be at least 10 characters";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field has been touched
    if (touched[name as keyof typeof touched]) {
      let error = "";
      switch (name) {
        case "customerName":
          error = validateCustomerName(value);
          break;
        case "city":
          error = validateCity(value);
          break;
        case "contactNumber":
          error = validateContactNumber(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "feedback":
          error = validateFeedback(value);
          break;
      }
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

    // Validate on blur
    let error = "";
    switch (name) {
      case "customerName":
        error = validateCustomerName(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "contactNumber":
        error = validateContactNumber(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "feedback":
        error = validateFeedback(value);
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      customerName: true,
      city: true,
      contactNumber: true,
      email: true,
      feedback: true,
    });

    // Validate all fields
    const newErrors: FormErrors = {
      customerName: validateCustomerName(formData.customerName),
      city: validateCity(formData.city),
      contactNumber: validateContactNumber(formData.contactNumber),
      email: validateEmail(formData.email),
      feedback: validateFeedback(formData.feedback),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/submit-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          alert('Form submitted successfully! Your feedback has been saved.');
          
          // Reset form after successful submission
          setFormData({
            customerName: "",
            city: "",
            contactNumber: "",
            email: "",
            feedback: "",
          });
          setErrors({
            customerName: "",
            city: "",
            contactNumber: "",
            email: "",
            feedback: "",
          });
          setTouched({
            customerName: false,
            city: false,
            contactNumber: false,
            email: false,
            feedback: false,
          });
        } else {
          alert(`Error: ${result.message || 'Failed to submit feedback. Please try again.'}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {/* Background video from public folder */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/Landing%20video%20Web.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to Giga Mall
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
              We value your feedback
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[200px] h-[100px]">
              <Image
                src="/Giga Mall_.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Customer Feedback Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Customer Name:
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                  errors.customerName && touched.customerName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                }`}
                placeholder="Enter your full name"
              />
              {errors.customerName && touched.customerName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                  errors.city && touched.city
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                }`}
                placeholder="Enter your city"
              />
              {errors.city && touched.city && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.city}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Contact number:
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                  errors.contactNumber && touched.contactNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                }`}
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && touched.contactNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                  errors.email && touched.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Feedback / Complaint */}
            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Feedback / Complaint:
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none ${
                  errors.feedback && touched.feedback
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                }`}
                placeholder="Please share your feedback or complaint..."
              />
              {errors.feedback && touched.feedback && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.feedback}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all transform shadow-lg ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
