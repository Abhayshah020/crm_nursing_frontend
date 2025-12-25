"use client"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js"
import Link from "next/link"
import {
  ClipboardCheck,
  FileText,
  Users,
  BarChart3,
  Clock,
  Shield,
  Zap,
  CheckCircle2,
  TrendingUp,
  Heart,
  Calendar,
  Database,
  Lock,
  MessageSquare,
  Settings,
} from "lucide-react"
import Image from "next/image"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

export default function Home() {
  const barData = {
    labels: ["Care Plans", "Daily Notes", "Clients", "Staff"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [50, 30, 70, 40],
        backgroundColor: ["#0F766E", "#14B8A6", "#2DD4BF", "#5EEAD4"],
        borderRadius: 8,
      },
    ],
  }

  const pieData = {
    labels: ["Draft", "Completed", "Pending"],
    datasets: [
      {
        label: "Care Plan Status",
        data: [12, 19, 7],
        backgroundColor: ["#0F766E", "#14B8A6", "#F59E0B"],
        hoverOffset: 10,
      },
    ],
  }

  const features = [
    {
      icon: ClipboardCheck,
      title: "Care Plan Management",
      description:
        "Create, update, and track comprehensive care plans for every client with ease. Customize plans to individual needs and monitor progress in real-time.",
    },
    {
      icon: FileText,
      title: "Daily Progress Notes",
      description:
        "Record detailed daily updates to ensure consistent, high-quality client care. Track changes, medications, and vital observations seamlessly.",
    },
    {
      icon: Users,
      title: "Client Management",
      description:
        "Maintain complete client profiles with medical history, preferences, emergency contacts, and family information all in one secure place.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description:
        "Generate insightful reports and visualizations to monitor performance, track outcomes, and make data-driven decisions for better care.",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Accurately log staff hours, client visits, and care activities. Streamline payroll and billing with automated time management.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Coordinate staff schedules, client appointments, and care activities with an intelligent calendar system that prevents conflicts.",
    },
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Efficiency by 40%",
      description:
        "Automate repetitive tasks and reduce paperwork, allowing your nursing team to spend more time providing quality care.",
    },
    {
      icon: Shield,
      title: "Enhanced Compliance",
      description:
        "Stay compliant with healthcare regulations through built-in audit trails, secure data storage, and standardized documentation.",
    },
    {
      icon: Heart,
      title: "Improved Care Quality",
      description:
        "Access complete client histories instantly, enabling more informed decisions and personalized care approaches.",
    },
    {
      icon: Zap,
      title: "Real-Time Collaboration",
      description:
        "Enable seamless communication between care team members with instant updates and shared access to critical information.",
    },
    {
      icon: Database,
      title: "Centralized Information",
      description:
        "Eliminate scattered records and duplicated data. Access everything you need from a single, secure platform.",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Protect sensitive health information with bank-level encryption, role-based access, and HIPAA-compliant infrastructure.",
    },
  ]

  const stats = [
    { number: "40%", label: "Time Saved on Admin" },
    { number: "99.9%", label: "System Uptime" },
    { number: "500+", label: "Healthcare Teams" },
    { number: "50k+", label: "Clients Managed" },
  ]

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="bg-background border-b border-border fixed w-full z-50 backdrop-blur-sm bg-background/100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <Link
            href="https://hdcs.com.au/"
            className="flex items-center gap-2 font-bold text-l sm:text-2xl bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent"
          >
            <Image
              src="/logo.jpeg"
              alt="SMS IT Solutions Logo"
              width={120}
              height={20}
            />
            HDCS
          </Link>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </a>
            <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
          <a href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover brightness-20 "
        >
          <source src="/backgroundvideocrm.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 text-center text-white px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl text-white md:text-7xl font-bold mb-6 text-balance text-foreground leading-tighter">
              Transform Your Nursing Care Management
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-5 text-pretty leading-tight">
              A comprehensive CRM platform designed specifically for nursing teams. Streamline care plans, daily notes,
              and client management with powerful analytics and seamless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity">
                Contact Us
              </a>
              {/* <button className="border-2 text-white border-border text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors">
                Schedule Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
              Everything Your Team Needs
            </h3>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Comprehensive tools designed specifically for nursing care management. From care plans to analytics, we've
              built features that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-card-foreground">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
              Why Healthcare Teams Choose Us
            </h3>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Real benefits that transform how nursing teams work. Discover the measurable impact on your care delivery
              and operational efficiency.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-card border border-border p-8 rounded-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-card-foreground">{benefit.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CRM Benefits Deep Dive */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
              The Power of Modern CRM
            </h3>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Understand how a specialized CRM system revolutionizes nursing care management and drives better outcomes
              for your organization.
            </p>
          </div>

          <div className="space-y-16">
            {/* Streamlined Operations */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Settings className="w-4 h-4" />
                  Streamlined Operations
                </div>
                <h4 className="text-3xl font-bold mb-4 text-foreground">Eliminate Administrative Burden</h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Manual paperwork and scattered systems drain valuable time from patient care. Our CRM automates
                  routine tasks, standardizes workflows, and centralizes all information in one intuitive platform.
                  Nurses spend less time on admin and more time doing what they do best—caring for patients.
                </p>
                <ul className="space-y-3">
                  {[
                    "Automated care plan generation and updates",
                    "Digital signatures and approval workflows",
                    "Integrated medication tracking and alerts",
                    "Streamlined incident reporting",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>

            {/* Data-Driven Insights */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-24 h-24 text-primary/30" />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <TrendingUp className="w-4 h-4" />
                  Data-Driven Insights
                </div>
                <h4 className="text-3xl font-bold mb-4 text-foreground">
                  Make Informed Decisions with Real-Time Analytics
                </h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Transform raw data into actionable insights. Our advanced analytics dashboard provides real-time
                  visibility into care quality metrics, staff performance, client outcomes, and operational efficiency.
                  Identify trends, spot issues early, and continuously improve your care delivery.
                </p>
                <ul className="space-y-3">
                  {[
                    "Custom dashboards for different roles and needs",
                    "Predictive analytics for proactive care",
                    "Compliance and quality metrics tracking",
                    "Exportable reports for stakeholders",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced Communication */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <MessageSquare className="w-4 h-4" />
                  Enhanced Communication
                </div>
                <h4 className="text-3xl font-bold mb-4 text-foreground">Connect Your Entire Care Team</h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Break down communication silos between shifts, departments, and facilities. Our CRM ensures everyone
                  has access to the latest client information, care notes, and critical updates. Seamless handoffs,
                  reduced errors, and improved continuity of care become the standard.
                </p>
                <ul className="space-y-3">
                  {[
                    "Instant notifications for critical updates",
                    "Shared notes and observations across teams",
                    "Family portal for client relations",
                    "Secure messaging and collaboration tools",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center">
                  <Users className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
              Powerful Analytics Dashboard
            </h3>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Visual insights into your care operations. Monitor performance, track outcomes, and identify opportunities
              for improvement at a glance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
              <h4 className="text-xl font-bold mb-6 text-card-foreground">Task Completion Overview</h4>
              <div className="flex flex-col items-center justify-center h-[100%]">
                <Bar data={barData} options={{ maintainAspectRatio: true, responsive: true }} />
              </div>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
              <h4 className="text-xl font-bold mb-6 text-card-foreground">Care Plan Status Distribution</h4>
              <Pie data={pieData} options={{ maintainAspectRatio: true, responsive: true }} />
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
              Security & Compliance Built In
            </h3>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Healthcare data requires the highest level of protection. Our platform is designed from the ground up with
              security, privacy, and compliance at its core.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "HIPAA Compliant", desc: "Full compliance with healthcare regulations" },
              { label: "End-to-End Encryption", desc: "Military-grade data protection" },
              { label: "Role-Based Access", desc: "Granular permission controls" },
              { label: "Audit Trails", desc: "Complete activity tracking" },
            ].map((item, index) => (
              <div key={index} className="bg-card border border-border p-6 rounded-xl text-center">
                <Lock className="w-10 h-10 text-primary mx-auto mb-3" />
                <h5 className="font-bold text-lg mb-2 text-card-foreground">{item.label}</h5>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
              Trusted by Healthcare Teams
            </h3>
            <p className="text-lg text-muted-foreground">See what nursing professionals say about our CRM platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This CRM has transformed how we manage client care. What used to take hours now takes minutes. Our team is more efficient and our clients receive better care.",
                author: "Sarah Mitchell",
                role: "Director of Nursing",
              },
              {
                quote:
                  "The analytics dashboard gives us insights we never had before. We can identify trends, optimize staffing, and ensure compliance with ease.",
                author: "James Chen",
                role: "Care Coordinator",
              },
              {
                quote:
                  "Implementation was seamless and the support team is outstanding. Every feature is designed with nursing workflows in mind.",
                author: "Emily Rodriguez",
                role: "Nurse Manager",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card border border-border p-8 rounded-2xl">
                <p className="text-muted-foreground mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold text-card-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance">
            Ready to Transform Your Care Management?
          </h3>
          <p className="text-xl text-muted-foreground mb-10 text-pretty leading-relaxed">
            Join hundreds of healthcare teams who have already improved their efficiency and care quality with SMS IT
            Solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity">
              Start Your Free Trial
            </button>
            <button className="border-2 border-border text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors">
              Talk to Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6 text-foreground">Get in Touch</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions? Our team is here to help you find the right solution for your nursing care needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-muted-foreground">
            <div>
              <div className="font-semibold text-foreground mb-1">Email</div>
              <a href="mailto:info@smsitsolutions.com" className="hover:text-primary transition-colors">
                info@smsitsolutions.com
              </a>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-1">Phone</div>
              <a href="tel:+97798000000000" className="hover:text-primary transition-colors">
                +977 980-3616675 <br />
                +977 986-2017411 <br />
                +61 450-366-703
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href="https://smsitsolutions.com.au/"
              target="_blank"
              className="text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Image src="/logo.jpg" alt="SMS IT Solutions Logo" width={40} height={40} />

              &copy; {new Date().getFullYear()} SMS IT Solutions. All rights reserved.
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
