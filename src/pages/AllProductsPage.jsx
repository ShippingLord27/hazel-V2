import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ProductCard from '../components/ProductCard';

const AllProductsPage = () => {
    const { products, categories, fetchProducts, productsLoading, productsCount, productsPerPage } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

    const categoriesForFilter = ['all', ...categories.map(c => c.name).sort()];
    const totalPages = Math.ceil(productsCount / productsPerPage);

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const handleFetchProducts = useCallback(debounce((page, filter, term) => {
        fetchProducts({ page, categoryName: filter, searchTerm: term });
        const params = {};
        if (term) params.search = term;
        if (filter !== 'all') params.category = filter;
        if (page > 1) params.page = page;
        setSearchParams(params);
    }, 500), [fetchProducts, setSearchParams]); 

    useEffect(() => {
        handleFetchProducts(currentPage, activeFilter, searchTerm);
    }, [currentPage, activeFilter, searchTerm, handleFetchProducts]);

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setCurrentPage(1); 
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    return (
        <div className="page active" id="all-products-page" style={{ paddingTop: '70px' }}>
            <div className="container products-page-container">
                <section className="products-page-header-section">
                    <h1>Our Full Catalog</h1>
                    <p>Browse all available items for rent. Use the filters and search to find exactly what you need.</p>
                </section>
                <section className="products-page-controls">
                    <div className="products-page-search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" className="search-input" placeholder="Search by name or tag..." value={searchTerm} onChange={handleSearchChange} />
                    </div>
                    <ul className="products-filter" id="productsPageFilter">
                        {categoriesForFilter.map(cat => (
                             <li key={cat} className={activeFilter === cat ? 'active' : ''} onClick={() => handleFilterClick(cat)}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </li>
                        ))}
                    </ul>
                </section>
                {productsLoading ? (
                    <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
                ) : products.length > 0 ? (
                    <>
                        <div className="products-grid" id="allProductsGrid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-products-found">
                        <p>No products match your current filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;
