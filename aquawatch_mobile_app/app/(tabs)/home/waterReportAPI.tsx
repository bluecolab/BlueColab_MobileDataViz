import { useCurrentData } from '@/contexts/CurrentDataContext';

export default function WaterReportAPI() {
    const { waterReportsData } = useCurrentData();
    console.log('Water Reports Data:', waterReportsData);
    return <></>;
}
