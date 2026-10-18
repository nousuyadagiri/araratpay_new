import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PageShell, pageHead } from "@/components/ararat/pages/PageShell";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({ interest: typeof search["interest"] === "string" ? search["interest"].slice(0, 120) : "" }),
  head: () => pageHead("Get started", "Request access to one AraratPay account for Crypto In, Crypto Out, Fiat Out and Cards. Preview form; no data is sent.", "/contact"),
  component: ContactPage,
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().min(1, "Please enter your work email.").email("Enter a valid work email.").max(255, "Email is too long."),
  company: z.string().trim().min(1, "Please enter your company.").max(120, "Company name is too long."),
});
type RequiredField = keyof z.infer<typeof formSchema>;
const choices = ["Accept crypto payments", "Pay out in crypto", "Settle to my bank", "Issue cards", "Not sure, show me everything"];
const countries = ["United Arab Emirates", "United States", "United Kingdom", "Canada", "Germany", "France", "India", "Singapore", "Brazil", "Nigeria", "Japan", "Other"];

function ContactPage() {
  const { interest } = Route.useSearch();
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [values, setValues] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const update = (field: RequiredField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) {
      const check = formSchema.shape[field].safeParse(value);
      setErrors(previous => ({ ...previous, [field]: check.success ? undefined : check.error.issues[0]?.message }));
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    const check = formSchema.safeParse(values);
    if (!check.success) {
      const next: Partial<Record<RequiredField, string>> = {};
      check.error.issues.forEach(issue => { const field = issue.path[0] as RequiredField; if (!next[field]) next[field] = issue.message; });
      setErrors(next);
      (event.currentTarget.querySelector(`[name="${check.error.issues[0]?.path[0]}"]`) as HTMLInputElement | null)?.focus();
      return;
    }
    setErrors({});
    setSent(true);
  };
  const toggle = (choice: string) => setSelected(current => choice === choices[4]
    ? current.includes(choice) ? [] : [choice]
    : current.includes(choice) ? current.filter(item => item !== choice) : [...current.filter(item => item !== choices[4]), choice]);

  return <PageShell cta={false}><div className="contact-page"><section className="page-section"><div className="shell contact-layout"><div className="contact-aside"><span className="mono-label">GET STARTED</span><h1>Get your AraratPay account.</h1><p>One account gives you every flow. Tell us what you need first and we'll set it up.</p><ul className="contact-benefits"><li><Check size={17}/>Crypto In, Crypto Out, Fiat Out &amp; Cards</li><li><Check size={17}/>One balance &amp; dashboard</li><li><Check size={17}/>Free sandbox</li></ul><span className="contact-rule"/>PREVIEW / NO DATA IS SENT</div>
    {sent ? <div className="contact-success" role="status"><CheckCircle2 size={48}/><h2>Thank you for your interest.</h2><p>This is a preview confirmation only. Your details were not submitted or saved. Please return when the contact service is available.</p><Button variant="glass" onClick={() => setSent(false)}>Back to form</Button></div> :
      <form className="contact-form" noValidate onSubmit={submit}><div className="contact-fields">
        <label>Name<input name="name" autoComplete="name" value={values.name} onChange={e => update("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} placeholder="Your name" maxLength={100}/>{errors.name && <span id="contact-name-error" className="contact-error" role="alert">{errors.name}</span>}</label>
        <label>Work email<input name="email" type="email" autoComplete="email" value={values.email} onChange={e => update("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "contact-email-error" : undefined} placeholder="you@company.com" maxLength={255}/>{errors.email && <span id="contact-email-error" className="contact-error" role="alert">{errors.email}</span>}</label>
        <label>Company<input name="company" autoComplete="organization" value={values.company} onChange={e => update("company", e.target.value)} aria-invalid={!!errors.company} aria-describedby={errors.company ? "contact-company-error" : undefined} placeholder="Company name" maxLength={120}/>{errors.company && <span id="contact-company-error" className="contact-error" role="alert">{errors.company}</span>}</label>
        <label>Country<select name="country" autoComplete="country-name" defaultValue=""><option value="" disabled>Select country</option>{countries.map(country => <option key={country}>{country}</option>)}</select></label>
        <label>Business type<select name="businessType" defaultValue=""><option value="" disabled>Select business type</option>{["E-commerce", "SaaS", "Marketplace", "Remittance & payroll", "Gaming & digital goods", "Freelance/agency", "Other"].map(type => <option key={type}>{type}</option>)}</select></label>
        <label>Monthly volume<select name="volume" defaultValue=""><option value="" disabled>Select a range</option>{["Under $10K", "$10K–$100K", "$100K–$1M", "$1M+", "Not sure yet"].map(range => <option key={range}>{range}</option>)}</select></label>
      </div><fieldset><legend>What do you want to do first? (pick any, all included)</legend><div className="interest-options">{choices.map(choice => <label key={choice}><input type="checkbox" checked={selected.includes(choice)} onChange={() => toggle(choice)}/><span>{choice}</span></label>)}</div></fieldset><label>Anything else?<textarea name="message" rows={5} maxLength={1000} placeholder={interest ? `Tell us about your use case… (${interest})` : "Tell us about your use case…"}/></label><p className="fee-note">Preview only: no data is sent. This form shows a confirmation only.</p><Button type="submit" variant="brand" size="hero">Request access <ArrowRight size={17}/></Button></form>}
  </div></section></div></PageShell>;
}