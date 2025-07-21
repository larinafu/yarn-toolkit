"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setStatus(null);
      await axios.post("/api/contact", data); // secure backend endpoint
      setStatus("Message sent successfully.");
      reset();
    } catch (error) {
      console.error("Submission error", error);
      setStatus("There was an error sending your message.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 card">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            className="w-full border p-2 rounded"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            {...register("message", {
              required: "Message is required",
              maxLength: 1000,
            })}
            className="w-full border p-2 rounded h-32"
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>

        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>
    </div>
  );
};

export default ContactUs;
