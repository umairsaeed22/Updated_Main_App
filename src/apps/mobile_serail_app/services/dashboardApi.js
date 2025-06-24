// src/services/api.js
import { useGRNStoreDashboard } from '../store/useGRNStoreDashboard';
// Base config
const BASE_URL = 'http://10.10.7.47:9081';
const AUTH = btoa('TB-DEV:c6a1906da009');

// General API request helper
const apiRequest = async ({ endpoint, method = 'GET', body, auth = false }) => {
  const url = `${BASE_URL}${endpoint}`;

  try {
      const response = await fetch(url, {
          method,
          headers: {
              'Content-Type': 'application/json',
              ...(auth && { Authorization: `Basic ${AUTH}` }),
          },
          body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Unexpected API error');
      }

      return { success: true, data };
  } catch (error) {
      console.error(`API Error [${method}] ${url}:`, error.message);
      return {
          success: false,
          message: error.message,
      };
  }
};


export const registerExceptionItem = async (payload) => {
    const { success, data, message } = await apiRequest({
        endpoint: '/api/v1/Serial/RegisterExceptionItem',
        method: 'POST',
        body: payload,
        auth: true,
    });

    return {
        success: success && data?.code === "1",
        message: data?.message || message || 'Unknown response',
        refNo: data?.refNo || null,
    };
};

// 6. Get Exception Item
export const getExceptionItem = async (key) => {
    const { success, data, message } = await apiRequest({
        endpoint: `/api/v1/Serial/GetExceptionItem?key=${encodeURIComponent(key)}`,
        method: 'GET',
        auth: true,
    });

    return {
        success: success && data?.grn !== undefined,
        message: success ? 'Request completed.' : message,
        data: data || null,
    };
};

// 7. Update Exception Item
export const updateExceptionItem = async ({ RefNo, GRN, REQUESTED_BY }) => {
    const { success, data, message } = await apiRequest({
        endpoint: '/api/v1/Serial/UpdateExceptionItem',
        method: 'POST',
        auth: true,
        body: { RefNo, GRN, REQUESTED_BY },
    });

    return {
        success: success && data?.code === "1",
        message: data?.message || message,
        data: data || null,
    };
};

export const fetchSerials = async (pageNumber = 1, pagesSize = 10, status= 'NEW') => {
    const response = await apiRequest({
        endpoint: `/api/v1/Serial/Get?pageNumber=${pageNumber}&pagesSize=${pagesSize}&status=${status}`,
        method: 'GET',
        auth: true
    });

    if (response.success && response.data) {
        const useStore = useGRNStoreDashboard.getState();
        useStore.setGrnData(response.data);
    } else {
        console.error('Failed to fetch serials:', response.message);
    }

    return response;
};


export const getExceptionSerial = async () => {
    const response = await apiRequest({
        endpoint: '/api/v1/Serial/GetInProgress',
        method: 'GET',
        auth: true
    });

    const { code, grNs, message } = response.data;

    return {
        success: code === '1' && Array.isArray(grNs),
        code,
        message: code === '1' ? 'Request completed.' : message,
        data: grNs || [],
    };
};

export const getUnverifiedSerialCount = async () => {
    const response = await apiRequest({
      endpoint: '/api/v1/Serial/UnverifiedSerialCount',
      method: 'GET',
      auth: true
    });
  
    const { code, count, message } = response.data;
  
    return {
      success: code === '1',
      code,
      message: code === '1' ? 'Request completed.' : message,
      data: { count }  // Correctly return count
    };
  };
  
  export const getVerifySerials = async (pageNumber = 1, pagesSize = 10) => {
    const response = await apiRequest({
        endpoint: `/api/v1/Serial/UnverifiedItems?pageNumber=${pageNumber}&pagesSize=${pagesSize}`,
        method: 'GET',
        auth: true
    });

    if (response.success && response.data) {
        const useStore = useGRNStoreDashboard.getState();
        useStore.setGrnData(response.data);
    } else {
        console.error('Failed to fetch serials:', response.message);
    }

    return response;
};

export const postVerifySerials = async (serials = [], requestedBy = '') => {
    const response = await apiRequest({
        endpoint: `/api/v1/Serial/VerifySerials`,
        method: 'POST',
        body: {
            Serials: serials,
            REQUESTED_BY: requestedBy
        },
        auth: true
    });

    if (response.success) {
        console.log('Serials verified successfully.');
    } else {
        console.error('Failed to verify serials:', response.message);
    }

    return response;
};

export const getPurchaseOrderDetails = async (poNumber) => {
    if (!poNumber) {
      console.error('poNumber is required');
      return;
    }
  
    const response = await apiRequest({
      endpoint: `/api/v1/Serial/PurchaseOrderDetails?poNumber=${poNumber}`,
      method: 'GET',
      auth: true
    });
  
    if (!response.success) {
      console.error('Failed to fetch Purchase Order Details:', response.message);
    }
  
    return response;
  };
  
  export const postSerialPosting = async ({
    site,
    articleNo,
    serialNo,
    user,
    channel,
    orderNo,
    orderDateAndTime,
    TransactionType,
    returnOrderNo,
    createdBy
}) => {
    const body = {
        Site: site,
        ArticleNo: articleNo,
        SerialNo: serialNo,
        User: user,
        Channel: channel,
        OrderNo: orderNo,
        OrderDateAndTime: orderDateAndTime,
        TransactionType: TransactionType,
        ReturnOrderNo: returnOrderNo,
        CreatedBy: createdBy
    };

    const response = await apiRequest({
        endpoint: `/api/v1/Serial/Posting`,
        method: 'POST',
        body,
        auth: true
    });
    return response;
};

export const getShiftHistory = async (userId, pageNumber = 1, pageSize = 10) => {
  const response = await apiRequest({
    endpoint: `/api/v1/Inventory/ShiftHistory?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    method: 'GET',
    auth: true,
  });

  if (!response.success) {
    console.error('Failed to fetch shift history:', response.message);
  }

  return response;
};

export const getShiftDetails = async (shiftId) => {
    const response = await apiRequest({
      endpoint: `/api/v1/Inventory/GetShiftDetails?shiftId=${shiftId}`,
      method: 'GET',
      auth: true,
    });
  
    if (response.success && response.data) {
      // You can handle or cache the data here if needed
    } else {
      console.error('Failed to fetch shift details:', response.message);
    }
  
    return response;
  };
  
  export const reportDiscrepancy = async ({
    shiftId,
    userId,
    site,
    startTime,
    shiftType,
    startShift,
    endShift
  }) => {
    const response = await apiRequest({
      endpoint: `/api/v1/Inventory/ReportDiscrepancy`,
      method: 'POST',
      body: {
        shiftId,
        userId,
        site,
        startTime,
        shiftType,
        startShift,
        endShift
      },
      auth: true
    });
  
    console.log('Report Discrepancy Response:', response);
  
    return response;
  };

  export const returnSerialItem = async ({
    user,
    returnOrderNo,
    orderNo,
    returnDate,
    article,
    serialNumber,
  }) => {
    const response = await apiRequest({
      endpoint: `/api/v1/Serial/Return`,
      method: 'POST',
      body: {
        User: user,
        ReturnOrderNo: returnOrderNo,
        OrderNo: orderNo,
        ReturnDate: returnDate,
        Article: article,
        SerialNumber: serialNumber,
      },
      auth: true, // set to false if authentication is not required
    });
  
    console.log('Return Serial Item Response:', response);
    return response;
  };
  
  export const getOrderReport = async ({ userId, orderNumber }) => {
    const response = await apiRequest({
      endpoint: `/api/v1/Serial/OrderReport`,
      method: 'POST',
      auth: true,
      body: {
        UserId: userId,
        OrderNumber: orderNumber,
      },
    });
  
    if (response.success && response.data) {
      // Handle or cache data here if needed
    } else {
      console.error('Failed to fetch order report:', response.message);
    }
  
    return response;
  };
  
  export const searchSerialTransaction = async (keyword) => {
  const { success, data, message, status } = await apiRequest({
    endpoint: `/api/v1/Serial/SearchTransaction?keyword=${encodeURIComponent(keyword)}`,
    method: 'GET',
    auth: true,
  });

  return {
    success: success && Array.isArray(data),
    message: success && status === 200 ? 'Search completed.' : message,
    data: Array.isArray(data) ? data : [],
  };
};

export const searchSerial = async (searchKey, searchCategory) => {
  const { success, data, message } = await apiRequest({
    endpoint: `/api/v1/Serial/Search?searchKey=${encodeURIComponent(searchKey)}&searchCategory=${encodeURIComponent(searchCategory)}`,
    method: 'GET',
    auth: true,
  });

  return {
    success: success && data !== undefined,
    message: success ? 'Search completed.' : message,
    data: data || null,
  };
};
