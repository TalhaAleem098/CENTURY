import Link from 'next/link';

export const metadata = {
  title: 'About Us - Centuary Fashion Store',
  description: 'Learn about Centuary, your trusted premium fashion marketplace. Discover our story, mission, and commitment to quality clothing.',
  keywords: 'about centuary, fashion store, premium clothing, company story, mission, values',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/carousel-1.webp)' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              About Centuary
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your trusted premium fashion marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Our Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded with a passion for premium fashion, Centuary has been at the forefront of 
                delivering high-quality clothing that combines comfort, style, and affordability. 
                We believe that everyone deserves access to exceptional fashion.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Our journey began with a simple mission: to create a marketplace where quality 
                meets accessibility. Today, we&apos;re proud to offer an extensive collection of 
                oversized tees, hoodies, sweatshirts, and more, all carefully curated to meet 
                the highest standards.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                From our signature winter collections to our everyday essentials, every piece 
                in our catalog represents our commitment to excellence and customer satisfaction.
              </p>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: 'url(/assets/carousel-2.webp)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product undergoes rigorous quality checks 
                to ensure it meets our high standards.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focused</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We&apos;re committed to providing 
                exceptional service and support.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate our designs, technology, and processes to bring you 
                the latest in fashion trends.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-black text-white rounded-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm md:text-base opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-sm md:text-base opacity-90">Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">99%</div>
              <div className="text-sm md:text-base opacity-90">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm md:text-base opacity-90">Support</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated team works tirelessly to bring you the best fashion experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & CEO',
                description: 'Passionate about fashion and customer experience'
              },
              {
                name: 'Mike Chen',
                role: 'Head of Design',
                description: 'Creative mind behind our stunning collections'
              },
              {
                name: 'Emma Davis',
                role: 'Customer Success',
                description: 'Ensuring every customer has an amazing experience'
              }
            ].map((member, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore Our Collection?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our premium fashion collection and find your perfect style. 
            From oversized tees to cozy hoodies, we have something for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-black hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-green-600 text-green-600 hover:bg-black hover:text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
