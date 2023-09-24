export const createEntry = (urid, start, end, row, text, detail, backgroundcolor, accent) => {
    return {
        urid:   urid,
        rowid:  row,
        text:   text ? text : "Entry text-"+urid,
        detail: detail ? detail : "Entry detail-"+urid,
        from:   start,
        to:     end,
        backgroundcolor: backgroundcolor,
        accent: accent
    };
}

export const createHoliday = (urid, start, end, text, backgroundcolor) => {
    const entry = createEntry(urid, start, end, null, text, "", backgroundcolor, "");
    entry.variant = "HOLIDAY";
    return entry;
}