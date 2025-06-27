import { products } from '@/services/mockData/products.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(300)
    return [...products]
  },

  async getById(id) {
    await delay(200)
    const product = products.find(p => p.Id === parseInt(id))
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  },

  async getByCategory(category) {
    await delay(250)
    return products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }))
  },

  async search(query) {
    await delay(200)
    const searchTerm = query.toLowerCase()
    return products.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }))
  },

  async getFeatured() {
    await delay(200)
    return products.filter(p => p.featured).map(p => ({ ...p }))
  },

  async getOnSale() {
    await delay(200)
    return products.filter(p => p.onSale).map(p => ({ ...p }))
  }
}