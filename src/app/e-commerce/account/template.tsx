'use client';

import AccountLayout from 'src/layouts/account';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Template({ children }: Props) {
  console.log(children, "this is from index ts of account")
  return <AccountLayout>{children}</AccountLayout>;
}
