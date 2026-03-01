import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { TableMenuPage } from '@/pages/TableMenu';
import { NotFoundPage } from '@/pages/NotFound';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/t/:publicCode', element: <TableMenuPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
