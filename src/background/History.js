export default NooBox => {
  //record the search history
  NooBox.History.recordImageSearch = null;
  NooBox.History.recordImageSearch = (cursor, info) => {
    get('totalImageSearch', (data) => {
      data = data || 0;
      set('totalImageSearch', parseInt(data) + 1);
    });
    isOn('history', () => {
      getDB('history_records', (records) => {
        records = records || [];
        const source = info.srcUrl || info;
        records.push({
          date: new Date().getTime(),
          event: 'search',
          cursor,
          info: source
        });
        setDB('history_records', records);
      });
    });
  }
};