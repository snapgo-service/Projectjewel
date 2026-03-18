import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { IMAGES } from '@/data/images';
import styles from './MegaMenu.module.css';

const MegaMenu = () => {
  return (
    <div className={styles.megaMenu}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.slug}`}
              className={styles.categoryCard}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={category.image || IMAGES.categories[category.slug as keyof typeof IMAGES.categories]}
                  alt={category.name}
                  width={200}
                  height={200}
                  className={styles.categoryImage}
                />
              </div>
              <h4 className={styles.categoryName}>{category.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
