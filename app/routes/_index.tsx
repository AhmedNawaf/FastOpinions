import { redirect, type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Fast Opinions' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function loader() {
  throw redirect('/login');
}

export default function Index() {
  return null;
}
