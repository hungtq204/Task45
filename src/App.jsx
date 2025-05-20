import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('default');

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const fetchProducts = async () => {
    const skip = (page - 1) * limit;
    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    const data = await response.json();
    setProducts(data.products);
    setFilteredProducts(data.products);
    setTotalPages(Math.ceil(data.total / limit));
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortType(sortValue);
    let sorted = [...filteredProducts];
    if (sortValue === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted = [...products];
    }
    setFilteredProducts(sorted);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center p-4'>
      <div className='w-full max-w-5xl'>
        <h1 className='text-3xl font-bold text-center mb-6'>
          Danh sách sản phẩm
        </h1>

        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm '
            value={searchTerm}
            onChange={handleSearch}
            className='p-2 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <select
            value={sortType}
            onChange={handleSort}
            className='p-2 border rounded-lg w-full sm:w-1/4'
          >
            <option value='default'>Sắp xếp theo giá</option>
            <option value='price-asc'>Từ thấp đến cao</option>
            <option value='price-desc'>Từ cao đến thấp</option>
          </select>
          <select
            value={limit}
            onChange={handleLimitChange}
            className='p-2 border rounded-lg w-full sm:w-1/4'
          >
            <option value='12'>12 Sản phẩm</option>
            <option value='24'> 24 Sản phẩm</option>
            <option value='36'> 36 Sản phẩm</option>
          </select>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProducts.map((product) => (
            <div key={product.id} className='bg-white p-4 rounded-lg shadow-md'>
              <img
                src={product.thumbnail}
                alt={product.title}
                className='w-full h-40 object-cover rounded-lg mb-4'
              />
              <h2 className='text-lg font-semibold'>{product.title}</h2>
              <p className='text-gray-600'>${product.price}</p>
            </div>
          ))}
        </div>

        <div className='flex justify-center items-center gap-4 mt-6'>
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400'
          >
            <i className='fas fa-chevron-left'></i> Pre
          </button>
          <span className='text-lg'>
            {page} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400'
          >
            Next <i className='fas fa-chevron-right'></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
