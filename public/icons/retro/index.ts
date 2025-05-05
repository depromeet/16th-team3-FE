import type { StaticImageData } from "next/image";

import retro1_0_0 from "@public/icons/retro/retro1-0-0.svg";
import retro1_0_1 from "@public/icons/retro/retro1-0-1.svg";
import retro1_1_0 from "@public/icons/retro/retro1-1-0.svg";
import retro1_1_1 from "@public/icons/retro/retro1-1-1.svg";
import retro1_2_0 from "@public/icons/retro/retro1-2-0.svg";
import retro1_2_1 from "@public/icons/retro/retro1-2-1.svg";
import retro1_3_0 from "@public/icons/retro/retro1-3-0.svg";
import retro1_3_1 from "@public/icons/retro/retro1-3-1.svg";
import retro1_4_0 from "@public/icons/retro/retro1-4-0.svg";
import retro1_4_1 from "@public/icons/retro/retro1-4-1.svg";

export const RETRO_ICON_MAP: Record<
	0 | 1 | 2 | 3 | 4,
	{ off: StaticImageData; on: StaticImageData }
> = {
	0: { off: retro1_0_0, on: retro1_0_1 },
	1: { off: retro1_1_0, on: retro1_1_1 },
	2: { off: retro1_2_0, on: retro1_2_1 },
	3: { off: retro1_3_0, on: retro1_3_1 },
	4: { off: retro1_4_0, on: retro1_4_1 },
};
