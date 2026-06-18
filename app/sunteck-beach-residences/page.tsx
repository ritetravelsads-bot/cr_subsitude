"use client"

import React, { useRef, useState, FormEvent } from "react"
import Script from "next/script"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { 
  ShieldCheck, Info, Maximize, IndianRupee, Flag, Waves, Building2, 
  GlassWater, ChevronLeft, ChevronRight, MapPin, Ship, TrainTrack, 
  Route, Navigation, Tag, Building, Loader2, Check, AlertCircle, X 
} from "lucide-react"

export default function SunteckBeachResidencesPage() {
  const lifestyleSliderRef = useRef<HTMLDivElement>(null)
  const estateSliderRef = useRef<HTMLDivElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, isSuccess: true, title: "", message: "" })

  const scrollSlider = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const slideWidth = ref.current.firstElementChild?.clientWidth || 300
      const scrollAmount = direction === "left" ? -slideWidth - 16 : slideWidth + 16
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleEOISubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Gather form data securely
    const formData = new FormData(e.currentTarget)
    const payload = {
      user_name: formData.get("user_name"),
      user_phone: formData.get("user_phone"),
      user_email: formData.get("user_email"),
      configuration: formData.get("configuration"),
    }

    try {
      // Call the backend API route we created
      const response = await fetch("/api/send-eoi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setModalState({
          isOpen: true,
          isSuccess: true,
          title: "EOI Registered Successfully",
          message: "Thank you for your interest in Sunteck Beach Residences. Our luxury consultant will contact you shortly regarding the ₹2 Lakh refundable EOI process."
        })
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error(data.error || "Failed to submit")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setModalState({
        isOpen: true,
        isSuccess: false,
        title: "Submission Failed",
        message: "We encountered an issue processing your request. Please try again later or contact us directly."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }))

  return (
    <div className="bg-[#fcfbf9] text-gray-800 antialiased overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
    
    {/* 2. Add the Next.js Scripts right here */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=AW-16516130302" 
        strategy="afterInteractive" 
      />
      <Script id="sunteck-ads-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16516130302');
        `}
      </Script>
    
        <style dangerouslySetInnerHTML={{__html: `
             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@400;500;600;700&display=swap');
             .font-heading { font-family: 'Montserrat', sans-serif; }
             .text-gold-gradient { background: linear-gradient(135deg, #e0c38c 0%, #b49a5b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
             .hide-scrollbar::-webkit-scrollbar { display: none; }
             .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}} />

      <nav className="fixed w-full z-50 bg-[#0f172a]/95 backdrop-blur border-b border-[#b49a5b]/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex-shrink-0 flex items-center gap-2">
              <svg id="Group_61" data-name="Group 61" xmlns="http://www.w3.org/2000/svg" width="85.682" height="41.361" viewBox="0 0 147.682 41.361">
                  <path id="Path_285" data-name="Path 285" d="M220.613,543.778h7.061a15.887,15.887,0,0,0-.158-1.624,6.481,6.481,0,0,0-.5-1.849,3.257,3.257,0,0,0-.971-1.211,2.5,2.5,0,0,0-1.521-.431,3.281,3.281,0,0,0-2.7,1.424,7.035,7.035,0,0,0-1.208,3.691m31.248-13.9h0l-.018-.013-.019-.015a1.9,1.9,0,0,0-.9-.275q-.626-.08-1.258-.124l-.5-.041v-2.2l7.309-.48.562.627v18.369c.7-.72,1.4-1.447,2.1-2.166.928-.959,1.846-1.941,2.708-2.963h.008v-.006a2.565,2.565,0,0,0,.261-.361.575.575,0,0,0,.078-.166c-.015-.1-.323-.2-.391-.223a7.726,7.726,0,0,0-1.414-.316l-.466-.064v-2.209h8.861v2.092l-.376.124a11.338,11.338,0,0,0-2.542,1.113,10.18,10.18,0,0,0-1.69,1.2l0,.005-.007,0c-.418.362-.8.77-1.179,1.168-.607.65-1.237,1.276-1.869,1.9,1.034,1.362,2.04,2.758,3.022,4.164.889,1.276,1.769,2.549,2.673,3.811a4.436,4.436,0,0,0,1.236,1.272,4.242,4.242,0,0,0,1.607.355l.505.032v2.272H264l-.16-.239q-1.488-2.264-2.989-4.524c-.942-1.419-1.916-2.81-2.934-4.172l-.866.851v4.153a1.913,1.913,0,0,0,.172.857.838.838,0,0,0,.477.4h0l.006,0a5.055,5.055,0,0,0,.739.256,4.937,4.937,0,0,0,.826.115l.5.037v2.267h-9.751V554.5l.487-.047c.286-.026.571-.058.859-.089h.01a2.775,2.775,0,0,0,.634-.116.78.78,0,0,0,.45-.347,1.628,1.628,0,0,0,.173-.815v-21.43a2.536,2.536,0,0,0-.222-1.071,1.707,1.707,0,0,0-.547-.707m-7.53,9.406a10.417,10.417,0,0,1-.217,1.045,8.434,8.434,0,0,0-.234,1.853,2.243,2.243,0,0,0,.753,1.64,2.821,2.821,0,0,0,2.014.712,2.04,2.04,0,0,0,1.875-.984,3.636,3.636,0,0,0,.508-1.924,4.819,4.819,0,0,0-1.835-3.965,7.111,7.111,0,0,0-4.559-1.418,8.141,8.141,0,0,0-3.729.875,8.515,8.515,0,0,0-2.828,2.279,10.978,10.978,0,0,0-1.789,3.236,11.927,11.927,0,0,0-.6,3.817,11.57,11.57,0,0,0,2.288,7.462,7.9,7.9,0,0,0,6.423,2.845,7.659,7.659,0,0,0,4.3-1.377,10.034,10.034,0,0,0,3.289-3.686l.233-.432-2.032-1.383-.287.506a8.131,8.131,0,0,1-2.031,2.472,4.21,4.21,0,0,1-2.593.77,3.969,3.969,0,0,1-3.434-1.953,9.554,9.554,0,0,1-1.388-5.378,14.622,14.622,0,0,1,.4-3.655,7.2,7.2,0,0,1,.995-2.35,3.809,3.809,0,0,1,1.31-1.239,3.061,3.061,0,0,1,1.4-.332,4.223,4.223,0,0,1,1.208.174l.005.005a1,1,0,0,1,.559.385m-23.739,7.2h0a13.744,13.744,0,0,0,.311,2.632,7.293,7.293,0,0,0,.977,2.43,4.664,4.664,0,0,0,1.633,1.535,5.034,5.034,0,0,0,2.428.55,4.328,4.328,0,0,0,2.456-.682,7.424,7.424,0,0,0,2.052-2.6l.278-.521,2.15,1.38-.212.434a9.937,9.937,0,0,1-3.15,3.712,7.788,7.788,0,0,1-4.6,1.4,8.984,8.984,0,0,1-3.975-.835,7.949,7.949,0,0,1-2.835-2.285,10.05,10.05,0,0,1-1.643-3.319,14.66,14.66,0,0,1-.53-3.949,12.279,12.279,0,0,1,.57-3.681,10.636,10.636,0,0,1,1.7-3.28,8.345,8.345,0,0,1,2.706-2.283,7.581,7.581,0,0,1,3.646-.882,8.415,8.415,0,0,1,3.547.685,6.4,6.4,0,0,1,2.437,1.894,7.6,7.6,0,0,1,1.324,2.658,11.713,11.713,0,0,1,.424,3.224v1.776ZM205.4,539.8h-3.2v-2.867h3.267v-5.737h4.341v5.737h5.076V539.8h-5.044v9.775a18.172,18.172,0,0,0,.081,1.876,2.957,2.957,0,0,0,.33,1.151v.007a1.351,1.351,0,0,0,.6.589,3.178,3.178,0,0,0,1.313.226c.418,0,.841-.038,1.261-.079a5.24,5.24,0,0,0,1.1-.184l.722-.273v2.491l-.326.14c-.731.321-1.486.613-2.251.864a8.618,8.618,0,0,1-2.706.378,4.294,4.294,0,0,1-3.557-1.377,5.9,5.9,0,0,1-1.015-3.632Zm-16.819,2.633h0V552.9a1.405,1.405,0,0,0,.174.764v0a1.066,1.066,0,0,0,.506.419l.015.006.015,0a2.921,2.921,0,0,0,.683.236,5.571,5.571,0,0,0,.832.122l.5.042v2.262h-9.737V554.5l.493-.047c.28-.026.567-.048.852-.074a2.713,2.713,0,0,0,.633-.126l.007-.005a.747.747,0,0,0,.439-.341l0-.006a1.641,1.641,0,0,0,.172-.815V541.7a2.059,2.059,0,0,0-.208-.925l-.007-.012a1.682,1.682,0,0,0-.535-.664,2.126,2.126,0,0,0-.624-.245,6.184,6.184,0,0,0-.92-.126l-.5-.04v-2.211l6.634-.465.573.6v1.6c.083-.086.169-.167.251-.249a11.241,11.241,0,0,1,1.286-1.081,6.911,6.911,0,0,1,1.72-.8,7.044,7.044,0,0,1,2.227-.335,4.978,4.978,0,0,1,4.206,1.871,7.823,7.823,0,0,1,1.329,4.724v9.593a1.761,1.761,0,0,0,.157.8l0,0a.9.9,0,0,0,.47.385l.006,0a3.871,3.871,0,0,0,.65.232,4.751,4.751,0,0,0,.78.1l.5.037v2.267h-9.738V554.5l.493-.047c.3-.029.612-.048.915-.074a2.912,2.912,0,0,0,.683-.126l.008-.005a.758.758,0,0,0,.444-.341l.008-.006a1.73,1.73,0,0,0,.167-.815V543.6a4.251,4.251,0,0,0-.762-2.685,2.206,2.206,0,0,0-1.75-.87,4.426,4.426,0,0,0-1.554.266,5.672,5.672,0,0,0-1.266.7,3.485,3.485,0,0,0-.82.8c-.14.2-.288.405-.412.616m-15.244,8.909h0V541.023a1.68,1.68,0,0,0-.185-.834v-.009a1.842,1.842,0,0,0-.542-.622,1.515,1.515,0,0,0-.678-.176c-.474-.034-.951-.059-1.419-.076l-.513-.03v-2.23l7.169-.5.6.586V552a1.679,1.679,0,0,0,.179.825,1.871,1.871,0,0,0,.532.584,1.446,1.446,0,0,0,.535.186c.314.035.634.064.943.078l.519.016v3.069l-6.5-.007-.6-.588v-1.7c-.054.046-.111.1-.166.155a6.792,6.792,0,0,1-1.33,1.036,8.116,8.116,0,0,1-1.662.823,7.244,7.244,0,0,1-2.31.284,4.791,4.791,0,0,1-4.009-1.8,8.237,8.237,0,0,1-1.334-4.977V541.16a1.865,1.865,0,0,0-.185-.885,1.717,1.717,0,0,0-.538-.6,1.781,1.781,0,0,0-.61-.244,6.994,6.994,0,0,0-.943-.131l-.5-.031v-2.221l6.632-.5.609.586v13.037a4.166,4.166,0,0,0,.732,2.658,2.111,2.111,0,0,0,1.655.82,4.054,4.054,0,0,0,1.551-.278,4.471,4.471,0,0,0,1.153-.669,5.562,5.562,0,0,0,.778-.756,3.985,3.985,0,0,0,.435-.608M154.69,529.673l.618-1.055h2.272l.16,9.885h-2.411l-.1-.408c-.242-.961-.543-1.91-.871-2.853a9.766,9.766,0,0,0-1.22-2.373,5.4,5.4,0,0,0-1.708-1.574,4.906,4.906,0,0,0-2.458-.573,3.5,3.5,0,0,0-2.53.993,3.138,3.138,0,0,0-1.037,2.391,4.488,4.488,0,0,0,.674,2.552,5.221,5.221,0,0,0,2.043,1.678,26.454,26.454,0,0,0,2.515,1.11c.839.311,1.671.665,2.485,1.032a18.768,18.768,0,0,1,2.131,1.135,8.733,8.733,0,0,1,1.852,1.544,6.685,6.685,0,0,1,1.294,2.228,8.376,8.376,0,0,1,.417,2.762,8.086,8.086,0,0,1-2.669,6.2,9.377,9.377,0,0,1-6.545,2.41,11.685,11.685,0,0,1-3.575-.571,13.877,13.877,0,0,1-2.568-1.109l-.663,1.164h-2.273l-.278-10.161h2.419l.107.4a19.789,19.789,0,0,0,1.021,2.954,10.506,10.506,0,0,0,1.5,2.41,6.963,6.963,0,0,0,2.012,1.628,6.309,6.309,0,0,0,4.624.283,3.218,3.218,0,0,0,1.29-.806,3.356,3.356,0,0,0,.733-1.259,5.371,5.371,0,0,0,.252-1.741,4.938,4.938,0,0,0-.779-2.68,4.823,4.823,0,0,0-2.317-1.872q-1.318-.549-2.654-1.071c-.886-.349-1.767-.717-2.639-1.123a9.176,9.176,0,0,1-3.55-2.822,7.707,7.707,0,0,1-1.287-4.585,7.457,7.457,0,0,1,.632-3.05,8.06,8.06,0,0,1,4.445-4.141,8.692,8.692,0,0,1,3.145-.583,8.935,8.935,0,0,1,3.354.6,15.056,15.056,0,0,1,2.138,1.055" transform="translate(-140.24 -515.402)" fill="#fff"/>
                  <path id="Path_286" data-name="Path 286" d="M281.686,556.763c2.521-6.327,3.089-12.153.329-18.319a23.535,23.535,0,0,0-2.106-3.77,7.7,7.7,0,0,0-.49-.621c-.349-.428-.767-1.015-.223-.878a1.978,1.978,0,0,1,.474.263,10.864,10.864,0,0,1,.922.772,22.462,22.462,0,0,1,6.572,22.553Z" transform="translate(-140.24 -515.402)" fill="#e5912a" fill-rule="evenodd"/>
                  <path id="Path_287" data-name="Path 287" d="M279.876,556.763c5.665-13.222-.281-20.032-4.282-26.829-1.864-3.169-3.485-6.412-2.829-9.628a7.1,7.1,0,0,1,2.029-3.97c.242-.254.553-.5.752-.712.254-.322-.185-.35-1.17.3-.225.163-.447.323-.659.51-4.339,3.944-3.487,9.325-1.412,14.138,3.056,7.055,7.753,13.7.6,26.191Z" transform="translate(-140.24 -515.402)" fill="#e5912a" fill-rule="evenodd"/>
                </svg>
              <span className="text-s uppercase tracking-[0.2em] border-l border-gray-600 pl-2 pt-2 text-gray-300 hidden sm:block">Oceanopolis</span>
            </div>
            <div className="hidden md:flex space-x-6 text-sm font-medium tracking-wide">
              <a href="#overview" className="hover:text-[#c5a365] transition">Overview</a>
              <a href="#pricing" className="hover:text-[#c5a365] transition">Pricing</a>
              <a href="#amenities" className="hover:text-[#c5a365] transition">Lifestyle</a>
              <a href="#location" className="hover:text-[#c5a365] transition">Location</a>
            </div>
            <div>
              <a href="#contact" className="bg-[#b49a5b] hover:bg-[#917943] text-white text-xs font-semibold py-2 px-4 uppercase tracking-wider transition rounded-sm">
                Submit EOI
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section id="overview" className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/img/img385.jpg" alt="Luxury Beachfront" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start mt-12">
          <span className="text-[#c5a365] text-xs font-semibold uppercase tracking-[0.3em] mb-3">Sunteck Beach Residences</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 max-w-2xl">
            Mumbai's Luxury <br/>Beachfront Living.
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-6 max-w-xl leading-relaxed border-l-2 border-[#b49a5b] pl-4">
            The most exclusive phase of a 50-acre private estate. Uninterrupted sea views, a 9-acre golf course, and elite coastal living just 500 meters from Suruchi Beach, Vasai (W).
          </p>
          
          <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#b49a5b]/30 p-5 rounded-sm inline-block w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Priority Allotment</p>
                <p className="text-lg font-heading font-semibold text-white">Refundable EOI: ₹2 Lakhs</p>
              </div>
              <ShieldCheck className="text-[#c5a365] w-6 h-6" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-300">
              <div className="border border-white/10 p-2 rounded-sm bg-white/5">
                <span className="block text-[#c5a365] font-semibold mb-1">2 BHK Premium</span>
                From ₹ 1.08 Cr*
              </div>
              <div className="border border-white/10 p-2 rounded-sm bg-white/5">
                <span className="block text-[#c5a365] font-semibold mb-1">3 BHK Luxury</span>
                From ₹ 1.86 Cr*
              </div>
            </div>
            <a href="#contact" className="block w-full text-center bg-white text-[#0f172a] hover:bg-[#b49a5b] hover:text-white transition text-xs font-bold py-3 uppercase tracking-wider rounded-sm">
              Express Interest
            </a>
          </div>
        </div>
      </section>

      <div className="bg-[#0f172a] border-y border-[#b49a5b]/30 text-white py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-gray-700">
            <div className="px-2">
              <p className="text-[#c5a365] text-sm font-heading font-semibold mb-1">500 Mtrs</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">From Suruchi Beach</p>
            </div>
            <div className="px-2">
              <p className="text-[#c5a365] text-sm font-heading font-semibold mb-1">50 Acres</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Private Coastal Estate</p>
            </div>
            <div className="px-2">
              <p className="text-[#c5a365] text-sm font-heading font-semibold mb-1">9 Acres</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Sea-Facing Golf Course</p>
            </div>
            <div className="px-2">
              <p className="text-[#c5a365] text-sm font-heading font-semibold mb-1">23 Acres</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Lush Open Greenery</p>
            </div>
          </div>
        </div>
      </div>

      <section id="pricing" className="py-10 bg-[#f9f8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-300 pb-4">
            <div className="max-w-2xl">
              <h2 className="text-xs text-[#917943] font-bold uppercase tracking-[0.2em] mb-2">Curated Residences</h2>
              <h3 className="font-heading text-3xl font-semibold text-[#0f172a]">Exclusive Pricing & Configurations</h3>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500 flex items-center">
              <Info className="w-4 h-4 mr-1 mb-0.5 inline" /> Uniform Pricing: ₹15,500 per sq.ft.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#b49a5b]/30 rounded-sm shadow-sm hover:shadow-md transition group overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-2/5 bg-gray-100 relative h-48 sm:h-auto overflow-hidden">
                <img src="/img/img232.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="2 BHK Premium" />
                <div className="absolute inset-0 bg-[#0f172a]/10"></div>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                <h4 className="font-heading text-xl font-semibold text-[#0f172a] mb-1">2 BHK Premium</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Oceanopolis Phase</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs text-gray-500 flex items-center"><Maximize className="w-3 h-3 mr-2 text-[#b49a5b]" /> Carpet Area</span>
                    <span className="text-sm font-medium text-gray-800">700 - 850 sq.ft.</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs text-gray-500 flex items-center"><IndianRupee className="w-3 h-3 mr-2 text-[#b49a5b]" /> Rate</span>
                    <span className="text-sm font-medium text-gray-800">₹ 15,500 psf</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Starting From</p>
                    <p className="font-heading text-xl text-[#917943] font-semibold">₹ 1.08 Cr*</p>
                  </div>
                  <a href="#contact" className="border border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white text-xs px-4 py-2 transition rounded-sm uppercase tracking-wider font-medium">Book EOI</a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#b49a5b]/30 rounded-sm shadow-sm hover:shadow-md transition group overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-2/5 bg-gray-100 relative h-48 sm:h-auto overflow-hidden">
                <img src="/img/img215.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="3 BHK Luxury" />
                <div className="absolute inset-0 bg-[#0f172a]/10"></div>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                <h4 className="font-heading text-xl font-semibold text-[#0f172a] mb-1">3 BHK Luxury</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Oceanopolis Phase</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs text-gray-500 flex items-center"><Maximize className="w-3 h-3 mr-2 text-[#b49a5b]" /> Carpet Area</span>
                    <span className="text-sm font-medium text-gray-800">1200 - 1400 sq.ft.</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs text-gray-500 flex items-center"><IndianRupee className="w-3 h-3 mr-2 text-[#b49a5b]" /> Rate</span>
                    <span className="text-sm font-medium text-gray-800">₹ 15,500 psf</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Starting From</p>
                    <p className="font-heading text-xl text-[#917943] font-semibold">₹ 1.86 Cr*</p>
                  </div>
                  <a href="#contact" className="border border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white text-xs px-4 py-2 transition rounded-sm uppercase tracking-wider font-medium">Book EOI</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="amenities" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-xs text-[#917943] font-bold uppercase tracking-[0.2em] mb-2">The Estate</h2>
            <h3 className="font-heading font-semibold text-3xl text-[#0f172a] mb-4">A Realm of the Truly Extraordinary</h3>
            <p className="text-sm text-gray-600">Built to perform long after others peak. Crafted with enduring design, robust construction, and timeless appeal, reserved for the exceptional few.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group h-64 overflow-hidden rounded-sm">
              <img src="/img/img400.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="Golf Course" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <Flag className="text-[#c5a365] w-5 h-5 mb-2" />
                <h4 className="font-heading font-semibold text-white text-lg">9-Acre Golf Course</h4>
                <p className="text-[10px] text-gray-300 uppercase tracking-wide">Sweeping Sea Views</p>
              </div>
            </div>
            
            <div className="relative group h-64 overflow-hidden rounded-sm">
              <img src="/img/img291.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="Beachfront Lifestyle" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <Waves className="text-[#c5a365] w-5 h-5 mb-2" />
                <h4 className="font-heading font-semibold text-white text-lg">Beachfront Lifestyle</h4>
                <p className="text-[10px] text-gray-300 uppercase tracking-wide">Exclusive Coastal Shacks</p>
              </div>
            </div>

            <div className="relative group h-64 overflow-hidden rounded-sm">
              <img src="/img/img238.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="Grand Atriums" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <Building2 className="text-[#c5a365] w-5 h-5 mb-2" />
                <h4 className="font-heading font-semibold text-white text-lg">Grand Atriums</h4>
                <p className="text-[10px] text-gray-300 uppercase tracking-wide">Magnificent Architecture</p>
              </div>
            </div>

            <div className="relative group h-64 overflow-hidden rounded-sm">
              <img src="/img/img241.jpg" className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="Infinity Pool" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <GlassWater className="text-[#c5a365] w-5 h-5 mb-2" />
                <h4 className="font-heading font-semibold text-white text-lg">Luxury Club</h4>
                <p className="text-[10px] text-gray-300 uppercase tracking-wide">Infinity Pool & Spa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-10 bg-[#fcfbf9] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-300 pb-4">
            <div>
              <h2 className="text-xs text-[#917943] font-bold uppercase tracking-[0.2em] mb-2">The Coastal Life</h2>
              <h3 className="font-heading font-semibold text-3xl text-[#0f172a]">Everyday by the Ocean</h3>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => scrollSlider(lifestyleSliderRef, 'left')} className="w-10 h-10 border border-[#b49a5b] flex items-center justify-center text-[#917943] hover:bg-[#b49a5b] hover:text-white transition rounded-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollSlider(lifestyleSliderRef, 'right')} className="w-10 h-10 border border-[#b49a5b] flex items-center justify-center text-[#917943] hover:bg-[#b49a5b] hover:text-white transition rounded-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div ref={lifestyleSliderRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4">
            {[
              { src: "/img/img869.jpg", title: "Private Ocean Vistas", sub: "A Signature in the Sky" },
              { src: "/img/img817.jpg", title: "Sunset Dining", sub: "Curated Culinary Experiences" },
              { src: "/img/img609.jpg", title: "Coastal Wellness", sub: "A Seaside Pause for Peace" },
              { src: "/img/img677.jpg", title: "Adventure & Sports", sub: "Dive into the Blue" },
              { src: "/img/img541.jpg", title: "Energizing Mornings", sub: "Active Beachfront Lifestyle" },
              { src: "/img/img747.jpg", title: "Family Moments", sub: "Cherished Memories Everyday" },
            ].map((slide, i) => (
              <div key={i} className="snap-center shrink-0 w-[85vw] md:w-[50vw] lg:w-[30vw] h-[400px] relative rounded-sm overflow-hidden group">
                <img src={slide.src} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={slide.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h4 className="font-heading font-semibold text-white text-xl">{slide.title}</h4>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">{slide.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="project-gallery" className="py-10 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-300 pb-4">
            <div>
              <h2 className="text-xs text-[#917943] font-bold uppercase tracking-[0.2em] mb-2">Masterplan & Architecture</h2>
              <h3 className="font-heading font-semibold text-3xl text-[#0f172a]">The Oceanopolis Estate</h3>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => scrollSlider(estateSliderRef, 'left')} className="w-10 h-10 border border-[#b49a5b] flex items-center justify-center text-[#917943] hover:bg-[#b49a5b] hover:text-white transition rounded-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollSlider(estateSliderRef, 'right')} className="w-10 h-10 border border-[#b49a5b] flex items-center justify-center text-[#917943] hover:bg-[#b49a5b] hover:text-white transition rounded-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div ref={estateSliderRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4">
             {[
              { src: "/img/img513.jpg", title: "The Coastal Legacy", sub: "A Master-planned Beachfront Township" },
              { src: "/img/img492.jpg", title: "Grand Courtyards & Club", sub: "Immersive Green Architecture" },
              { src: "/img/img483.jpg", title: "Elevated Infinity Pool", sub: "A Seamless Blend of Water and Sky" },
              { src: "/img/img501.jpg", title: "Sunset Dining Lounge", sub: "Gourmet Experiences by the Water" },
              { src: "/img/img504.jpg", title: "Sunteck Beach Drive", sub: "The Next International High Street" },
              { src: "/img/img498.jpg", title: "International Benchmarks", sub: "Inspired by Miami, Dubai, & Beverly Hills" },
              { src: "/img/img507.jpg", title: "Elegant Interiors", sub: "Curated Spaces for Social Indulgence" },
              { src: "/img/img482.jpg", title: "Podium Gardens", sub: "Lush Landscapes Uniting All Towers" },
              { src: "/img/img444.jpg", title: "Central Parks", sub: "A 23-Acre Haven of Open Spaces" },
              { src: "/img/img443.jpg", title: "Serene Walkways", sub: "Discover Tranquility at Every Step" },
            ].map((slide, i) => (
              <div key={i} className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[350px] sm:h-[450px] relative rounded-sm overflow-hidden group">
                <img src={slide.src} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={slide.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h4 className="font-heading font-semibold text-white text-xl">{slide.title}</h4>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">{slide.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="py-10 bg-[#0f172a] text-white border-t border-[#b49a5b]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-xs text-[#c5a365] font-bold uppercase tracking-[0.2em] mb-2">Location</h2>
              <h3 className="font-heading font-semibold text-3xl mb-4">When World-Class Connectivity Arrives, City Limits Disappear.</h3>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Strategically located at Vasai (W), a hub of proximities and a haven of calm. As the Coastal Road approaches SBR, it presents an unprecedented investment opportunity with high appreciation potential.
              </p>
              
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start">
                  <MapPin className="text-[#c5a365] w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>500 Meters</strong> to pristine Suruchi Beach.</span>
                </li>
                <li className="flex items-start">
                  <Ship className="text-[#c5a365] w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Daily 16 RoRo</strong> ferry services between Bhayandar and Vasai.</span>
                </li>
                <li className="flex items-start">
                  <TrainTrack className="text-[#c5a365] w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Vasai-Diva-Roha Line</strong> links Western, Central, and Harbour lines.</span>
                </li>
                <li className="flex items-start">
                  <Route className="text-[#c5a365] w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Coastal Road Edge:</strong> 25 mins from Versova, 40 mins from Airport.</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[350px] lg:h-[450px] border border-[#b49a5b]/30 p-2 rounded-sm bg-[#1a2332]">
              <img src="/img/img491.jpg" className="w-full h-full object-cover rounded-sm filter brightness-90" alt="Connectivity Map" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#0f172a]/90 backdrop-blur border border-[#b49a5b] text-center p-4 rounded-sm shadow-2xl">
                  <Navigation className="w-6 h-6 text-[#c5a365] mx-auto mb-1" />
                  <p className="font-heading font-semibold text-lg text-white">Vasai West</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Mumbai's Coastal Frontier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-10 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl border border-[#b49a5b]/30 flex flex-col md:flex-row overflow-hidden rounded-sm">
            
            <div className="md:w-5/12 bg-[#0f172a] p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#b49a5b] rounded-bl-full opacity-10"></div>
              <div className="relative z-10">
                <h3 className="font-heading font-semibold text-2xl mb-2 text-[#c5a365]">Secure Your Legacy</h3>
                <p className="text-sm text-gray-300 mb-6">Submit your Expression of Interest (EOI) today to guarantee priority allotment at lowest pre-launch pricing.</p>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border border-[#b49a5b]/50 flex items-center justify-center mr-3">
                      <Tag className="w-4 h-4 text-[#c5a365]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">EOI Amount</p>
                      <p className="font-medium">₹ 2,000,000 (Fully Refundable)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border border-[#b49a5b]/50 flex items-center justify-center mr-3">
                      <Building className="w-4 h-4 text-[#c5a365]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Developer</p>
                      <p className="font-medium">Sunteck Realty</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 relative z-10">
                <img src="/img/img228.jpg" className="h-24 w-full object-cover rounded-sm opacity-80" alt="Sunteck Realty" />
              </div>
            </div>

            <div className="md:w-7/12 p-8">
              <h4 className="font-heading font-semibold text-xl text-[#0f172a] mb-4">Register Interest</h4>
              
              <form id="eoi-form" className="space-y-4" onSubmit={handleEOISubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name *</label>
                    <input type="text" name="user_name" required className="w-full border-b border-gray-300 py-2 text-sm bg-transparent focus:outline-none focus:border-[#b49a5b] transition placeholder-gray-400" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number *</label>
                    <input type="tel" name="user_phone" required className="w-full border-b border-gray-300 py-2 text-sm bg-transparent focus:outline-none focus:border-[#b49a5b] transition placeholder-gray-400" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address *</label>
                  <input type="email" name="user_email" required className="w-full border-b border-gray-300 py-2 text-sm bg-transparent focus:outline-none focus:border-[#b49a5b] transition placeholder-gray-400" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Interested Configuration</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input type="radio" name="configuration" value="2BHK" className="mr-2 text-[#b49a5b] focus:ring-[#b49a5b] border-gray-300" defaultChecked />
                      2 BHK Premium
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input type="radio" name="configuration" value="3BHK" className="mr-2 text-[#b49a5b] focus:ring-[#b49a5b] border-gray-300" />
                      3 BHK Luxury
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#0f172a] hover:bg-[#b49a5b] text-white font-semibold py-3 text-sm uppercase tracking-widest transition flex justify-center items-center rounded-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                    ) : (
                      "Submit EOI Application"
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">By submitting this form, you agree to be contacted by Sunteck authorized representatives.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Luxury Message Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white border border-[#b49a5b]/50 p-8 max-w-sm w-full rounded-sm shadow-2xl transform transition-transform duration-300 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#0f172a] transition">
              <X className="w-5 h-5" />
            </button>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modalState.isSuccess ? 'bg-amber-50' : 'bg-red-50'}`}>
              {modalState.isSuccess ? (
                <Check className="w-6 h-6 text-[#917943]" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h3 className="font-heading font-semibold text-xl text-[#0f172a] mb-2">{modalState.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{modalState.message}</p>
            <button onClick={closeModal} className="w-full bg-[#0f172a] text-white text-xs uppercase tracking-wider py-2 font-medium hover:bg-[#b49a5b] transition rounded-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}