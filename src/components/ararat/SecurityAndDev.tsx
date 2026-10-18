import DeveloperTeaser from "./DeveloperTeaser";
import { SecurityTeaser } from "./UseCasesAndSecurity";

export default function SecurityAndDev({ onAction }: { onAction: (name: string) => void }) {
  return <section className="combined-security" aria-label="Security and developer tools">
    <div className="shell combined-heading"><div className="section-kicker">08 / TRUST & TECHNOLOGY</div><h2>Secure by design. <span>Built for builders.</span></h2></div>
    <div className="combined-security-grid"><SecurityTeaser onAction={onAction} hideNumber/><DeveloperTeaser onAction={onAction} hideNumber/></div>
  </section>;
}
