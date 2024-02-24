import { Outlet } from '@remix-run/react';
import { AuthenticationLayout } from '~/routes/_layout/Layout';

export default function Index() {
  return (
    <AuthenticationLayout
      heading='Welcome to Fast Opinions'
      image='url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80)'
    >
      <Outlet />
    </AuthenticationLayout>
  );
}
