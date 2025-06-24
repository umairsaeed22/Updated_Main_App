import React, { useState, useEffect } from 'react';
import Header from '../../../components/Headers';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { returnSerialItem } from '../../../services/dashboardApi'; // Adjust path as needed

const ReturnProcess = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState('068D10E4-308B-4CD0-A26D-F1FF2F5B3CA0');
  const [returnOrderNo, setReturnOrderNo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [article, setArticle] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    gsap.fromTo(
      '.content',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
  }, []);

  const handleReturn = async () => {
    setIsSubmitting(true);

    try {
      const response = await returnSerialItem({
        user,
        returnOrderNo,
        orderNo,
        returnDate,
        article,
        serialNumber,
      });

      console.log('API Response:', response);
      toast.success('Return submitted successfully!');
    } catch (error) {
      console.error('Return API Error:', error);
      toast.error('Failed to submit return.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
        >
          ← Return
        </button>
      </div>

      <div className="items-start flex-grow flex justify-center px-4">
        <div className="w-full max-w-4xl p-6 bg-white rounded shadow content">
          <h1 className="text-2xl font-[800] text-[#000] mb-1">Return Order</h1>
          <p className="text-sm text-gray-500 mb-6">Please fill in the return order details below.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='hidden'>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Return Order Number</label>
              <input
                type="text"
                value={returnOrderNo}
                placeholder='Enter the return order number'
                onChange={(e) => setReturnOrderNo(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Original Order Number</label>
              <input
                type="text"
                value={orderNo}
                placeholder='Enter the original order number'
                onChange={(e) => setOrderNo(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Return Date</label>
              <input
                type="date"
                value={returnDate}
                placeholder='Enter the return date'
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Article Number</label>
              <input
                type="text"
                value={article}
                placeholder='Enter the article number'
                onChange={(e) => setArticle(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">IMEI Number</label>
              <input
                type="text"
                value={serialNumber}
                placeholder='Enter the serial number'
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <button
              onClick={handleReturn}
              className="bg-[#103B63] text-white px-6 py-2 rounded-md cursor-pointer transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnProcess;
