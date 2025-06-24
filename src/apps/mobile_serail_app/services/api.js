// src/services/api.js
import { useGRNStore } from '../store/useGRNStore';

// Base config
const BASE_URL = 'http://10.10.7.47:9081';
const AUTH = btoa('TB-DEV:c6a1906da009');

// General API request helper
const apiRequest = async ({ endpoint, method = 'GET', body, auth = false, timeout = 10000 }) => {
  const url = `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && { Authorization: `Basic ${AUTH}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unexpected API error');
    }

    return { success: true, data };
  } catch (error) {
    clearTimeout(timer);
    console.error(`API Error [${method}] ${url}:`, error.message);
    return {
      success: false,
      message: error.name === 'AbortError' ? 'Request timed out.' : error.message,
    };
  }
};

// 1. Fetch GRN Data
export const fetchGrnData = async (requestedBy, grn) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${BASE_URL}/api/v1/Serial/GetGRN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({ REQUESTED_BY: requestedBy, GRN: grn }),
      signal: controller.signal,
      credentials: 'same-origin',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error?.message || `HTTP Error ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();

    if (!data.grn) {
      const errorMsg = data?.error?.message || 'GRN data missing in response';
      throw new Error(errorMsg);
    }

    const { setGrnData } = useGRNStore.getState();
    setGrnData(data.grn, grn);

    return data.grn;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 10 seconds');
    }
    // Removed console.error to prevent any logging
    throw error;
  }
};

// 2. Verify Serial Number
export const verifySerial = async (serialNumber, itemRef, user, Site) => {
  const url = `${BASE_URL}/api/v1/Serial/Register`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        SerialNumber: serialNumber,
        ItemRef: itemRef,
        User: user,
        Site: Site,
      }),
    });

    if (!response.ok) {
      console.error('Failed to verify serial:', response.status);
      throw new Error('Failed to verify serial');
    }

    const data = await response.json();

    const { updateItemByRefNo, grnNumber } = useGRNStore.getState();

    if (data?.status) {
      updateItemByRefNo(itemRef, {
        scannedSerial: data.scannedSerial,
        isRegistered: data.isRegistered,
        scannedQty: data.scannedQty,
        missingQty: data.missingQty,
        status: data.status,
      });

      // ✅ Fetch userId from localStorage and pass to fetchGrnData
      const storedUser = JSON.parse(localStorage.getItem('handHeldUser'));
      const userId = storedUser?.id;

      setTimeout(() => {
        fetchGrnData(userId, grnNumber).catch((err) =>
          console.error('Background refresh failed:', err)
        );
      }, 1000);
    } else {
      const message = data?.message || 'Serial verification failed';
      console.info(message);
      return { message };
    }

    return data;
  } catch (error) {
    console.error('Error verifying serial:', error);
    return { message: 'Error verifying serial.' };
  }
};


// 3. Report Missing Item
export const reportMissing = async (reportedQty, itemRef, description) => {
  const url = `${BASE_URL}/api/v1/Serial/ReportMissing`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        ReportedQty: reportedQty,
        ItemRef: itemRef,
        User: 'FA930799-F8C7-405F-A2EF-154DEA61D8C1',
        Description: description,
      }),
    });

    if (!response.ok) throw new Error('Failed to report missing item');

    const data = await response.json();
    const { updateItemByRefNo, grnNumber } = useGRNStore.getState();

    if (data?.code === '1') {
      updateItemByRefNo(itemRef, {
        reportedQty: reportedQty,
        status: 'Missing Reported',
      });

      setTimeout(() => {
        fetchGrnData('web', grnNumber).catch((err) =>
          console.error('Background refresh failed:', err)
        );
      }, 1000);

      return data;
    } else {
      console.error('Missing report failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error reporting missing item:', error);
    return null;
  }
};

// 4. Finish GRN Registration
export const finishGrnRegistration = async (requestedBy, grn) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/Serial/finishRegistration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({ REQUESTED_BY: requestedBy, GRN: grn }),
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.code === '0') {
      throw new Error(data.message || 'Registration failed.');
    }

    return data;
  } catch (error) {
    console.error('Finish GRN Registration Error:', error.message);
    throw error;
  }
};


// 5. Snapshot
export const snapshotInventory = async ({ userId, site, startTime, articles = [] }) => {
  const url = `${BASE_URL}/api/v1/Inventory/SnapshotInventory`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        UserId: userId || "10989809",
        Site: site || "1105",
        StartTime: startTime || new Date().toISOString().split('T')[0].replace(/-/g, '/'),
        Articles: articles
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch inventory snapshot:', response.status);
      throw new Error('Failed to fetch inventory snapshot');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching inventory snapshot:', error);
    return { message: 'Error fetching inventory snapshot.' };
  }
};

// 6. Scan Inventory
export const scanInventory = async (serialNumber, userId, shiftId, shiftType) => {
  const url = `${BASE_URL}/api/v1/Inventory/ScanInventory`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        SerialNumber: serialNumber,
        User: userId,
        ShiftId: shiftId,
        ShiftType: shiftType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Scan Inventory API Error:', error);
    return { success: false, error: error.message };
  }
};

// 7. Complete Shift
export const completeShift = async (shiftId, shiftType, startTime, User) => {
  const url = `${BASE_URL}/api/v1/Inventory/ShiftComplete`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        ShiftId: shiftId,
        ShiftType: shiftType,
        StartTime: startTime,
        User: User
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Complete Shift API Error:', error);
    return { success: false, error: error.message };
  }
};

export const userLogin = async (username, password) => {
  const url = `${BASE_URL}/api/v1/User/Login`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        UserName: username, 
        Password: password, 
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Login API Error:', error);
    return { success: false, error: error.message };
  }
};
