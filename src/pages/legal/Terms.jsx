import SEO from '../../components/SEO'
import LegalLayout from './LegalLayout'

const Terms = () => (
  <>
    <SEO
      title="Terms of Service"
      description="The rules and conditions for using the Eclipse platform."
      path="/terms"
    />
    <LegalLayout title="Terms of Service" lastUpdated="May 28, 2026">
      <p>
        By accessing or using eclipserblx.com (the "Service"), you agree to
        these Terms of Service. If you do not agree, do not use the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 13 years old to use the Service. By using it, you
        represent that you meet this requirement.
      </p>

      <h2>2. Accounts</h2>
      <p>
        Accounts are created through Google OAuth. You are responsible for
        activity under your account. We may suspend or terminate accounts that
        violate these Terms.
      </p>

      <h2>3. User content</h2>
      <p>
        You retain ownership of content you post (comments, profile data). By
        posting, you grant Eclipse a worldwide, non-exclusive, royalty-free
        license to host, display, and distribute that content as part of the
        Service.
      </p>
      <p>You agree not to post content that:</p>
      <ul>
        <li>Is unlawful, harassing, hateful, or defamatory.</li>
        <li>Infringes intellectual property or privacy rights.</li>
        <li>Contains malware, exploits unrelated to documented script behavior, or attempts to compromise user accounts.</li>
        <li>Is spam, scams, or unsolicited advertising.</li>
      </ul>

      <h2>4. Script content</h2>
      <p>
        Scripts published on Eclipse are user-contributed and provided "as is".
        Eclipse does not guarantee that any script is safe, functional,
        compliant with Roblox's Terms of Service, or free of side effects.
        Use scripts at your own risk; you are solely responsible for any
        consequence to your Roblox account or device.
      </p>

      <h2>5. Roblox relationship</h2>
      <p>
        Eclipse is an independent fan community. It is not affiliated with,
        endorsed by, or sponsored by Roblox Corporation. "Roblox" and all
        related marks are trademarks of Roblox Corporation.
      </p>

      <h2>6. Prohibited use</h2>
      <ul>
        <li>Scraping the Service at a rate that degrades availability for others.</li>
        <li>Reverse-engineering, decompiling, or attempting to access non-public APIs.</li>
        <li>Circumventing rate limits, authentication, or moderation systems.</li>
        <li>Impersonating others or misrepresenting affiliations.</li>
      </ul>

      <h2>7. Moderation</h2>
      <p>
        We may remove content or suspend accounts at our discretion when
        content violates these Terms or applicable law. Reports can be filed
        via the in-app report flow.
      </p>

      <h2>8. Disclaimer</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS
        OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ECLIPSE DISCLAIMS
        ALL LIABILITY FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
        ARISING FROM YOUR USE OF THE SERVICE.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these Terms over time. Material changes will be
        announced on the Service or by notice to your registered email.
        Continued use after changes constitutes acceptance.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms? Email{' '}
        <a href="mailto:legal@eclipserblx.com">legal@eclipserblx.com</a>.
      </p>
    </LegalLayout>
  </>
)

export default Terms
