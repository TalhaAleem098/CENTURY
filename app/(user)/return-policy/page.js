import React from 'react';

const contactNumber = process.env.NEXT_PUBLIC_CONTACT_NUMBER || '+923227154205';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_GMAIL || 'centuryapparelpk@gmail.com';

const page = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-8">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Exchange Policy</h1>
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-4">
          <span className="font-medium text-gray-800">Phone: <a href={`tel:${contactNumber}`} className="text-blue-600 hover:text-blue-800 transition-colors">{contactNumber}</a></span>
          <span className="font-medium text-gray-800">Email: <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:text-blue-800 transition-colors break-all">{contactEmail}</a></span>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          We want you to be completely satisfied with your purchase. If you are not satisfied with your product, you may request an <span className="font-semibold text-gray-900">exchange</span> within <span className="font-semibold text-gray-900">7 days</span> of receiving your order, provided it meets our exchange conditions. <span className="font-semibold text-red-600">We do not offer cash refunds.</span>
        </p>
      </div>

      {/* Exchange Conditions */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exchange Conditions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Exchange must be initiated within <strong>7 days</strong> of delivery</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Products must be unused and unwashed</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Original packaging with all tags attached</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Shipping charges are non-refundable</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Exchanges processed after item inspection</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Customized items are not eligible for exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Notes</h3>
        <div className="space-y-2 text-gray-700">
          <p>• All exchanged items are subject to inspection before approval</p>
          <p>• Sale items and final clearance products cannot be exchanged</p>
          <p>• No cash refunds will be provided under any circumstances</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-6">
          To initiate an exchange or if you have any questions about our exchange policy, 
          please don&apos;t hesitate to contact us:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <a 
              href={`tel:${contactNumber}`} 
              className="text-lg text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              {contactNumber}
            </a>
            <p className="text-sm text-gray-500 mt-1">Available during business hours</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <a 
              href={`mailto:${contactEmail}`} 
              className="text-lg text-blue-600 hover:text-blue-800 transition-colors duration-200 break-all"
            >
              {contactEmail}
            </a>
            <p className="text-sm text-gray-500 mt-1">We&apos;ll respond within 24 hours</p>
          </div>
        </div>
      </div>

      {/* Additional Content Sections */}
      
      {/* Shipping Information */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
        <p className="text-gray-600 mb-4">
          We offer fast and reliable shipping across Pakistan. Here&apos;s what you need to know about our shipping process:
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Standard Delivery</h3>
            <p className="text-gray-600 text-sm">3-5 business days</p>
            <p className="text-gray-600 text-sm">Available nationwide</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Express Delivery</h3>
            <p className="text-gray-600 text-sm">1-2 business days</p>
            <p className="text-gray-600 text-sm">Major cities only</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Cash on Delivery</h3>
            <p className="text-gray-600 text-sm">Available everywhere</p>
            <p className="text-gray-600 text-sm">Pay when you receive</p>
          </div>
        </div>
      </div>

      {/* Size Guide */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Size Guide</h2>
        <p className="text-gray-600 mb-6">
          Getting the right fit is important to us. Use our size guide to find your perfect size and reduce the need for exchanges.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to Measure</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Height</h4>
              <p className="text-gray-600 text-sm">Measure from the highest point of the shoulder to the bottom hem of the shirt.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Width</h4>
              <p className="text-gray-600 text-sm">Measure across the chest, from one armpit to the other, with the shirt laid flat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Care Instructions */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Care Instructions</h2>
        <p className="text-gray-600 mb-6">
          Proper care extends the life of your garments. Follow these guidelines to keep your clothes looking their best.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Washing Guidelines</h3>
            <div className="space-y-2 text-gray-700">
              <p>• Always check the care label before washing</p>
              <p>• Wash dark colors separately to prevent bleeding</p>
              <p>• Use cold water for delicate fabrics</p>
              <p>• Turn printed garments inside out before washing</p>
              <p>• Avoid overloading the washing machine</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Drying & Storage</h3>
            <div className="space-y-2 text-gray-700">
              <p>• Air dry when possible to prevent shrinkage</p>
              <p>• Avoid direct sunlight for colored fabrics</p>
              <p>• Iron on appropriate heat settings</p>
              <p>• Store clothes in a cool, dry place</p>
              <p>• Use hangers for structured garments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex mb-2">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">&quot;Great quality fabrics and excellent customer service. The return process was smooth and hassle-free.&quot;</p>
            <p className="text-gray-500 text-xs">- Ahmed M.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex mb-2">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">&quot;Fast delivery and perfect fit. The size guide was very helpful in choosing the right size.&quot;</p>
            <p className="text-gray-500 text-xs">- Bilal S.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex mb-2">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">&quot;Affordable prices without compromising on quality. Will definitely shop again!&quot;</p>
            <p className="text-gray-500 text-xs">- Usman R.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;