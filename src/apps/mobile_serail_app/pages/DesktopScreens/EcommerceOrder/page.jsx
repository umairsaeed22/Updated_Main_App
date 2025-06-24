import React, { useState, useEffect, useRef } from 'react';
import Header from '../../../components/Headers';
import { gsap } from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postSerialPosting } from '../../../services/dashboardApi';
import DatePicker from 'react-datepicker';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

const CHANNEL = 'E-COMMERCE';

const SerialPostingPage = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('SALE');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    orderNumber: '',
    returnOrderNumber: '',
    orderDateAndTime: null,
    site: '',
    articleNumber: '',
    serialNumber: '',
    createdBy: ''
  });
  const [buttonState, setButtonState] = useState("Submit");
  const [btnHover, setBtnHover] = useState(false);
  const contentRef = useRef(null);



  useEffect(() => {
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
     const userString = localStorage.getItem('user');
    const parsedUser = userString ? JSON.parse(userString) : null;
    setUser(parsedUser);

 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderTypeChange = (e) => {
    const TransactionType = e.target.value;
    setOrderType(TransactionType);
    setForm(prev => ({ ...prev, returnOrderNumber: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState("Submitting...");

    const {
      orderNumber,
      returnOrderNumber,
      orderDateAndTime,
      site,
      articleNumber,
      serialNumber,
      createdBy
    } = form;

    const payload = {
      site,
      articleNo: articleNumber,
      serialNo: serialNumber,
      user: user?.id,
      channel: CHANNEL,
      orderNo: orderNumber,
      orderDateAndTime: orderDateAndTime?.toISOString(),
      createdBy,
      TransactionType: orderType,
      returnOrderNo: orderType === 'RETURN' ? returnOrderNumber : ''
    };

    try {
      const response = await postSerialPosting(payload);
      const code = String(response?.data?.code || '');
      const message = response?.data?.message || 'Something went wrong.';

      if (code === '200') {
        toast.success(message);
        setButtonState("Submitted");
        setTimeout(() => setButtonState("Submit"), 2000);
      } else {
        toast.error(message);
        setButtonState("Submit");
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error("Failed to submit. Please try again.");
      setButtonState("Submit");
    }
  };

  return (
    <div className='animated-bg'>
      <Header />
      <div className="flex justify-start my-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
        >
          ← Return
        </button>
      </div>

      <div className="min-h-screen flex items-start justify-center p-4 content">
        <div ref={contentRef} className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md text-left">
          <div className='flex justify-between'>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                {orderType === 'RETURN' ? 'Return Order' : 'Sales Order'}
              </h1>
              <p className="text-sm text-gray-500 mb-6">Please enter the details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Transaction Type<span className="text-red-500">*</span></label>
              <select
                value={orderType}
                onChange={handleOrderTypeChange}
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
              >
                <option value="SALE">Sales Order</option>
                <option value="RETURN">Return Order</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Channel</label>
              <input
                type="text"
                value={CHANNEL}
                readOnly
                disabled
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {orderType === 'RETURN' && (
              <div>
                <label className="block font-medium text-sm text-gray-700 mb-1">Created By<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="createdBy"
                  value={form.createdBy}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name or ID"
                  className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Order Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="orderNumber"
                value={form.orderNumber}
                onChange={handleChange}
                required
                placeholder="Enter order number"
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
              />
            </div>

            {orderType === 'RETURN' && (
              <div>
                <label className="block font-medium text-sm text-gray-700 mb-1">Return Order Number<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="returnOrderNumber"
                  value={form.returnOrderNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter return order number"
                  className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Order Date & Time<span className="text-red-500">*</span></label>
              <DatePicker
                selected={form.orderDateAndTime}
                onChange={(date) => setForm(prev => ({ ...prev, orderDateAndTime: date }))}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Site<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="site"
                value={form.site}
                onChange={handleChange}
                required
                placeholder="Enter site"
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Article Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="articleNumber"
                value={form.articleNumber}
                onChange={handleChange}
                required
                placeholder="Enter article number"
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">IMEI Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                required
                placeholder="Enter serial number"
                className="w-full px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-900"
              />
            </div>

            <div className="col-span-2 text-center mt-4">
              <button
                type="submit"
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                className={`cursor-pointer px-6 py-2 rounded-md text-white text-sm font-semibold ${btnHover ? 'bg-[#1f4a7a]' : 'bg-[#103B63]'}`}
              >
                {buttonState}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SerialPostingPage;
