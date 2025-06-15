'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white">      {/* Fashion T-Shirt Store Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {/* Geometric Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-gray-600 rotate-45 rounded-lg"></div>
            <div className="absolute bottom-40 right-32 w-24 h-24 border border-gray-500 rotate-12 rounded-lg"></div>
            <div className="absolute top-1/3 right-20 w-16 h-16 border border-gray-600 -rotate-12 rounded-lg"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-32 left-1/4 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gray-500 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-2/3 left-16 w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-500"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className="text-left space-y-8">
              
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-gray-300 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Premium Fashion Support
              </motion.div>
              
              {/* Main Heading */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight">
                  Connect with
                </h1>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text">
                    Century Fashion
                  </span>
                </h1>
              </motion.div>
              
              {/* Subtitle */}
              <motion.p 
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Get personalized style advice, inquire about our premium T-shirt collections, 
                or simply say hello. Our fashion experts are ready to assist you.
              </motion.p>
                {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a 
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_GMAIL || 'centuryapparelpk@gmail.com'}`}
                  className="group bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Start Conversation
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                </a>
                <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_NUMBER || '923227154205'}?text=Hello! I'm interested in your products. Can you help me?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-gray-500 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    WhatsApp Chat
                  </span>
                </a>
              </motion.div>
              
            </div>
            
            {/* Right Column - Contact Cards */}
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Quick Contact Cards */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Email Support</h3>
                    <p className="text-gray-400 mb-2">Get detailed responses within 24 hours</p>
                    <p className="text-white text-sm font-medium">{process.env.NEXT_PUBLIC_CONTACT_GMAIL || 'centuryapparelpk@gmail.com'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Live Chat</h3>
                    <p className="text-gray-400 mb-2">Instant help from our style experts</p>
                    <p className="text-green-400 text-sm font-medium">● Available now</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-start space-x-4">                  <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Follow Us</h3>
                    <p className="text-gray-400 mb-2">Stay updated with latest collections</p>
                    <p className="text-green-400 text-sm font-medium">● Social Media</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex flex-col items-center text-gray-400">
            <p className="text-sm mb-2 font-medium">Scroll to explore</p>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Multiple Contact Options
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Choose Your 
              <span className="block text-transparent bg-gradient-to-r from-gray-700 to-black bg-clip-text">
                Preferred Method
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-black mx-auto mb-8 rounded-full"></div>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Whether you prefer instant messaging, detailed emails, or face-to-face conversations, 
              we offer multiple ways to connect with our fashion experts and get the support you need.
            </p>
          </motion.div>
            {/* Contact Methods */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-24"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            <motion.div 
              className="bg-white rounded-3xl p-10 text-center group hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>              <h3 className="text-2xl font-bold text-black mb-3">Email Support</h3>
              <p className="text-lg text-gray-800 mb-3 font-medium">{process.env.NEXT_PUBLIC_CONTACT_GMAIL || 'centuryapparelpk@gmail.com'}</p>
              <p className="text-gray-500 mb-4">Get detailed responses from our style experts</p>
              <div className="inline-flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Response within 24 hours
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-3xl p-10 text-center group hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100"
              variants={fadeInUp}
            >              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </div><h3 className="text-2xl font-bold text-black mb-3">WhatsApp Chat</h3>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_NUMBER || '923227154205'}?text=Hello! I'm interested in your products. Can you help me?`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-800 mb-3 font-medium hover:text-green-600 transition-colors"
              >
                +{process.env.NEXT_PUBLIC_CONTACT_NUMBER || '92 322 7154205'}
              </a>
              <p className="text-gray-500 mb-4">Chat instantly with our fashion consultants</p>              <div className="inline-flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Available 24/7
              </div>
            </motion.div>

            

            <motion.div 
              className="bg-white rounded-3xl p-10 text-center group hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Social Media</h3>
              <p className="text-lg text-gray-800 mb-3 font-medium">Follow @century.pk</p>
              <p className="text-gray-500 mb-4">Connect with us on social platforms</p>
              <div className="flex justify-center space-x-2">
                <a href="https://www.facebook.com/profile.php?id=61576551254002" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">
                  Facebook
                </a>
                <a href="https://www.instagram.com/century.pk?igsh=aHJvemhjbHdncXhk&utm_source=qr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full hover:bg-pink-100 transition-colors">
                  Instagram
                </a>
                <a href="http://www.tiktok.com/@century.pk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors">
                  TikTok
                </a>
              </div>
            </motion.div>
          </motion.div>          {/* Contact Form */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  Send us a 
                  <span className="text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text"> Message</span>
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Got questions about our T-shirts or need styling assistance? We&apos;d love to hear from you and help you find your perfect fit.
                </p>
              </div>

              {submitStatus === 'success' && (
                <motion.div 
                  className="bg-black text-white p-6 mb-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Thank you! Your message has been sent successfully.
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div 
                  className="bg-gray-900 text-white p-6 mb-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Sorry, there was an error sending your message. Please try again.
                  </div>
                </motion.div>
              )}              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="What&apos;s this about?"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-4 px-8 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
