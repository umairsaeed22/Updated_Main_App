import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Header from '../../../components/Headers';
import { getExceptionItem, updateExceptionItem } from '../../../services/dashboardApi';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../../../../store/useAuthStore';

const AddGrn = () => {
  const [grnData, setGrnData] = useState(null);
  const [itemInfo, setItemInfo] = useState(null);
  const [grnNumber, setGrnNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { apps } = useAuthStore();
  const navigate = useNavigate();
  const { refNo } = useParams();




  const fetchData = async () => {
    if (refNo) {
      const result = await getExceptionItem(refNo);
      if (result.success && result.data?.grn) {
        const grn = result.data.grn;
        setGrnData(grn);
        if (Array.isArray(grn.item) && grn.item.length > 0) {
          setItemInfo(grn.item[0]);
        }
      } else {
        console.error("Failed to fetch GRN data:", result);
      }
    }
  };

  useEffect(() => {
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );

    fetchData();

    const userString = localStorage.getItem('user');
    const parsedUser = userString ? JSON.parse(userString) : null;
    setUser(parsedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasViewOnlyAccess) {
      toast.error("You don't have permission to perform this operation.");
      return;
    }

    setLoading(true);

    const response = await updateExceptionItem({
      RefNo: refNo,
      GRN: grnNumber.trim(),
      REQUESTED_BY: user?.id,
    });

    setLoading(false);

    if (response.success) {
      toast.success(response.message);
      setGrnNumber('');
      await fetchData();
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } else {
      toast.error(response.message);
      console.error(response.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative animated-bg">
      <Header />
      <div className="flex justify-start mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
        >
          ← Return
        </button>
      </div>
      <main className="flex-grow flex justify-center items-start px-4 content">
        <div className="bg-white flex flex-col w-full max-w-4xl overflow-hidden px-4 sm:px-8 py-6 rounded shadow relative">
          {grnData?.status && (
            <div className={`text-sm px-4 py-2 rounded shadow font-bold self-start sm:self-end mb-4 ${grnData.status === 'COMPLETE'
              ? 'bg-[#8aa386] text-white'
              : 'bg-blue-100 text-blue-800'
              }`}>
              Status: {grnData.status}
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800">Register New GRN</h2>
          <p className="text-sm text-gray-500 mb-4">Please enter the New GRN</p>

          {grnData && itemInfo && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Details</h2>
              <div className="p-4 rounded border-2 border-dashed" style={{ borderColor: '#103b63' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-4 text-left">
                  <p className="text-gray-400 font-bold">
                    <strong className="text-[#103b63] font-bold">Article:</strong> {itemInfo.article}
                  </p>
                  <p className="text-gray-400 font-bold">
                    <strong className="text-[#103b63] font-bold">Description:</strong> {itemInfo.articleDesc}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#103b63] mb-2 text-left">Registered IMEI Numbers:</h3>
                  <div className="flex flex-wrap items-baseline gap-[10px]">
                    {itemInfo.serialNumbers.map((sn, index) => (
                      <div
                        key={index}
                        className="bg-[#8aa386] px-3 py-2 rounded text-sm shadow-sm text-white cursor-pointer"
                      >
                        <span className="font-semibold">IMEI No:</span> {sn.serialNo}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          
          <form className="mt-5 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                GRN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={grnNumber}
                onChange={(e) => setGrnNumber(e.target.value)}
                placeholder="Enter GRN Number"
                className="bg-gray-100 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent"
                required
                
              />
            </div>

            <div className="sm:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer bg-[#103b63] text-white rounded-md px-6 py-2 text-sm hover:bg-[#0d2f52] disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddGrn;
