import { ComponentType } from "@/types/page";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
export const NAVCOMPONENTS: ComponentType[] = [
  {
    icon: ArrowRightIcon,
    id: "1",
    type: "button",
    label: "Button",
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  {
    icon: ArrowRightIcon,
    id: "2",
    type: "input",
    label: "Input",
    placeholder: "Enter text",
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  {
    icon: ArrowRightIcon,
    id: "3",
    type: "text",
    content: "Sample Text",
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
] as const;
