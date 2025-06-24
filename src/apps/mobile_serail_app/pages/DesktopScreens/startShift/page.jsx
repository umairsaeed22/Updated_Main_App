import React, { useState, useEffect } from 'react';
import Header from '../../../components/Headers';
import { gsap } from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reportDiscrepancy } from '../../../services/dashboardApi';

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shiftData = location.state?.data;

  const [username, setUsername] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [remarksMap, setRemarksMap] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      '.content',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
    const userString = localStorage.getItem('user');
    const parsedUser = userString ? JSON.parse(userString) : null;
    setUsername(parsedUser);

    const employeeString = localStorage.getItem('employee');
    const employee = employeeString ? JSON.parse(employeeString) : null;
    setUser(employee);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRemarkChange = (index, value) => {
    setRemarksMap(prev => ({ ...prev, [index]: value }));
  };

  const isFormValid = () => {
    const items = shiftData?.shiftType === 'START' ? shiftData?.startShift : shiftData?.endShift;

    return (
      items?.every((item, i) => {
        return item.discrepancyCount === 0 || (remarksMap[i] && remarksMap[i].trim() !== '');
      }) ?? false
    );
  };


  const submitDiscrepancy = async () => {
    const isStart = shiftData.shiftType === 'START';
    const updatedShiftItems = (isStart ? shiftData.startShift : shiftData.endShift).map((item, index) => ({
      ...item,
      remarks: item.discrepancyCount !== 0 ? (remarksMap[index] || '') : null,
    }));

    const shiftPayload = {
      shiftId: shiftData.shiftId,
      userId: username?.id,
      site: shiftData.site,
      startTime: new Date().toLocaleString('en-GB'),
      shiftType: shiftData.shiftType,
      startShift: isStart ? updatedShiftItems : [],
      endShift: !isStart ? updatedShiftItems : [],
    };

    try {
      const response = await reportDiscrepancy(shiftPayload);
      if (response.success) {
        toast.success('Shift submitted successfully!');
        navigate(-1);
      } else {
        toast.error('Failed to submit shift. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting shift:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };


  return (
    <div className="min-h-screen animated-bg mb-50">
      <Header />

      <div className="flex justify-start mb-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
        >
          ← Return
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 content bg-white shadow-md">
        <h1 className="text-2xl font-[800] text-[#000] mb-1">{shiftData?.shiftType} Shift</h1>
        <p className="text-sm text-gray-500 mb-6">Shift Details and Live current stock</p>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">File Number</label>
          <p className="w-full px-4 py-2 rounded bg-gray-100 font-bold text-[#9095a1] cursor-pointer">
            {user?.fileNo}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
            <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer">{user?.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
            <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer">{user?.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Site</label>
            <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer">{user?.location}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Start Date & Time</label>
            <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer">
              {shiftData?.startTime}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#103B63] mb-4 flex items-center">
            <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
            Report Discrepancy
          </h2>
          <table className="w-full table-auto text-sm shadow-sm">
            <thead className="bg-[#FAFAFB] sticky top-0 z-10">
              <tr className="text-left">
                <th className="p-3 font-[800] text-lg text-[#153d64]">Article#</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Article Description</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">System Count</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Scanned Count</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Discrepancy</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {(shiftData.shiftType === 'START' ? shiftData.startShift : shiftData.endShift)?.map((item, index) => {
                const scanned = item.manualCount;
                const discrepancy = item.discrepancyCount;
                const requiresRemark = discrepancy !== 0;

                return (
                  <tr
                    key={index}
                    className={`cursor-pointer transition-colors duration-200 border-b ${index % 2 === 1 ? 'bg-[#FAFAFB]' : ''}`}
                  >
                    <td className="p-3 font-bold text-[#9095a1]">{item.article}</td>
                    <td className="p-3 font-bold text-[#9095a1]">{item.articleDesc}</td>
                    <td className="p-3 font-bold text-[#9095a1]">{item.systemCount}</td>
                    <td className="p-3 font-bold text-[#9095a1]">{scanned}</td>
                    <td className="p-3 font-bold text-[#9095a1]">{discrepancy}</td>
                    <td className="p-3 font-bold text-[#9095a1]">
                      {requiresRemark ? (
                        <textarea
                          rows={2}
                          required
                          className="w-full px-3 py-2 text-sm rounded bg-gray-100 focus:outline-none resize-none border-2 border-dashed border-yellow-400"
                          placeholder="Enter remarks (required)..."
                          value={remarksMap[index] || ''}
                          onChange={(e) => handleRemarkChange(index, e.target.value)}
                        />
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          <button
            onClick={submitDiscrepancy}
            disabled={!isFormValid()}
            className={`text-white px-6 py-2 rounded-full transition w-auto max-w-xs ${isFormValid() ? 'bg-[#103B63] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
            style={{ minWidth: '140px' }}
          >
            Report Discrepancy & {shiftData?.shiftType} Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
