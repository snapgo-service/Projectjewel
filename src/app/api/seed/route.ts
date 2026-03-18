import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import BlogPost from '@/models/BlogPost';
import Order from '@/models/Order';
import Slider from '@/models/Slider';
import Poster from '@/models/Poster';
import SiteSettings from '@/models/SiteSettings';
import User from '@/models/User';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { blogPosts } from '@/data/blogPosts';
import { IMAGES } from '@/data/images';

export async function GET() {
  try {
    await dbConnect();

    // Clear all collections
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      BlogPost.deleteMany({}),
      Order.deleteMany({}),
      Slider.deleteMany({}),
      Poster.deleteMany({}),
      SiteSettings.deleteMany({}),
      User.deleteMany({}),
    ]);

    // Seed products
    await Product.insertMany(products);

    // Seed categories
    await Category.insertMany(categories);

    // Seed blog posts
    await BlogPost.insertMany(blogPosts);

    // Seed sliders
    await Slider.insertMany([
      {
        id: 'slider-1',
        title: 'Special sale! Up to 30% OFF',
        subtitle: 'Special Collection',
        description: 'Discover our exclusive collection of handcrafted diamond jewelry.',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        backgroundImage: IMAGES.heroBg,
        productImage: IMAGES.heroProduct,
        isActive: true,
        order: 1,
      },
      {
        id: 'slider-2',
        title: 'New Arrivals Collection',
        subtitle: 'Just Landed',
        description: 'Explore our newest pieces featuring the latest trends in fine jewelry design.',
        buttonText: 'Explore Now',
        buttonLink: '/shop?filter=new',
        backgroundImage: IMAGES.heroBg,
        productImage: IMAGES.products['taneka-ring'][0],
        isActive: true,
        order: 2,
      },
    ]);

    // Seed posters
    await Poster.insertMany([
      {
        id: 'poster-1',
        title: 'Diamond Rings Collection',
        subtitle: 'Starting from $190',
        image: IMAGES.products['sinead-ring'][0],
        link: '/category/rings',
        position: 'mid-page',
        isActive: true,
        order: 1,
      },
      {
        id: 'poster-2',
        title: 'Earrings Sale',
        subtitle: 'Up to 20% Off',
        image: IMAGES.products['eulla-earring'][0],
        link: '/category/earrings',
        position: 'mid-page',
        isActive: true,
        order: 2,
      },
    ]);

    // Seed orders
    await Order.insertMany([
      {
        id: 'ORD-001',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 555-0101',
        address: '123 Main St, New York, NY 10001',
        items: [{ productId: '1', productName: 'The Sinead Ring 18kt Diamond Yellow Gold Ring', quantity: 1, price: 250 }],
        total: 250,
        status: 'delivered',
        paymentMethod: 'cod',
        date: '2024-01-15',
      },
      {
        id: 'ORD-002',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1 555-0102',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        items: [
          { productId: '2', productName: 'Beautiful Diamond Stud Eulla Earring Rose Gold', quantity: 1, price: 210 },
          { productId: '6', productName: 'Latest Diamond Bangles Designs For Women', quantity: 2, price: 130 },
        ],
        total: 470,
        status: 'processing',
        paymentMethod: 'razorpay',
        date: '2024-02-20',
      },
      {
        id: 'ORD-003',
        customerName: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 555-0103',
        address: '789 Pine Rd, Chicago, IL 60601',
        items: [{ productId: '7', productName: 'Trending Ring Diamond Taneka Diamond Ring', quantity: 1, price: 270 }],
        total: 270,
        status: 'pending',
        paymentMethod: 'cod',
        date: '2024-03-10',
      },
    ]);

    // Seed settings
    await SiteSettings.create({
      siteName: 'Jubilee',
      siteDescription: 'Premium Diamond Jewelry Store',
      freeShippingThreshold: 199,
      shippingCost: 15,
      currency: '$',
      contactEmail: 'info@jubilee.com',
      contactPhone: '+1 (555) 123-4567',
      contactAddress: '123 Jewelry Lane, Diamond District, NY 10036',
      socialFacebook: 'https://facebook.com/jubilee',
      socialTwitter: 'https://twitter.com/jubilee',
      socialInstagram: 'https://instagram.com/jubilee',
      socialPinterest: 'https://pinterest.com/jubilee',
      announcementText: 'Free shipping world wide for all orders over $199',
      announcementActive: true,
    });

    // Seed admin user
    const passwordHash = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin',
      email: 'admin@jubilee.com',
      passwordHash,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        products: products.length,
        categories: categories.length,
        blogPosts: blogPosts.length,
        sliders: 2,
        posters: 2,
        orders: 3,
        users: 1,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
  }
}
