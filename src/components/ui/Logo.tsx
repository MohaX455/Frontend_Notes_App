interface LogoProps {
    variant?: "default" | "homepage";
}

export const Logo = ({ variant = "default" }: LogoProps) => {
    const textColor = variant === "homepage" ? "text-white" : "text-primary";

    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-accent-foreground">N</span>
            </div>
            <span className={`font-display font-semibold text-lg ${textColor}`}>
                Notes
            </span>
        </div>
    );
};
