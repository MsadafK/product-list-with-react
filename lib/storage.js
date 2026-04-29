const STORAGE_KEY = "product_catalog_data"

export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (err) {
    console.error("Products save nahi hue:", err)
  }
}

export function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (err) {
    console.error("Products load nahi hue:", err)
    return null
  }
}

export function clearProducts() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error("Products clear nahi hue:", err)
  }
}