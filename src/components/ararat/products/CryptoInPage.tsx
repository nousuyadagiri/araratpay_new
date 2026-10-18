import FlowPageTemplate, { CryptoInDeveloper, CryptoInVisual, CryptoInWhy } from './FlowPageTemplate';
import CryptoInSignature from './CryptoInSignature';
import { cryptoIn } from './cryptoInData';

const slots = { Signature: CryptoInSignature, Visual: CryptoInVisual, Why: CryptoInWhy, Developer: CryptoInDeveloper };
export default function CryptoInPage() { return <FlowPageTemplate content={cryptoIn} slots={slots}/>; }
