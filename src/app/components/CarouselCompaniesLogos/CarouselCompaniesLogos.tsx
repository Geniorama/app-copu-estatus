import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import type { Company } from '@/app/types';
import {Navigation, Pagination} from 'swiper/modules';
import { useState } from 'react';

interface CarouselCompaniesLogosProps {
  companies: Company[];
}

export default function CarouselCompaniesLogos({ companies }: CarouselCompaniesLogosProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div >
        <Swiper 
            modules={[Navigation, Pagination]}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            slidesPerView={companies.length > 3 ? 2.5 : companies.length}
            spaceBetween={30}
            className="rounded-xl"
        >
        {companies.map((company) => (
            <SwiperSlide key={company.id}>
            <div className="flex flex-col gap-2 items-center">
                <img src={company.logo ? company.logo : 'https://placehold.co/500x500'} alt={company.name} className="w-28 h-28 rounded-full bg-black" />
                <p className="text-slate-400 text-center hover:underline cursor-pointer hover:text-cp-primary transition">{company.name}</p>
            </div>
            </SwiperSlide>
        ))}
        </Swiper>

        {/* Bullets personalizados */}
      <div className="flex justify-center mt-3 space-x-2">
        {companies.length > 3 && companies.map((_, index) => (
          <button
            key={index}
            onClick={() => swiper?.slideTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index ? 'bg-cp-primary scale-125' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
