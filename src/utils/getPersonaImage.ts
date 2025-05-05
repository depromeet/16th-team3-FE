import {
	DEFAULT_PERSONA_ICON,
	PERSONA_ICON_MAP,
} from "@public/icons/character/index";

import type { StaticImageData } from "next/image";

export const getPersonaImage = (
	personaId?: number,
): StaticImageData | string => {
	if (!personaId || personaId < 1 || personaId > 24) {
		return DEFAULT_PERSONA_ICON;
	}
	return PERSONA_ICON_MAP[personaId];
};
