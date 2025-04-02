import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const PrintLayout = ({ children }: MainLayoutProps) => {
    return (
        <>
          {children}
      </>
     );
}
 
export default PrintLayout;