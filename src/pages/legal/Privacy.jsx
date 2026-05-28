import SEO from '../../components/SEO'
import LegalLayout from './LegalLayout'

const Privacy = () => (
  <>
    <SEO
      title="Privacy Policy"
      description="How Eclipse collects, uses, and protects your personal data, plus your rights under GDPR."
      path="/privacy"
    />
    <LegalLayout title="Privacy Policy" lastUpdated="May 28, 2026">
      <p>
        Eclipse ("we", "us") operates eclipserblx.com (the "Service"). This
        policy explains what data we collect, why we collect it, and the rights
        you have over your data.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — when you sign in with Google, we
          store your Google ID, email address, display name, and profile photo
          URL.
        </li>
        <li>
          <strong>Profile data</strong> — username, nickname, and Discord
          username if you choose to provide them.
        </li>
        <li>
          <strong>Activity</strong> — comments you post, scripts you save,
          hubs you follow, reactions you cast, and reports you submit.
        </li>
      </ul>

      <h2>2. How we use your data</h2>
      <ul>
        <li>Authenticate you and keep your session active.</li>
        <li>Display your activity to other users (comments, profile).</li>
        <li>Send in-app notifications for replies, reactions, and follows.</li>
        <li>Detect and prevent abuse, spam, and malicious content.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your personal data, and we do not use
        it for advertising or profiling.
      </p>

      <h2>3. Legal basis (GDPR)</h2>
      <p>
        We process your data under the legal bases of (a) contract performance
        — to provide you the Service — and (b) legitimate interest — to keep
        the platform secure and functional.
      </p>

      <h2>4. Your rights</h2>
      <p>You may at any time:</p>
      <ul>
        <li>
          <strong>Access &amp; export</strong> — download a complete copy of
          your data via Profile → Account → Download data.
        </li>
        <li>
          <strong>Rectify</strong> — edit your profile information at any
          time.
        </li>
        <li>
          <strong>Erase</strong> — delete your account permanently via
          Profile → Account → Delete account. This cascades to all your
          comments, saves, follows, reactions, and reports.
        </li>
        <li>
          <strong>Object &amp; restrict</strong> — contact us to limit how we
          process your data.
        </li>
      </ul>

      <h2>5. Third parties</h2>
      <ul>
        <li>
          <strong>Google</strong> — OAuth authentication. Subject to{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google's Privacy Policy
          </a>
          .
        </li>
        <li>
          <strong>YouTube</strong> — embedded showcase videos. Subject to{' '}
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube's Terms
          </a>
          .
        </li>
      </ul>

      <h2>6. Retention</h2>
      <p>
        Account data is retained until you delete your account.
      </p>

      <h2>7. Children</h2>
      <p>
        The Service is not directed to children under 13. If you believe a
        child has provided us personal data, contact us and we will erase it.
      </p>

      <h2>8. Contact</h2>
      <p>
        For privacy questions or to exercise your rights, email{' '}
        <a href="mailto:privacy@eclipserblx.com">privacy@eclipserblx.com</a>.
      </p>
    </LegalLayout>
  </>
)

export default Privacy
