import { cn } from "@/lib/utils";
import { NavItem } from "./nav-Item";

export const NavList = ({
    parentPages,
    level = 0,
    onClose,
    selectedLink,
    setSelectedLink
  }: {
    parentPages: any[];
    level?: number;
    onClose: () => void;
    selectedLink: any;
    setSelectedLink: (value: any) => void;
  }) => {
    if (!parentPages || parentPages.length === 0) {
      return (
        <p
          style={{
            paddingLeft: level ? `${(level * 12) + 25}px` : undefined
          }}
          className={cn(
            "hidden text-sm font-medium text-muted-foreground/80",
            level === 0 && "hidden"
          )}
        >
          No pages inside
        </p>
      );
    }
  
    return (
      <>
        {parentPages.map((page, index) => (
          <div key={page.id}>
            <NavItem
              key={page.id}
              page={page}
              level={level}
              onClose={onClose}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
              currentIndex={index}
            />
          </div>
        ))}
      </>
    );
  };