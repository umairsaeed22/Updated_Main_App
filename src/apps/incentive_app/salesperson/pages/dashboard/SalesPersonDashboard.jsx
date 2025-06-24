import React from 'react';
import useLayoutStore from '../../../store/useLayoutStore';
import OtherDepartmentsData from '../../components/departments/OtherDepartmentsData';
import MainDepartmentData from '../../components/departments/MainDepartmentData';

const SalesPersonDashboard = () => {
  const { isOtherDepartment } = useLayoutStore();
  return (
    <div className="w-full h-full   ">
      {isOtherDepartment ? <OtherDepartmentsData /> : <MainDepartmentData />}
    </div>
  );
};

export default SalesPersonDashboard;
