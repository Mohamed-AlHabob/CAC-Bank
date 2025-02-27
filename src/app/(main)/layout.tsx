import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <>
          {children}
      </>
     );
}
 
export default MainLayout;