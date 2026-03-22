'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/store/AdminContext';

const MegaMenu = () => {
  const { categories } = useAdmin();

  if (!categories.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-border p-8 min-w-[700px]">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center text-center gap-3"
          >
            {category.image && (
              <div className="w-20 h-20 rounded-full overflow-hidden bg-bg-blush border-2 border-transparent group-hover:border-primary transition-all duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              </div>
            )}
            <h4 className="text-sm font-medium text-heading group-hover:text-primary transition-colors duration-300">
              {category.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
