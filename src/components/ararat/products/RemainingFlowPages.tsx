import FlowPageTemplate from './FlowPageTemplate';
import type { ProductSlug } from './productData';
import { cryptoOut, fiatOut, cards } from './remainingFlowData';
import { CryptoOutSignature, FiatOutSignature, CardsSignature } from './RemainingFlowSignatures';
import { CryptoOutWhy, FiatOutWhy, CardsWhy, CryptoOutVisual, FiatOutVisual, CardsVisual, FlowDeveloper } from './RemainingFlowSections';
export function CryptoOutPage() {return <FlowPageTemplate content={cryptoOut} slots={{Signature:CryptoOutSignature,Why:CryptoOutWhy,Visual:CryptoOutVisual,Developer:FlowDeveloper}}/>}
export function FiatOutPage() {return <FlowPageTemplate content={fiatOut} slots={{Signature:FiatOutSignature,Why:FiatOutWhy,Visual:FiatOutVisual,Developer:FlowDeveloper}}/>}
export function CardsPage() {return <FlowPageTemplate content={cards} slots={{Signature:CardsSignature,Why:CardsWhy,Visual:CardsVisual,Developer:FlowDeveloper}}/>}
export default function RemainingFlowPages({slug}:{slug:ProductSlug}) {if(slug==='crypto-out') return <CryptoOutPage/>; if(slug==='fiat-out') return <FiatOutPage/>; return <CardsPage/>}
