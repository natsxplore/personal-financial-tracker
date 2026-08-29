import {
    ShoppingBag,
    ShieldCheck,
    House,
    Heart,
    BriefcaseBusiness,
    Gamepad2,
    Wallet,
    PiggyBank,
    Car,
    Utensils,
    GraduationCap,
    Plane,
    Tag,
} from "lucide-react";

export default function BudgetIcon({
    icon,
    size = 19,
    className,
}) {
    switch (icon) {
        case "shopping-bag":
            return (
                <ShoppingBag
                    size={size}
                    className={className}
                />
            );
        case "shield":
            return (
                <ShieldCheck
                    size={size}
                    className={className}
                />
            );
        case "home":
            return (
                <House size={size} className={className} />
            );
        case "heart":
            return (
                <Heart size={size} className={className} />
            );
        case "briefcase":
            return (
                <BriefcaseBusiness
                    size={size}
                    className={className}
                />
            );
        case "gamepad":
            return (
                <Gamepad2
                    size={size}
                    className={className}
                />
            );
        case "wallet":
            return (
                <Wallet size={size} className={className} />
            );
        case "piggy-bank":
            return (
                <PiggyBank
                    size={size}
                    className={className}
                />
            );
        case "car":
            return (
                <Car size={size} className={className} />
            );
        case "utensils":
            return (
                <Utensils
                    size={size}
                    className={className}
                />
            );
        case "graduation-cap":
            return (
                <GraduationCap
                    size={size}
                    className={className}
                />
            );
        case "plane":
            return (
                <Plane size={size} className={className} />
            );
        default:
            return (
                <Tag size={size} className={className} />
            );
    }
}
