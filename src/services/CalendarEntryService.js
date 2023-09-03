export const createEntry = (uuid, start, end, row, text, detail) => {
    return {
        uuid:   uuid,
        rowid:  row,
        text:   text ? text : "Entry text "+row,
        detail: detail ? detail : "Entry detail"+row,
        from:   start,
        to:     end
    };
  }