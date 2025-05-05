import drinkWaterIcon from "@public/icons/DrinkWater.svg";

import sitAtTheDeskIcon from "@public/icons/SitAtTheDesk.svg";
import turnOnTheLaptopIcon from "@public/icons/TurnOnTheLaptop.svg";

import type { StaticImageData } from "next/image";

export type SmallActionKey = "SitAtTheDesk" | "TurnOnTheLaptop" | "DrinkWater";

export const SMALL_ACTION_ICON_MAP: Record<
	SmallActionKey | string,
	StaticImageData
> = {
	SitAtTheDesk: sitAtTheDeskIcon,
	TurnOnTheLaptop: turnOnTheLaptopIcon,
	DrinkWater: drinkWaterIcon,
};
