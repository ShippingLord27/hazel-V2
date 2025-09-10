import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const Search = () => {
    const { products, currentUser } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isResultsVisible, setResultsVisible] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchTerm.length > 1) {
            const visibleProducts = currentUser?.role === 'admin'
                ? products
                : products.filter(p => p.status === 'approved');

            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = visibleProducts.filter(p =>
                p.title.toLowerCase().includes(lowercasedTerm) ||
                p.category.toLowerCase().includes(lowercasedTerm) ||
                (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)))
            );
            setResults(filtered);
            setResultsVisible(true);
        } else {
            setResults([]);
            setResultsVisible(false);
        }
    }, [searchTerm, products, currentUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResultsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (id) => {
        navigate(`/listing/${id}`);
        setSearchTerm('');
        setResultsVisible(false);
    };

    return (
        <div className="search-container" ref={searchRef}>
            <i className="fas fa-search search-icon"></i>
            <input type="text" className="search-input" placeholder="Search by name or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => searchTerm.length > 1 && setResultsVisible(true)} />
            {isResultsVisible && (
                <div className="search-results active">
                    {results.length > 0 ? (
                        results.map(product => (
                            <div key={product.id} className="search-result-item" onClick={() => handleResultClick(product.id)}>
                                <div className="product-title">{product.title}</div>
                                <div className="product-price">{product.priceDisplay}</div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No products found</div>
                    )}
                </div>
            )}
        </div>
    );
};
export default Search;
