const HeaderTitle = ({ title }: { title: string }) => {
	return (
		<div className="pb-10 pt-4">
			<span className="t2" style={{ whiteSpace: "pre-line" }}>
				{title}
			</span>
		</div>
	);
};

export default HeaderTitle;
