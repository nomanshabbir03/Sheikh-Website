import { useState } from "react";
import styles from "./Contact.module.css";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    setLoading(true);

    const { error } = await supabase.from("bookings").insert([
      {
        full_name: data.full_name,
        email: data.email,
        service_type: data.service_type,
        package: data.package,
        preferred_date: data.preferred_date,
        message: data.message,
      },
    ]);

    if (error) {
      toast.error("Something went wrong. Try again.");
    } else {
      toast.success("Booking request submitted successfully!");
      reset();
    }

    setLoading(false);
  }

  return (
    <div className="section container">
      {/* Header */}
      <div className={styles.header}>
        <p className="eyebrow">Book Consultation</p>
        <h1 className="display-title">
          Let’s Work <em>Together</em>
        </h1>
        <div className="gold-line"></div>
        <p className={styles.subtitle}>
          Select your service, preferred date and share your objectives.
          We’ll get back to you shortly.
        </p>
      </div>

      {/* Calendar Placeholder */}
      <div className={styles.calendarBox}>
        <p>Calendar Embed Placeholder</p>
      </div>

      {/* Content Layout */}
      <div className={styles.grid}>
        {/* Booking Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <input
            type="text"
            placeholder="Full Name"
            {...register("full_name", { required: true })}
          />
          {errors.full_name && (
            <span className={styles.error}>Name is required</span>
          )}

          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className={styles.error}>Email is required</span>
          )}

          <select
            {...register("service_type", { required: true })}
          >
            <option value="">Select Service</option>
            <option value="Consulting">Consulting</option>
            <option value="Visa">Visa Consultancy</option>
            <option value="TGD">TGD Courses</option>
          </select>
          {errors.service_type && (
            <span className={styles.error}>Select a service</span>
          )}

          <select
            {...register("package", { required: true })}
          >
            <option value="">Select Package</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Executive">Executive</option>
          </select>
          {errors.package && (
            <span className={styles.error}>Select a package</span>
          )}

          <input
            type="date"
            {...register("preferred_date", { required: true })}
          />
          {errors.preferred_date && (
            <span className={styles.error}>Select preferred date</span>
          )}

          <textarea
            rows="4"
            placeholder="Tell us about your goals..."
            {...register("message")}
          />

          <button
            type="submit"
            className="btn-gold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>

        {/* Info Column */}
        <div className={styles.info}>
          <h3>Direct Contact</h3>
          <p>Email: info@imsheikhishtiaq.com</p>
          <p>WhatsApp Channel: 2K+ Members</p>

          <div className={styles.stats}>
            <div>
              <strong>500+</strong>
              <span>Consultations</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>Years Experience</span>
            </div>
            <div>
              <strong>40+</strong>
              <span>Countries Reached</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
