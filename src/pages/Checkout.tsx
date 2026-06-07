import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, QrCode } from 'lucide-react';
import { FadeIn, TextReveal } from '../components/motion/Animations';
import SEO from '../components/seo/SEO';
import { getLocalData } from '../lib/crud';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'upi' | null>(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>({
    id: 'custom',
    title: 'Dreweb Service/Template',
    price: 'Custom',
    paypalLink: '',
    upiQrCode: '',
    upiId: ''
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (templateId) {
        const templates = await getLocalData('templates') || [];
        const found = templates.find((t: any) => t.id === templateId);
        if (found) {
          setSelectedTemplate(found);
        }
      }
      setLoading(false);
    }
    load();
  }, [templateId]);

  const paypalLink = selectedTemplate.paypalLink || 'https://www.paypal.com/ncp/payment/ZM6XXWCD95TX8';

  if (loading) return <div className="p-8">Loading checkout...</div>;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-zinc-50 pb-24">
      <SEO 
        title="Checkout | Dreweb"
        description="Secure checkout for Dreweb templates and services."
        noIndex={true} // Don't index checkout pages
      />
      
      <div className="max-w-4xl mx-auto pt-16 px-6 lg:px-8">
        <Link to="/templates" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Order Summary */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
                <h2 className="font-display text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="flex justify-between items-start pb-6 border-b border-zinc-100 mb-6">
                  <div>
                    <h3 className="font-semibold text-zinc-900">{selectedTemplate.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">Digital Download / Access</p>
                  </div>
                  <span className="font-bold text-lg">
                    {paymentMethod === 'upi' && selectedTemplate.priceINR ? selectedTemplate.priceINR : selectedTemplate.price}
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {paymentMethod === 'upi' && selectedTemplate.priceINR ? selectedTemplate.priceINR : selectedTemplate.price}
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Payment Selection */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <TextReveal as="h1" className="font-display text-4xl font-bold tracking-tight mb-8">Select Payment Method</TextReveal>
            
            <FadeIn delay={0.2}>
              <div className="space-y-4 mb-8">
                {/* PayPal Option */}
                <label className={`block relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-brand-lime bg-lime-50/30' : 'border-zinc-200 hover:border-zinc-300 bg-white'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paypal" 
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${paymentMethod === 'paypal' ? 'border-brand-lime' : 'border-zinc-300'}`}>
                      {paymentMethod === 'paypal' && <div className="w-3 h-3 bg-brand-lime rounded-full" />}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        PayPal / Credit Card
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">Pay securely via PayPal. Accepts all major cards.</p>
                    </div>
                  </div>
                </label>

                {/* UPI Option */}
                <label className={`block relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-brand-lime bg-lime-50/30' : 'border-zinc-200 hover:border-zinc-300 bg-white'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${paymentMethod === 'upi' ? 'border-brand-lime' : 'border-zinc-300'}`}>
                      {paymentMethod === 'upi' && <div className="w-3 h-3 bg-brand-lime rounded-full" />}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg flex items-center">
                        <QrCode className="w-5 h-5 mr-2 text-zinc-800" />
                        UPI (India Only)
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">Pay using Google Pay, PhonePe, Paytm, or any UPI app.</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Area based on selection */}
              <div className="mt-8">
                {paymentMethod === 'paypal' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <a 
                      href={paypalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 px-6 bg-[#0070ba] hover:bg-[#003087] text-white text-center rounded-xl font-bold text-lg transition-colors shadow-lg"
                    >
                      Proceed to PayPal
                    </a>
                    <p className="text-xs text-center text-zinc-500 mt-4">You will be securely redirected to PayPal to complete your purchase.</p>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-3xl border border-zinc-200 text-center shadow-sm">
                    <h4 className="font-bold text-xl mb-2">Scan to Pay</h4>
                    <p className="text-zinc-500 text-sm mb-6">Open your UPI app and scan the QR code below.</p>
                    
                    {selectedTemplate.upiQrCode ? (
                      <div className="w-64 mx-auto rounded-2xl overflow-hidden border-2 border-zinc-200 mb-6 bg-white p-2 shadow-sm">
                        <img src={selectedTemplate.upiQrCode} alt="UPI QR Code" className="w-full h-auto object-contain mix-blend-multiply" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 mx-auto bg-zinc-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-300 mb-6">
                        <div className="text-center">
                          <QrCode className="w-12 h-12 mx-auto text-zinc-400 mb-2" />
                          <span className="text-xs text-zinc-500 font-medium">QR Code<br/>Not Available</span>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm font-medium text-zinc-800 bg-zinc-100 py-2 px-4 rounded-lg inline-block">
                      UPI ID: {selectedTemplate.upiId || 'dreweb@ybl'}
                    </p>
                    
                    <div className="mt-6 pt-6 border-t border-zinc-100">
                      {/* Removed manual email instruction as per user request */}
                    </div>
                  </div>
                )}

                {!paymentMethod && (
                  <div className="py-4 px-6 bg-zinc-200 text-zinc-500 text-center rounded-xl font-bold text-lg cursor-not-allowed">
                    Select a payment method to continue
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
