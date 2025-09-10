export const initialProductData = [
  {
    id: 1,
    title: 'High-Performance Blender',
    category: 'Electronics',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1589474422964-1a943715e459?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    description: 'A powerful blender perfect for smoothies, soups, and more. Features multiple speed settings and a durable glass pitcher.',
    tags: ['kitchen', 'appliance', 'blender'],
    status: 'approved',
    ownerId: 'owner-123',
    ownerName: 'John Doe'
  },
  // ... other products
];

export const initialRentalAgreement = `
<div class="agreement-item">
  <h3>Rental Terms</h3>
  <p>By checking the box below, you (the "Renter") agree to the following terms and conditions set by both HAZEL and the item owner.</p>
</div>
<div class="agreement-item">
  <h3>Item Condition</h3>
  <p>The Renter agrees to return the item(s) in the same condition as they were received, accounting for normal wear and tear.</p>
</div>
<div class="agreement-item">
  <h3>Owner's Specific Terms</h3>
  <p>The following items have specific terms provided by their respective owners:</p>
  [List of Items and Terms]
</div>
`;
