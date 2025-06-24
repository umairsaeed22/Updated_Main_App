import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import useDateStore from '../../../store/useDateStore';
import { useLanguage } from '../../../../../context/LanguageContext';

const TransactionTrendBarchart = ({ transactions }) => {
  const { selectedMonthYear } = useDateStore();
  const { lang } = useLanguage();

  const { daysInMonth, dailyTotals } = useMemo(() => {
    const [selectedMonth, selectedYear] = selectedMonthYear
      .split('-')
      .map((v) => parseInt(v));

    const getDaysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate();
    };

    const daysCount = getDaysInMonth(selectedMonth, selectedYear);
    const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
    const dailyTotals = Array(daysCount).fill(0);

    if (transactions?.length) {
      transactions.forEach((transaction) => {
        const [day, month, year] = transaction.date
          .split('-')
          .map((v) => parseInt(v));
        const transactionDate = new Date(`${year}-${month}-${day}`);

        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();
        const transactionDay = transactionDate.getDate();

        if (
          transactionMonth === selectedMonth &&
          transactionYear === selectedYear
        ) {
          dailyTotals[transactionDay - 1] += transaction.totalAmount;
        }
      });
    }

    return { daysInMonth, dailyTotals };
  }, [transactions, selectedMonthYear]);

  const currencyLabel = lang === 'en' ? 'SAR' : 'ريال سعودي';
  const isRTL = lang === 'ar';

  // 🛠️ Reverse data manually if Arabic
  const finalDaysInMonth = isRTL ? [...daysInMonth].reverse() : daysInMonth;
  const finalDailyTotals = isRTL ? [...dailyTotals].reverse() : dailyTotals;

  const options = {
    chart: {
      id: 'transaction-trends',
      toolbar: { show: false },
      rtl: isRTL,
    },
    xaxis: {
      categories: finalDaysInMonth, // 👈 apply reversed days if needed
      labels: {
        rotate: -45,
        style: {
          fontFamily: 'inherit',
        },
      },
    },
    yaxis: {
      opposite: isRTL,
      labels: {
        formatter: (val) => `${val.toLocaleString()} ${currencyLabel}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} ${currencyLabel}`,
      },
    },
    dataLabels: { enabled: false },
    colors: ['#2563eb'],
    grid: { borderColor: '#e5e7eb' },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        columnWidth: '55%',
      },
    },
  };

  const series = [
    {
      name: lang === 'en' ? 'Transactions' : 'المعاملات',
      data: finalDailyTotals, // 👈 apply reversed totals if needed
    },
  ];

  return (
    <div className="min-w-[900px]">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={240}
      />
    </div>
  );
};

export default TransactionTrendBarchart;
