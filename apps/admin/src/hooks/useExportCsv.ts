import { toastHelper } from '@/components';
import { ReservationInfo } from '@/services';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import dayjs from 'dayjs';

export const useExportCSV = () => {
  const exportCSV = async (data: ReservationInfo[], filename?: string) => {
    const id = toastHelper.loading('Exporting data...');
    if (!data.length) {
      toastHelper.error('No data to export', { id });
      return;
    }

    const dataList = data.map(data => {
      return {
        guestName: data.guest_name || data.customer?.name,
        contact: data.guest_phone || data.customer?.phone,
        email: data.guest_email || data.customer?.email,
        time: dayjs(data.reservation_time).format('HH:mm'),
        partySize: data.party_size,
        tableInfo: data.table?.table_number,
        status: data.status,
      }
    })
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: `${filename || 'Today'}'s Reservations Data` });
    const csv = generateCsv(csvConfig)(dataList);
    download(csvConfig)(csv);

    toastHelper.success('Export data successfully', { id });
  }

  return {
    exportCSV,
  }
}