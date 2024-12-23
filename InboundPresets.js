export function getInboundPresets() {
    return [
        { title: 'PG & LEADERSHIP', associates: [], stations: ['PA', 'PG'] },
        { title: 'PARCEL', associates: [], stations: Array.from({ length: 17 }, (_, i) => (206 + i).toString()) },
        { title: 'WATERSPIDER', associates: [], stations: ['North', 'South'] },
        { title: 'TDR', associates: [], stations: ['North', 'South'] },
        { title: 'DRIVERS', associates: [], stations: ['North', 'South'] },
        { title: 'JAM CLEAR', associates: [], stations: ['North', 'South'] },
        { title: 'DOCKSORT', associates: [], stations: ['North', 'South'] },
        { title: 'North PIDS', associates: [], stations: ['PID4', 'PID5', 'PID6'] },
        { title: 'South PIDS', associates: [], stations: ['PID1', 'PID2', 'PID3'] }
    ];
}
