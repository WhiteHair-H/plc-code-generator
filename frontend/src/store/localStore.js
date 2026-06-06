const KEY = 'plc_codes';

export function localSave(code, ladderData, description = '') {
  const codes = localList();
  const item = {
    id: crypto.randomUUID(),
    description,
    code,
    ladder_data: ladderData || [],
    created_at: new Date().toISOString(),
  };
  codes.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(codes.slice(0, 50)));
  return item;
}

export function localList() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

export function localGet(id) {
  return localList().find(c => c.id === id) || null;
}

export function localDelete(id) {
  const codes = localList().filter(c => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(codes));
}
