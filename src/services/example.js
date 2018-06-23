import request from '../utils/ajax';

export function query() {
  return request('/api/users');
}
