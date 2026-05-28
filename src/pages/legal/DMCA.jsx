import SEO from '../../components/SEO'
import LegalLayout from './LegalLayout'

const DMCA = () => (
  <>
    <SEO
      title="DMCA Policy"
      description="How to submit a DMCA copyright takedown notice for content on Eclipse."
      path="/dmca"
    />
    <LegalLayout title="DMCA Policy" lastUpdated="May 28, 2026">
      <p>
        Eclipse respects intellectual property rights and responds to clear
        notices of alleged copyright infringement under the Digital Millennium
        Copyright Act (DMCA).
      </p>

      <h2>1. Submitting a takedown notice</h2>
      <p>
        Send a written notice to{' '}
        <a href="mailto:dmca@eclipserblx.com">dmca@eclipserblx.com</a>{' '}
        containing:
      </p>
      <ul>
        <li>Your physical or electronic signature.</li>
        <li>Identification of the copyrighted work you claim is infringed.</li>
        <li>
          The URL(s) on Eclipse of the material you claim is infringing.
        </li>
        <li>Your contact information (address, phone, email).</li>
        <li>
          A statement that you have a good-faith belief that the use is not
          authorized by the copyright owner, its agent, or the law.
        </li>
        <li>
          A statement, under penalty of perjury, that the information in your
          notice is accurate and that you are authorized to act on behalf of
          the rights holder.
        </li>
      </ul>

      <h2>2. Counter-notice</h2>
      <p>
        If you believe your content was removed in error, you may submit a
        counter-notice to the same email containing:
      </p>
      <ul>
        <li>Your signature, name, address, and phone number.</li>
        <li>Identification of the removed content and where it appeared.</li>
        <li>
          A statement, under penalty of perjury, that you have a good-faith
          belief the material was removed by mistake or misidentification.
        </li>
        <li>
          Consent to the jurisdiction of the federal court in your district
          (or, if outside the US, where Eclipse is located), and to accept
          service of process from the complainant.
        </li>
      </ul>

      <h2>3. Repeat infringers</h2>
      <p>
        Accounts that are the subject of repeated valid takedown notices will
        be terminated.
      </p>

      <h2>4. False claims</h2>
      <p>
        Submitting a knowingly false DMCA notice may result in liability under
        17 U.S.C. § 512(f). Send notices only when you have a genuine,
        good-faith claim.
      </p>
    </LegalLayout>
  </>
)

export default DMCA
