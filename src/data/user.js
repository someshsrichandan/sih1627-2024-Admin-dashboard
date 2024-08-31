// users.js
export const users = [
    { 
      id: 1,
      username: 'supplier',
      password: 'supplier123',
      role: 'drugSupplier', // Supplier who provides drugs
    },
    {
      id: 2,
      username: 'government',
      password: 'government123',
      role: 'government', // Government monitoring role
    },
    {
      id: 3,
      username: 'distributor1',
      password: 'distributor123',
      role: 'distributor', // Primary distributor role
    },
    {
      id: 4,
      username: 'distributor2',
      password: 'distributor2123',
      role: 'distributorLowLevel', // Lower-level distributor
    },
    {
      id: 5,
      username: 'medAdmin',
      password: 'medAdmin123',
      role: 'medicalAdministrator', // Medical administrator receiving drugs
    },
  ];
  