export const RequestMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
} as const;

export type RequestMethod = typeof RequestMethod[keyof typeof RequestMethod];