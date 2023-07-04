import { FC } from "react";
import { Button } from "./ui/Button";
import { classNameMerge } from "@/lib/utils";
import { Icons } from "./icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
	return (
		<div
			className={classNameMerge("flex justify-center", className)}
			{...props}
		>
			<Button
				onClick={loginWithGoogle}
				isLoading={isLoading}
				size="sm"
				className="w-full"
			>
				{isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
				Google
			</Button>
		</div>
	);
};

export default UserAuthForm;
