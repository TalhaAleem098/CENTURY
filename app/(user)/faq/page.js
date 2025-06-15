"use client";
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaShippingFast, FaUndo, FaTshirt, FaCreditCard, FaQuestionCircle, FaStore, FaGift, FaHeadset } from 'react-icons/fa';  const faqData = [
  {
    category: "Orders & Shipping",
    icon: FaShippingFast,
    color: "bg-gray-800",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "We offer fast and reliable shipping across the country. Standard delivery takes 3-5 business days within major cities and 5-7 business days for remote areas. Express delivery is available for 1-2 business days in selected cities."
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We provide free standard shipping on orders above ₹4900. For orders below ₹4900, a delivery charge applies. Express shipping is available at an additional cost."
      },
      {
        question: "Can I track my order?",
        answer: "Absolutely! Once your order is dispatched, you'll receive a tracking number via SMS and email. You can track your order in real-time through our website or by calling our customer service."
      },
      {
        question: "Can I change or cancel my order?",
        answer: "You can modify or cancel your order within 30 minutes of placing it. After that, your order goes into processing. Contact our customer service immediately for urgent changes."
      },
      {
        question: "What areas do you deliver to?",
        answer: "We deliver pan-India to all major cities and towns. For remote locations, delivery might take additional 1-2 days. We're constantly expanding our delivery network."
      }
    ]
  },  {
    category: "Cash on Delivery",
    icon: FaCreditCard,
    color: "bg-gray-700",
    questions: [
      {
        question: "Do you accept Cash on Delivery (COD)?",
        answer: "Yes! We accept Cash on Delivery for all orders. This is our primary payment method, allowing you to pay when your order arrives at your doorstep."
      },
      {
        question: "Is there any extra charge for COD?",
        answer: "No additional charges! Cash on Delivery is completely free of charge. You only pay the product price plus shipping (if applicable)."
      },
      {
        question: "Can I pay partially online and rest on delivery?",
        answer: "Currently, we only accept full Cash on Delivery. We're working on introducing partial payment options soon. Stay tuned for updates!"
      },
      {
        question: "What if I'm not available during delivery?",
        answer: "Our delivery partner will attempt delivery 2-3 times. If unsuccessful, the order will be returned. You can reschedule delivery by contacting our customer service."
      },
      {
        question: "Can I check the product before paying?",
        answer: "Yes! You can inspect the package for any external damage before making payment. However, detailed product inspection should be done after payment as per COD terms."
      }
    ]
  },  {
    category: "Returns & Exchanges",
    icon: FaUndo,
    color: "bg-gray-600",
    questions: [
      {
        question: "What is your return policy?",
        answer: "We offer a hassle-free 7-day return policy. Items must be unused, unworn, and in original condition with tags attached. Custom or personalized items cannot be returned."
      },
      {
        question: "How do I return an item?",
        answer: "Contact our customer service within 7 days of delivery. We'll arrange a free pickup from your address. Refunds are processed within 5-7 business days after we receive the returned item."
      },
      {
        question: "Do you offer exchanges?",
        answer: "Yes! You can exchange items for different sizes or colors within 7 days. The exchange process is similar to returns - just mention 'exchange' when contacting us."
      },
      {
        question: "Who bears the return shipping cost?",
        answer: "Return shipping is free for defective items or wrong deliveries. For other returns like size issues or change of mind, return pickup is still free as part of our customer-first policy."
      },
      {
        question: "How long does the refund process take?",
        answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. You'll receive a confirmation SMS and email once the refund is initiated."
      }
    ]
  },  {
    category: "Products & Sizing",
    icon: FaTshirt,
    color: "bg-gray-500",
    questions: [
      {
        question: "How do I choose the right size?",
        answer: "Each product page has a detailed size chart. Measure your chest, waist, and length, then compare with our size guide. When in doubt between two sizes, we recommend choosing the larger size for comfort."
      },
      {
        question: "Are your products true to size?",
        answer: "Yes, our products are true to Indian sizing standards. However, fit may vary slightly between different styles. Always check the specific size chart and read customer reviews for fit feedback."
      },
      {
        question: "What materials do you use?",
        answer: "We use premium quality 100% cotton, cotton blends, and breathable fabrics suitable for Indian climate. Each product page lists detailed material composition and care instructions."
      },
      {
        question: "Do you offer plus sizes?",
        answer: "Yes! We offer extended sizing from S to 5XL on most products. We believe fashion should be inclusive and accessible to everyone regardless of body type."
      },
      {
        question: "How should I care for my products?",
        answer: "Most of our products are machine washable. Use cold water, mild detergent, and avoid bleach. Air dry in shade to maintain color and fabric quality. Specific care instructions are provided with each product."
      }
    ]
  },  {
    category: "Account & Shopping",
    icon: FaStore,
    color: "bg-gray-700",
    questions: [
      {
        question: "Do I need an account to place an order?",
        answer: "No, you can shop as a guest. However, creating an account helps you track orders, save addresses, view order history, and receive exclusive offers and early access to sales."
      },
      {
        question: "How do I create an account?",
        answer: "Click on 'Sign Up' and provide your email and phone number. You'll receive an OTP for verification. Once verified, your account is ready! You can also sign up during checkout."
      },
      {
        question: "Can I save multiple addresses?",
        answer: "Yes! Registered users can save multiple delivery addresses for convenience. You can add, edit, or delete addresses anytime from your account settings."
      },
      {
        question: "How do I track my previous orders?",
        answer: "Log into your account and visit 'My Orders' section. You can see all your order history, current status, tracking information, and download invoices."
      },
      {
        question: "Can I modify my account information?",
        answer: "Yes, you can update your name, email, phone number, and addresses anytime from the 'My Profile' section in your account."
      }
    ]
  },  {
    category: "Offers & Discounts",
    icon: FaGift,
    color: "bg-gray-600",
    questions: [
      {
        question: "Do you offer student discounts?",
        answer: "Yes! Students get 10% off on their first order with valid student ID verification. Register with your .edu email or upload student ID for verification."
      },
      {
        question: "How can I get discount coupons?",
        answer: "Subscribe to our newsletter, follow us on social media, and join our WhatsApp updates. We regularly share exclusive discount codes and flash sale notifications."
      },
      {
        question: "Do you have loyalty programs?",
        answer: "Yes! Earn points on every purchase. For every ₹100 spent, earn 10 points. 100 points = ₹10 discount. Points never expire and can be used on any future purchase."
      },
      {
        question: "Can I combine multiple offers?",
        answer: "Generally, only one promotional code can be used per order. However, loyalty points can be combined with most offers. Check offer terms for specific details."
      },
      {
        question: "Do you have seasonal sales?",
        answer: "Yes! We have major sales during festivals, end-of-season clearances, and special occasions. Follow us on social media to stay updated on upcoming sales."
      }
    ]
  },  {
    category: "Customer Support",
    icon: FaHeadset,
    color: "bg-gray-500",
    questions: [
      {
        question: "How can I contact customer support?",
        answer: "Reach us via WhatsApp, phone call, email, or contact form on our website. Our support team is available Monday-Saturday, 10 AM-7 PM IST. We respond to all queries within 2-4 hours."
      },
      {
        question: "Do you have a physical store?",
        answer: "Currently, we're an online-only brand, which helps us offer better prices and wider selection. However, we're planning to open experience centers in major cities soon."
      },
      {
        question: "What languages does your support team speak?",
        answer: "Our customer support team is fluent in Hindi and English. We're working on adding support for more regional languages to serve you better."
      },
      {
        question: "How can I provide feedback or suggestions?",
        answer: "We love hearing from our customers! Send your feedback via email, contact form, or social media. Your suggestions help us improve our products and services."
      },
      {
        question: "Do you have a mobile app?",
        answer: "We're working on launching our mobile app soon! For now, our website is fully mobile-optimized for the best shopping experience on your phone."
      }
    ]
  }
];


