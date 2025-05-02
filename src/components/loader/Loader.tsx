import { motion } from "framer-motion";

interface LoaderProps {
	width?: number;
	height?: number;
}

const Loader = ({ width = 50, height = 50 }: LoaderProps) => {
	return (
		<div className="flex justify-center items-center h-screen">
			<motion.div
				style={{
					width: width,
					height: height,
					border: "4px solid #ccc",
					borderTop: "4px solid #6b6be1",
					borderRadius: "50%",
				}}
				animate={{ rotate: 360 }}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: 1,
					ease: "linear",
				}}
			/>
		</div>
	);
};

export default Loader;
