import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import React from "react";

interface FailedDialogProps {
	isOpen: boolean;
	onClick: () => void;
}

const FailedDialog = ({ isOpen, onClick }: FailedDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClick}>
			<DialogContent className="w-[328px] rounded-[24px] border-none bg-component-gray-secondary px-4 py-6">
				<DialogHeader>
					<DialogTitle className="text-normal t3 mb-1">
						할 일 만들기에 실패했어요!
					</DialogTitle>
					<DialogDescription className="max-w-[190px] b3 flex-wrap self-center">
						마감시간이 다 되어서 실패했어요.
					</DialogDescription>
					<DialogDescription className="max-w-[190px] b3 flex-wrap self-center whitespace-pre-line">
						{"다음에는 조금 더 여유롭게 \n해보는 건 어때요?"}
					</DialogDescription>
				</DialogHeader>
				<Button variant="primary" className="w-full mt-3" onClick={onClick}>
					확인
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default FailedDialog;