export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Orders & Shipping');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleItem = (category, index) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categories = faqData.map(section => section.category);

  const filteredQuestions = faqData.find(section => section.category === selectedCategory)?.questions.filter(item => {
    return !searchTerm || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];
  const selectedSection = faqData.find(section => section.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mb-6">
            <FaQuestionCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find instant answers to all your questions about orders, shipping, returns, and more. We&apos;re here to make your shopping experience seamless.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <span className="font-medium text-gray-900">{selectedCategory}</span>
                <FaChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Sidebar Menu */}
            <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Topics</h3>
                <p className="text-sm text-gray-600">Select a category to explore related questions</p>
              </div>
              <nav className="p-2">
                {faqData.map((section, index) => {
                  const IconComponent = section.icon;
                  const isActive = selectedCategory === section.category;
                  
                  return (
                    <button
                      key={section.category}
                      onClick={() => {
                        setSelectedCategory(section.category);
                        setIsMobileMenuOpen(false);
                      }}                      className={`w-full flex items-center px-4 py-4 rounded-lg transition-all duration-200 mb-1 ${
                        isActive 
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm border border-gray-200' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                        isActive ? section.color : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{section.category}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {section.questions.length} questions
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {selectedSection && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">                {/* Category Header */}
                <div className={`px-8 py-6 border-b border-gray-100 bg-gradient-to-r ${selectedSection.color} text-white rounded-t-xl`}>
                  <div className="flex items-center">
                    <selectedSection.icon className="h-8 w-8 mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedSection.category}</h2>
                      <p className="text-white/90 mt-1">
                        {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} 
                        {searchTerm && ' found'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-8">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12">
                      <FaSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No questions found matching your search.</p>
                      <p className="text-gray-400 text-sm mt-2">Try different keywords or browse other categories.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredQuestions.map((item, index) => {
                        const key = `${selectedSection.category}-${index}`;
                        const isOpen = openItems[key];
                        
                        return (
                          <div key={index} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">                            <button
                              className="flex justify-between items-center w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-200"
                              onClick={() => toggleItem(selectedSection.category, index)}
                            >
                              <span className="text-lg font-semibold text-gray-900 pr-4 leading-relaxed">
                                {item.question}
                              </span>                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                isOpen ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isOpen ? (
                                  <FaChevronUp className="h-4 w-4" />
                                ) : (
                                  <FaChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </button>
                            
                            {isOpen && (                              <div className="px-6 pb-6 bg-white">
                                <div className="border-l-4 border-gray-300 pl-6">
                                  <p className="text-gray-700 leading-relaxed text-base">
                                    {item.answer}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <FaHeadset className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Still need help?
            </h3>            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Our customer support team is ready to assist you with personalized help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-xl text-white bg-transparent hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                Contact Support
              </a>
              <a
                href="https://wa.me/923227154205"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
