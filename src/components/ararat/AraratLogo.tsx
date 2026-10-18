import markSource from "@/assets/araratpay-mark.svg?raw";

// Parse the official mark once so it renders inline and inherits currentColor.
const paths = Array.from(markSource.matchAll(/<path d="([^"]+)" transform="([^"]+)"/g), m => ({ d: m[1] ?? "", transform: m[2] ?? "" }));

export type AraratLogoVariant = "color" | "white" | "mono-dark";

export function AraratMark({ className = "", variant = "color", title }: { className?: string; variant?: AraratLogoVariant; title?: string | undefined }) {
  return <svg className={`ararat-mark ararat-mark--${variant} ${className}`} viewBox="0 0 1200 710" fill="currentColor" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    {paths.map((p, i) => <path key={i} d={p.d} transform={p.transform}/>)}
  </svg>;
}

export function AraratLogo({ variant = "color", wordmark = true, className = "", markClassName = "" }: { variant?: AraratLogoVariant; wordmark?: boolean; className?: string; markClassName?: string }) {
  return <span className={`ararat-logo ararat-logo--${variant} ${className}`}>
    <AraratMark variant={variant} className={markClassName} title={wordmark ? undefined : "AraratPay"}/>
    {wordmark && <span className="ararat-wordmark">Ararat<span>pay</span></span>}
  </span>;
}

export default AraratLogo;
