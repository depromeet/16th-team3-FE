type ResultContent = -1 | 0 | 1 | 2 | 3 | 4;
type FocusContent = 0 | 1 | 2 | 3 | 4 | 5;

type RetrospectContent = {
	satisfaction: ResultContent | number;
	concentration: FocusContent | number;
	comment: string;
};

type RetrospectItems = {
	[key: string]: {
		title: string;
		required: boolean;
	};
};

type RetrospectContentProps = {
	retrospectContent: RetrospectContent;
	setRetrospectContent: React.Dispatch<React.SetStateAction<RetrospectContent>>;
};
