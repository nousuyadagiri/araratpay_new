import { useState } from "react";
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { productNameToSlug } from "./products/productData";
import { AraratLogo } from "./AraratLogo";
const columns = [
  { title: "Platform", items: ["Crypto In", "Crypto Out", "Fiat Out", "Cards", "Pricing"] },
  { title: "Developers", items: ["API Docs", "SDKs", "Webhooks", "Status Page", "Changelog"] },
  { title: "Company", items: ["About", "Careers", "Contact", "Blog"] },
  {
    title: "Legal",
    items: [
      "Terms of Service",
      "Privacy Policy",
      "AML/KYC Policy",
      "Cookie Policy",
      "Risk Disclosure",
      "Licensing",
      "Card Program",
    ],
  },
  { title: "Security", items: ["Security Overview", "Bug Bounty", "Audit Reports", "FAQ"] },
];
export default function SiteFooter({ onAction }: { onAction: (name: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div className="footer-brand-col">
            <Link to="/" className="brand" aria-label="AraratPay home">
              <AraratLogo markClassName="brand-mark" />
            </Link>
            <p>One platform. Four flows. Move value without limits.</p>
            <div className="footer-social">
              <Button
                variant="iconGlass"
                size="icon"
                aria-label="LinkedIn profile not available yet"
                title="LinkedIn profile not available yet"
                disabled
              >
                <Linkedin size={16} />
              </Button>
              <Button
                variant="iconGlass"
                size="icon"
                aria-label="GitHub profile not available yet"
                title="GitHub profile not available yet"
                disabled
              >
                <Github size={16} />
              </Button>
              <Button
                variant="iconGlass"
                size="icon"
                aria-label="Contact AraratPay"
                title="Contact"
                onClick={() => onAction("Email")}
              >
                <Mail size={16} />
              </Button>
            </div>
          </div>
          <div className="footer-columns">
            {columns.map((col) => (
              <div className="footer-col" key={col.title}>
                <h3>{col.title}</h3>
                {col.items.map((item) => {
                  const slug = productNameToSlug[item];
                  if (slug)
                    return (
                      <Button key={item} variant="ghost" asChild>
                        <Link to="/platform/$slug" params={{ slug }}>
                          {item}
                        </Link>
                      </Button>
                    );
                  const legal: Record<string, string> = {
                    "Terms of Service": "terms",
                    "Privacy Policy": "privacy",
                    "AML/KYC Policy": "aml-kyc",
                    "Cookie Policy": "cookies",
                    "Risk Disclosure": "risk-disclosure",
                    "Card Program": "card-program",
                  };
                  if (legal[item])
                    return (
                      <Button key={item} variant="ghost" asChild>
                        <Link to="/legal/$slug" params={{ slug: legal[item] }}>
                          {item}
                        </Link>
                      </Button>
                    );
                  const paths: Record<
                    string,
                    "/pricing" | "/developers" | "/company" | "/contact" | "/security" | "/faq"
                  > = {
                    Pricing: "/pricing",
                    "API Docs": "/developers",
                    SDKs: "/developers",
                    Webhooks: "/developers",
                    "Status Page": "/developers",
                    Changelog: "/developers",
                    About: "/company",
                    Careers: "/contact",
                    Contact: "/contact",
                    Blog: "/company",
                    Licensing: "/company",
                    "Security Overview": "/security",
                    "Bug Bounty": "/security",
                    "Audit Reports": "/security",
                    FAQ: "/faq",
                  };
                  const path = paths[item];
                  return path ? (
                    <Button key={item} variant="ghost" asChild>
                      <Link to={path}>{item}</Link>
                    </Button>
                  ) : (
                    <Button key={item} variant="ghost" onClick={() => onAction(item)}>
                      {item}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-newsletter">
          <div>
            <span className="mono-label">STAY IN THE LOOP</span>
            <h3>Get in touch with AraratPay.</h3>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) onAction("Contact");
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              variant="brand"
              size="icon"
              type="submit"
              title="Contact us"
              aria-label="Open contact form"
            >
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AraratPay. All rights reserved.</span>
          <span>Crypto assets are volatile; values can rise or fall, and you may lose money.</span>
          <a href="#top">
            BACK TO TOP <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
