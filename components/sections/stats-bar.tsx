import { Calendar, Users, ShieldCheck, Building2 } from "lucide-react"

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years",
    sublabel: "Since 2008",
  },
  {
    icon: Users,
    value: "1200+",
    label: "Happy Clients",
    sublabel: "Trusted by buyers across NCR",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "RERA Verified",
    sublabel: "Every listing is legally cleared",
  },
  {
    icon: Building2,
    value: "50+",
    label: "Developer Partners",
    sublabel: "Delivery-verified developers",
  },
]

export default function StatsBar() {
  return (
    <section className="w-full bg-[#002366] py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-1">
                  <Icon className="text-amber-400" size={24} />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                  {stat.value}
                </p>
                <div>
                  <p className="text-white font-bold text-base md:text-lg leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-white/60 text-xs md:text-sm mt-0.5">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
