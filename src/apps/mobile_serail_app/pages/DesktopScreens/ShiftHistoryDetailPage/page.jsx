import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Headers';
import Logo from '../../../assets/sacoLogoBlue.png';
import { gsap } from 'gsap';
import { MdOutlineFileDownload, MdOutlineFileDownloadDone } from "react-icons/md";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'


const ShiftDetailsPage = () => {
    const location = useLocation();
    const shiftData = location.state?.data;
    const navigate = useNavigate();
    const [downloaded, setDownloaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        gsap.fromTo(
            '.content',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
        );
        const employeeString = localStorage.getItem('employee');
        const employee = employeeString ? JSON.parse(employeeString) : null;
         setUser(employee);
    }, []);

    const handleDownloadReport = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = margin;

        // Helper to add watermark
        const addWatermark = (doc, image, opacity = 0.05) => {
            const imgProps = doc.getImageProperties(image);
            const wmWidth = 100; // desired width
            const wmHeight = (imgProps.height * wmWidth) / imgProps.width; // keep aspect ratio

            const x = (pageWidth - wmWidth) / 2;
            const y = (pageHeight - wmHeight) / 2;

            doc.setGState(new doc.GState({ opacity }));
            doc.addImage(image, 'PNG', x, y, wmWidth, wmHeight);
            doc.setGState(new doc.GState({ opacity: 1 }));
        };


        // 1) Draw Logo top-right
        const imgProps = doc.getImageProperties(Logo);
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.addImage(Logo, 'PNG', pageWidth - margin - imgWidth, margin - 10, imgWidth, imgHeight);

        // 2) Header (bold)
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor('#153d64');
        doc.text('Shift Report', margin, y);
        y += 30;

        // Basic info (2 columns)
        const basicInfo = [
            ['File Number: ', user?.fileNo],
            ['First Name: ', user?.firstName],
            ['Last Name: ', user?.lastName],
            ['Site: ', user?.location],
            ['Start Shift Date & Time: ', shiftData.startTime || ''],
            ['End Shift Date & Time: ', shiftData.endTime || ''],
            ['Shift Status: ', shiftData.status || ''],
        ];
        doc.setFontSize(10);
        const labelColor = '#153d64';
        const valueColor = '#9095a1';
        const gap = 20, padding = 10, rowHeight = 16;

        const rows = [];
        for (let i = 0; i < basicInfo.length; i += 2) {
            rows.push([basicInfo[i], basicInfo[i + 1] || ['', '']]);
        }

        const colWidths = [0, 0];
        rows.forEach(([c0, c1]) => {
            [c0, c1].forEach((pair, idx) => {
                const [lbl, val] = pair;
                doc.setFont(undefined, 'bold');
                const lw = doc.getTextWidth(lbl);
                doc.setFont(undefined, 'normal');
                const vw = doc.getTextWidth(String(val));
                colWidths[idx] = Math.max(colWidths[idx], lw + 5 + vw + padding);
            });
        });

        const totalNeeded = colWidths[0] + colWidths[1] + gap;
        const maxContent = pageWidth - margin * 2;
        if (totalNeeded > maxContent) {
            const scale = maxContent / totalNeeded;
            colWidths[0] *= scale;
            colWidths[1] *= scale;
        }

        rows.forEach(([c0, c1]) => {
            let x = margin;

            const [lbl0, val0] = c0;
            doc.setFont(undefined, 'bold').setTextColor(labelColor);
            doc.text(lbl0, x, y);
            doc.setFont(undefined, 'normal').setTextColor(valueColor);
            doc.text(String(val0), x + doc.getTextWidth(lbl0) + 5, y, {
                maxWidth: colWidths[0] - doc.getTextWidth(lbl0) - 5,
            });
            x += colWidths[0] + gap;

            const [lbl1, val1] = c1;
            doc.setFont(undefined, 'bold').setTextColor(labelColor);
            doc.text(lbl1, x, y);
            doc.setFont(undefined, 'normal').setTextColor(valueColor);
            doc.text(String(val1), x + doc.getTextWidth(lbl1) + 5, y, {
                maxWidth: colWidths[1] - doc.getTextWidth(lbl1) - 5,
            });
            y += rowHeight;
        });

        y += 20;

        const prepareTable = (data, showHighlights = false) => {
            const columns = [
                { header: 'Article', dataKey: 'article' },
                { header: 'Description', dataKey: 'articleDesc' },
                { header: 'System Count', dataKey: 'systemCount' },
                { header: 'Scanned Count', dataKey: 'manualCount' },
                { header: 'Discrepancy', dataKey: 'discrepancyCount' },
                { header: 'Discrepancy Remarks', dataKey: 'remarks' },
                { header: 'IMEI', dataKey: 'imei' },
            ];
            if (showHighlights) {
                columns.push({ header: 'Shift Highlights', dataKey: 'shiftHighlights' });
            }

            const rows = (data || []).map(item => ({
                article: item.article,
                articleDesc: item.articleDesc,
                systemCount: item.systemCount,
                manualCount: item.manualCount,
                discrepancyCount: item.discrepancyCount === 0 ? 'None' : item.discrepancyCount,
                remarks: item.remarks || '-',
                imei: item.serialNumbers?.length ? item.serialNumbers.join(', ') : '-',
                shiftHighlights: showHighlights
                    ? item.summaryChanges?.length
                        ? item.summaryChanges
                            .map(sc => `IMEI: ${sc.serialNo}\nTransaction: ${sc.transactionType}`)
                            .join('\n\n')
                        : 'No record'
                    : '',
            }));

            return { columns, rows };
        };

        const tableOpts = {
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 7,
                cellPadding: 4,
                textColor: '#9095a1',
                lineColor: '#9095a1',
                lineWidth: 0.5,
            },
            headStyles: {
                fillColor: '#FAFAFB',
                textColor: '#153d64',
                fontStyle: 'bold',
                fontSize: 8,
                lineColor: '#9095a1',
                lineWidth: 0.5,
            },
            theme: 'grid',
        };

        doc.setFontSize(14).setTextColor('#153d64');
        doc.text('Start Shift', margin, y);
        y += 20;
        const start = prepareTable(shiftData.startShift, false);
        autoTable(doc, {
            ...tableOpts,
            startY: y,
            head: [start.columns.map(c => c.header)],
            body: start.rows.map(r => start.columns.map(c => r[c.dataKey] || '-')),
            didDrawPage: data => { y = data.cursor.y + 10; }
        });

        y += 15;

        doc.setFontSize(14).setTextColor('#153d64');
        doc.text('End Shift', margin, y);
        y += 20;
        const end = prepareTable(shiftData.endShift, true);
        autoTable(doc, {
            ...tableOpts,
            startY: y,
            head: [end.columns.map(c => c.header)],
            body: end.rows.map(r => end.columns.map(c => r[c.dataKey] || '-'))
        });

        // Add watermark + page number to each page
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            addWatermark(doc, Logo); // ✅ watermark
            doc.setFontSize(9).setFont(undefined, 'normal').setTextColor('#9095a1');
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth - margin,
                pageHeight - 10,
                { align: 'right' }
            );
        }

        doc.save('shift-report.pdf');
        setDownloaded(true);
    };


    const renderShiftTable = (title, data, showShiftHighlights = false) => (
        <div className="my-6 print-break" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-lg font-[800] text-[#153d64] mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm shadow-sm">
                    <thead className="bg-[#FAFAFB] sticky top-0 z-10">
                        <tr className="text-left">
                            <th className="p-3 font-[800] text-md text-[#153d64]">Article</th>
                            <th className="p-3 font-[800] text-md text-[#153d64]">Description</th>
                            <th className="p-3 font-[800] text-md text-[#153d64]">System Count</th>
                            <th className="p-3 font-[800] text-md text-[#153d64]">Scanned Count</th>
                            <th className="p-3 font-[800] text-md text-[#153d64]">Discrepancy</th>
                            <th className="p-3 font-[800] text-md text-[#153d64]">Discrepancy Remarks</th>
                            <th className="p-3 font-[800] text-md text-[#153d64]">IMEI(s)</th>
                            {showShiftHighlights && (
                                <th className="p-3 font-[800] text-md text-[#153d64]">Shift Highlights</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`transition-colors duration-200 hover:bg-[#FAFAFB] ${index % 2 === 1 ? 'bg-[#FAFAFB]' : ''} border-b`}
                                >
                                    <td className="p-3 font-bold text-[#9095a1]">{item.article}</td>
                                    <td className="p-3 font-bold text-[#9095a1]">{item.articleDesc}</td>
                                    <td className="p-3 font-bold text-[#9095a1]">{item.systemCount}</td>
                                    <td className="p-3 font-bold text-[#9095a1]">{item.manualCount}</td>
                                    <td
                                        className={`p-3 font-[800] ${item.discrepancyCount === 0 ? 'text-green-600' : 'text-red-500'}`}
                                    >
                                        {item.discrepancyCount || 'None'}
                                    </td>
                                    <td className="p-3 font-bold text-[#9095a1] break-words max-w-xs whitespace-normal">
                                        {item.remarks || '-'}
                                    </td>
                                    <td className="p-3 font-bold text-[#9095a1]">
                                        {item.serialNumbers?.length > 0 ? item.serialNumbers.join(', ') : '-'}
                                    </td>
                                    {showShiftHighlights && (
                                        <td className="p-3 font-bold text-yellow-400 break-words max-w-xs whitespace-normal">
                                            {item.summaryChanges?.length > 0 ? (
                                                item.summaryChanges.map((change, idx) => (
                                                    <div key={idx} className="mb-1 flex flex-col gap-0.5">
                                                        <div>
                                                            <strong>IMEI:</strong> {change.serialNo}
                                                        </div>
                                                        <div>
                                                            <strong>Transaction:</strong> {change.transactionType}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-yellow-400">No record</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={showShiftHighlights ? 8 : 7}
                                    className="text-center text-[#9095a1] py-6 font-semibold"
                                >
                                    No records available...
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );

    if (!shiftData) {
        return <div className="p-4 text-red-500">No shift data available.</div>;
    }

    return (
        <div className="min-h-screen animated-bg">
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

            <div className="max-w-7xl mx-auto p-6 content bg-white shadow-md">
                <div className="flex justify-between mb-4 items-start">
                    <div>
                        <h1 className="text-2xl font-[800] text-[#000] mb-1">Shift Report</h1>
                        <p className="text-sm text-gray-500 mb-3">Below are the details for this shift</p>
                    </div>
                    <div>
                        <div className="flex justify-end mb-10">
                            <img src={Logo} className="h-15 w-auto object-contain align-middle" alt="SACO Logo" />
                        </div>
                        <button
                            onClick={handleDownloadReport}
                            className={`flex items-center gap-2 px-4 py-2 rounded text-white font-semibold shadow transition-all duration-200 
            ${downloaded ? 'bg-green-600 hover:bg-green-700' : 'bg-[#153d64] hover:bg-[#122f4d]'}`}
                        >
                            {downloaded ? <MdOutlineFileDownloadDone size={20} /> : <MdOutlineFileDownload size={20} />}
                            {downloaded ? 'Downloaded' : 'Download Report'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">File Number</label>
                        <p className="w-full px-4 py-2 rounded bg-gray-100 font-bold text-[#9095a1] cursor-pointer">
                            {user?.fileNo}
                        </p>
                    </div>
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
                        <label className="block text-sm font-bold text-gray-700 mb-1">Start Shift Date & Time</label>
                        <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer">
                            {shiftData?.startTime}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">End Shift Date & Time</label>
                        <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer min-h-[40px] flex items-center">
                            {shiftData?.endTime || "-"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Shift Status</label>
                        <p className="px-4 py-2 font-bold text-[#9095a1] rounded bg-gray-100 cursor-pointer">
                            {shiftData.status}
                        </p>
                    </div>
                </div>

                {renderShiftTable('Start Shift', shiftData.startShift, false)}
                {renderShiftTable('End Shift', shiftData.endShift, true)}
            </div>
        </div>
    );
};

export default ShiftDetailsPage;
