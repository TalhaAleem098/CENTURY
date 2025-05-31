import Link from 'next/link';

export const metadata = {
  title: 'About Us - Centuary Fashion Store',
  description: 'Learn about Centuary, your trusted premium fashion marketplace. Discover our journey, mission, values, and dedication to excellence.',
  keywords: 'Centuary, fashion, about us, premium clothing, our story, values, team',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-black">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        <section className="space-y-6">
          <h2 className="text-4xl font-extrabold mb-4">Our Journey</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Centuary was founded with a vision to redefine everyday fashion by blending luxury, comfort, and affordability. What began as a niche clothing line quickly grew into a trusted marketplace for premium streetwear and timeless essentials. Our dedication to innovation and quality has fueled our growth, while customer satisfaction remains our guiding principle.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            Over the years, we&apos;ve expanded our offerings to include exclusive collections of oversized tees, hoodies, sweatshirts, and more. Our in-house designers meticulously curate each piece, ensuring it reflects both trend-forward style and enduring craftsmanship. Today, Centuary stands as a beacon for those who value both individuality and quality.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            To empower self-expression through fashion that is accessible, sustainable, and always on-trend. We believe everyone deserves to feel confident and comfortable in what they wear.
          </p>
          <h2 className="text-3xl font-bold mb-2">Our Vision</h2>
          <p className="text-lg text-gray-700">
            To be the leading destination for modern, conscious consumers seeking quality, style, and value. We strive to set new standards in customer experience, product innovation, and community engagement.
          </p>
        </section>

        {/* What We Stand For */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-700">
                We operate with honesty and transparency in all we do — from how we source our materials to how we serve our customers.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-700">
                Our products undergo stringent quality checks. Every thread, every seam, every fit — perfected to offer you nothing but the best.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-700">
                Our brand is built on the strength of our community — from our team to our customers. We listen, evolve, and grow together.
              </p>
            </div>
          </div>
        </section>

        {/* Sustainability & Innovation */}
        <section className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2">Sustainability & Innovation</h2>
          <p className="text-lg text-gray-700 mb-2">
            We are committed to reducing our environmental impact by using eco-friendly materials, ethical manufacturing, and minimal packaging. Our innovation lab is constantly exploring new fabrics and processes to make fashion more sustainable and future-ready.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Organic and recycled fabrics in our core collections</li>
            <li>Water-saving dyeing and finishing processes</li>
            <li>Carbon-neutral shipping options</li>
            <li>Recyclable and compostable packaging</li>
            <li>Partnerships with green initiatives and charities</li>
          </ul>
        </section>

        {/* Who We Serve */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Who We Serve</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Centuary is for the bold, the expressive, the minimalist, and the style-savvy. Whether you&apos;re layering up for winter or dressing down in casual classics, our range caters to all. We believe great fashion is not exclusive — it&apos;s inclusive, accessible, and universal.
          </p>
        </section>

        {/* In Numbers */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">In Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">75K+</p>
              <p className="text-gray-700">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">600+</p>
              <p className="text-gray-700">Products Delivered</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-gray-700">Repeat Buyers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">5+</p>
              <p className="text-gray-700">Years in Fashion</p>
            </div>
          </div>
        </section>

        {/* Meet the Minds */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Meet the Minds</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg bg-gray-50">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold">SJ</span>
              </div>
              <h3 className="font-semibold text-xl">Sarah Johnson</h3>
              <p className="text-sm text-gray-600">Founder & Visionary</p>
            </div>
            <div className="text-center p-6 border rounded-lg bg-gray-50">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold">MC</span>
              </div>
              <h3 className="font-semibold text-xl">Mike Chen</h3>
              <p className="text-sm text-gray-600">Creative Director</p>
            </div>
            <div className="text-center p-6 border rounded-lg bg-gray-50">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold">ED</span>
              </div>
              <h3 className="font-semibold text-xl">Emma Davis</h3>
              <p className="text-sm text-gray-600">Head of Support</p>
            </div>
          </div>
        </section>

        {/* Our Community & Social Impact */}
        <section className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2">Our Community & Social Impact</h2>
          <p className="text-lg text-gray-700 mb-2">
            We believe in giving back. Centuary regularly donates a portion of profits to local charities, supports youth empowerment programs, and hosts community events. Our customers are at the heart of everything we do.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Annual clothing drives for those in need</li>
            <li>Workshops and mentorship for aspiring designers</li>
            <li>Collaborations with artists and creators</li>
            <li>Inclusive campaigns celebrating diversity</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gray-100 py-16 rounded-xl shadow-inner">
          <h2 className="text-3xl font-bold mb-4">Be a Part of Our Journey</h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto mb-8">
            Explore our latest collections and step into fashion that&apos;s made for you — stylish, sustainable, and standout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:opacity-90">
              Shop Now
            </Link>
            <Link href="/contact" className="border border-black text-black px-6 py-3 rounded-md font-semibold hover:bg-black hover:text-white transition">
              Contact Us
            </Link>
          </div>
        </section>

        {/* Brand Story - Expanded */}
        <section className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2">Our Brand Story</h2>
          <p className="text-lg text-gray-700 mb-2">
            From humble beginnings in a small studio, Centuary was born out of a passion for redefining the boundaries of fashion. Our founders, inspired by the vibrant street culture and timeless classics, set out to create a brand that bridges the gap between luxury and everyday wear. Each collection is a testament to our relentless pursuit of creativity, quality, and authenticity.
          </p>
          <p className="text-lg text-gray-700 mb-2">
            We believe that fashion is more than just clothing—it&apos;s a statement, a movement, and a way to connect with the world. Our journey has been shaped by the stories of our customers, the dedication of our team, and the ever-evolving landscape of style. As we continue to grow, our commitment to excellence and innovation remains unwavering.
          </p>
        </section>

        {/* Customer Testimonials */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
              <p className="italic text-gray-700">“Centuary’s oversized tees are my go-to for comfort and style. The quality is unmatched!”</p>
              <p className="mt-4 font-semibold text-gray-900">— Priya S.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
              <p className="italic text-gray-700">“I love how inclusive and sustainable the brand is. Fast shipping and great support!”</p>
              <p className="mt-4 font-semibold text-gray-900">— Alex R.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
              <p className="italic text-gray-700">“The attention to detail in every product is amazing. I’m a repeat buyer for a reason.”</p>
              <p className="mt-4 font-semibold text-gray-900">— Fatima K.</p>
            </div>
          </div>
        </section>

        {/* Timeline of Milestones */}
        <section className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2">Our Journey in Milestones</h2>
          <ol className="relative border-l border-gray-300 pl-6 space-y-6">
            <li>
              <span className="block text-lg font-semibold">2019</span>
              <span className="block text-gray-700">Centuary founded and first collection launched</span>
            </li>
            <li>
              <span className="block text-lg font-semibold">2020</span>
              <span className="block text-gray-700">Expanded to nationwide shipping and introduced eco-friendly packaging</span>
            </li>
            <li>
              <span className="block text-lg font-semibold">2022</span>
              <span className="block text-gray-700">Reached 50,000+ customers and launched the Innovation Lab</span>
            </li>
            <li>
              <span className="block text-lg font-semibold">2024</span>
              <span className="block text-gray-700">Recognized as a top sustainable fashion brand</span>
            </li>
          </ol>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Where do you ship?</h3>
              <p className="text-gray-700">We ship across India and select international destinations. See our Shipping Policy for details.</p>
            </div>
            <div>
              <h3 className="font-semibold">How do I return or exchange an item?</h3>
              <p className="text-gray-700">Returns and exchanges are easy! Visit our Returns page or contact support for assistance within 14 days of delivery.</p>
            </div>
            <div>
              <h3 className="font-semibold">Are your products sustainable?</h3>
              <p className="text-gray-700">Yes, we use organic and recycled materials, and our processes are designed to minimize environmental impact.</p>
            </div>
            <div>
              <h3 className="font-semibold">How can I contact customer support?</h3>
              <p className="text-gray-700">Reach us anytime via our <Link href="/contact" className="underline">Contact page</Link> or email support@centuary.com.</p>
            </div>
          </div>
        </section>

        {/* Press & Media Mentions */}
        <section className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2">Press & Media</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><span className="font-semibold">Vogue India:</span> “Centuary is setting new standards for sustainable streetwear.”</li>
            <li><span className="font-semibold">The Times of Fashion:</span> “A brand to watch in the premium essentials space.”</li>
            <li><span className="font-semibold">EcoStyle Magazine:</span> “Leading the way in eco-conscious fashion.”</li>
          </ul>
        </section>

        {/* Careers & Join Us */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Careers at Centuary</h2>
          <p className="text-lg text-gray-700">We’re always looking for passionate, creative individuals to join our growing team. If you’re excited about fashion, sustainability, and innovation, <Link href="/contact" className="underline">reach out to us</Link> or check our Careers page for openings.</p>
        </section>
      </div>
    </div>
  );
}
