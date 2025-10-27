import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <Link href={'/'} className="flex items-center space-x-2 mb-4">
              {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm">
                GP
              </div> */}
              <div className="w-[150px] h-[60px] flex justify-center items-center">
                <Image src={'./images/logo.png'} alt="logo" width={150} height={60} />
              </div>
              {/* <span className="text-xl font-bold text-white">GuestPostNow.io</span> */}
            </Link>
            <p className="text-gray-400 text-sm">We are an SEO agency providing guest posts on real DA30+ websites. Boost rankings with safe, dofollow backlinks..</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#article-writing" className="text-gray-400 hover:text-white">
                  Article Writing
                </Link>
              </li>
              <li>
                <Link href="/services#link-insertions" className="text-gray-400 hover:text-white">
                  Link Insertions
                </Link>
              </li>
              <li>
                <Link href="/services#hoth-digital-pr" className="text-gray-400 hover:text-white">
                  HOTH Digital PR
                </Link>
              </li>
              <li>
                <Link href="/services#content-syndication" className="text-gray-400 hover:text-white">
                  Content Syndication
                </Link>
              </li>
              <li>
                <Link href="/services#press-releases" className="text-gray-400 hover:text-white">
                  Press Releases
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/guestpostnow.i0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/guestpostnow_io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/guest-post-now-io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/Guestpostnow_io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">Connect with us on social media for updates and tips.</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 GuestPostNow.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
