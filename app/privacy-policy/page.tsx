import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Countryroof",
  description: "Countryroof privacy policy and legal framework - how we collect, use, and protect your personal information in accordance with Indian regulations.",
  alternates: {
    canonical: "https://countryroof.in/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-12 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Countryroof</h1>
            <h2 className="text-2xl font-semibold text-foreground">Legal & Policy Framework</h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <p><strong>Effective Date:</strong> To be inserted</p>
              <p><strong>Website:</strong> https://countryroof.in</p>
              <p><strong>Jurisdiction:</strong> Gurugram, Haryana, India</p>
            </div>
          </div>

          <div className="max-w-none text-foreground space-y-6">
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Part I – Privacy Policy</h2>
              <h3 className="text-lg font-semibold text-foreground">1. Introduction</h3>
              <p className="text-muted-foreground">
                Countryroof ("Company", "We", "Us", "Our") operates as an independent real estate advisory and marketing platform in Gurugram and Delhi NCR.
              </p>
              <p className="text-muted-foreground">
                This Privacy Policy governs the collection, processing, storage, and protection of personal data in accordance with the Information Technology Act, 2000 and applicable Indian regulations.
              </p>
              <p className="text-muted-foreground">
                By accessing this website, submitting information, or engaging with our services, you consent to this Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">2. Information We Collect</h3>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">A. Voluntarily Provided Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Property Preferences</li>
                  <li>Budget Range</li>
                  <li>Investment Intent</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-2">Collected when you:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Submit inquiry forms</li>
                  <li>Request callbacks</li>
                  <li>Download brochures</li>
                  <li>Schedule site visits</li>
                  <li>Communicate via phone, WhatsApp, or email</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">B. Automatically Collected Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>IP Address</li>
                  <li>Device & Browser Information</li>
                  <li>Website Interaction Data</li>
                  <li>Cookies & Tracking Data</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">3. Purpose of Processing</h3>
              <p className="text-muted-foreground">Data is used for:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Property consultation</li>
                <li>Site visit coordination</li>
                <li>Sharing project information</li>
                <li>Marketing communication</li>
                <li>CRM storage and internal record maintenance</li>
                <li>Legal compliance</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Countryroof does not sell personal data.</strong>
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">4. CRM Data Storage</h3>
              <p className="text-muted-foreground">
                User data may be stored securely in internal CRM systems for operational, compliance, and dispute-resolution purposes.
              </p>
              <p className="text-muted-foreground">
                Data may be retained for a reasonable commercial period unless deletion is legally required.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">5. Advertising & Tracking</h3>
              <p className="text-muted-foreground">We use:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Google Ads</li>
                <li>Meta Ads</li>
                <li>Analytics tools</li>
                <li>Remarketing pixels</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                By using our website, you consent to tracking for performance measurement and relevant advertisement delivery.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">6. Call Recording Disclaimer</h3>
              <p className="text-muted-foreground">
                Calls made to or received from Countryroof may be recorded for quality assurance, compliance, and dispute resolution.
              </p>
              <p className="text-muted-foreground">
                By continuing communication, users consent to such recording.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">7. WhatsApp Communication Consent</h3>
              <p className="text-muted-foreground">
                By initiating communication via WhatsApp, users consent to receiving project information, promotional updates, and consultation messages.
              </p>
              <p className="text-muted-foreground">
                Countryroof shall not be liable for risks associated with third-party messaging platforms.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">8. Data Sharing</h3>
              <p className="text-muted-foreground">Information may be shared with:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>RERA-registered developers</li>
                <li>CRM and analytics providers</li>
                <li>Advertising platforms</li>
                <li>Regulatory authorities if required by law</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">9. Data Security</h3>
              <p className="text-muted-foreground">
                Reasonable administrative and technical safeguards are implemented. Absolute security cannot be guaranteed.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">10. User Rights</h3>
              <p className="text-muted-foreground">Users may request:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Access</li>
                <li>Correction</li>
                <li>Deletion (subject to legal retention obligations)</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Email:</strong> info@countryroof.in
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">11. Grievance Officer</h3>
              <div className="p-4 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground"><strong>Grievance Officer</strong></p>
                <p className="text-muted-foreground">Countryroof</p>
                <p className="text-muted-foreground"><strong>Email:</strong> info@countryroof.in</p>
                <p className="text-muted-foreground"><strong>Phone:</strong> +91-98737-02365</p>
                <p className="text-muted-foreground mt-3">Response within 30 days.</p>
              </div>
            </section>



            <section className="space-y-4 border-t pt-6 mt-8">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>

              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, You can contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong>By email:</strong> info@countryroof.in
                </li>
                <li>
                  <strong>By phone:</strong> +91-98737-02365
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
