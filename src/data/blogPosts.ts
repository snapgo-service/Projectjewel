import { BlogPost } from '@/types';
import { IMAGES } from './images';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-choose-perfect-diamond-ring',
    title: 'How to Choose the Perfect Diamond Ring',
    excerpt: 'Discover the essential tips for selecting a diamond ring that matches your style and budget. From the 4Cs to setting styles, we cover everything.',
    content: `<p>Choosing the perfect diamond ring is one of the most exciting and significant purchases you'll ever make. Whether it's for an engagement, anniversary, or simply a treat for yourself, understanding the key factors will help you make the right choice.</p>
<h3>Understanding the 4Cs</h3>
<p>The 4Cs — Cut, Color, Clarity, and Carat — are the universal standards for assessing diamond quality. Cut determines how well the diamond reflects light, making it the most important factor for brilliance. Color grades range from D (colorless) to Z (light yellow). Clarity measures the presence of internal inclusions, and Carat refers to the diamond's weight.</p>
<h3>Choosing the Right Setting</h3>
<p>The setting plays a crucial role in the ring's overall appearance. Popular settings include solitaire, halo, pavé, and three-stone designs. Each offers a unique look and level of diamond protection.</p>
<h3>Setting Your Budget</h3>
<p>While the traditional rule suggests spending two months' salary, the most important thing is to choose a ring that fits your budget while meeting your quality preferences.</p>`,
    image: IMAGES.products['sinead-ring'][0],
    author: 'Stellora Silver Team',
    date: '2024-01-15',
    category: 'Guides',
    tags: ['diamond', 'rings', 'guide'],
  },
  {
    id: '2',
    slug: 'trending-jewelry-styles-2024',
    title: 'Trending Jewelry Styles for 2024',
    excerpt: 'Stay ahead of the curve with this year\'s hottest jewelry trends. From bold gold pieces to delicate layering, discover what\'s making waves.',
    content: `<p>The jewelry world is constantly evolving, and 2024 brings exciting new trends that blend classic elegance with modern flair.</p>
<h3>Bold Gold Statement Pieces</h3>
<p>Chunky gold jewelry continues to dominate the fashion scene. Think oversized chain necklaces, wide cuff bracelets, and bold hoop earrings that make a statement.</p>
<h3>Delicate Layering</h3>
<p>The art of layering delicate pieces remains strong. Stack thin rings, layer dainty necklaces of varying lengths, and mix metals for a personalized look.</p>
<h3>Colored Gemstones</h3>
<p>While diamonds remain timeless, colored gemstones like emeralds, sapphires, and rubies are gaining popularity for engagement rings and everyday wear.</p>`,
    image: IMAGES.products['eulla-earring'][0],
    author: 'Stellora Silver Team',
    date: '2024-02-10',
    category: 'Trends',
    tags: ['trends', 'fashion', 'style'],
  },
  {
    id: '3',
    slug: 'caring-for-your-fine-jewelry',
    title: 'Essential Tips for Caring for Your Fine Jewelry',
    excerpt: 'Learn how to maintain the beauty and longevity of your precious jewelry pieces with these professional care tips.',
    content: `<p>Fine jewelry is an investment that can last for generations when properly cared for. Here are essential tips to keep your pieces looking their best.</p>
<h3>Daily Care</h3>
<p>Remove jewelry before showering, swimming, or exercising. Apply perfume and hairspray before putting on your jewelry to avoid chemical damage.</p>
<h3>Cleaning at Home</h3>
<p>For most pieces, a gentle cleaning solution of warm water and mild dish soap works well. Use a soft-bristled toothbrush to clean around settings and crevices.</p>
<h3>Professional Maintenance</h3>
<p>Have your jewelry professionally inspected and cleaned at least once a year. Jewelers can check for loose stones, worn prongs, and other potential issues.</p>`,
    image: IMAGES.products['taneka-ring'][0],
    author: 'Stellora Silver Team',
    date: '2024-03-05',
    category: 'Care',
    tags: ['care', 'maintenance', 'tips'],
  },
];
