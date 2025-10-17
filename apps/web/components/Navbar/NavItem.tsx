import { ComponentType } from "@/types/page";
import React from "react";

interface NavItemProps {
  component: ComponentType;
}

const NavItem: React.FC<NavItemProps> = ({ component }) => {
  return (
    <div className='flex items-center'>
      {component.icon && <component.icon className='h-6 w-6' />}
      {component.type != "text" && (
        <span className='ml-2'>{component.label}</span>
      )}
    </div>
  );
};

export default NavItem;
