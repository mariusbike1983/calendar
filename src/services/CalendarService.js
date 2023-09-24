import { createEntry } from '../services/CalendarEntryService';

export const handleNewSegment = (tEntry, segments, newStart, newEnd) => {
    let segmentsData = segments.get(tEntry.urid);
    if (!segmentsData) {
        segmentsData = [];
        segments.set(tEntry.urid, segmentsData);
    }
    const segment = createEntry(tEntry.urid, newStart, newEnd, tEntry.rowid, tEntry.text, tEntry.detail, tEntry.backgroundcolor, tEntry.accent);
    segmentsData.push(segment);
}