import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const SectionLayout = ({ children }: MainLayoutProps) => {
    return (
        <>
          {children}
      </>
     );
}
 
export default SectionLayout;