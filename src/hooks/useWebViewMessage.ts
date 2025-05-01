import { postFcmToken } from "@/lib/fcmToken";
import { useUserStore } from "@/store/useUserStore";
import { FcmDeviceType } from "@/types/create";
import { useMutation } from "@tanstack/react-query";
import type { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useWebViewMessage = (router?: ReturnType<typeof useRouter>) => {
	const setDeviceInfo = useUserStore((state) => state.setDeviceInfo);

	const { mutate: postFcmTokenMutation } = useMutation({
		mutationFn: async (data: FcmDeviceType) => {
			const res = await postFcmToken(data);
			return res;
		},
		onError: (error) => {
			console.error("FCM 토큰 전송 실패:", error);
		},
	});

	const handleTakePicture = (action: string) => {
		try {
			const message = JSON.stringify({ type: "CAMERA_OPEN", action });
			window.ReactNativeWebView?.postMessage(message);
		} catch (error) {
			console.error("메시지 전송 에러:", error);
		}
	};

	const handleGetDeviceToken = () => {
		try {
			const message = JSON.stringify({ type: "GET_DEVICE_TOKEN" });
			window.ReactNativeWebView?.postMessage(message);
		} catch (error) {
			console.error("메시지 전송 에러:", error);
		}
	};

	const handleGetDeviceType = () => {
		try {
			const message = JSON.stringify({ type: "GET_DEVICE_TYPE" });
			window.ReactNativeWebView?.postMessage(message);
		} catch (error) {
			console.error("메시지 전송 에러:", error);
		}
	};

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			try {
				const data =
					typeof event.data === "string" ? JSON.parse(event.data) : event.data;

				if (data.type === "CAPTURED_IMAGE") {
					localStorage.setItem("capturedImage", data.payload.image);

					router?.push("/action/complete");
				}

				if (data.type === "GET_DEVICE_TOKEN") {
					if (data.payload && data.payload.fcmToken) {
						// 토큰 전송
						postFcmTokenMutation({
							fcmRegistrationToken: data.payload.fcmToken,
							deviceType: data.payload.deviceType,
						});
					} else {
						console.error("페이로드에 fcmToken이 없음:", data.payload);
					}
				}

				if (data.type === "GET_DEVICE_TYPE") {
					setDeviceInfo(data.payload.deviceId || "", data.payload.deviceType);
				}
			} catch (error) {
				console.error("메시지 파싱 에러:", error);
			}
		};

		window.addEventListener("message", handleMessage);

		// Android 웹뷰 지원 - 타입 안전하게 핸들러 작성
		const documentMessageHandler = (event: Event) => {
			// 수동으로 MessageEvent로 변환하여 처리
			if (event instanceof Event && "data" in event) {
				handleMessage(event as unknown as MessageEvent);
			}
		};
		document.addEventListener("message", documentMessageHandler);

		return () => {
			window.removeEventListener("message", handleMessage);
			document.removeEventListener("message", documentMessageHandler);
		};
	}, [router, postFcmTokenMutation, setDeviceInfo]);

	return { handleTakePicture, handleGetDeviceToken, handleGetDeviceType };
};
