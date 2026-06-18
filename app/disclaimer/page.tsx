import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Disclaimer | CountryRoof",
  description: "Legal disclaimer for CountryRoof real estate services. Important information about property listings and advisory services.",
}

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-12 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Disclaimer</h1>
            <p className="text-muted-foreground text-sm">Last updated: April 04, 2025</p>
          </div>

          <div className="max-w-none text-foreground space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">General Information</h2>
              <p className="text-muted-foreground">
                The information provided on this website is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Property Information</h2>
              <p className="text-muted-foreground">
                CountryRoof acts as a real estate advisory firm and property consultant. The property details, prices, specifications, amenities, and other information displayed on this website are provided by respective developers and property owners. While we strive to ensure accuracy, we:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Do not guarantee the accuracy or completeness of property information</li>
                <li>Are not responsible for any discrepancies between listed and actual property details</li>
                <li>Recommend buyers to verify all information independently before making any decisions</li>
                <li>Advise conducting proper due diligence and legal verification</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Pricing and Availability</h2>
              <p className="text-muted-foreground">
                Property prices displayed on this website are indicative and subject to change without prior notice. Availability of properties is not guaranteed and may change based on market conditions and developer policies. Final pricing will be as per the agreement with the respective developer or seller.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Images and Renders</h2>
              <p className="text-muted-foreground">
                Images, 3D renders, floor plans, and virtual tours shown on this website are for illustration purposes only. They may not represent the exact finished product. Actual properties may differ in design, dimensions, specifications, and furnishings. All images are either provided by developers, licensed from third parties, or are artistic representations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Investment Advice</h2>
              <p className="text-muted-foreground">
                The information on this website does not constitute financial, legal, or investment advice. Real estate investments carry inherent risks, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Market value fluctuations</li>
                <li>Delays in project completion</li>
                <li>Changes in government policies and regulations</li>
                <li>Developer-related risks</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                We strongly recommend consulting with qualified financial advisors, legal experts, and conducting independent research before making any investment decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">RERA Compliance</h2>
              <p className="text-muted-foreground">
                All projects promoted on this website are RERA registered (where applicable). However, it is the buyer's responsibility to verify RERA registration numbers and check project status on the official RERA website of the respective state before making any purchase decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Third-Party Links</h2>
              <p className="text-muted-foreground">
                This website may contain links to third-party websites or services that are not owned or controlled by CountryRoof. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Under no circumstances shall CountryRoof, its directors, employees, partners, agents, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your use or inability to use the website or services</li>
                <li>Any property transaction facilitated through or as a result of using this website</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
                <li>Statements or conduct of any third party on the website</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Changes to This Disclaimer</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace this Disclaimer at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Disclaimer, please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>By email: legal@countryroof.in</li>
                <li>By phone: +91 8500-900-100</li>
                <li>By visiting our office: IRIS Tech Park, Unit No. 407, Gurugram, Haryana</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
