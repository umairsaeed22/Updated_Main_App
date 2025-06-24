import React, { useRef, useEffect, useState } from 'react';
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
  const [status, setStatus] = useState('NEW'); // Default status 'NEW'

  const pageSize = 10;

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


  useEffect(() => {
    // Animate content entrance
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

  const fetchData = async (page = 1, status = 'NEW') => {
    await fetchSerials(page, pageSize, status);
  };

  useEffect(() => {
    fetchData(currentPage, status);
  }, [currentPage, status]);

  // Function to handle status change from GRNSummary
  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus); // Update the status and trigger fetch
  };
  // console.log()
  return (
    <div className='animated-bg'>
      <Header />
    
      <div className="mx-4 sm:mx-6 lg:mx-15 xl:mx-30 my-6 bg-white rounded content">
        {/* Pass handleStatusChange to GRNSummary */}
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
