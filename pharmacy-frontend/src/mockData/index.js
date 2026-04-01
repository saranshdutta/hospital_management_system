export const mockMedicines = [
  { id: 1, name: 'Paracetamol 500mg', desc: 'Fever and pain relief', price: 5.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a4282e?w=500&q=80', stock: 150 },
  { id: 2, name: 'Amoxicillin 250mg', desc: 'Antibiotic for bacterial infections', price: 12.50, image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&q=80', stock: 85 },
  { id: 3, name: 'Ibuprofen 400mg', desc: 'Anti-inflammatory painkiller', price: 7.25, image: 'https://images.unsplash.com/photo-1550572017-edb7dfd08235?w=500&q=80', stock: 200 },
  { id: 4, name: 'Vitamin C Complex', desc: 'Immunity booster', price: 15.00, image: 'https://images.unsplash.com/photo-1616671285409-f3161df1f512?w=500&q=80', stock: 45 },
  { id: 5, name: 'Cough Syrup', desc: 'Dry and tickly cough relief', price: 9.99, image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&q=80', stock: 30 }
];

export const mockOrders = [
  { id: 'ORD-001', date: '2023-10-15', total: 17.98, status: 'Delivered', items: 2 },
  { id: 'ORD-002', date: '2023-10-22', total: 15.00, status: 'Dispatched', items: 1 },
  { id: 'ORD-003', date: '2023-10-25', total: 12.50, status: 'Pending', items: 1 }
];

export const mockPatients = [
  { id: 'P-101', name: 'John Doe', email: 'user@example.com', bloodGroup: 'O+', concerns: 'None' },
  { id: 'P-102', name: 'Alice Smith', email: 'alice@example.com', bloodGroup: 'A-', concerns: 'Asthma' },
  { id: 'P-103', name: 'Bob Johnson', email: 'bob@example.com', bloodGroup: 'B+', concerns: 'Diabetes Type 2' }
];

export const mockHospitals = [
  { id: 1, name: 'City General Hospital', contact: '+1 234-567-8900', address: '123 Health Ave' },
  { id: 2, name: 'Westside Clinic', contact: '+1 987-654-3210', address: '456 Wellness Blvd' },
  { id: 3, name: 'Sunrise Medical Center', contact: '+1 555-123-4567', address: '789 Recovery Rd' }
];
