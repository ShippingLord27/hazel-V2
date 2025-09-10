import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { initialProductData } from './initialData';




const ownersToSeed = [
    {
        user_id: 'YOUR_ALICE_UUID_HERE', 
        email: 'alice.photo@example.com',
        name: 'Alice Photo',
        phone: '555-0101',
        address: '123 Photography Lane'
    },
    {
        user_id: 'YOUR_BOB_UUID_HERE', 
        email: 'bob.rider@example.com',
        name: 'Bob Rider',
        phone: '555-0102',
        address: '456 Adventure Trail'
    },
    {
        user_id: 'YOUR_JOHN_UUID_HERE', 
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '555-0103',
        address: '789 Tool Street'
    },
    {
        user_id: 'YOUR_JANE_UUID_HERE', 
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '555-0104',
        address: '101 Gaming Blvd'
    },
    {
        user_id: 'YOUR_CAROL_UUID_HERE', 
        email: 'carol.camper@example.com',
        name: 'Carol Camper',
        phone: '555-0105',
        address: '212 Forest Drive'
    }
];

const TestDataSavePage = () => {
    const [status, setStatus] = useState('Ready to seed data.');
    const [isLoading, setIsLoading] = useState(false);

    const handleClearAll = async () => {
        setIsLoading(true);
        setStatus('Starting database clear...');

        setStatus('Clearing favorites...');
        const { error: fError } = await supabase.from('favorites').delete().neq('favorite_id', -1);
        if (fError) { setStatus(`Error clearing favorites: ${fError.message}`); setIsLoading(false); return; }

        setStatus('Clearing transactions...');
        const { error: tError } = await supabase.from('transactions').delete().neq('transaction_id', -1);
        if (tError) { setStatus(`Error clearing transactions: ${tError.message}`); setIsLoading(false); return; }

        setStatus('Clearing items...');
        const { error: iError } = await supabase.from('items').delete().neq('item_id', -1);
        if (iError) { setStatus(`Error clearing items: ${iError.message}`); setIsLoading(false); return; }

        setStatus('Clearing categories...');
        const { error: cError } = await supabase.from('categories').delete().neq('category_id', -1);
        if (cError) { setStatus(`Error clearing categories: ${cError.message}`); setIsLoading(false); return; }

        setStatus('Skipping profile tables (renters, owners, admins). Please manage users in Supabase Auth UI.');

        setStatus('All non-user tables cleared successfully!');
        setIsLoading(false);
    };

    const handleSeedData = async () => {
        setIsLoading(true);
        setStatus('Starting data seeding...');

        if (ownersToSeed.some(o => o.user_id.startsWith('YOUR_'))) {
            setStatus('Seeding failed: Please replace placeholder UUIDs in `src/data/testdatasave.jsx` with actual UUIDs from your Supabase Auth users.');
            setIsLoading(false);
            return;
        }

        try {
            setStatus('Inserting categories...');
            const categoryNames = [...new Set(initialProductData.map(p => p.category))];
            const categoriesForDb = categoryNames.map(name => ({ name }));
            
            const { error: catInsertError } = await supabase
                .from('categories')
                .insert(categoriesForDb)
                .onConflict('name')
                .ignore(); 

            if (catInsertError) throw new Error(`Error inserting categories: ${catInsertError.message}`);

            setStatus('Retrieving category IDs...');
            const { data: categories, error: catFetchError } = await supabase.from('categories').select('category_id, name');
            if (catFetchError) throw new Error(`Error fetching categories: ${catFetchError.message}`);
            const categoryMap = categories.reduce((acc, cat) => { acc[cat.name] = cat.category_id; return acc; }, {});

            setStatus('Inserting owners...');
            const ownersForDb = ownersToSeed.map(o => ({ user_id: o.user_id, name: o.name, phone: o.phone, address: o.address }));
            const { error: ownerInsertError } = await supabase
                .from('owners')
                .insert(ownersForDb)
                .onConflict('user_id')
                .ignore();

            if (ownerInsertError) throw new Error(`Error inserting owners: ${ownerInsertError.message}`);

            setStatus('Retrieving owner IDs...');
            const { data: owners, error: ownerFetchError } = await supabase.from('owners').select('owner_id, user_id');
            if (ownerFetchError) throw new Error(`Error fetching owners: ${ownerFetchError.message}`);
            const ownerUuidToPkMap = owners.reduce((acc, owner) => { acc[owner.user_id] = owner.owner_id; return acc; }, {});
            const ownerEmailToPkMap = ownersToSeed.reduce((acc, owner) => {
                const ownerPk = ownerUuidToPkMap[owner.user_id];
                if (ownerPk) {
                    acc[owner.email] = ownerPk;
                }
                return acc;
            }, {});

            setStatus('Preparing and inserting items...');
            const itemsForDb = initialProductData.map(item => {
                const owner_id = ownerEmailToPkMap[item.ownerId];
                const category_id = categoryMap[item.category];
                if (!owner_id) {
                    console.warn(`Skipping item "${item.title}" because owner email "${item.ownerId}" was not found in the seed data.`);
                    return null;
                }
                return {
                    owner_id: owner_id,
                    title: item.fullTitle || item.title,
                    description: item.description,
                    category_id: category_id,
                    image_url: item.image,
                    price_per_day: item.price,
                    availability: item.status === 'approved', 
                    tracking_tag_id: item.trackingTagId,
                    owner_terms: item.ownerTerms
                };
            }).filter(Boolean); 

            const { error: itemsInsertError } = await supabase.from('items').insert(itemsForDb);
            if (itemsInsertError) throw new Error(`Error inserting items: ${itemsInsertError.message}`);

            setStatus('Data seeded successfully! All items from initialData.jsx are now in the database.');

        } catch (error) {
            setStatus(`Seeding failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
            <h1>Supabase Data Seeding</h1>
            <p>Use these buttons to manage your Supabase database with test data.</p>
            <p><strong>Warning:</strong> Clearing will delete all existing data in the `favorites`, `items`, `transactions`, and `categories` tables.</p>
            <p><strong>Important:</strong> This tool does NOT seed new user data. You must create users (renters, owners, admins) through the application's sign-up form or directly in the Supabase Auth dashboard. The SQL trigger will handle creating their corresponding profiles.</p>

            <div style={{ display: 'flex', gap: '1rem', margin: '1rem' }}>
                <button
                    onClick={handleClearAll}
                    disabled={isLoading}
                    style={{
                        fontWeight: 'bold',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    CLEAR ALL NON-USER DATA
                </button>
                <button
                    onClick={handleSeedData}
                    disabled={isLoading}
                    style={{
                        fontWeight: 'bold',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    SEED ALL DATA
                </button>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', border: '1px solid #ccc' }}>
                <strong>Status:</strong> {isLoading ? 'Processing...' : status}
            </div>
        </div>
    );
};

export default TestDataSavePage;
