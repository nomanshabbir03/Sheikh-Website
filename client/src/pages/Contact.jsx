import { useState } from "react";
import styles from "./Contact.module.css";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

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
        full_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.phone,
        service_type: data.service_type,
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

      {/* Consultation Contact Section */}
      <div className={styles.consultationCard}>
        <h2 className={styles.consultationHeading}>Need Expert's Guidance?</h2>
        <p className={styles.consultationSubtext}>Our consultants are ready to assist you every step of the way</p>
        
        <div className={styles.iconButtons}>
          <a 
            href="https://wa.me/923365116800" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${styles.iconButton} ${styles.whatsapp}`}
          >
            <FaWhatsapp size={48} />
          </a>
          
          <a 
            href="mailto:contact@sheikhvisaconsultancy.com" 
            className={`${styles.iconButton} ${styles.email}`}
          >
            <MdEmail size={48} />
          </a>
        </div>
      </div>

      {/* Content Layout */}
      <div className={styles.grid}>
        {/* Booking Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          {/* First Group: First Name | Last Name */}
          <div className={styles.fieldGroup}>
            <div className={styles.fieldPair}>
              <input
                type="text"
                placeholder="First Name"
                {...register("first_name", { required: true })}
                className={styles.noBorder}
              />
              <div className={styles.divider}></div>
              <input
                type="text"
                placeholder="Last Name"
                {...register("last_name", { required: true })}
                className={styles.noBorder}
              />
            </div>
          </div>
          {(errors.first_name || errors.last_name) && (
            <span className={styles.error}>Name is required</span>
          )}

          {/* Second Group: Email | Phone */}
          <div className={styles.fieldGroup}>
            <div className={styles.fieldPair}>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", { required: true })}
                className={styles.noBorder}
              />
              <div className={styles.divider}></div>
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone", { required: true })}
                className={styles.noBorder}
              />
            </div>
          </div>
          {(errors.email || errors.phone) && (
            <span className={styles.error}>Email and Phone are required</span>
          )}

          {/* Third Group: Subject */}
          <div className={styles.fieldGroup}>
            <select
              {...register("service_type", { required: true })}
              className={styles.noBorder}
            >
              <option value="">Select Service</option>
              <option value="Consulting">Consulting</option>
              <option value="Visa">Visa Consultancy</option>
              <option value="TGD">TGD Courses</option>
            </select>
          </div>
          {errors.service_type && (
            <span className={styles.error}>Select a service</span>
          )}

          {/* Fourth Group: Message */}
          <div className={styles.fieldGroup}>
            <textarea
              rows="4"
              placeholder="Tell us about your goals..."
              {...register("message")}
              className={styles.noBorder}
            />
          </div>

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
