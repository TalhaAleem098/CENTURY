'use client';
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const privacyData = {
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: [
          "Century (we, our, or us) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
          "Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site."
        ]
      },
      {
        id: 'information-collection',
        title: 'Information We Collect',
        subsections: [
          {
            title: 'Personal Information',
            content: [
              'We may collect personal information that you voluntarily provide to us when you:'
            ],
            list: [
              'Create an account',
              'Make a purchase',
              'Subscribe to our newsletter',
              'Contact us with questions or feedback',
              'Participate in surveys or promotions'
            ]
          },
          {
            title: 'Automatically Collected Information',
            content: [
              'We may automatically collect certain information about your device and usage patterns, including:'
            ],
            list: [
              'IP address and location information',
              'Browser type and version',
              'Operating system',
              'Pages visited and time spent on our site',
              'Referring website addresses'
            ]
          }
        ]
      },
      {
        id: 'information-usage',
        title: 'How We Use Your Information',
        content: [
          'We use the information we collect for various purposes, including:'
        ],
        list: [
          'Processing and fulfilling your orders',
          'Providing customer service and support',
          'Sending promotional emails and marketing communications',
          'Improving our website and services',
          'Preventing fraud and ensuring security',
          'Complying with legal obligations'
        ]
      },
      {
        id: 'information-sharing',
        title: 'Information Sharing',
        content: [
          'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:'
        ],
        list: [
          'Service providers who assist us in operating our business',
          'Payment processors for transaction processing',
          'Shipping companies for order fulfillment',
          'Legal requirements or to protect our rights',
          'Business transfers or mergers'
        ]
      },
      {
        id: 'data-security',
        title: 'Data Security',
        content: [
          'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
          'However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.'
        ]
      },
      {
        id: 'cookies',
        title: 'Cookies & Tracking',
        content: [
          'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content.',
          'You can control cookies through your browser settings, but disabling cookies may affect site functionality.'
        ]
      },
      {
        id: 'third-party',
        title: 'Third-Party Links',
        content: [
          'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.',
          'We encourage you to review the privacy policies of any third-party sites you visit.'
        ]
      },
      {
        id: 'user-rights',
        title: 'Your Rights',
        content: [
          'Depending on your location, you may have certain rights regarding your personal information, including:'
        ],
        list: [
          'Access to your personal information',
          'Correction of inaccurate information',
          'Deletion of your personal information',
          'Restriction of processing',
          'Data portability',
          'Objection to processing'
        ]
      },
      {
        id: 'email-communications',
        title: 'Email Communications',
        content: [
          'If you subscribe to our newsletter or promotional emails, you can unsubscribe at any time by clicking the unsubscribe link in our emails or contacting us directly.',
          'Please note that you may still receive transactional emails related to your orders.'
        ]
      },
      {
        id: 'children-privacy',
        title: "Children's Privacy",
        content: [
          'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
          'If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.'
        ]
      },
      {
        id: 'policy-changes',
        title: 'Policy Changes',
        content: [
          'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
          'Your continued use of our services after any changes constitutes acceptance of the updated policy.'
        ]
      },
      {
        id: 'contact',
        title: 'Contact Us',
        content: [
          'If you have any questions about this Privacy Policy or our privacy practices, please contact us:',
          'Email: centuryapparelpk@gmail.com',
          'Phone: +923227154205'
        ]
      }
    ]
  };
  useEffect(() => {
    const handleScroll = () => {
      const sections = privacyData.sections;
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [privacyData.sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
            <div className="w-24 h-1 bg-white mx-auto"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Side Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-6">Table of Contents</h3>
                <nav className="space-y-2">
                  {privacyData.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-black text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-200 hover:text-black'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {index + 1}. {section.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-16">
              {privacyData.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    
                    <div className="pl-16 space-y-6">
                      {section.content && section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-lg text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}

                      {section.list && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <ul className="space-y-3">
                            {section.list.map((item, lIndex) => (
                              <li key={lIndex} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.subsections && section.subsections.map((subsection, sIndex) => (
                        <div key={sIndex} className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-black pl-4">
                            {subsection.title}
                          </h3>
                          {subsection.content && subsection.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className="text-lg text-gray-700 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                          {subsection.list && (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <ul className="space-y-3">
                                {subsection.list.map((item, lIndex) => (
                                  <li key={lIndex} className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-3 flex-shrink-0"></div>
                                    <span className="text-gray-700">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-20 bg-black text-white rounded-2xl p-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                If you have any questions or concerns about how we handle your personal information, 
                were here to help. Contact us anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:centuryapparelpk@gmail.com"
                  className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Email Us
                </a>
                <a
                  href="tel:+923227154205"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
