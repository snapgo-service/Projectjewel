'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { useAdmin } from '@/store/AdminContext';
import ImageUpload from '@/components/admin/ImageUpload';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
}

const emptyPost: Omit<BlogPost, 'id'> = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  author: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  tags: [],
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function BlogAdminPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(emptyPost);
  const [tagsInput, setTagsInput] = useState('');

  const openAddModal = () => {
    setEditingPost(null);
    setFormData(emptyPost);
    setTagsInput('');
    setModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      date: post.date,
      category: post.category,
      tags: post.tags,
    });
    setTagsInput(post.tags.join(', '));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSave = () => {
    if (editingPost) {
      updateBlogPost(editingPost.id, formData);
    } else {
      addBlogPost(formData);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogPost(id);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <p className={styles.pageSubtitle}>Manage your blog content</p>
        </div>
        <button className={styles.addBtn} onClick={openAddModal}>
          Add New Post
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Posts</h2>
        </div>
        {blogPosts.length === 0 ? (
          <div className={styles.emptyState}>No blog posts found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post: BlogPost) => (
                <tr key={post.id}>
                  <td>
                    <img
                      src={post.image}
                      alt={post.title}
                      className={styles.tableImage}
                    />
                  </td>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.date}</td>
                  <td>{post.category}</td>
                  <td className={styles.tableActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEditModal(post)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingPost ? 'Edit Post' : 'Add New Post'}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    name="title"
                    className={styles.formInput}
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className={styles.formInput}
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Author</label>
                  <input
                    type="text"
                    name="author"
                    className={styles.formInput}
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    name="date"
                    className={styles.formInput}
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <input
                    type="text"
                    name="category"
                    className={styles.formInput}
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <ImageUpload label="Image" value={formData.image} onChange={(url) => setFormData({...formData, image: url})} />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Excerpt</label>
                  <textarea
                    name="excerpt"
                    className={styles.formTextarea}
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Content (HTML)</label>
                  <textarea
                    name="content"
                    className={styles.formTextarea}
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                  />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={tagsInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editingPost ? 'Update Post' : 'Add Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
