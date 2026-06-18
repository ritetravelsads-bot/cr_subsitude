import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Terms & Conditions | Countryroof",
  description: "Countryroof Terms & Conditions - Please read before using our platform. Marketing and advisory services in Gurugram and Delhi NCR.",
  alternates: {
    canonical: "https://countryroof.in/terms-and-conditions",
  },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-12 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2 border-b border-border pb-6">
            <h1 className="text-3xl font-bold text-foreground">TERMS & CONDITIONS</h1>
            <p className="text-muted-foreground">Countryroof - Effective Date: To be inserted</p>
          </div>

          <div className="max-w-none text-foreground space-y-6">
            <section className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                By using this website, submitting information, or engaging with our services, you accept these Terms & Conditions. Countryroof reserves the right to modify these terms at any time without notice. Continued use constitutes acceptance of modifications.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance & Electronic Consent</h2>
              <p className="text-muted-foreground leading-relaxed">
                Use of this website constitutes electronic acceptance under the Information Technology Act, 2000. Submission of online forms, inquiries, or digital communication constitutes legally binding consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Nature of Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Countryroof acts solely as a marketing and advisory platform. We are not a developer or promoter unless separately registered. Final agreements are executed directly between buyer and developer.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. No Investment Advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                Information provided does not constitute financial, legal, or investment advice. Users must conduct independent due diligence.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Pricing & Availability Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Property pricing, availability, offers, and payment plans are subject to developer revision without notice. Countryroof bears no liability for such changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Refund / Token Handling Clause</h2>
              <p className="text-muted-foreground leading-relaxed">
                Countryroof does not collect, hold, or manage booking amounts unless explicitly stated in writing. All refunds, cancellations, or forfeitures are governed strictly by the respective developer's agreement. Countryroof bears no responsibility for refund disputes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Strict ROI & Appreciation Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Countryroof does not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Capital appreciation</li>
                <li>Rental yield</li>
                <li>Investment returns</li>
                <li>Market growth</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                All projections are indicative and based on market observations. Countryroof shall not be liable for financial losses resulting from market fluctuations or developer performance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Anti-Solicitation Clause</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users shall not bypass Countryroof to transact directly with developers introduced by us. Violation entitles Countryroof to claim compensation for commercial loss.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Non-Circumvention Clause</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users shall not circumvent Countryroof for 24 months from introduction. Any transaction concluded within this period shall be deemed originating from Countryroof's efforts.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Liquidated Damages Clause</h2>
              <p className="text-muted-foreground leading-relaxed">
                In case of circumvention, the user agrees to pay liquidated damages equal to: 5% of the total transaction value OR the applicable advisory/commission value, whichever is higher. The parties agree that this amount represents a genuine pre-estimate of commercial loss and not a penalty.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Commission Protection Clause</h2>
              <p className="text-muted-foreground leading-relaxed">
                Countryroof retains commercial rights over transactions resulting from its introductions, even if final negotiations occur directly between buyer and developer.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Data Misuse & Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Users shall not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Reproduce or redistribute marketing material</li>
                <li>Use shared information for brokerage</li>
                <li>Misrepresent affiliation with Countryroof</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Violation may result in legal claims and injunctive relief.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">12. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Countryroof's maximum liability shall be limited to advisory fees actually received (if any). Countryroof shall not be liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Developer default</li>
                <li>Construction delays</li>
                <li>Regulatory changes</li>
                <li>Market losses</li>
                <li>Indirect or consequential damages</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">13. Force Majeure</h2>
              <p className="text-muted-foreground leading-relaxed">
                No liability for delays caused by government policy, RERA amendments, pandemic, natural disasters, or regulatory restrictions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">14. Arbitration</h2>
              <p className="text-muted-foreground leading-relaxed">
                All disputes shall be resolved by binding arbitration under the Arbitration and Conciliation Act, 1996. Seat and venue: Gurugram, Haryana. The arbitrator shall be appointed in accordance with the Arbitration Act provisions. The award shall be final and binding.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">15. Waiver of Class Action</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users waive rights to collective or representative proceedings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">16. Survival Clause</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Provisions relating to the following shall survive termination of engagement:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Non-Circumvention</li>
                <li>Anti-Solicitation</li>
                <li>Commission Protection</li>
                <li>Limitation of Liability</li>
                <li>Arbitration</li>
                <li>ROI Disclaimer</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">17. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                This document constitutes the entire agreement between users and Countryroof. No oral representation shall override these terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">18. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision is deemed invalid, remaining provisions remain enforceable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">RERA DISCLAIMER</h2>
              <p className="text-muted-foreground leading-relaxed">
                Countryroof is not a developer or promoter. All projects are subject to respective RERA registrations. Users must independently verify project approvals and legal documentation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">WEBSITE DISCLAIMER</h2>
              <p className="text-muted-foreground leading-relaxed">
                Information is provided for general informational purposes only. Images may be artistic impressions. No warranties are provided regarding completeness or suitability.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">COOKIE POLICY</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use cookies and tracking technologies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Traffic analysis</li>
                <li>Website optimization</li>
                <li>Advertising performance measurement</li>
                <li>Personalized advertising</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                By continuing to browse this website, you consent to such use. Users may disable cookies via browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">CONSENT CHECKBOX LANGUAGE</h2>
              <div className="p-4 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground leading-relaxed italic">
                  "I voluntarily provide my personal information and consent to being contacted by Countryroof via phone, SMS, WhatsApp, and email regarding property consultation and offers. I agree to the Privacy Policy and Terms & Conditions."
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">
              If you have any questions about these Terms & Conditions, please contact us at{" "}
              <a href="mailto:info@countryroof.in" className="text-primary hover:underline">
                info@countryroof.in
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
