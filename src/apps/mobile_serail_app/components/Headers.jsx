import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../assets/saco.png";
import { Search, X } from "lucide-react";
import { FiHome } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { LuCircleArrowOutUpRight } from "react-icons/lu";
import { searchSerial, getPurchaseOrderDetails } from "../services/dashboardApi";
import { HiOutlineLogout } from "react-icons/hi";
import { BsBoxes } from "react-icons/bs";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const employeeString = localStorage.getItem('employee');
    const parsedEmployee = employeeString ? JSON.parse(employeeString) : null;
    setEmployee(parsedEmployee);
  }, [])

  console.log(employee)

  // Map pathnames to searchCategory
  const getSearchCategoryFromPath = () => {
    if (location.pathname.includes("/pending-grn")) return "2";
    if (location.pathname.includes("/verify-serial")) return "3";
    if (location.pathname.includes("/")) return "1";  // fallback for all other paths
    return "1"; // default fallback
  };


  const searchCategory = getSearchCategoryFromPath();

  // Debounce search on typing or category change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchCategory]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchSerial(searchTerm.trim(), searchCategory);
      if (result.success && Array.isArray(result.data)) {
        setSearchResults(result.data);
        if (result.data.length === 0) {
          setError("No results found");
        }
      } else {
        setError(result.message || "Search failed");
        setSearchResults([]);
      }
    } catch (err) {
      setError("Network error");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (item) => {
    if (searchCategory === "1") {
      // Category 1: Fetch PO details and navigate to PO-details page
      try {
        const response = await getPurchaseOrderDetails(item.link);
        if (response.success && response.data) {
          navigate("/mobile-serial-app/PO-details", {
            state: { poDetails: response.data },
          });
        } else {
          console.error("API error or no data found.");
        }
      } catch (error) {
        console.error("Error fetching PO details:", error);
      }
    } else if (searchCategory === "2") {
      // Category 2: Navigate to update-grn with refNo
      navigate(`/mobile-serial-app/update-grn/${item.refNo || item.link}`);
    } else if (searchCategory === "3") {
      // Category 3: Convert link string to structured object and navigate

      try {
        const parsedLink = JSON.parse(item.link);

        const transformed = {
          inBoundNo: parsedLink.InBoundNo,
          refDoc: parsedLink.RefDoc,
          totalDelQty: parsedLink.TotalDelQty,
          totalScanQty: parsedLink.TotalScanQty,
          sapCreatedBy: parsedLink.SapCreatedBy,
          sapCreatedOn: parsedLink.SapCreatedOn,
          status: parsedLink.Status,
          unverifiedArticles: (parsedLink.UnverifiedArticles || []).map((article) => ({
            article: article.Article,
            description: article.Description,
            delQty: article.DelQty,
            scanQty: article.ScanQty,
            serials: (article.Serials || []).map((serial) => ({
              refNo: serial.RefNo,
              scannedSerialNo: serial.ScannedSerialNo,
              status: serial.Status,
              scanDate: serial.ScanDate,
              soldDate: serial.SoldDate,
              remarks: serial.Remarks,
              registeredBy: serial.RegisteredBy,
              registeredDate: serial.RegisteredDate,
              verifiedBy: serial.VerifiedBy,
              verifiedDate: serial.VerifiedDate,
            })),
          })),
        };

        navigate('/mobile-serial-app/verify-article/', {
          state: { grnList: transformed },
        });
      } catch (err) {
        console.error("Error parsing GRN link JSON:", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('user');
    localStorage.removeItem('employee');
    navigate('/');
  };


  return (
    <header className="bg-[#103b63] h-20 flex items-center justify-between px-4 sm:px-6 relative">
      {/* Left: Logo */}
      <div className="flex items-center space-x-4">
        <Link to="/mobile-serial-app/" className="cursor-pointer">
          <img
            src={Icon}
            alt="SACO Logo"
            className="h-10 w-auto object-contain align-middle"
          />
        </Link>
      </div>

      {/* Middle: Search */}
      <div className="flex justify-center flex-1 mx-6">
        <div className="relative w-full max-w-2xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search GRN Number / details"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-md bg-white text-black text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                setError(null);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          )}

          {/* Search Result Dropdown */}
          {loading && (
            <div className="absolute top-full left-0 w-full bg-white p-2 text-center z-50">
              Loading...
            </div>
          )}

          {error && !loading && (
            <div
              className="absolute text-sm top-full left-0 w-full mt-1 bg-white p-2 text-center text-red-700 font-semibold  shadow-lg rounded-md z-50"
            >
              {error}
            </div>
          )}

          {!loading && !error && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white rounded-md mt-1 p-2 z-50 max-h-64 overflow-auto shadow-xl">
              <span className="p-2 text-sm font-normal text-[#9095a1]">
                Here are the matching results
              </span>
              <ul>
                {searchResults.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleRowClick(item)}
                    className="p-2 text-sm border-[#E7E7E7] border-b last:border-b-0 cursor-pointer hover:bg-gray-100 font-medium text-[#9095a1] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <CgWebsite size={16} color="#9095a1" />
                      <span>{item.searchResult || item.link}</span>
                    </div>
                    <LuCircleArrowOutUpRight size={16} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right: Home */}
      {/* Right: Employee Info + Icons */}
      <div className="flex items-center h-full space-x-6 text-white">
        {/* Icons */}
        <div className="flex items-center space-x-4 text-2xl">
          <Link to="/mobile-serial-app/" className="flex items-center justify-center h-full cursor-pointer hover:text-gray-300">
            <FiHome />
          </Link>
          <div
            className="flex items-center justify-center h-full cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/mainDashboard")}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') navigate("/mainDashboard") }}
            aria-label="Go to Main Dashboard"
          >
            <BsBoxes />
          </div>

          {/* Employee Info */}
          {employee && (
            <div className="relative group">
              {/* Visible initial */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow text-[#103b63] font-semibold uppercase cursor-default">
                {employee.firstName?.charAt(0)}
              </div>

              {/* Tooltip */}
              <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col items-start bg-white text-sm text-[#103b63] border border-gray-200 shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                <span className="font-semibold">
                  {employee.firstName} {employee.lastName}
                </span>
                <span className="text-[#efb034] text-xs font-bold">{employee.location}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center h-full cursor-pointer hover:text-gray-300"
            title="Logout"
            aria-label="Logout"
          >
            <HiOutlineLogout />
          </button>
        </div>
      </div>

    </header>
  );
}
