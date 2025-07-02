import React, { useEffect, useState } from 'react';
import Header from '../../../components/Headers';
import GRNSummary from '../../../components/GrnSummary';
import GRNTable from '../../../components/GrnTable';
import { gsap } from 'gsap';
import { fetchSerials } from '../../../services/dashboardApi';
import { useGRNStoreDashboard } from '../../../store/useGRNStoreDashboard';

const Page = () => {
  const { grnData } = useGRNStoreDashboard();
  const [header, setHeader] = useState('');
  const [tableData, setTableData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('NEW');
  const [user, setUser] = useState(null);

  const pageSize = 10;

  // Animate entry and fetch user from localStorage
  useEffect(() => {
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );

    const userString = localStorage.getItem('employee');
    const parsedUser = userString ? JSON.parse(userString) : null;
    setUser(parsedUser);
  }, []);

  // Update header and table data when grnData changes
  useEffect(() => {
    if (grnData) {
      setHeader({
        new: grnData.new,
        inProgress: grnData.inProgress,
        completed: grnData.completed,
      });

      setTableData(grnData.grNs || []);
    }
  }, [grnData]);

  // Fetch data when user, page, or status changes
  useEffect(() => {
    if (user?.location) {
      fetchSerials(currentPage, pageSize, status, user.location);
    }
  }, [user, currentPage, status]);

  // Handle status change
  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
  };

  return (
    <div className='animated-bg'>
      <Header />

      <div className="mx-4 sm:mx-6 lg:mx-15 xl:mx-30 my-6 bg-white rounded content">
        <GRNSummary summary={header} onStatusChange={handleStatusChange} />
        <GRNTable
          data={tableData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalCount={grnData?.totalCount}
        />
      </div>
    </div>
  );
};

export default Page;
