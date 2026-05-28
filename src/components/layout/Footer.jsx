import { Link } from 'react-router'
import { SiYoutube, SiDiscord } from '../ui/BrandIcons'

const Footer = () => {
  return (
    <footer id="footer" className="bg-ground border-t border-edge mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/eclipse-logo.png"
              alt="Eclipse"
              className="h-6 w-auto"
            />
            <span className="font-bold text-foreground tracking-wider">
              ECLIPSE
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors duration-200"
              aria-label="YouTube"
            >
              <SiYoutube size={20} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors duration-200"
              aria-label="Discord"
            >
              <SiDiscord size={20} />
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-edge gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Eclipse. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm">
            <Link
              to="/privacy"
              className="text-muted hover:text-foreground transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-muted hover:text-foreground transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              to="/dmca"
              className="text-muted hover:text-foreground transition-colors duration-200"
            >
              DMCA
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted/60 mt-6">
          Not affiliated with or endorsed by Roblox Corporation.
        </p>
      </div>
    </footer>
  )
}

export default Footer
