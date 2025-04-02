import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * icon link는 /icons/ 뒤에 붙는 부분만 넣어주면 됩니다.
 */
type HeaderButton = {
    icon: string;
    isBack: boolean;
    link?: string;
}

type HeaderProps = {
    leftButton?: HeaderButton;
    title: string;
    rightButton?: HeaderButton;
}

const Header = ({
    leftButton,
    title,
    rightButton
} : HeaderProps) => {
    const router = useRouter();

    const buttonHandler = (button: HeaderButton) => {
        if (button.isBack) {
            router.back();
        } else {
            if (!button.link) {
                console.error("Link is required for non-back button");
                return;
            }
            router.push(button.link as string);
        }
    }

    return (
        <div className="flex items-center bg-background-primary py-[14px]">
            {leftButton && (
                <button 
                    className=""
                    onClick={() => buttonHandler(leftButton)}
                >
                    <Image
                    src={`/icons/${leftButton.icon}`}
                    alt={leftButton.icon}
                    width={leftButton.isBack ? 18 : 24}
                    height={leftButton.isBack ? 16 : 24}
                    />
                </button>
            )}
            <h1 className="s2 w-full text-center text-lg font-semibold text-text-normal">
                {title}
            </h1>
            {rightButton && (
                <button 
                    className=""
                    onClick={() => buttonHandler(rightButton)}
                >
                    <Image
                    src={`/icons/${rightButton.icon}`}
                    alt={rightButton.icon}
                    width={24}
                    height={24}
                    />
                </button>
            )}
        </div>
    )
}

export default Header;