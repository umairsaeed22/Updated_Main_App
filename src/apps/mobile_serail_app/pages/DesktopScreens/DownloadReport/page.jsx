import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Headers";
import { gsap } from "gsap";
import { toast } from "react-toastify";
import { getOrderReport, searchSerialTransaction } from "../../../services/dashboardApi";
import { jsPDF } from "jspdf";
import Logo from "../../../assets/sacoLogoBlue.png";
import debounce from 'lodash.debounce';
import { CgWebsite } from "react-icons/cg";
import { LuCircleArrowOutUpRight } from "react-icons/lu";
import { X } from "lucide-react";
import useAuthStore from "../../../../../store/useAuthStore";

const OrderReport = () => {

  const navigate = useNavigate();
  const debounceRef = useRef();
  const { user } = useAuthStore();

  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formLocked, setFormLocked] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);

  if (!debounceRef.current) {
    debounceRef.current = debounce(async (keyword) => {
      if (!keyword) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const response = await searchSerialTransaction(keyword);
      if (response) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    }, 300);
  }

  useEffect(() => {
    if (!hasSelected) {
      debounceRef.current(orderNumber);
    } else {
      // When item selected, don't trigger new search
      setSearchResults([]); // optionally clear dropdown
    }
  }, [orderNumber, hasSelected]);

  // Clear search results and cancel debounce when selecting
  const handleSelectItem = (item) => {
    setOrderNumber(item);
    setSearchResults([]);
    setHasSelected(true);  // Mark that an item was selected
    debounceRef.current.cancel();
  };

  useEffect(() => {
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

  const fetchReport = async () => {
    const userId = user?.id;
    if (!orderNumber.trim()) {
      toast.error("Please enter a valid order number.");
      return;
    }

    setLoading(true);
    try {
      const response = await getOrderReport({ userId, orderNumber });

      if (
        response.success &&
        response.data &&
        response.data.status &&
        response.data.orderDetails
      ) {
        setOrderDetails(response.data.orderDetails);
        toast.success("Order details fetched. Click again to download PDF.");
      } else {
        setOrderDetails(null);
        toast.error(response.data?.message || "Failed to fetch report.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");

      setOrderDetails(null);
    }
    setLoading(false);
  };

  // Helper to convert image URL to base64 (for embedding logo)
  const getBase64ImageFromUrl = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const downloadPdf = async () => {
    if (!orderDetails) {
      toast.error("No order details to generate report.");
      return;
    }

    setFormLocked(true);

    try {
      const base64Logo = await getBase64ImageFromUrl(Logo);
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const borderMargin = 10;

      // Draw dotted border
      pdf.setDrawColor('#103B63');
      pdf.setLineWidth(0.5);
      pdf.setLineDashPattern([1, 1], 0);
      pdf.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);

      const isSale = (orderDetails.transactionType || "").toUpperCase() === 'SALE';

      // Load logo image and layout PDF
      const img = new Image();
      img.src = base64Logo;

      await new Promise((resolve) => {
        img.onload = () => {
          const imgRatio = img.width / img.height;

          // Logo top-right
          const logoWidth = 40;
          const logoHeight = logoWidth / imgRatio;
          const logoX = pageWidth - margin - logoWidth; // top-right corner
          const logoY = 20;
          pdf.addImage(base64Logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

          // Title top-left (left aligned)
          pdf.setFontSize(18);
          pdf.setFont(undefined, 'bold');
          pdf.setTextColor('#103B63');
          const title = isSale ? 'E-commerce - Sales Order Report' : 'E-commerce - Return Order Report';
          const titleX = margin;  // left margin
          const titleY = logoY + logoHeight / 1.5;
          pdf.text(title, titleX, titleY);

          // Watermark center
          const wmWidth = 100;
          const wmHeight = wmWidth / imgRatio;
          const wmX = (pageWidth - wmWidth) / 2;
          const wmY = (pageHeight - wmHeight) / 2;

          pdf.setGState(new pdf.GState({ opacity: 0.08 }));
          pdf.addImage(base64Logo, 'PNG', wmX, wmY, wmWidth, wmHeight);
          pdf.setGState(new pdf.GState({ opacity: 1 }));

          resolve();
        };
      });

      // Transaction info - 2 columns per row
      const infoYStart = 50;
      const lineHeight = 7;
      const colGap = 8;
      const colWidth = (pageWidth - margin * 2 - colGap) / 2;

      pdf.setFontSize(12);
      pdf.setTextColor('#9095a1');

      // Prepare infoPairs as arrays of label and value (strings)
      const infoPairs = [
        ["Order Number:", orderDetails.orderNumber || '-'],
        ["Site:", orderDetails.transactionSite || '-'],
        ["Transaction Type:", orderDetails.transactionType || '-'],
      ];

      if (!isSale) {
        infoPairs.push(
          ["Return Order Number:", orderDetails.returnOrderNumber || '-'],
          ["Created By:", orderDetails.transactionCreatedBy || '-']
        );
      }

      // Render infoPairs 2 per row (left and right columns)
      for (let i = 0; i < infoPairs.length; i += 2) {
        const y = infoYStart + (i / 2) * lineHeight;

        // Left column - label bold + value normal
        pdf.setFont(undefined, 'bold');
        const leftLabel = infoPairs[i][0] + " ";
        pdf.text(leftLabel, margin, y);
        const leftLabelWidth = pdf.getTextWidth(leftLabel);

        pdf.setFont(undefined, 'normal');
        pdf.text(infoPairs[i][1], margin + leftLabelWidth, y, { maxWidth: colWidth - leftLabelWidth });

        // Right column if exists
        if (infoPairs[i + 1]) {
          pdf.setFont(undefined, 'bold');
          const rightLabel = infoPairs[i + 1][0] + " ";
          pdf.text(rightLabel, margin + colWidth + colGap, y);
          const rightLabelWidth = pdf.getTextWidth(rightLabel);

          pdf.setFont(undefined, 'normal');
          pdf.text(infoPairs[i + 1][1], margin + colWidth + colGap + rightLabelWidth, y, { maxWidth: colWidth - rightLabelWidth });
        }
      }

      // Horizontal line after details
      const detailsBottomY = infoYStart + Math.ceil(infoPairs.length / 2) * lineHeight + 3;
      pdf.setDrawColor('#103B63');
      pdf.setLineWidth(0.5);
      pdf.line(margin, detailsBottomY, pageWidth - margin, detailsBottomY);

      // Articles table headers and rest of your code unchanged ...
      if (orderDetails.articles?.length > 0) {
        let tableY = detailsBottomY + 15;
        const colWidths = [40, 80, 30, pageWidth - margin * 2 - 40 - 80 - 30];
        const headers = ["Article", "Description", "Quantity", "Serials"];

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor('#103B63');

        let xPos = margin;
        for (let i = 0; i < headers.length; i++) {
          pdf.text(headers[i], xPos + 2, tableY);
          xPos += colWidths[i];
        }

        pdf.setDrawColor('#bbb');
        pdf.setLineWidth(0.2);
        pdf.line(margin, tableY + 3, pageWidth - margin, tableY + 3);

        // Articles rows
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor('#9095a1');
        tableY += 10;

        for (const article of orderDetails.articles) {
          let xPosRow = margin;
          const rowHeight = 7;
          if (tableY + rowHeight > pageHeight - margin - 30) {
            pdf.addPage();
            tableY = margin;
          }

          pdf.text(String(article.article), xPosRow + 2, tableY);
          xPosRow += colWidths[0];
          pdf.text(String(article.articleDescription), xPosRow + 2, tableY, { maxWidth: colWidths[1] - 4 });
          xPosRow += colWidths[1];
          pdf.text(String(article.qty), xPosRow + 2, tableY);
          xPosRow += colWidths[2];
          pdf.text(article.serials.join(", "), xPosRow + 2, tableY, { maxWidth: colWidths[3] - 4 });

          tableY += rowHeight;
        }

        // Draw line below table
        pdf.setDrawColor('#103B63');
        pdf.setLineWidth(0.5);
        pdf.line(margin, tableY + 3, pageWidth - margin, tableY + 3);

        // Status & note below table
        tableY += 15;
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor('#103B63');
        pdf.text('Status:', margin, tableY);
        pdf.text('Posted', margin + 20, tableY);

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor('#9095a1');
        const statusNote = isSale
          ? 'The Sales Order has been posted.'
          : 'The item has been marked as returned and active for sale.';
        pdf.text(statusNote, margin, tableY + 8, { maxWidth: pageWidth - margin * 2 });
      }

      // Save PDF file
      pdf.save(isSale ? `Sales-Order-Report-${orderDetails.orderNumber || ""}.pdf` : `Return-Order-Report-${orderDetails.orderNumber || ""}.pdf`);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {

      toast.error("Error generating PDF");
    } finally {
      setFormLocked(false);
    }
  };

  const handleButtonClick = async () => {
    if (!orderDetails) {
      await fetchReport();
    } else {
      await downloadPdf();
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <Header />

      <div className="flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
        >
          ← Return
        </button>
      </div>

      <div className="content bg-white rounded p-6 mx-4 sm:mx-6 lg:mx-20 xl:mx-40 mt-4 shadow-md">
        <h1 className="text-2xl font-bold text-[#103B63] mb-4">Order Report</h1>
        <p className="text-gray-500 mb-4 text-sm">
          Enter an order number to fetch and download its report.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-end justify-center text-left">

          <div className="flex-1 relative">
            <label className="block text-sm font-bold text-black mb-1">
              Order Number <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                setHasSelected(false); // reset so search runs again
              }}
              placeholder="Enter Order Number"
              required
              className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2`}
            />
            {orderNumber && (
              <button
                type="button"
                onClick={() => {
                  setOrderNumber('');
                  setHasSelected(false);
                  setSearchResults([]);
                  setOrderDetails(null);
                }}
                className="absolute top-9 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} className="cursor-pointer" />
              </button>
            )}

            {/* Dropdown suggestions */}
            { orderNumber && searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {loading ? (
                  <div className="p-2 text-sm text-gray-500">Searching...</div>
                ) : (
                  searchResults.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 text-sm border-[#E7E7E7] border-b last:border-b-0 cursor-pointer hover:bg-gray-100 font-medium text-[#9095a1] flex items-center justify-between"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="flex items-center gap-2">
                        <CgWebsite size={16} color="#9095a1" />
                        {item}
                      </div>
                      <LuCircleArrowOutUpRight size={16} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* "No records found" message */}
            {!loading &&
              orderNumber &&
              searchResults.length === 0 &&
              !hasSelected && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 p-2 text-sm text-gray-500 shadow-lg">
                  No records found.
                </div>
              )}

            {/* View-only access message */}
            
          </div>

          <button
            onClick={handleButtonClick}
            disabled={loading}
            className={`cursor-pointer px-6 py-2 rounded-md transition whitespace-nowrap flex items-center gap-2 ${loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#103B63] text-white hover:bg-[#0e2c4f]'
              }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : orderDetails ? (
              'Download PDF'
            ) : (
              'Fetch Report'
            )}
          </button>
        </div>

        {/* Report Section to Export */}
        {orderDetails && (
          <div id="report-section">
            <div className="grid grid-cols-4 gap-4 mt-8 p-4 border-2 border-dashed border-amber-400 rounded-md mb-10">
              {orderDetails.orderNumber && (
                <div>
                  <span className="font-bold text-[#9095a1]">Order Number:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">{orderDetails.orderNumber}</span>
                </div>
              )}
              {orderDetails.returnOrderNumber && (
                <div>
                  <span className="font-bold text-[#9095a1]">Return Order Number:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">{orderDetails.returnOrderNumber}</span>
                </div>
              )}
              {orderDetails.transactionChannel && (
                <div>
                  <span className="font-bold text-[#9095a1]">Channel:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">{orderDetails.transactionChannel}</span>
                </div>
              )}
              {orderDetails.transactionCreatedBy && (
                <div>
                  <span className="font-bold text-[#9095a1]">Created By:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">{orderDetails.transactionCreatedBy}</span>
                </div>
              )}
              {orderDetails.transactionDate && (
                <div>
                  <span className="font-bold text-[#9095a1]">Date:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">
                    {new Date(orderDetails.transactionDate).toLocaleString()}
                  </span>
                </div>
              )}
              {orderDetails.transactionSite && (
                <div>
                  <span className="font-bold text-[#9095a1]">Site:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">{orderDetails.transactionSite}</span>
                </div>
              )}
              {orderDetails.transactionType && (
                <div>
                  <span className="font-bold text-[#9095a1]">Type:</span>{' '}
                  <span className="font-semibold text-[#9095a1]">{orderDetails.transactionType}</span>
                </div>
              )}
            </div>

            {/* Articles table */}
            {orderDetails.articles?.length > 0 && (
              <table className="w-full table-auto text-sm">
                <thead className="bg-[#FAFAFB] sticky top-0 z-10">
                  <tr className="text-left cursor-pointer">
                    <th className="p-3 font-[800] text-lg text-[#153d64]">Article</th>
                    <th className="p-3 font-[800] text-lg text-[#153d64]">Description</th>
                    <th className="p-3 font-[800] text-lg text-[#153d64]">Quantity</th>
                    <th className="p-3 font-[800] text-lg text-[#153d64]">Serials</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.articles.map((item, i) => (
                    <tr
                      key={i}
                      className={`cursor-pointer transition-colors duration-200 hover:bg-[#FAFAFB] ${i % 2 === 1 ? 'bg-[#FAFAFB]' : ''
                        }`}
                    >
                      <td className="p-3 font-bold text-[#9095a1]">{item.article}</td>
                      <td className="p-3 font-bold text-[#9095a1]">{item.articleDescription}</td>
                      <td className="p-3 font-medium text-[#9095a1]">{item.qty}</td>
                      <td className="p-3 font-medium text-[#9095a1]">{item.serials.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderReport;
