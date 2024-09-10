// components/Sidebar/RoleBased/RoleBasedSidebar.js
import React from 'react';
import DrugSupplierSidebar from './RoleBased/DrugSupplierSidebar';
import GovernmentSidebar from './RoleBased/GovernmentSidebar';
import DistributorSidebar from './RoleBased/DistributorSidebar';
import LowLevelDistributorSidebar from './RoleBased/LowLevelDistributorSidebar';
import MedicalAdminSidebar from './RoleBased/MedicalAdminSidebar';

const RoleBasedSidebar = ({ role, colors }) => {
  switch (role) {
    case 'drugSupplier':
      return <DrugSupplierSidebar colors={colors} />;
    case 'government':
      return <GovernmentSidebar colors={colors} />;
    case 'distributor':
      return <DistributorSidebar colors={colors} />;
    case 'distributorLowLevel':
      return <LowLevelDistributorSidebar colors={colors} />;
    case 'medicalAdministrator':
      return <MedicalAdminSidebar colors={colors} />;
    default:
      return null; // Handle unknown roles or provide a default sidebar
  }
};

export default RoleBasedSidebar;
