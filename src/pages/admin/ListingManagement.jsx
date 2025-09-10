import React from 'react';
import { useApp } from '../../hooks/useApp';

const ListingManagement = () => {
    const { products, updateProductStatus, deleteProduct } = useApp();

    const handleDelete = (productId) => {
        if (window.confirm("ADMIN: Are you sure you want to PERMANENTLY delete this listing? This is irreversible.")) {
            deleteProduct(productId);
        }
    }

    return (
        <div className="admin-view">
            <div className="admin-view-header">
                <h1>Listing Management</h1>
                <p>Manage item availability and delete listings.</p>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            return (
                                <tr key={product.id}>
                                    <td>{product.title}</td>
                                    <td>
                                        {product.ownerName || 'N/A'}
                                        <div className="admin-listing-owner-info">
                                            {product.ownerEmail || 'No Email'} ({product.ownerId || 'No ID'})
                                        </div>
                                    </td>
                                    <td><span className={`status-${product.status}`}>{product.status}</span></td>
                                    <td className="actions-cell">
                                        {product.status === 'approved' ? (
                                            <button className="btn btn-secondary btn-small" onClick={() => updateProductStatus(product.id, 'unavailable')}>Make Unavailable</button>
                                        ) : (
                                            <button className="btn btn-success btn-small" onClick={() => updateProductStatus(product.id, 'approved')}>Make Available</button>
                                        )}
                                         <button className="btn btn-danger btn-small" onClick={() => handleDelete(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListingManagement;
