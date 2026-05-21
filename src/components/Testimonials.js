'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    quote: "The SMTP relay from Isha Software is blazing fast! Our transactional receipts reach inboxes in seconds, and the real-time analytics are incredibly detailed.",
    author: "Sarah Jenkins",
    role: "CTO, CloudScale Tech",
    rating: 5,
    avatar: "S"
  },
  {
    quote: "We increased our outbound campaign open rates by 45% using their Bulk Email service and custom templates. The automated sequences save us hours every week.",
    author: "David Miller",
    role: "Head of Marketing, RetailFlow",
    rating: 5,
    avatar: "D"
  },
  {
    quote: "The Email Extractor tool is a lifesaver. We generated over 2,500 highly targeted B2B leads in less than a week, helping us kickstart our outreach campaigns.",
    author: "Priya Sharma",
    role: "Founder, ScaleUp Agency",
    rating: 5,
    avatar: "P"
  },
  {
    quote: "Exceptional infrastructure and customer service. Whenever we had a scaling question, their support team was there to guide us 24/7.",
    author: "Marcus Vane",
    role: "Ops Director, Apex Logistics",
    rating: 5,
    avatar: "M"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      {/* Abstract decorative elements */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
            Client Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-4">
            Trusted by Thousands of Growing Brands
          </h2>
          <p className="text-slate-600 text-lg">
            Hear from businesses that scaled their marketing outreach and secured high deliverability with our infrastructure.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-14"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full relative group">
                  <div>
                    {/* Rating stars */}
                    <div className="flex space-x-1 mb-6">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                      ))}
                    </div>

                    {/* Quote Icon */}
                    <Quote className="w-10 h-10 text-accent/15 absolute right-8 top-8 group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Text */}
                    <p className="text-slate-600 leading-relaxed mb-6 italic">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary/10">
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark">{item.author}</h4>
                      <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
